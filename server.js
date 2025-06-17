import express from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import connectMongoDB from "./config/db.js"; // 🔄 typo fixed in function name
import cookieParser from "cookie-parser";
import cloudinary from "cloudinary";
import Stripe from "stripe";


// Load environment variables
dotenv.config();

// Connect to MongoDB
connectMongoDB();

// Stripe configuration
export const stripe = new Stripe(process.env.STRIPE_API_SECRET);

// cloudinary.v2.config({
//     cloud_name: process.env.CLOUDINARY_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET,
// });


cloudinary.v2.config({
    cloud_name: "dkqw4xkjg",
    api_key: "695735725747622",
    api_secret: "nOMLeMSnxMAlIE5HUXOJIMT2G2Y"
})

// Create Express app
const app = express();

// Middleware
app.use(morgan("dev"));
app.use(express.json()); // ✅ Handles JSON request bodies
app.use(cors());
app.use(cookieParser());

// Import routes
import testRoutes from "./routes/testRoutes.js";
import userRoutes from "./routes/userRoutes.js";
// import productRoutes from "./routes/productRoutes.js";
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

// Route setup
app.use("/api/v1", testRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/cat", categoryRoutes);
app.use("/api/v1/order", orderRoutes);


// Home route
app.get("/", (req, res) => {
    res.status(200).send("<h1>🛒 E-comm App Server Running</h1>");
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`✅ Server is running on Port ${PORT} on ${process.env.NODE_ENV} mode`);
});
