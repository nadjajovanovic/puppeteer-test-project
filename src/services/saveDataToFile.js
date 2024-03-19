"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveAllProductsToFile = void 0;
const consts_1 = require("../utils/consts");
function saveAllProductsToFile(data, fileName) {
    try {
        consts_1.fs.writeFile(consts_1.path.join(__dirname, '..', 'data', fileName), JSON.stringify(data, null, 2), function (err) {
            if (err)
                throw err;
        });
    }
    catch (error) {
        console.log('You cannot write to file');
    }
}
exports.saveAllProductsToFile = saveAllProductsToFile;
