import express from "express";
import {
  getAllProducts,
  getProductById,
} from "../controllers/productController.js";

const router = express.Router();

// GET /products - Fetch all products
router.get("/", getAllProducts);

// GET /products/:id - Fetch a single product by ID
router.get("/:id", getProductById);

export default router;