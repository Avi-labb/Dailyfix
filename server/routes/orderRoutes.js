import express from "express";

const router = express.Router();

import authMiddleware from "../middleware/auth.js";

import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,

  trackDelhiveryOrder,
  cancelDelhiveryShipment,
  downloadShippingLabel,
  syncOrderTracking,
  getShippingRate,

  createRazorpayOrder,
  verifyRazorpayPayment,
  razorpayWebhook,

  getDashboardStats,

} from "../controllers/orderController.js";

/*
=================================================
RAZORPAY ROUTES
=================================================
*/

// Razorpay Webhook (must be before auth routes - no auth needed)
router.post("/razorpay-webhook", express.raw({ type: "application/json" }), razorpayWebhook);

// Create Razorpay Order (public - checkout use)
router.post("/create-razorpay-order", createRazorpayOrder);

// Verify Razorpay Payment Signature (public - checkout use)
router.post("/verify-payment", verifyRazorpayPayment);

/*
=================================================
ORDER ROUTES
=================================================
*/

router.get("/shipping/rate", getShippingRate);

// Dashboard Stats (Admin)
router.get("/dashboard/stats", authMiddleware, getDashboardStats);

// Sync All Tracking (Admin)
router.post("/sync-tracking", authMiddleware, syncOrderTracking);

// Create Order
router.post("/", createOrder);

// Get All Orders (Admin)
router.get("/", authMiddleware, getAllOrders);

// Get Single Order
router.get("/:id", getOrderById);
// Update Order Status
router.put("/:id/status", authMiddleware, updateOrderStatus);
/*
=================================================
DELHIVERY ROUTES
=================================================
*/
router.get("/:orderId/track", trackDelhiveryOrder);

router.get("/:orderId/label", authMiddleware, downloadShippingLabel);

router.get("/:orderId/cancel", authMiddleware, cancelDelhiveryShipment);

export default router;