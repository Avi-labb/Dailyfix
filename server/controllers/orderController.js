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
    const { customer, items, shippingAddress, shipping_address, paymentMethod, payment_method = 'cod' } = req.body;
    
    // Normalize the keys (handle both snake_case and camelCase)
    const shippingAddressData = shippingAddress || shipping_address;
    const payment = paymentMethod || payment_method;
    
    // Validate required fields
    if (!customer.firstName || !customer.lastName || !customer.email || !customer.phone) {
      return res.status(400).json({ message: 'Please provide all customer details' });
    }
    if (!shippingAddressData || !shippingAddressData.address || !shippingAddressData.city || !shippingAddressData.state || !shippingAddressData.pincode) {
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
      console.log("product",prouct.name)
      orderItemsDb.push({
        product: product._id,
        quantity: item.quantity,
        price: itemPrice
      });
    }

    const grandTotal = total;
    const tax = 0;
    const shipping = 0;

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
      shipping: 0,
      paymentMethod: payment === 'cod' ? 'COD' : 'Online',
      paymentStatus: payment === 'cod' ? 'Pending (COD)' : 'Paid',
      shippingAddress: shippingAddressData,
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
    let shipmentData;
    try {
      // Prepare shipment data
      const isCod = payment === 'cod';
      
      // Prepare customer object
      const customerData = {
        name: `${customer.firstName} ${customer.lastName}`,
        address: shippingAddressData.address,
        pin: shippingAddressData.pincode,
        city: shippingAddressData.city,
        state: shippingAddressData.state,
        country: 'India',
        phone: customer.phone
      };
      
      // Prepare shipment object
      const shipment = {
        // Customer / Consignee
        name: customerData.name,
        add: customerData.address,
        pin: String(customerData.pin),
        city: customerData.city,
        state: customerData.state,
        country: customerData.country,
        phone: String(customerData.phone),
        
        // Order
        order: String(orderId),
        payment_mode: isCod ? 'COD' : 'Pre-paid',
        shipping_mode: 'Surface',
        cod_amount: isCod ? Number(grandTotal) : 0,
        products_desc: orderItems.map(item => `${item.name} x${item.quantity}`).join(', '),
        
        // Package details (default values)
        weight: 500, // grams
        shipment_length: 20, // cm
        shipment_width: 15, // cm
        shipment_height: 10, // cm
        
        // Pickup location
        pickup_location: process.env.DELHIVERY_PICKUP_NAME,
        
        // Seller details
        seller_name: process.env.DELHIVERY_PICKUP_NAME,
        seller_address: process.env.DELHIVERY_PICKUP_ADDRESS,
        seller_city: process.env.DELHIVERY_PICKUP_CITY,
        seller_state: process.env.DELHIVERY_PICKUP_STATE,
        seller_pin: process.env.DELHIVERY_PICKUP_PIN,
        seller_country: process.env.DELHIVERY_PICKUP_COUNTRY || 'India',
        seller_phone: process.env.DELHIVERY_PICKUP_PHONE,
        seller_gstin: process.env.DELHIVERY_GST_NUMBER,
        
        // Consignee details
        name_consignee: customerData.name,
        address_consignee: customerData.address,
        city_consignee: customerData.city,
        state_consignee: customerData.state,
        pin_consignee: String(customerData.pin),
        phone_consignee: String(customerData.phone),
        country_consignee: customerData.country,
        
        // Individual product fields (for compatibility)
        ...orderItems.reduce((acc, item, index) => {
          acc[`name${index + 1}`] = item.name;
          acc[`qty${index + 1}`] = item.quantity;
          acc[`price${index + 1}`] = item.price;
          return acc;
        }, {})
      };
      
      // Final payload
      shipmentData = {
        shipments: [shipment],
        client: process.env.DELHIVERY_CLIENT_NAME // Important: add client field!
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
      console.error('❌ Error creating Delhivery shipment:');
      console.error('  - Error message:', shipmentError.message);
      if (shipmentError.response) {
        console.error('  - Response status:', shipmentError.response.status);
        console.error('  - Response data:', JSON.stringify(shipmentError.response.data, null, 2));
      }
      console.error('  - Shipment data sent:', JSON.stringify(shipmentData, null, 2));
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
      paymentMethod: paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment',
      paymentStatus: paymentMethod === 'cod' ? 'Pending (COD)' : 'Paid',
      subtotal: total,
      shipping: 0,
      gst: 0,
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
      paymentMethod: paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment',
      paymentStatus: paymentMethod === 'cod' ? 'Pending (COD)' : 'Paid',
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
