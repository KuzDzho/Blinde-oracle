import { chromium } from "playwright";

const base = process.argv[2] ?? "http://127.0.0.1:8080";
const dir = "/workspace/screenshots";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
page.setDefaultTimeout(8000);

await page.goto(base, { waitUntil: "networkidle" });
await page.getByRole("link", { name: /Козерог/ }).scrollIntoViewIfNeeded();
await page.screenshot({ path: `${dir}/home-scrolled.png` });

await page.getByRole("link", { name: /Скорпион/ }).click();
await page.getByRole("heading", { level: 1 }).waitFor();
await page.screenshot({ path: `${dir}/forecast-scorpio.png`, fullPage: true });

const title = await page.locator("h1").first().innerText();
await page.getByRole("button", { name: /Добавить в избранное/ }).click();
await page.getByRole("button", { name: /В избранном/ }).waitFor();

await page.getByRole("link", { name: "Избранное" }).click();
await page.getByRole("heading", { name: "ИЗБРАННОЕ" }).waitFor();
await page.screenshot({ path: `${dir}/favorites.png` });

await page.getByRole("link", { name: "Настройки" }).click();
await page.getByRole("heading", { name: "НАСТРОЙКИ" }).waitFor();
await page.screenshot({ path: `${dir}/settings.png` });

await page.getByRole("switch", { name: "Тёмная тема" }).click();
await page.waitForTimeout(400);
await page.screenshot({ path: `${dir}/settings-light.png` });

await browser.close();
console.log(JSON.stringify({ forecastTitle: title, ok: true }, null, 2));
