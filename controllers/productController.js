import Product from "../models/Product.js";

/**
 * @route   GET /products
 * @desc    Get all products
 * @access  Public
 */
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching products",
      error: error.message,
    });
  }
};

/**
 * @route   GET /products/:id
 * @desc    Get a single product by ID
 * @access  Public
 */
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    // Handle invalid MongoDB ObjectId
    if (error.kind === "ObjectId") {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID format",
      });
    }

    res.status(500).json({
      success: false,
      message: "Error fetching product",
      error: error.message,
    });
  }
};