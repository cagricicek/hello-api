// utils/notify.js
const axios = require("axios");
require("dotenv").config();

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

async function sendTelegramNotification(product) {
  const message = `🆕 Yeni Ürün Eklendi:

📦 *${product.title}*
💰 ${product.price}
🔗 [Ürün Linki](${product.link})`;

  try {
    await axios.post(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: "Markdown",
      }
    );
    console.log("📤 Telegram bildirimi gönderildi.");
  } catch (error) {
    console.error("❌ Telegram bildirimi hatası:", error.message);
  }
}

module.exports = sendTelegramNotification;
