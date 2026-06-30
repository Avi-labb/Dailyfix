import sendEmail from '../utils/sendEmail.js';
import customerOrderTemplate from '../templates/customerOrderTemplate.js';
import adminOrderTemplate from '../templates/adminOrderTemplate.js';

const generateOrderId = () => {
  return 'DFC' + crypto.randomBytes(4).toString('hex').toUpperCase();
};

const createOrder = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const { customer, items, shipping_address, billing_address, payment_method, coupon_code } = req.body;
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!customer.email || !emailRegex.test(customer.email)) {
      await connection.rollback();
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }
    
    let customerId = null;
    if (customer.email || customer.phone) {
      const [existingCustomers] = await connection.query(
        'SELECT id FROM customers WHERE email = ? OR phone = ?',
        [customer.email, customer.phone]
      );
      if (existingCustomers.length > 0) {
        customerId = existingCustomers[0].id;
      } else {
        const [result] = await connection.query(
          'INSERT INTO customers (first_name, last_name, email, phone) VALUES (?, ?, ?, ?)',
          [customer.firstName, customer.lastName, customer.email, customer.phone]
        );
        customerId = result.insertId;
      }
    }

    let total = 0;
    const orderItems = []; // Store items for email
    
    for (let item of items) {
      const [products] = await connection.query('SELECT * FROM products WHERE id = ?', [item.product_id]);
      const product = products[0];
      const itemPrice = product.discount_price || product.price;
      const itemTotal = itemPrice * item.quantity;
      total += itemTotal;
      
      // Collect item details for email
      orderItems.push({
        id: product.id,
        name: product.name,
        image: product.image,
        quantity: item.quantity,
        price: itemPrice,
        total: itemTotal
      });
    }

    let discount = 0;
    if (coupon_code) {
      const [coupons] = await connection.query(
        'SELECT * FROM coupons WHERE code = ? AND active = true AND valid_from <= NOW() AND (valid_to IS NULL OR valid_to >= NOW())',
        [coupon_code]
      );
      if (coupons.length > 0) {
        const coupon = coupons[0];
        if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
          await connection.rollback();
          return res.status(400).json({ message: 'Coupon usage limit reached' });
        }
        if (coupon.min_order_value && total < coupon.min_order_value) {
          await connection.rollback();
          return res.status(400).json({ message: `Minimum order value for coupon is ${coupon.min_order_value}` });
        }
        if (coupon.discount_type === 'percentage') {
          discount = (total * coupon.discount_value) / 100;
          if (coupon.max_discount && discount > coupon.max_discount) {
            discount = coupon.max_discount;
          }
        } else {
          discount = coupon.discount_value;
        }
        await connection.query('UPDATE coupons SET used_count = used_count + 1 WHERE id = ?', [coupon.id]);
      }
    }

    const tax = total * 0.05; // 5% GST
    const shipping = total > 500 ? 0 : 50;
    const grandTotal = total - discount + tax + shipping;

    const orderId = generateOrderId();
    const [orderResult] = await connection.query(
      'INSERT INTO orders (order_id, customer_id, total, tax, shipping, discount, payment_method, shipping_address, billing_address) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [orderId, customerId, grandTotal, tax, shipping, discount, payment_method, JSON.stringify(shipping_address), JSON.stringify(billing_address)]
    );

    for (let item of items) {
      const [products] = await connection.query('SELECT * FROM products WHERE id = ?', [item.product_id]);
      const product = products[0];
      await connection.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
        [orderResult.insertId, item.product_id, item.quantity, product.discount_price || product.price]
      );
      await connection.query('UPDATE products SET stock = stock - ? WHERE id = ?', [item.quantity, item.product_id]);
    }

    await connection.commit();
    
    // ------------------------------
    // Send emails asynchronously after order is committed
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
    const paymentMethodDisplay = payment_method === 'cod' 
      ? 'Cash on Delivery' 
      : 'UPI / Card / Netbanking';
    
    const paymentStatus = payment_method === 'cod' ? 'Pending (COD)' : 'Paid';
    
    // 1. Send Customer Confirmation Email
    const customerEmailData = {
      orderId: orderId,
      customerName: `${customer.firstName} ${customer.lastName}`,
      orderDate: orderDate,
      items: orderItems,
      shippingAddress: shipping_address,
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
      shippingAddress: shipping_address,
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
    await connection.rollback();
    res.status(500).json({ message: 'Server error', error: error.message });
  } finally {
    connection.release();
  }
};

const getOrderById = async (req, res) => {
  try {
    const [orders] = await pool.query('SELECT * FROM orders WHERE order_id = ?', [req.params.id]);
    if (orders.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }
    const order = orders[0];
    const [items] = await pool.query('SELECT oi.*, p.name, p.slug FROM order_items oi JOIN products p ON oi.product_id = p.id WHERE oi.order_id = ?', [order.id]);
    order.items = items;
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    
    let query = 'SELECT * FROM orders';
    const params = [];

    if (status) {
      query += ' WHERE status = ?';
      params.push(status);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [orders] = await pool.query(query, params);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    await pool.query('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ message: 'Order status updated' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export {
  createOrder,
  getOrderById,
  getAllOrders,
  updateOrderStatus
};