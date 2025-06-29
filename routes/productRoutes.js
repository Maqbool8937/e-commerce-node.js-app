import express from 'express';
import { createProductController, deleteProductController, deleteProductImageController, getAllProductsController, getSingleProductController, productReviewController, updateProductController, updateProductImageController } from '../controllers/productController.js';
import { isAdmin, isAuth } from '../middleswares/authMiddleware.js';
import { singleUpload } from '../middleswares/multer.js';

const router = express.Router();
// GET ALL PRODUCTS
router.get('/get-all', getAllProductsController)
// GET SINGLE PRODUCTS
router.get("/:id", getSingleProductController);
// CREATE PRODUCT
router.post('/create', isAuth, isAdmin, singleUpload, createProductController);
// UPDATE PRODUCT
router.put("/:id", isAuth, isAdmin, updateProductController);
// UPDATE PRODUCT Image
router.put("/image/:id", isAuth, isAdmin, singleUpload, updateProductImageController);
// DELETE PRODUCT IMAGE
router.delete('/delete-image/:id', isAuth, isAdmin, deleteProductImageController);
// DELETE PRODUCT 
router.delete('/delete/:id', isAuth, isAdmin, deleteProductController);

// REVIEW PRODUCT
router.put("/:id/review", isAuth, productReviewController);


export default router;