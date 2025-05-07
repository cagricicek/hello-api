const puppeteer = require("puppeteer");
const Product = require("./models/Product");
const sendTelegramNotification = require("./utils/notify");

const BASE_URL = "https://order.mandarake.co.jp/order/listPage/list?page=";

async function scrapeProducts(maxPages = 10) {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
    const url = `${BASE_URL}${pageNum}&soldOut=1&keyword=beyblade&lang=en`;
    console.log(`🔍 Fetching page ${pageNum}: ${url}`);

    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });

    const hasNoResults = await page.evaluate(() => {
      return document.body.innerText.includes("Goods could not be found.");
    });

    if (hasNoResults) {
      console.log("⛔ No more results. Stopping.");
      break;
    }

    const products = await page.evaluate(() => {
      const items = [];
      const blocks = document.querySelectorAll(".block[data-itemidx]");

      blocks.forEach((block) => {
        const title = block.querySelector(".title a")?.innerText.trim() || "";
        const price = block.querySelector(".price")?.innerText.trim() || "";
        const image = block.querySelector("img")?.src || "";
        const link = block.querySelector(".title a")?.href || "";
        const html = block.outerHTML;
        items.push({ title, price, image, link, html });
      });

      return items;
    });

    console.log(`✅ ${products.length} products found on page ${pageNum}`);

    for (const product of products) {
      const result = await Product.updateOne(
        { link: product.link },
        { $setOnInsert: product },
        { upsert: true }
      );

      if (result.upsertedCount > 0) {
        await sendTelegramNotification(product);
      }
    }
  }

  await browser.close();
}

module.exports = scrapeProducts;
