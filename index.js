// index.js
const express = require("express");
const connectDB = require("./db");
const scrapeProducts = require("./scraper");
const Product = require("./models/Product");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB bağlantısı
connectDB();

// Ana endpoint
app.get("/products", async (req, res) => {
  try {
    await scrapeProducts(10); // İlk 10 sayfayı tara
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

// Basit test endpointi
app.get("/", (req, res) => {
  res.send("🚀 Mandarake Scraper API Çalışıyor!");
});

// Sunucu başlat
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
