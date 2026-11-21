// Renders a poster page to PNG at 2x, then to WebP.
// Usage: node render.mjs <html file> <out.webp>
import { createRequire } from "module";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
const require = createRequire("C:/Users/akids/Documents/my-site/package.json");
const { chromium } = require("playwright");
const sharp = require("sharp");

const [html, out] = process.argv.slice(2);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 2 });
await page.goto(pathToFileURL(path.resolve(html)).href, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
const png = await page.screenshot({ type: "png" });
await browser.close();
await sharp(png).webp({ quality: 88 }).toFile(out);
// A small preview beside this script (never into public/, which ships with the site)
await sharp(png).resize(1200).png().toFile(path.join(path.dirname(fileURLToPath(import.meta.url)), "preview.png"));
console.log("wrote", out);
