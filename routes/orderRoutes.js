import express from 'express';
import { isAdmin, isAuth } from '../middleswares/authMiddleware.js';
import { changeOrderStatusController, createOrderController, getAllOrdersController, getMyOrdersCotroller, paymetsController, singleOrderDetrailsController } from '../controllers/orderController.js';

const router = express.Router();
// CREATE ORDER
router.post('/create', isAuth, createOrderController);
// GET ALL ORDERS
router.get('/my-orders', isAuth, getMyOrdersCotroller);
// GET SINGLE ORDER DETAIL
router.get('/my-orders/:id', isAuth, singleOrderDetrailsController);
// ACCEPT PAYMENTS
router.post('/payments', isAuth, paymetsController);

/// ======== ADMIN PART ============
// get all order
router.get("/admin/get-all-orders", isAuth, isAdmin, getAllOrdersController);

// change order status
router.put("/admin/order/:id", isAuth, isAdmin, changeOrderStatusController);

// ====================================================================



export default router;