import express from 'express';
import { getUserProfileController, loginController, logoutController, registerController, udpatePasswordController, updateProfileController, updateProfilePicController } from '../controllers/userController.js';
import { isAuth } from '../middleswares/authMiddleware.js';
import { singleUpload } from '../middleswares/multer.js';


const router = express.Router();

// ROUTES
// REGISTER
router.post('/register', registerController)

// LOGIN
router.post('/login', loginController)

// GET USER PROFILE
router.get('/profile', isAuth, getUserProfileController)

// LOGOUT
router.get('/logout', isAuth, logoutController)
// UPDATE USER PROFILE
router.put('/update-profile', isAuth, updateProfileController)

// UPDATE PASSWORD
router.put('/update-password', isAuth, udpatePasswordController)
// UPDATE PICTURE
router.put('/update-picture', isAuth, singleUpload, updateProfilePicController)

export default router;