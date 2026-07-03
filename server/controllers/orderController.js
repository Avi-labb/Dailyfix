import crypto from 'crypto';
import Razorpay from 'razorpay';
import sendEmail from '../utils/sendEmail.js';
import customerOrderTemplate from '../templates/customerOrderTemplate.js';
import adminOrderTemplate from '../templates/adminOrderTemplate.js';
import Customer from '../models/Customer.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Coupon from '../models/Coupon.js';
import delhiveryService from '../utils/delhivery.js';

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const generateOrderId = () => {
  return 'DFC' + crypto.randomBytes(4).toString('hex').toUpperCase();
};

const createOrder = async (req, res) => {
  try {
    const { customer, items, shippingAddress, billingAddress, paymentMethod, couponCode } = req.body;
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!customer.email || !emailRegex.test(customer.email)) {
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }
    
    let customerDoc = null;
    if (customer.email || customer.phone) {
      customerDoc = await Customer.findOne({ $or: [{ email: customer.email }, { phone: customer.phone }] });
      if (!customerDoc) {
        customerDoc = new Customer({
          firstName: customer.firstName,
          lastName: customer.lastName,
          email: customer.email,
          phone: customer.phone
        });
        await customerDoc.save();
      }
    }

    let total = 0;
    const orderItems = []; // Store items for email
    const orderItemsDb = []; // Items for DB
    
    for (let item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product with ID ${item.productId} not found` });
      }
      
      const itemPrice = product.discountPrice || product.price;
      const itemTotal = itemPrice * item.quantity;
      total += itemTotal;
      
      // Collect item details for email
      orderItems.push({
        id: product._id,
        name: product.name,
        image: product.image,
        quantity: item.quantity,
        price: itemPrice,
        total: itemTotal
      });
      
      orderItemsDb.push({
        product: product._id,
        quantity: item.quantity,
        price: itemPrice
      });
    }

    let discount = 0;
    let coupon = null;
    if (couponCode) {
      coupon = await Coupon.findOne({ 
        code: couponCode, 
        active: true, 
        validFrom: { $lte: new Date() },
        $or: [{ validTo: null }, { validTo: { $gte: new Date() } }]
      });
      
      if (coupon) {
        if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
          return res.status(400).json({ message: 'Coupon usage limit reached' });
        }
        if (coupon.minOrderValue && total < coupon.minOrderValue) {
          return res.status(400).json({ message: `Minimum order value for coupon is ${coupon.minOrderValue}` });
        }
        if (coupon.discountType === 'percentage') {
          discount = (total * coupon.discountValue) / 100;
          if (coupon.maxDiscount && discount > coupon.maxDiscount) {
            discount = coupon.maxDiscount;
          }
        } else {
          discount = coupon.discountValue;
        }
        coupon.usedCount += 1;
        await coupon.save();
      }
    }

    const tax = total * 0.05; // 5% GST
    const shipping = total > 500 ? 0 : 50;
    const grandTotal = total - discount + tax + shipping;

    const orderId = generateOrderId();
    const order = new Order({
      orderId,
      customer: customerDoc?._id,
      total: grandTotal,
      tax,
      shipping,
      discount,
      paymentMethod,
      shippingAddress: JSON.stringify(shippingAddress),
      billingAddress: JSON.stringify(billingAddress),
      items: orderItemsDb
    });
    await order.save();

    // Update product stock
    for (let item of items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity }
      });
    }
    
    // ------------------------------
    // Send emails asynchronously after order is created
    // ------------------------------
    
    // Format date for email
    const orderDate = new Date().toLocaleDateString('en-IN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    
    // Calculate estimated delivery date (5-7 days from now)
    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 7);
    const estDeliveryDate = estimatedDelivery.toLocaleDateString('en-IN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    
    // Format payment method for display
    const paymentMethodDisplay = paymentMethod === 'cod' 
      ? 'Cash on Delivery' 
      : 'UPI / Card / Netbanking';
    
    const paymentStatus = paymentMethod === 'cod' ? 'Pending (COD)' : 'Paid';
    
    // 1. Send Customer Confirmation Email
    const customerEmailData = {
      orderId: orderId,
      customerName: `${customer.firstName} ${customer.lastName}`,
      orderDate: orderDate,
      items: orderItems,
      shippingAddress: shippingAddress,
      paymentMethod: paymentMethodDisplay,
      paymentStatus: paymentStatus,
      subtotal: total,
      shipping: shipping,
      discount: discount,
      gst: tax,
      grandTotal: grandTotal,
      estimatedDelivery: estDeliveryDate,
    };
    
    // 2. Send Admin Notification
    const adminEmailData = {
      orderId: orderId,
      customerName: `${customer.firstName} ${customer.lastName}`,
      customerEmail: customer.email,
      customerPhone: customer.phone,
      orderDate: orderDate,
      shippingAddress: shippingAddress,
      paymentMethod: paymentMethodDisplay,
      paymentStatus: paymentStatus,
      items: orderItems,
      grandTotal: grandTotal,
    };

    // Send emails (don't wait for them to complete, just log errors)
    (async () => {
      try {
        // Send customer confirmation
        await sendEmail({
          to: customer.email,
          subject: `Order Confirmation - ${orderId} | DailyFixCare`,
          html: customerOrderTemplate(customerEmailData)
        });
        
        // Send admin notification
        if (process.env.ADMIN_EMAIL) {
          await sendEmail({
            to: process.env.ADMIN_EMAIL,
            subject: `New Order Received - ${orderId}`,
            html: adminOrderTemplate(adminEmailData)
          });
        }
      } catch (emailError) {
        // Log but don't fail the order if email fails
        console.error('❌ Error sending emails:', emailError.message);
      }
    })();

    res.status(201).json({ message: 'Order placed successfully', orderId });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.id }).populate('items.product', 'name slug');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;
    
    const filter = {};
    if (status) filter.status = status;

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    await Order.findByIdAndUpdate(req.params.id, { status });
    res.json({ message: 'Order status updated' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create Razorpay order
const createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body; // amount in INR (rupees)
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    const options = {
      amount: Math.round(amount * 100), // Convert to paise
      currency: 'INR',
      receipt: crypto.randomBytes(10).toString('hex'),
    };

    const order = await razorpay.orders.create(options);
    res.json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
      },
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    res.status(500).json({ message: 'Failed to create Razorpay order', error: error.message });
  }
};

// Verify Razorpay payment
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    // Generate signature
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
    const generatedSignature = hmac.digest('hex');

    // Verify signature
    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ message: 'Payment verification failed' });
    }

    // If orderId is provided, you can update order status here
    if (orderId) {
      const order = await Order.findOne({ orderId });
      if (order) {
        order.paymentStatus = 'Paid';
        await order.save();
      }
    }

    res.json({ success: true, message: 'Payment verified successfully' });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ message: 'Failed to verify payment', error: error.message });
  }
};

const createDelhiveryShipment = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findOne({ orderId }).populate('items.product');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const shippingAddress = JSON.parse(order.shippingAddress);
    
    // Prepare shipment data
    const shipmentData = {
      shipments: [{
        name: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
        add: `${shippingAddress.address}, ${shippingAddress.city}`,
        pin: shippingAddress.pincode,
        city: shippingAddress.city,
        state: shippingAddress.state,
        country: 'India',
        phone: shippingAddress.phone,
        order: order.orderId,
        payment_mode: order.paymentMethod === 'cod' ? 'COD' : 'Prepaid',
        shipping_mode: 'Surface',
        cod_amount: order.paymentMethod === 'cod' ? order.total : 0,
        product_desc: order.items.map(item => `${item.product.name} x${item.quantity}`).join(', ')
      }]
    };

    // Create shipment with Delhivery
    const delhiveryResponse = await delhiveryService.createShipment(shipmentData);
    
    if (delhiveryResponse && delhiveryResponse.shipments && delhiveryResponse.shipments.length > 0) {
      const waybill = delhiveryResponse.shipments[0].waybill;
      
      // Update order
      order.delhiveryWaybill = waybill;
      order.delhiveryStatus = 'Manifested';
      order.shipmentCreatedAt = new Date();
      order.status = 'Shipped';
      await order.save();
      
      return res.json({ 
        message: 'Shipment created successfully', 
        waybill,
        delhiveryResponse 
      });
    } else {
      return res.status(500).json({ message: 'Failed to create shipment with Delhivery' });
    }
    
  } catch (error) {
    console.error('Create Delhivery shipment error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const trackDelhiveryOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findOne({ orderId });
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (!order.delhiveryWaybill) {
      return res.status(400).json({ message: 'No shipment created for this order' });
    }

    // Track shipment with Delhivery
    const trackingData = await delhiveryService.trackShipment(order.delhiveryWaybill);
    
    // Update order with latest tracking data
    order.delhiveryTrackingData = trackingData;
    if (trackingData && trackingData.ShipmentData && trackingData.ShipmentData.length > 0) {
      const latestStatus = trackingData.ShipmentData[0].Shipment;
      order.delhiveryStatus = latestStatus.Status?.status || 'In Transit';
      
      if (order.delhiveryStatus === 'Delivered') {
        order.status = 'Delivered';
      }
    }
    await order.save();
    
    res.json({ 
      message: 'Tracking data retrieved successfully', 
      order,
      trackingData 
    });
    
  } catch (error) {
    console.error('Track Delhivery order error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getShippingRate = async (req, res) => {
  try {
    const { pincode, weight = 0.5 } = req.query;
    const rate = delhiveryService.calculateShipping(pincode, weight);
    res.json({ pincode, weight, rate });
  } catch (error) {
    console.error('Shipping rate calculation error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export {
  createOrder,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  createRazorpayOrder,
  verifyPayment,
  createDelhiveryShipment,
  trackDelhiveryOrder,
  getShippingRate
};
