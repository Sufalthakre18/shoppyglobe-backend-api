/**
 * Seed Script - Populates MongoDB with sample products
 * Run with: node seed.js
 */

import dotenv from "dotenv";
import Product from "./models/Product.js";
import connectDB from "./config/db.js";

dotenv.config();

const sampleProducts = [
  {
    name: "iPhone 15 Pro",
    price: 999.99,
    description:
      "Apple iPhone 15 Pro with A17 Pro chip, 48MP camera system, and titanium design.",
    stockQuantity: 50,
    category: "Electronics",
    imageUrl: "https://example.com/iphone15pro.jpg",
  },
  {
    name: "Samsung Galaxy S24",
    price: 849.99,
    description:
      "Samsung Galaxy S24 with Snapdragon 8 Gen 3, 50MP camera, and 6.2-inch Dynamic AMOLED display.",
    stockQuantity: 40,
    category: "Electronics",
    imageUrl: "https://example.com/galaxys24.jpg",
  },
  {
    name: "Sony WH-1000XM5 Headphones",
    price: 349.99,
    description:
      "Industry-leading noise canceling wireless headphones with 30-hour battery life.",
    stockQuantity: 75,
    category: "Electronics",
    imageUrl: "https://example.com/sony-headphones.jpg",
  },
  {
    name: "Nike Air Max 270",
    price: 150.0,
    description:
      "Nike Air Max 270 running shoes with Max Air unit for all-day comfort.",
    stockQuantity: 100,
    category: "Footwear",
    imageUrl: "https://example.com/nike-airmax.jpg",
  },
  {
    name: "MacBook Air M3",
    price: 1299.99,
    description:
      "Apple MacBook Air with M3 chip, 13.6-inch Liquid Retina display, and 18-hour battery life.",
    stockQuantity: 30,
    category: "Computers",
    imageUrl: "https://example.com/macbook-air-m3.jpg",
  },
  {
    name: "Levi's 501 Original Jeans",
    price: 69.99,
    description:
      "Classic straight fit jeans with original button fly. The original blue jean since 1873.",
    stockQuantity: 200,
    category: "Clothing",
    imageUrl: "https://example.com/levis-501.jpg",
  },
  {
    name: "Instant Pot Duo 7-in-1",
    price: 89.99,
    description:
      "7-in-1 multi-use programmable pressure cooker, slow cooker, rice cooker, steamer, and more.",
    stockQuantity: 60,
    category: "Kitchen",
    imageUrl: "https://example.com/instant-pot.jpg",
  },
  {
    name: "The Alchemist - Paulo Coelho",
    price: 14.99,
    description:
      "A philosophical novel about a young Andalusian shepherd's journey to find a worldly treasure.",
    stockQuantity: 150,
    category: "Books",
    imageUrl: "https://example.com/alchemist.jpg",
  },
];

const seedDB = async () => {
  try {
    await connectDB();

    // Clear existing products
    await Product.deleteMany({});
    console.log("🗑️ Cleared existing products");

    // Insert sample products
    const products = await Product.insertMany(sampleProducts);
    console.log(`✅ Inserted ${products.length} sample products`);

    console.log("\n📦 Sample Product IDs (use these for testing):");
    products.forEach((product) => {
      console.log(`  ${product.name}: ${product._id}`);
    });

    process.exit(0);
  } catch (error) {
    console.error("❌ Seed error:", error.message);
    process.exit(1);
  }
};

seedDB();