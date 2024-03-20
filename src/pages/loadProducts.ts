import { ElementHandle } from "puppeteer";
import { goToProductDetailsPage } from "./loadProductDetailPage";
import { goToCartPage } from "./loadCartPage";
import {
  anonymizeUaPlugin,
  baseUrl,
  limiter,
  puppeteer,
  stealthPlugin,
} from "../utils/consts";
import { pagination } from "../utils/pagination";
import launchPuppeteerCluster from "../utils/launchPuppeteerCluster";
import { saveDataToFile } from "../services/saveDataToFile";

//optimizing
puppeteer.use(stealthPlugin());
puppeteer.use(anonymizeUaPlugin());

//const
let productHandles: ElementHandle<HTMLLIElement>[];
let productName: string;
let productPrice: string;
let listingUrl: string;
let products = [];

export async function loadProducts() {
  const cluster = await launchPuppeteerCluster();

  await cluster.task(async ({ page, data: url }) => {
    await limiter.schedule(async () => {
      await page.goto(url);
    });

    //extracting products from a page with a selector
    try {
      productHandles = await page.$$(
        "ol.wt-grid.wt-grid--block.wt-pl-xs-0.tab-reorder-container > li"
      );
    } catch (error) {
      console.log("There are no elements that match these selectors");
    }

    //extractin first 10 products from a page
    const productHandlesFirst10 = productHandles.slice(0, 10);

    //looping through first 10 products from a page
    for (const productHandle of productHandlesFirst10) {
      //extract products name, price and url from page
      productName = await page.evaluate(
        (el: any) => el.querySelector("h2").textContent,
        productHandle
      );

      productPrice = await page.evaluate(
        (el: any) =>
          el.querySelector("p.wt-text-title-01.lc-price > span:nth-child(2)")
            .textContent,
        productHandle
      );

      listingUrl = await page.evaluate(
        (el: any) =>
          el.querySelector("div.v2-listing-card > a").getAttribute("href"),
        productHandle
      );
      goToProductDetailsPage(cluster, listingUrl);

      products.push({
        name: productName.trim(),
        price: productPrice.trim(),
        url: listingUrl,
      });
    }

    //saving extracted data to file
    saveDataToFile(products, "products.json");

    //paginate
    pagination(cluster, baseUrl, productHandles);

    const checkoutPageButton = await page.$(
      "nav > ul > li:nth-child(3) > span > a"
    );
    const checkoutUrl = await checkoutPageButton.evaluate((form: any) =>
      form.getAttribute("href")
    );
    //navigate to cart page
    goToCartPage(cluster, checkoutUrl);
  });

  await cluster.queue(baseUrl);
  await cluster.idle();
  await cluster.close();
}
