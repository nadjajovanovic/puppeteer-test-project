"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.goToProductDetailsPage = void 0;
let productName;
let productPrice;
let productDescription;
let imageHandle;
let imageUrl;
function goToProductDetailsPage(cluster, url) {
    return __awaiter(this, void 0, void 0, function* () {
        yield cluster.task((_a) => __awaiter(this, [_a], void 0, function* ({ page }) {
            yield page.goto(url);
            let product = [];
            let productImageUrls = [];
            const productDetailHandle = yield page.$('div.wt-pt-xs-5.listing-page-content-container-wider.wt-horizontal-center');
            try {
                productName = yield productDetailHandle.$eval('h1.wt-text-body-01.wt-line-height-tight.wt-break-word.wt-mt-xs-1', el => el.textContent);
            }
            catch (error) {
                console.log('The product name cannot be found');
            }
            try {
                productPrice = yield productDetailHandle.$eval('p.wt-text-title-larger.wt-mr-xs-1', el => el.textContent);
            }
            catch (error) {
                console.log('The product price cannot be found');
            }
            try {
                productDescription = yield productDetailHandle.$eval('div.wt-content-toggle__body p', el => el.textContent);
            }
            catch (error) {
                console.log('The product description cannot be found');
            }
            try {
                imageHandle = yield page.$$("ul.wt-list-unstyled.wt-overflow-hidden.wt-position-relative.carousel-pane-list > li");
            }
            catch (error) {
                console.log("There are no elements that match these selectors");
            }
            for (const image of imageHandle) {
                try {
                    imageUrl = yield page.evaluate((el) => el.querySelector("img.wt-max-width-full").getAttribute('src'), image);
                }
                catch (error) {
                    console.log('The product image urls cannot be found');
                }
                productImageUrls.push(imageUrl);
            }
            product.push({ name: productName, price: productPrice, description: productDescription, imageUrl: productImageUrls });
            yield page.waitForSelector("#listing-page-personalization-textarea");
            yield page.type("#listing-page-personalization-textarea", "thank");
            yield page.waitForSelector("#listing-page-personalization-textarea");
            yield page.type("#listing-page-personalization-textarea", "yes");
            const button = yield productDetailHandle.$('button.wt-btn.wt-btn--filled.wt-width-full');
            yield button.evaluate((form) => form.click());
            yield cluster.idle();
        }));
        yield cluster.queue(url);
    });
}
exports.goToProductDetailsPage = goToProductDetailsPage;
