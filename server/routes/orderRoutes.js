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

} from "../controllers/orderController.js";

/*
=================================================
ORDER ROUTES
=================================================
*/

router.get("/shipping/rate", getShippingRate);

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