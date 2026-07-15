import crypto from 'crypto';
import sendEmail from '../utils/sendEmail.js';
import customerOrderTemplate from '../templates/customerOrderTemplate.js';
import adminOrderTemplate from '../templates/adminOrderTemplate.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import delhiveryService from '../utils/delhivery.js';

const generateOrderId = () => {
  return 'DFC' + crypto.randomBytes(4).toString('hex').toUpperCase();
};

const createOrder = async (req, res) => {
  try {
    const { customer, items, shippingAddress } = req.body;
    
    // Validate required fields
    if (!customer.firstName || !customer.lastName || !customer.email || !customer.phone) {
      return res.status(400).json({ message: 'Please provide all customer details' });
    }
    if (!shippingAddress.address || !shippingAddress.city || !shippingAddress.state || !shippingAddress.pincode) {
      return res.status(400).json({ message: 'Please provide complete shipping address' });
    }

    let total = 0;
    const orderItems = []; // Store items for email
    const orderItemsDb = []; // Items for DB
    
    for (let item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product with ID ${item.productId} not found` });
      }
      
      const itemPrice = product.price;
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

    const tax = total * 0.05; // 5% GST
    const shipping = total > 500 ? 0 : 50;
    const grandTotal = total + tax + shipping;

    const orderId = generateOrderId();
    const order = new Order({
      orderId,
      customer: {
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phone: customer.phone
      },
      total: grandTotal,
      tax,
      shipping,
      paymentMethod: 'COD',
      shippingAddress: shippingAddress,
      items: orderItemsDb,
      status: 'Confirmed'
    });
    await order.save();

    // Update product stock
    for (let item of items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity }
      });
    }
    
    // ------------------------------
    // Automatically create Delhivery shipment
    // ------------------------------
    try {
      // Prepare shipment data
      const shipmentData = {
        shipments: [{
          name: `${customer.firstName} ${customer.lastName}`,
          add: `${shippingAddress.address}, ${shippingAddress.city}`,
          pin: shippingAddress.pincode,
          city: shippingAddress.city,
          state: shippingAddress.state,
          country: 'India',
          phone: customer.phone,
          order: orderId,
          payment_mode: 'COD',
          shipping_mode: 'Surface',
          cod_amount: grandTotal,
          product_desc: orderItems.map(item => `${item.name} x${item.quantity}`).join(', ')
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
        // Calculate estimated delivery (7 days from now)
        const estimatedDelivery = new Date();
        estimatedDelivery.setDate(estimatedDelivery.getDate() + 7);
        order.estimatedDelivery = estimatedDelivery;
        await order.save();
      }
    } catch (shipmentError) {
      console.error('❌ Error creating Delhivery shipment:', shipmentError);
      // Don't fail the order if shipment creation fails
    }
    
    // ------------------------------
    // Send emails asynchronously
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
    
    // 1. Send Customer Confirmation Email
    const customerEmailData = {
      orderId: orderId,
      customerName: `${customer.firstName} ${customer.lastName}`,
      orderDate: orderDate,
      items: orderItems,
      shippingAddress: shippingAddress,
      paymentMethod: 'Cash on Delivery',
      paymentStatus: 'Pending (COD)',
      subtotal: total,
      shipping: shipping,
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
      paymentMethod: 'Cash on Delivery',
      paymentStatus: 'Pending (COD)',
      items: orderItems,
      grandTotal: grandTotal,
    };

    // Send emails (don't wait for them to complete)
    (async () => {
      try {
        await sendEmail({
          to: customer.email,
          subject: `Order Confirmation - ${orderId} | DailyFixCare`,
          html: customerOrderTemplate(customerEmailData)
        });
        
        if (process.env.ADMIN_EMAIL) {
          await sendEmail({
            to: process.env.ADMIN_EMAIL,
            subject: `New Order Received - ${orderId}`,
            html: adminOrderTemplate(adminEmailData)
          });
        }
      } catch (emailError) {
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
        order.paymentStatus = 'Paid'; // Mark as paid when delivered for COD
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
  trackDelhiveryOrder,
  getShippingRate
};
