export const url = require("../config/config.json");
export const baseUrl = url.productUrl;
export const paginationUrl = `${baseUrl}?ref=pagination&page=1`
/* export const puppeteer = require('puppeteer-extra');
export const anonymizeUaPlugin = require('puppeteer-extra-plugin-anonymize-ua');
export const stealthPlugin = require('puppeteer-extra-plugin-stealth'); */
export const fs = require("fs");
export const path = require('path');