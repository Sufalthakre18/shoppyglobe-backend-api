import express from "express";
import { protect } from "../middleware/auth.js";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
} from "../controllers/cartController.js";

const router = express.Router();

// All cart routes are protected — require valid JWT
router.use(protect);

// GET /cart - Get current user's cart
router.get("/", getCart);

// POST /cart - Add a product to the cart
router.post("/", addToCart);

// PUT /cart/:productId - Update quantity of a product in the cart
router.put("/:productId", updateCartItem);

// DELETE /cart/:productId - Remove a product from the cart
router.delete("/:productId", removeFromCart);

export default router;