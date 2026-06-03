import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

/**
 * @route   GET /cart
 * @desc    Get current user's cart
 * @access  Private
 */
const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product",
      "name price description stockQuantity imageUrl"
    );

    if (!cart) {
      return res.status(200).json({
        success: true,
        message: "Cart is empty",
        data: { items: [], total: 0 },
      });
    }

    // Calculate total price
    const total = cart.items.reduce((sum, item) => {
      return sum + item.product.price * item.quantity;
    }, 0);

    res.status(200).json({
      success: true,
      data: { ...cart.toObject(), total: total.toFixed(2) },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching cart",
      error: error.message,
    });
  }
};

/**
 * @route   POST /cart
 * @desc    Add a product to the cart
 * @access  Private
 */
const addToCart = async (req, res) => {
  const { productId, quantity = 1 } = req.body;

  // Validate required fields
  if (!productId) {
    return res.status(400).json({
      success: false,
      message: "Product ID is required",
    });
  }

  if (quantity < 1) {
    return res.status(400).json({
      success: false,
      message: "Quantity must be at least 1",
    });
  }

  try {
    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check if enough stock is available
    if (product.stockQuantity < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stockQuantity} units available in stock`,
      });
    }

    // Find existing cart or create new one
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      // Create a new cart for the user
      cart = await Cart.create({
        user: req.user._id,
        items: [{ product: productId, quantity }],
      });
    } else {
      // Check if product already in cart
      const itemIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId
      );

      if (itemIndex > -1) {
        // Update quantity if product already in cart
        const newQty = cart.items[itemIndex].quantity + quantity;
        if (newQty > product.stockQuantity) {
          return res.status(400).json({
            success: false,
            message: `Cannot add more. Only ${product.stockQuantity} units available`,
          });
        }
        cart.items[itemIndex].quantity = newQty;
      } else {
        // Add new item to cart
        cart.items.push({ product: productId, quantity });
      }

      await cart.save();
    }

    // Populate product details before sending response
    await cart.populate("items.product", "name price description stockQuantity");

    res.status(200).json({
      success: true,
      message: "Product added to cart",
      data: cart,
    });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID format",
      });
    }
    res.status(500).json({
      success: false,
      message: "Error adding to cart",
      error: error.message,
    });
  }
};

/**
 * @route   PUT /cart/:productId
 * @desc    Update the quantity of a product in the cart
 * @access  Private
 */
const updateCartItem = async (req, res) => {
  const { quantity } = req.body;
  const { productId } = req.params;

  // Validate quantity
  if (!quantity || quantity < 1) {
    return res.status(400).json({
      success: false,
      message: "Valid quantity (minimum 1) is required",
    });
  }

  try {
    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check stock availability
    if (quantity > product.stockQuantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stockQuantity} units available in stock`,
      });
    }

    // Find user's cart
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    // Find the item in cart
    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart",
      });
    }

    // Update quantity
    cart.items[itemIndex].quantity = quantity;
    await cart.save();
    await cart.populate("items.product", "name price description stockQuantity");

    res.status(200).json({
      success: true,
      message: "Cart updated successfully",
      data: cart,
    });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID format",
      });
    }
    res.status(500).json({
      success: false,
      message: "Error updating cart",
      error: error.message,
    });
  }
};

/**
 * @route   DELETE /cart/:productId
 * @desc    Remove a product from the cart
 * @access  Private
 */
const removeFromCart = async (req, res) => {
  const { productId } = req.params;

  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    // Check if item exists in cart
    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart",
      });
    }

    // Remove the item
    cart.items.splice(itemIndex, 1);
    await cart.save();

    res.status(200).json({
      success: true,
      message: "Product removed from cart",
      data: cart,
    });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID format",
      });
    }
    res.status(500).json({
      success: false,
      message: "Error removing from cart",
      error: error.message,
    });
  }
};

export {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
};