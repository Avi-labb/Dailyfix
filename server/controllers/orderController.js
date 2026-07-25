import crypto from "crypto";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import sendEmail from "../utils/sendEmail.js";
import customerOrderTemplate from "../templates/customerOrderTemplate.js";
import adminOrderTemplate from "../templates/adminOrderTemplate.js";
import delhiveryService from "../utils/delhivery.js";

const generateOrderId = () => {
  return (
    "DFX" +
    new Date().getFullYear() +
    crypto.randomBytes(4).toString("hex").toUpperCase()
  );
};


const calculateWeight = async (items) => {
  let weight = 0;

  for (const item of items) {
    const product = await Product.findById(item.productId);

    if (!product) continue;

    weight += (product.weight || 500) * Number(item.quantity);
  }

  return weight;
};

const calculateDimensions = async (items) => {
  let length = 0;
  let width = 0;
  let height = 0;

  for (const item of items) {
    const product = await Product.findById(item.productId);

    if (!product) continue;

    length = Math.max(length, product.length || 15);
    width = Math.max(width, product.width || 10);
    height += product.height || 5;
  }

  return {
    length,
    width,
    height,
  };
};

export const createOrder = async (req, res) => {
  let order;

  try {
    console.log("========== NEW ORDER ==========");

    const {
      customer,
      items,
      shippingAddress,
      shipping_address,
      paymentMethod,
      payment_method,
    } = req.body;

    const finalShippingAddress =
      shippingAddress || shipping_address;

    const payment =
      paymentMethod ||
      payment_method ||
      "COD";

    if (!customer) {
      return res.status(400).json({
        success: false,
        message: "Customer information missing",
      });
    }

    if (
      !customer.firstName ||
      !customer.lastName ||
      !customer.email ||
      !customer.phone
    ) {
      return res.status(400).json({
        success: false,
        message: "Complete customer details required",
      });
    }

    if (!finalShippingAddress) {
      return res.status(400).json({
        success: false,
        message: "Shipping address missing",
      });
    }

    if (
      !finalShippingAddress.address ||
      !finalShippingAddress.city ||
      !finalShippingAddress.state ||
      !finalShippingAddress.pincode
    ) {
      return res.status(400).json({
        success: false,
        message: "Complete shipping address required",
      });
    }

    if (!items || !items.length) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    let subtotal = 0;

    const orderItems = [];

    const dbItems = [];

    for (const item of items) {
      const product = await Product.findById(
        item.productId
      );

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `${product.name} is out of stock`,
        });
      }

      subtotal +=
        Number(product.price) *
        Number(item.quantity);

      orderItems.push({
        id: product._id,
        name: product.name,
        image: product.image,
        quantity: Number(item.quantity),
        price: product.price,
      });

      dbItems.push({
        product: product._id,
        name: product.name,
        quantity: Number(item.quantity),
        price: product.price,
      });
    }

    const tax = 0;
    const shipping = 0;

    const total = subtotal + tax + shipping;

    const weight =
      await calculateWeight(items);

    const dimensions =
      await calculateDimensions(items);

    order = await Order.create({
      orderId: generateOrderId(),

      customer,

      shippingAddress:
        finalShippingAddress,

      packageDetails: {
        weight,
        length: dimensions.length,
        width: dimensions.width,
        height: dimensions.height,
      },

      paymentMethod:
        payment.toUpperCase() === "COD"
          ? "COD"
          : "Online",

      paymentStatus:
        payment.toUpperCase() === "COD"
          ? "Pending (COD)"
          : "Paid",

      total,
      tax,
      shipping,

      status: "Confirmed",

      items: dbItems,
    });

    console.log("✅ Order Saved:", order.orderId);

    /*
    ==========================================
    UPDATE STOCK FIRST (IMPORTANT!)
    ==========================================
    */

    console.log("Updating Product Stock...");
    for (const item of items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -Number(item.quantity) },
      });
    }
    console.log("✅ Product Stock Updated");

    /*
    ==========================================
    SEND EMAILS FIRST (CRITICAL!)
    ==========================================
    */

    try {
      await sendEmail({
        to: order.customer.email,
        subject: `Order Confirmation - ${order.orderId}`,
        html: customerOrderTemplate(order),
      });
      console.log("✅ Customer email sent");
    } catch (error) {
      console.error("❌ Customer email failed:", error.message);
    }

    try {
      const adminEmail = process.env.ADMIN_EMAIL;
      if (adminEmail) {
        await sendEmail({
          to: adminEmail,
          subject: `New Order Received - ${order.orderId}`,
          html: adminOrderTemplate(order),
        });
        console.log("✅ Admin email sent");
      }
    } catch (error) {
      console.error("❌ Admin email failed:", error.message);
    }

    /*
    ==========================================
    SUCCESS RESPONSE (SEND BEFORE DELHIVERY!)
    ==========================================
    */

    res.status(201).json({
      success: true,
      message: "Order placed successfully.",
      order,
    });

    /*
    ==========================================
    DELHIVERY INTEGRATION (BACKGROUND, NON-BLOCKING)
    ==========================================
    */
    (async () => {
      try {
        // Check Serviceability (optional)
        try {
          console.log("📍 Checking serviceability...");
          const serviceability = await delhiveryService.checkServiceability({
            pickupPin: process.env.DELHIVERY_PICKUP_PIN,
            deliveryPin: finalShippingAddress.pincode,
            weight,
            cod: payment === "COD",
          });
          console.log("✅ Serviceability Response:", JSON.stringify(serviceability, null, 2));
        } catch (serviceErr) {
          console.log("⚠ Serviceability check failed (skipping):", serviceErr.message);
        }

        // Calculate Shipping (optional)
        try {
          console.log("💰 Calculating shipping...");
          const shippingRate = await delhiveryService.calculateShipping({
            pickupPin: process.env.DELHIVERY_PICKUP_PIN,
            deliveryPin: finalShippingAddress.pincode,
            weight,
          });
          console.log("✅ Shipping Response:", JSON.stringify(shippingRate, null, 2));
        } catch (shippingErr) {
          console.log("⚠ Shipping calculation failed (skipping):", shippingErr.message);
        }

        console.log("📦 Building shipment payload...");
        const shipmentPayload = delhiveryService.buildShipmentPayload(order);
        console.log(JSON.stringify(shipmentPayload, null, 2));

        console.log("🚚 Creating shipment...");
        const shipmentResponse = await delhiveryService.createShipment(shipmentPayload);
        console.log("Shipment Response:", JSON.stringify(shipmentResponse, null, 2));

        const waybill = delhiveryService.extractWaybill(shipmentResponse);
        console.log("AWB :", waybill);

        order.delhivery = {
          waybill,
          shipmentId: delhiveryService.getShipmentId(shipmentResponse),
          pickupRequestId: delhiveryService.getPickupRequestId(shipmentResponse),
          currentStatus: "Manifested",
          labelUrl: delhiveryService.getLabelURL(shipmentResponse),
          invoiceUrl: delhiveryService.getInvoiceURL(shipmentResponse),
          expectedDelivery: delhiveryService.getEstimatedDelivery(shipmentResponse),
          shipmentResponse,
          trackingHistory: [],
          lastSynced: new Date(),
        };
        await order.save();
        console.log("✅ Delhivery Details Saved");

        // Try to generate label
        try {
          const label = await delhiveryService.generateShippingLabel(waybill);
          console.log("✅ Shipping Label Generated");
          order.delhivery.label = label;
          await order.save();
        } catch (labelErr) {
          console.log("⚠ Shipping Label Generation Failed:", labelErr.message);
        }
      } catch (delhiveryErr) {
        console.error("⚠ Delhivery Integration Failed (Non-Blocking):", delhiveryErr.message);
      }
    })();

  } catch (error) {

    console.error("❌ CREATE ORDER ERROR");
    console.error(error);

    /*
    ==========================================
    ROLLBACK STOCK (OPTIONAL)
    ==========================================
    */

    try {
      if (order && order._id) {
        await Order.findByIdAndDelete(order._id);
        for (const item of req.body.items) {
          await Product.findByIdAndUpdate(item.productId, {
            $inc: { stock: Number(item.quantity) },
          });
        }
      }
    } catch (rollbackError) {
      console.error(
        "Rollback Failed:",
        rollbackError.message
      );
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
==========================================
GET ORDER BY ID
==========================================
*/

export const getOrderById = async (req, res) => {
  try {

    const order = await Order.findById(req.params.id)
      .populate("items.product");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.json({
      success: true,
      order,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

/*
==========================================
GET ALL ORDERS
==========================================
*/

export const getAllOrders = async (req, res) => {
  try {

    const orders = await Order.find()
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      total: orders.length,
      orders,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

/*
==========================================
UPDATE ORDER STATUS
==========================================
*/

export const updateOrderStatus = async (req, res) => {

  try {

    const { status } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {

      return res.status(404).json({
        success: false,
        message: "Order not found",
      });

    }

    order.status = status;

    await order.save();

    return res.json({
      success: true,
      message: "Order updated successfully.",
      order,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};
/*
=================================================
TRACK DELHIVERY SHIPMENT
=================================================
*/

export const trackDelhiveryOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findOne({ orderId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (!order.delhivery?.waybill) {
      return res.status(400).json({
        success: false,
        message: "Shipment not created yet.",
      });
    }

    const tracking = await delhiveryService.trackShipment(
      order.delhivery.waybill
    );

    order.delhivery.currentStatus =
      tracking?.ShipmentData?.[0]?.Shipment?.Status?.Status ||
      order.delhivery.currentStatus;

    order.delhivery.lastSynced = new Date();

    const scans =
      tracking?.ShipmentData?.[0]?.Shipment?.Scans || [];

    order.delhivery.trackingHistory = scans.map((scan) => ({
      status: scan.ScanDetail.Scan,
      location: scan.ScanDetail.ScannedLocation,
      remarks: scan.ScanDetail.Instructions,
      date: scan.ScanDetail.ScanDateTime,
    }));

    await order.save();

    return res.json({
      success: true,
      tracking,
      order,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
=================================================
CANCEL SHIPMENT
=================================================
*/

export const cancelDelhiveryShipment = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findOne({
      orderId,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (!order.delhivery?.waybill) {
      return res.status(400).json({
        success: false,
        message: "Shipment not created.",
      });
    }

    const response =
      await delhiveryService.cancelShipment(
        order.delhivery.waybill
      );

    order.status = "Cancelled";
    order.delhivery.currentStatus = "Cancelled";

    await order.save();

    return res.json({
      success: true,
      message: "Shipment cancelled.",
      response,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
=================================================
DOWNLOAD SHIPPING LABEL
=================================================
*/

export const downloadShippingLabel = async (
  req,
  res
) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findOne({
      orderId,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const pdf =
      await delhiveryService.generateShippingLabel(
        order.delhivery.waybill
      );

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=${order.orderId}.pdf`,
    });

    return res.send(pdf);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
=================================================
SYNC TRACKING
=================================================
*/

export const syncOrderTracking = async (
  req,
  res
) => {
  try {
    const activeOrders = await Order.find({
      "delhivery.waybill": { $ne: "" },
      status: { $nin: ["Delivered", "Cancelled", "Returned"] },
    });
    await Promise.allSettled(
      activeOrders.map((order) => delhiveryService.syncTracking(order))
    );

    return res.json({
      success: true,
      message: `Synced tracking for ${activeOrders.length} active orders.`,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
=================================================
GET SHIPPING RATE
=================================================
*/

export const getShippingRate = async ( req,res) => {
  try {
    const { destinationPin, weight } = req.query;
    const response =
      await delhiveryService.calculateShipping({
        pickupPin:
          process.env.DELHIVERY_PICKUP_PIN,
        deliveryPin: destinationPin,
        weight,
      });

    return res.json({
      success: true,
      response,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};  