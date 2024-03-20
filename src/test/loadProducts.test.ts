import { baseUrl, limiter } from "../utils/consts";
import launchPuppeteerCluster from "../utils/launchPuppeteerCluster";

const url = baseUrl;

describe("Load products tests", () => {
  let cluster: any;
  let productHandlesFirst10: any;
  let listingUrl: any;
  let checkoutPageButton: any;

  beforeAll(async () => {
    cluster = await launchPuppeteerCluster();
    await cluster.task(async ({ page, data: url }) => {
      await limiter.schedule(async () => {
        await page.goto(url);
      });
      const productHandles = await page.$$(
        "ol.wt-grid.wt-grid--block.wt-pl-xs-0.tab-reorder-container > li"
      );
      productHandlesFirst10 = productHandles.slice(0, 10);
      listingUrl = await page.evaluate(
        (el) =>
          el.querySelector("div.v2-listing-card > a").getAttribute("href"),
        productHandlesFirst10
      );
      checkoutPageButton = await page.$('nav > ul > li:nth-child(3) > span > a');
    });
    await cluster.queue(url);
    await cluster.idle();
  });

  afterAll(async () => {
    await cluster.close();
  });

  test("Extract first 10 products from page test", async () => {
    expect(productHandlesFirst10).toHaveLength(10);
  });

  test("Extract first 10 products failed from page test", async () => {
    expect(productHandlesFirst10).not.toBeNull();
  });

  test("Navigate to product details page", async () => {
    try {
      const isBtnClicked = await listingUrl.click();
      expect(isBtnClicked).toBe(true);
    } catch (error) {
      console.log(error);
    }
  });

  test("Navigate to checkout page", async () => {
    try {
      const isBtnClicked = await checkoutPageButton.click();
      expect(isBtnClicked).toBe(true);
    } catch (error) {
        console.log(error);
    }
  });
});
