// db.js
const mongoose = require("mongoose");
require("dotenv").config();

async function connectDB() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/mandarake");
    console.log("✅ MongoDB bağlantısı başarılı");
  } catch (err) {
    console.error("❌ MongoDB bağlantı hatası:", err.message);
  }
}

module.exports = connectDB;
