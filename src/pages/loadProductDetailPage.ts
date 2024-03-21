import { saveDataToFile } from "../services/saveDataToFile";
import { limiter } from "../utils/limiter";

let productName: string;
let productPrice: string;
let productDescription: string;
let imageHandle: string;
let imageUrl: string;

export async function goToProductDetailsPage(cluster: any, url: any) {
  //Navigate to product detail page
  await cluster.task(async ({ page }) => {
    await limiter.schedule(async () => {
      await page.goto(url);
    });

    let product = [];
    let productImageUrls = [];

    //extracting product detail from a page with a selector
    const productDetailHandle = await page.$(
      "div.wt-pt-xs-5.listing-page-content-container-wider.wt-horizontal-center"
    );

    //getting product name, price, description, images from page
    productName = await productDetailHandle.$eval(
      "h1.wt-text-body-01.wt-line-height-tight.wt-break-word.wt-mt-xs-1",
      (el: any) => el.textContent
    );
    productPrice = await productDetailHandle.$eval(
      "p.wt-text-title-larger.wt-mr-xs-1",
      (el: any) => el.textContent
    );
    productDescription = await productDetailHandle.$eval(
      "div.wt-content-toggle__body p",
      (el: any) => el.textContent
    );
    imageHandle = await page.$$(
      "ul.wt-list-unstyled.wt-overflow-hidden.wt-position-relative.carousel-pane-list > li"
    );

    for (const image of imageHandle) {
      imageUrl = await page.evaluate(
        (el: any) => el.querySelector("img.wt-max-width-full").getAttribute("src"),
        image
      );
      productImageUrls.push(imageUrl);
    }

    product.push({
      name: productName,
      price: productPrice,
      description: productDescription,
      imageUrl: productImageUrls,
    });
    saveDataToFile(product, `product_detail_${productName.trim()}.json`);

    //some products require personalization text
    await page.waitForSelector("#listing-page-personalization-textarea");
    await page.type("#listing-page-personalization-textarea", "thank");

    await page.waitForSelector("#listing-page-personalization-textarea");
    await page.type("#listing-page-personalization-textarea", "yes");

    //clicking to button add to cart
    const button = await productDetailHandle.$(
      "button.wt-btn.wt-btn--filled.wt-width-full"
    );
    await button
      .evaluate((form: any) => form.click())
      .then(() => console.log("clicked"))
      .catch((err) => console.log(err));

    await cluster.idle();
    await cluster.close();
  });
  await cluster.queue(url);
}
