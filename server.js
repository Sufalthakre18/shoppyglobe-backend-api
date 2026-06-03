/**
 * ShoppyGlobe E-Commerce Backend
 * Main server entry point
 */

import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/db.js";

// Import routes
import authRoutes from "./routes/authRoutes.js";


dotenv.config();

const app = express();

// ─── Connect to MongoDB ───────────────────────────────────────────────────────
connectDB();

// ─── Middlewares ──────────────────────────────────────────────────────────────
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded bodies


// ─── Routes ───────────────────────────────────────────────────────────────────
app.use("/", authRoutes);

// ─── Root / Health Check ─────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "ShoppyGlobe API is running 🛒",
    version: "1.0.0",
    endpoints: {
      auth: ["POST /register", "POST /login"],
      products: ["GET /products", "GET /products/:id"],
      cart: [
        "GET /cart (protected)",
        "POST /cart (protected)",
        "PUT /cart/:productId (protected)",
        "DELETE /cart/:productId (protected)",
      ],
    },
  });
});

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});