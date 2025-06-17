import userModel from '../models/userModel.js';
import jwt from "jsonwebtoken";
import { getDataUri } from '../utils/features.js';
import cloudinary from 'cloudinary';

export const registerController = async (req, res) => {
    try {
        const { name, email, password, address, city, country, phone, answer } = req.body;

        // Validation
        if (!name || !email || !password || !city || !address || !country || !phone || !answer) {
            return res.status(400).send({
                success: false,
                message: "Please provide all fields",
            });
        }

        // Check existing user
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).send({
                success: false,
                message: "Email already taken",
            });
        }

        // Create user
        const user = await userModel.create({
            name,
            email,
            password,
            address,
            city,
            country,
            phone,
            answer,
        });

        res.status(201).send({
            success: true,
            message: "Registration successful, please login",
            user,
        });
    } catch (error) {
        console.log("❌ Error in registerController:", error);
        res.status(500).send({
            success: false,
            message: "Error in Register API",
            error: error.message,
        });
    }

};

// LOGIN
export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide both email and password",
            });
        }

        // Find user by email
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { _id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "15d" }
        );

        //Set cookie options
        const cookieOptions = {
            expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days
            httpOnly: true,
            secure: process.env.NODE_ENV === "developement" ? true : false, // true in prod
            sameSite: "lax",
        };

        //Send response with token cookie
        res.status(200)
            .cookie("token", token, cookieOptions)
            .json({
                success: true,
                message: "Login successful",
                token,
                user: {
                    _id: user._id,
                    email: user.email,
                    name: user.name,   // send only needed fields
                    // ...any other public fields
                },
            });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

// GET USER PROFILE
export const getUserProfileController = async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id);
        user.password = undefined;
        res.status(200).send({
            success: true,
            message: "USer Prfolie Fetched Successfully",
            user,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error In PRofile API",
            error,
        });
    }
};


// LOGOUT
export const logoutController = async (req, res) => {
    try {
        res
            .status(200)
            .cookie("token", "", {
                expires: new Date(Date.now()),
                secure: process.env.NODE_ENV === "development" ? true : false,
                httpOnly: process.env.NODE_ENV === "development" ? true : false,
                sameSite: process.env.NODE_ENV === "development" ? true : false,
            })
            .send({
                success: true,
                message: "Logout SUccessfully",
            });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error In LOgout API",
            error,
        });
    }
};

// UPDATE USER PROFILE
export const updateProfileController = async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id);
        const { name, email, address, city, country, phone } = req.body;
        // validation + Update
        if (name) user.name = name;
        if (email) user.email = email;
        if (address) user.address = address;
        if (city) user.city = city;
        if (country) user.country = country;
        if (phone) user.phone = phone;
        //save user
        await user.save();
        res.status(200).send({
            success: true,
            message: "User Profile Updated",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error In update profile API",
            error,
        });
    }
};

// update user passsword
export const udpatePasswordController = async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id);
        const { oldPassword, newPassword } = req.body;
        //valdiation
        if (!oldPassword || !newPassword) {
            return res.status(500).send({
                success: false,
                message: "Please provide old or new password",
            });
        }
        // old pass check
        const isMatch = await user.comparePassword(oldPassword);
        //validaytion
        if (!isMatch) {
            return res.status(500).send({
                success: false,
                message: "Invalid Old Password",
            });
        }
        user.password = newPassword;
        await user.save();
        res.status(200).send({
            success: true,
            message: "Password Updated Successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error In update password API",
            error,
        });
    }
};
/// Update user profile photo
export const updateProfilePicController = async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id);

        // file get from client photo
        const file = getDataUri(req.file);

        // delete prev image if exists
        if (user.profilePic?.public_id) {
            await cloudinary.v2.uploader.destroy(user.profilePic.public_id);
        }

        // upload new image
        const cdb = await cloudinary.v2.uploader.upload(file.content, {
            folder: "profile_pictures", // optional: organize better
        });

        user.profilePic = {
            public_id: cdb.public_id,
            url: cdb.secure_url,
        };

        // save to DB
        await user.save();

        res.status(200).send({
            success: true,
            message: "Profile picture updated successfully",
            profilePic: user.profilePic,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in update profile pic API",
            error: error.message,
        });
    }
};
