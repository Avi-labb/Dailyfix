import crypto from "crypto";
import axios from "axios";
import sendEmail from "../utils/sendEmail.js";
import customerOrderTemplate from "../templates/customerOrderTemplate.js";
import adminOrderTemplate from "../templates/adminOrderTemplate.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import delhiveryService from "../utils/delhivery.js";

/* =====================================================
   GENERATE ORDER ID
===================================================== */
const generateOrderId = () => {
  return "DFC" + crypto.randomBytes(4).toString("hex").toUpperCase();
};

/* =====================================================
   CREATE ORDER
===================================================== */
const createOrder = async (req, res) => {
  let order = null;

  try {
    console.log("📦 RECEIVED ORDER REQUEST:");
    console.log(JSON.stringify(req.body, null, 2));

    const {
      customer,
      items,
      shippingAddress,
      shipping_address,
      paymentMethod,
      payment_method,
    } = req.body;

    /* =====================================================
       VALIDATE CUSTOMER
    ===================================================== */
    if (
      !customer ||
      !customer.firstName ||
      !customer.lastName ||
      !customer.email ||
      !customer.phone
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all customer details",
      });
    }

    /* =====================================================
       NORMALIZE PAYMENT & SHIPPING
    ===================================================== */
    const payment = paymentMethod || payment_method || "cod";
    const shippingAddressData = shippingAddress || shipping_address;

    /* =====================================================
       VALIDATE SHIPPING ADDRESS
    ===================================================== */
    if (
      !shippingAddressData ||
      !shippingAddressData.address ||
      !shippingAddressData.city ||
      !shippingAddressData.state ||
      !shippingAddressData.pincode
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide complete shipping address",
      });
    }

    const finalShippingAddress = {
      ...shippingAddressData,
      phone: customer.phone,
    };

    /* =====================================================
       VALIDATE ITEMS
    ===================================================== */
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please add items to your order",
      });
    }

    /* =====================================================
       CALCULATE TOTAL
    ===================================================== */
    let total = 0;
    const orderItems = [];
    const orderItemsDb = [];

    for (const item of items) {
      console.log("🔍 FINDING PRODUCT:", item.productId);

      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product with ID ${item.productId} not found`,
        });
      }

      const quantity = Number(item.quantity);

      if (!quantity || quantity <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid product quantity",
        });
      }

      const itemPrice = Number(product.price);
      const itemTotal = itemPrice * quantity;

      total += itemTotal;

      orderItems.push({
        id: product._id,
        name: product.name,
        image: product.image,
        quantity,
        price: itemPrice,
        total: itemTotal,
      });

      orderItemsDb.push({
        product: product._id,
        quantity,
        price: itemPrice,
      });

      console.log("✅ PRODUCT FOUND:", product.name);
    }

    const grandTotal = total;
    const tax = 0;
    const shipping = 0;

    /* =====================================================
       CREATE ORDER IN DATABASE
    ===================================================== */
    const orderId = generateOrderId();

    order = new Order({
      orderId,
      customer: {
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phone: customer.phone,
      },
      total: grandTotal,
      tax,
      shipping,
      paymentMethod: payment === "cod" ? "COD" : "Online",
      paymentStatus: payment === "cod" ? "Pending (COD)" : "Paid",
      shippingAddress: finalShippingAddress,
      items: orderItemsDb,
      status: "Confirmed",
    });

    await order.save();
    console.log("✅ ORDER SAVED:", orderId);

    /* =====================================================
       UPDATE PRODUCT STOCK
    ===================================================== */
    for (const item of items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -Number(item.quantity) },
      });
    }

    /* =====================================================
       CREATE DELHIVERY SHIPMENT
    ===================================================== */
    let shipmentData = null;

    try {
      const isCod = payment.toLowerCase() === "cod";

      // Trim whitespace from env variables
      const pickupName = process.env.DELHIVERY_PICKUP_NAME?.trim();
      const pickupAddress = process.env.DELHIVERY_PICKUP_ADDRESS?.trim();
      const pickupCity = process.env.DELHIVERY_PICKUP_CITY?.trim();
      const pickupState = process.env.DELHIVERY_PICKUP_STATE?.trim();
      const pickupPin = process.env.DELHIVERY_PICKUP_PIN?.trim();
      const pickupPhone = process.env.DELHIVERY_PICKUP_PHONE?.trim();
      const clientName = process.env.DELHIVERY_CLIENT_NAME?.trim();

      console.log("========== PICKUP DATA ==========");
      console.log("PICKUP NAME:", pickupName);
      console.log("PICKUP ADDRESS:", pickupAddress);
      console.log("PICKUP CITY:", pickupCity);
      console.log("PICKUP STATE:", pickupState);
      console.log("PICKUP PIN:", pickupPin);
      console.log("CLIENT NAME:", clientName);
      console.log("==================================");

      if (!pickupName) {
        throw new Error("DELHIVERY_PICKUP_NAME is missing from env variables");
      }

      const shipment = {
        name: `${customer.firstName} ${customer.lastName}`,
        add: finalShippingAddress.address,
        pin: String(finalShippingAddress.pincode).trim(),
        city: finalShippingAddress.city,
        state: finalShippingAddress.state,
        country: "India",
        phone: String(customer.phone).trim(),

        order: String(orderId),
        payment_mode: isCod ? "COD" : "Pre-paid",
        cod_amount: isCod ? Number(grandTotal) : 0,
        total_amount: Number(grandTotal),
        products_desc: orderItems.map((item) => `${item.name} x${item.quantity}`).join(", "),
        quantity: items.reduce((sum, item) => sum + Number(item.quantity), 0),

        weight: 500,
        shipment_length: 20,
        shipment_width: 15,
        shipment_height: 10,


        pickup_location: pickupName,
        pickup_address: pickupAddress,
        pickup_city: pickupCity,
        pickup_state: pickupState,
        pickup_pin: String(pickupPin),
        pickup_phone: pickupPhone,


        seller_name: pickupName,
        seller_inv_date: new Date().toISOString().split("T")[0],
        seller_add: pickupAddress,
        seller_cst_number: "",
        seller_tin: process.env.DELHIVERY_GST_NUMBER || "",
        seller_gst_tin: process.env.DELHIVERY_GST_NUMBER || "",
        gst_number: process.env.DELHIVERY_GST_NUMBER || "",


        return_add: pickupAddress,
        return_city: pickupCity,
        return_state: pickupState,
        return_country: "India",
        return_pin: String(pickupPin),
        return_phone: pickupPhone,
      };

      console.log("Address", pickupAddress)
      console.log("ENV ADD", process.env.DELHIVERY_PICKUP_ADDRESS)
      shipmentData = {
        shipments: [shipment],
        client: clientName || pickupName,
      };

      console.log("📦 CALLING DELHIVERY API...");
      const delhiveryResponse = await delhiveryService.createShipment(shipmentData);

      console.log("📦 FULL DELHIVERY RESPONSE:", JSON.stringify(delhiveryResponse, null, 2));

      // Inspect Delhivery response status explicitly
      const packageResult = delhiveryResponse?.packages?.[0];

      if (!delhiveryResponse || packageResult?.status === "Fail") {
        const errorRemarks = packageResult?.remarks?.join(", ") || packageResult?.rmk || "Unknown Delhivery error";
        throw new Error(`Delhivery Shipment Creation Failed: ${errorRemarks}`);
      }

      /* =====================================================
         EXTRACT & SAVE AWB
      ===================================================== */
      const awb = delhiveryService.extractAWB(delhiveryResponse) || packageResult?.waybill;

      if (!awb) {
        throw new Error("Shipment succeeded but failed to parse AWB/Waybill from response.");
      }

      console.log("✅ AWB GENERATED SUCCESSFULLY:", awb);

      order.delhiveryAWB = awb;
      order.delhiveryWaybill = awb;
      order.delhiveryStatus = "Manifested";
      order.shipmentCreatedAt = new Date();
      order.status = "Shipped";

      const estimatedDelivery = new Date();
      estimatedDelivery.setDate(estimatedDelivery.getDate() + 7);
      order.estimatedDelivery = estimatedDelivery;

      await order.save();
      console.log("✅ ORDER UPDATED WITH AWB:", awb);

    } catch (shipmentError) {
      console.error("❌ DELHIVERY SHIPMENT ERROR DETAILS:");
      console.error("Reason:", shipmentError.message);
      console.error("API Response Data:", shipmentError.response?.data);
      order.delhiveryStatus = "Failed";
      await order.save();
    }

    /* =====================================================
       SEND EMAILS
    ===================================================== */
    const orderDate = new Date().toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const estimatedDeliveryDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const customerEmailData = {
      orderId,
      customerName: `${customer.firstName} ${customer.lastName}`,
      orderDate,
      items: orderItems,
      shippingAddress: finalShippingAddress,
      paymentMethod: payment === "cod" ? "Cash on Delivery" : "Online Payment",
      paymentStatus: payment === "cod" ? "Pending (COD)" : "Paid",
      subtotal: total,
      shipping: 0,
      gst: 0,
      grandTotal,
      estimatedDelivery: estimatedDeliveryDate,
    };

    const adminEmailData = {
      orderId,
      customerName: `${customer.firstName} ${customer.lastName}`,
      customerEmail: customer.email,
      customerPhone: customer.phone,
      orderDate,
      shippingAddress: finalShippingAddress,
      paymentMethod: payment === "cod" ? "Cash on Delivery" : "Online Payment",
      paymentStatus: payment === "cod" ? "Pending (COD)" : "Paid",
      items: orderItems,
      grandTotal,
    };

    (async () => {
      try {
        await sendEmail({
          to: customer.email,
          subject: `Order Confirmation - ${orderId} | DailyFixCare`,
          html: customerOrderTemplate(customerEmailData),
        });
        console.log("✅ CUSTOMER EMAIL SENT");

        if (process.env.ADMIN_EMAIL) {
          await sendEmail({
            to: process.env.ADMIN_EMAIL,
            subject: `New Order Received - ${orderId}`,
            html: adminOrderTemplate(adminEmailData),
          });
          console.log("✅ ADMIN EMAIL SENT");
        }
      } catch (emailError) {
        console.error("❌ EMAIL ERROR:", emailError.message);
      }
    })();

    /* =====================================================
       FINAL RESPONSE
    ===================================================== */
    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      orderId,
      awb: order.delhiveryAWB || null,
      shipmentStatus: order.delhiveryStatus,
    });

  } catch (error) {
    console.error("❌ ORDER CREATION ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

/* =====================================================
   OTHER CONTROLLERS
===================================================== */
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.id }).populate(
      "items.product",
      "name slug"
    );
    if (!order) return res.status(404).json({ message: "Order not found" });
    return res.json(order);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const filter = {};
    if (status) filter.status = status;

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    return res.json(orders);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    await Order.findByIdAndUpdate(req.params.id, { status });
    return res.json({ message: "Order status updated" });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

const trackDelhiveryOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findOne({ orderId });

    if (!order) return res.status(404).json({ message: "Order not found" });
    if (!order.delhiveryWaybill) {
      return res.status(400).json({ message: "No shipment created for this order" });
    }

    const trackingData = await delhiveryService.trackShipment(order.delhiveryWaybill);
    order.delhiveryTrackingData = trackingData;

    if (trackingData?.ShipmentData?.[0]?.Shipment) {
      const shipment = trackingData.ShipmentData[0].Shipment;
      const latestStatus = shipment?.Status?.Status || shipment?.Status?.status || "In Transit";
      order.delhiveryStatus = latestStatus;

      if (latestStatus.toLowerCase().includes("delivered")) {
        order.status = "Delivered";
        if (order.paymentMethod === "COD") order.paymentStatus = "Paid";
      }
    }

    await order.save();
    return res.json({ message: "Tracking data retrieved successfully", order, trackingData });
  } catch (error) {
    console.error("❌ TRACKING ERROR:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getShippingRate = async (req, res) => {
  try {
    const { pincode, weight = 0.5 } = req.query;
    const rate = delhiveryService.calculateShipping(pincode, weight);
    return res.json({ pincode, weight, rate });
  } catch (error) {
    console.error("❌ SHIPPING RATE ERROR:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

export {
  createOrder,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  trackDelhiveryOrder,
  getShippingRate,
};