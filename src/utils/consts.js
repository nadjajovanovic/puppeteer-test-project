"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.path = exports.fs = exports.paginationUrl = exports.baseUrl = exports.url = void 0;
exports.url = require("../config/config.json");
exports.baseUrl = exports.url.productUrl;
exports.paginationUrl = `${exports.baseUrl}?ref=pagination&page=1`;
exports.fs = require("fs");
exports.path = require('path');
