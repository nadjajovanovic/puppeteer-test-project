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
exports.pagination = void 0;
function pagination(cluster, url, productHandle) {
    return __awaiter(this, void 0, void 0, function* () {
        yield cluster.task((_a) => __awaiter(this, [_a], void 0, function* ({ page }) {
            yield page.goto(url);
            yield productHandle;
            let lastPageReached = false;
            while (!lastPageReached) {
                const nextPageLink = yield page.$("div.wt-show-lg.appears-ready > nav > ul > li:nth-child(11) > a");
                if (!nextPageLink) {
                    console.log("No more pages. Exiting.");
                    lastPageReached = true;
                }
                else {
                    yield nextPageLink.evaluate((form) => form.click());
                    yield page.waitForNavigation();
                    const URL = page.url();
                    console.log(URL);
                    yield productHandle;
                }
            }
            yield cluster.idle();
        }));
        yield cluster.queue(url);
    });
}
exports.pagination = pagination;
