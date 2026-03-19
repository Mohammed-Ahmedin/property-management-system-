"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chapaConfig = void 0;
const chapa_nodejs_1 = require("chapa-nodejs");
exports.chapaConfig = new chapa_nodejs_1.Chapa({
    secretKey: process.env.CHAPA_SECRET_KEY,
});
