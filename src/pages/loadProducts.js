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
exports.loadProducts = void 0;
const saveDataToFile_1 = require("../services/saveDataToFile");
const puppeteer_cluster_1 = require("puppeteer-cluster");
const loadCartPage_1 = require("./loadCartPage");
const consts_1 = require("../utils/consts");
function loadProducts() {
    return __awaiter(this, void 0, void 0, function* () {
        const cluster = yield puppeteer_cluster_1.Cluster.launch({
            concurrency: puppeteer_cluster_1.Cluster.CONCURRENCY_PAGE,
            maxConcurrency: 100,
            monitor: true,
            puppeteerOptions: {
                headless: false,
                defaultViewport: null,
                userDataDir: "./tmp",
            },
        });
        yield cluster.task((_a) => __awaiter(this, [_a], void 0, function* ({ page, data: url }) {
            yield page.goto(url);
            let productHandles;
            let productName;
            let productPrice;
            let listingUrl;
            let products = [];
            try {
                productHandles = yield page.$$("ol.wt-grid.wt-grid--block.wt-pl-xs-0.tab-reorder-container > li");
            }
            catch (error) {
                console.log("There are no elements that match these selectors");
            }
            const productHandlesFirst10 = productHandles.slice(0, 10);
            for (const productHandle of productHandlesFirst10) {
                try {
                    productName = yield page.evaluate((el) => el.querySelector("h2").textContent, productHandle);
                }
                catch (error) {
                    console.log("The product name cannot be found");
                }
                try {
                    productPrice = yield page.evaluate((el) => el.querySelector("p.wt-text-title-01.lc-price > span:nth-child(2)")
                        .textContent, productHandle);
                }
                catch (error) {
                    console.log("The product price cannot be found");
                }
                try {
                    listingUrl = yield page.evaluate((el) => el.querySelector("div.v2-listing-card > a").getAttribute("href"), productHandle);
                }
                catch (error) {
                    console.log(error);
                }
                products.push({ name: productName, price: productPrice, url: listingUrl });
            }
            (0, saveDataToFile_1.saveAllProductsToFile)(products, 'products.json');
            const checkoutPageButton = yield page.$('nav > ul > li:nth-child(3) > span > a');
            const checkoutUrl = yield checkoutPageButton.evaluate((form) => form.getAttribute('href'));
            (0, loadCartPage_1.goToCartPage)(cluster, checkoutUrl);
        }));
        yield cluster.queue(consts_1.baseUrl);
        yield cluster.idle();
    });
}
exports.loadProducts = loadProducts;
