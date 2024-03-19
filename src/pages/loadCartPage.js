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
exports.goToCartPage = void 0;
function goToCartPage(cluster, url) {
    return __awaiter(this, void 0, void 0, function* () {
        yield cluster.task((_a) => __awaiter(this, [_a], void 0, function* ({ page }) {
            yield page.goto(url);
            const proceedToCheckout = yield page.$("button.proceed-to-checkout");
            yield proceedToCheckout.evaluate((button) => button.click());
            yield page.waitForSelector("#join-neu-overlay");
            const continueToShipping = yield page.$("div.wt-validation button.wt-btn--secondary");
            yield continueToShipping.evaluate((button) => button.click());
            yield goToShipingForm(page);
            yield cluster.idle();
        }));
        yield cluster.queue(url);
    });
}
exports.goToCartPage = goToCartPage;
function goToShipingForm(page) {
    return __awaiter(this, void 0, void 0, function* () {
        yield page.waitForSelector("#shipping-form-email-input");
        yield page.type("#shipping-form-email-input", "test@gmail.com");
        yield page.waitForSelector("#shipping-form-email-confirmation");
        yield page.type("#shipping-form-email-confirmation", "test@gmail.com");
        yield page.waitForSelector("#name11-input");
        yield page.type("#name11-input", "Nadja Jovanovic");
        yield page.waitForSelector("#first_line12-input");
        yield page.type("#first_line12-input", "Test");
        yield page.waitForSelector("#second_line13-input");
        yield page.type("#second_line13-input", "25");
        yield page.waitForSelector("#zip14-input");
        yield page.type("#zip14-input", "21000");
        yield page.waitForSelector("#city15-input");
        yield page.type("#city15-input", "Novi Sad");
        yield page.waitForSelector("#phone16-input");
        yield page.type("#phone16-input", "123456");
        const continueToPayment = yield page.$("#shipping-address-form > div:nth-child(2) > button");
        yield continueToPayment.evaluate((button) => button.click());
        yield page.waitForSelector("#gpay_panonly-radio--paymentstep");
        const gpay = yield page.$("#gpay_panonly-radio--paymentstep");
        yield gpay.evaluate((button) => button.click());
    });
}
