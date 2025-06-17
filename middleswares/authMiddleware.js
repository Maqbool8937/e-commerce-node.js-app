import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";

// USER AUTH MIDDLEWARE
export const isAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;

        // Token validation
        if (!token) {
            return res.status(401).send({
                success: false,
                message: "Unauthorized user. Token missing.",
            });
        }

        // Verify JWT
        const decoded = JWT.verify(token, process.env.JWT_SECRET);

        // Attach user to request
        req.user = await userModel.findById(decoded._id).select("-password");
        if (!req.user) {
            return res.status(401).send({
                success: false,
                message: "User not found",
            });
        }

        next();
    } catch (error) {
        console.error("Auth Middleware Error:", error);
        return res.status(401).send({
            success: false,
            message: "Invalid or expired token",
        });
    }
};

// ADMIN AUTH MIDDLEWARE
export const isAdmin = (req, res, next) => {
    try {
        if (req.user?.role !== "admin") {
            return res.status(403).send({
                success: false,
                message: "Access denied. Admins only.",
            });
        }
        next();
    } catch (error) {
        console.error("Admin Auth Error:", error);
        return res.status(500).send({
            success: false,
            message: "Server error in admin auth",
        });
    }
};
