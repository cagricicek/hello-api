// index.js
const express = require("express");
const connectDB = require("./db");
const scrapeProducts = require("./scraper");
const Product = require("./models/Product");
require("dotenv").config();

const app = express();
const PORT = 3000;

connectDB();

app.get("/products", async (req, res) => {
  try {
    await scrapeProducts(10);
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    console.error("❌ Scraping error:", error);
    res.status(500).json({
      error: "Scraping failed",
      details: error.message,
    });
  }
});

app.get("/hello", (req, res) => {
  res.send("Hello World");
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
