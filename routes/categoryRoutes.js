import express from 'express';
import { isAdmin, isAuth } from '../middleswares/authMiddleware.js';
import { createCategory, deleteCategoryController, getAllCategoriesController, updateCategoryController } from '../controllers/categoryController.js';

const router = express.Router();
// CREATE CATEGORY
router.post('/create', isAuth, isAdmin, createCategory);
// GET ALL CATEGORY
router.get('/get-all', getAllCategoriesController);
// DELETE CATEGORY
router.delete('/delete/:id', isAuth, isAdmin, deleteCategoryController);
// UPDATE CATEGORY
router.put('/update/:id', isAuth, isAdmin, updateCategoryController);

export default router;