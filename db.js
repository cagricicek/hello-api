const mongoose = require("mongoose");
require("dotenv").config();

async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("❌ HATA: MONGO_URI ortam değişkeni tanımlı değil!");
    return;
  }

  try {
    await mongoose.connect(uri);
    console.log("✅ MongoDB bağlantısı başarılı");
  } catch (err) {
    console.error("❌ MongoDB bağlantı hatası:", err.message);
  }
}

module.exports = connectDB;
