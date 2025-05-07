const express = require("express");
const connectDB = require("./db");
const scrapeProducts = require("./scraper");
const Product = require("./models/Product");
const cron = require("node-cron");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB bağlantısını başlat
connectDB();

// Ürünleri manuel tetikleme
app.get("/products", async (req, res) => {
  try {
    await scrapeProducts(10); // İlk 10 sayfa
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

// Basit test endpoint'i
app.get("/", (req, res) => {
  res.send("🚀 Mandarake Scraper API Çalışıyor!");
});

// Otomatik cron işi (her 15 dakikada bir)
cron.schedule("*/15 * * * *", async () => {
  console.log("⏰ Otomatik tarama başlatılıyor...");
  await scrapeProducts(10);
});

// Sunucuyu başlat
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
