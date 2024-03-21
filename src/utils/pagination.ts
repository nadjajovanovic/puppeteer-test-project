import { ElementHandle, Page } from "puppeteer";
import { limiter } from "./limiter";

export async function pagination(
  cluster: any,
  url: any,
  productHandle: ElementHandle<HTMLLIElement>[]
) {
  //Navigate to product detail page
  await cluster.task(async ({ page }) => {
    await limiter.schedule(async () => {
      await page.goto(url);
    })

    productHandle;

    let lastPageReached = false;

    while (!lastPageReached) {
      const nextPageLink = await page.$(
        "div.wt-show-lg.appears-ready > nav > ul > li:nth-child(11) > a"
      );

      if (!nextPageLink) {
        lastPageReached = true;
      } else {
        await nextPageLink.evaluate((form: any) => form.click());

        await page.waitForNavigation();

        productHandle;
      }
    }
    await cluster.idle();
    await cluster.close(); 
  });
  await cluster.queue(url);
}
