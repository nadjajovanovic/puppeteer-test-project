import { ElementHandle } from "puppeteer";
import { saveAllProductsToFile } from "../services/saveDataToFile";
import { goToProductDetailsPage } from "./loadProductDetailPage";
import { goToCartPage } from "./loadCartPage";
import { anonymizeUaPlugin, baseUrl, limiter, paginationUrl, puppeteer, stealthPlugin } from "../utils/consts";
import { pagination } from "../utils/pagination";
import launchPuppeteerCluster from "../utils/launchPuppeteerCluster";

puppeteer.use(stealthPlugin());
puppeteer.use(anonymizeUaPlugin());

export async function loadProducts() {
  const cluster = await launchPuppeteerCluster();

  await cluster.task(async ({ page, data: url }) => {
    await limiter.schedule(async () => {
      await page.goto(url);
    })

    let productHandles: ElementHandle<HTMLLIElement>[];
    let productName: string;
    let productPrice: string;
    let listingUrl: string;
    let products = [];

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
      
      try {
        productName = await page.evaluate(
          (el) => el.querySelector("h2").textContent,
          productHandle
        );
      } catch (error) {
        console.log("The product name cannot be found");
      }

      try {
        productPrice = await page.evaluate(
          (el) =>
            el.querySelector("p.wt-text-title-01.lc-price > span:nth-child(2)")
              .textContent,
          productHandle
        );
      } catch (error) {
        console.log("The product price cannot be found");
      }

      try {
        listingUrl = await page.evaluate(
          (el) =>
            el.querySelector("div.v2-listing-card > a").getAttribute("href"),
          productHandle
        );
        goToProductDetailsPage(cluster, listingUrl);
      } catch (error) {
        console.log(error);
      }

      products.push({ name: productName, price: productPrice, url: listingUrl });
    }

    //saving extracted data to file
    saveAllProductsToFile(products, 'products.json');

    const checkoutPageButton = await page.$('nav > ul > li:nth-child(3) > span > a');
    const checkoutUrl = await checkoutPageButton.evaluate( (form: any) => form.getAttribute('href'));
    goToCartPage(cluster, checkoutUrl);
    
    pagination(cluster, paginationUrl, productHandles);
  });
  

  await cluster.queue(baseUrl);
  await cluster.idle();
  /* await cluster.close(); */
}
  


