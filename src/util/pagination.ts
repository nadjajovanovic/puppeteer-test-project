import { ElementHandle } from "puppeteer";

export async function pagination(
  cluster: any,
  url: any,
  productHandle: ElementHandle<HTMLLIElement>[]
) {
  //Navigate to product detail page
  await cluster.task(async ({ page }) => {
    await page.goto(url);

    await productHandle;

    let lastPageReached = false;

    while (!lastPageReached) {
      const nextPageLink = await page.$(
        "div.wt-show-lg.appears-ready > nav > ul > li:nth-child(11) > a"
      );

      if (!nextPageLink) {
        console.log("No more pages. Exiting.");
        lastPageReached = true;
      } else {
        await nextPageLink.evaluate((form: any) => form.click());

        await page.waitForNavigation();

        const URL = page.url();
        console.log(URL);

        await productHandle;
      }
    }
    await cluster.idle();
    /* await cluster.close();  */
  });
  await cluster.queue(url);
}
