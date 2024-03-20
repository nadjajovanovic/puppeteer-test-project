import { saveAllProductsToFile } from "../services/saveDataToFile";
import { limiter } from "../utils/consts";

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
      })
      
      let product = [];
      let productImageUrls = [];
  
      //extracting product detail from a page with a selector
      const productDetailHandle = await page.$('div.wt-pt-xs-5.listing-page-content-container-wider.wt-horizontal-center');
      
      try {
        productName = await productDetailHandle.$eval('h1.wt-text-body-01.wt-line-height-tight.wt-break-word.wt-mt-xs-1', el => el.textContent);
      } catch (error) {
        console.log('The product name cannot be found');
        
      }
      try {
        productPrice = await productDetailHandle.$eval('p.wt-text-title-larger.wt-mr-xs-1', el => el.textContent);
      } catch (error) {
        console.log('The product price cannot be found');
      }
      try {
        productDescription = await productDetailHandle.$eval('div.wt-content-toggle__body p', el => el.textContent);
      } catch (error) {
        console.log('The product description cannot be found');
      }
      try {
        imageHandle = await page.$$("ul.wt-list-unstyled.wt-overflow-hidden.wt-position-relative.carousel-pane-list > li");
      } catch (error) {
        console.log("There are no elements that match these selectors");
      }
      
      //extracting array of images src
      for(const image of imageHandle) {
        try {
            imageUrl = await page.evaluate(
                (el) =>
                  el.querySelector("img.wt-max-width-full").getAttribute('src'),
                  image
              ); 
        } catch (error) {
            console.log('The product image urls cannot be found');
        }
        productImageUrls.push(imageUrl);
      }

      product.push({ name: productName, price: productPrice, description: productDescription, imageUrl: productImageUrls});
      //saveAllProductsToFile(product, `product_detail_${productName.trim()}.json`);
      
      //some products require personalization text
      await page.waitForSelector("#listing-page-personalization-textarea");
      await page.type("#listing-page-personalization-textarea", "thank");

      await page.waitForSelector("#listing-page-personalization-textarea");
      await page.type("#listing-page-personalization-textarea", "yes");

      //clicking to button add to cart
      const button = await productDetailHandle.$('button.wt-btn.wt-btn--filled.wt-width-full');
      await button.evaluate( (form: any) => form.click());
  
      await cluster.idle();
        /* await cluster.close();  */
    });
    await cluster.queue(url);
  }