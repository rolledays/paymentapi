"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPayment = exports.createPayment = void 0;
const axios_1 = __importDefault(require("axios"));
const crypto_js_1 = __importDefault(require("crypto-js"));
const moment_1 = __importDefault(require("moment"));
// Example
const api = {
    key: "SANDBOX0C29F717-EB82-4256-BE40-D79179841D8A-XXXXXX",
    va: "XXXX",
    returnUrl: "https://realmsconnection.com",
    cancelUrl: "https://realmsconnection.com",
    notifyUrl: "https://realmsconnection.com/notify"
};
async function createPayment(productName, quantity, method, userinfo, channel) {
    const url = "https://sandbox.ipaymu.com/api/v2/payment";
    const body = {
        buyerName: userinfo.name + "#" + userinfo.discrim.toString().padStart(4, "0"),
        buyerEmail: userinfo?.email,
        buyerPhone: userinfo.id.replace("@c.us", ""),
        returnUrl: api.returnUrl,
        cancelUrl: api.cancelUrl,
        notifyUrl: api.notifyUrl,
        product: [productName + " - YourProductName"],
        expired: 1,
        paymentMethod: method,
        qty: [quantity],
        paymentChannel: channel,
        price: [function () {
                switch (productName) {
                    case "Your product":
                        return 7500; //Price
                    case "Your product":
                        return 14500; //Price
                    case "Your product":
                        return 22500; //Price
                }
            }()]
    };
    var bodyEncrypt = crypto_js_1.default.SHA256(JSON.stringify(body));
    var stringtosign = "POST:" + api.va + ":" + bodyEncrypt + ":" + api.key;
    var signature = crypto_js_1.default.enc.Hex.stringify(crypto_js_1.default.HmacSHA256(stringtosign, api.key));
    const headers = {
        Accept: 'application/json', 'Content-Type': 'application/json',
        va: api.va,
        signature: signature,
        timestamp: (0, moment_1.default)().format("YYYYMMDDhhmmss")
    };
    return (await axios_1.default.post(url, body, {
        headers: headers
    })).data;
}
exports.createPayment = createPayment;
async function checkPayment(id) {
    const url = "https://sandbox.ipaymu.com/api/v2/transaction";
    const body = {
        transactionId: id
    };
    var bodyEncrypt = crypto_js_1.default.SHA256(JSON.stringify(body));
    var stringtosign = "POST:" + api.va + ":" + bodyEncrypt + ":" + api.key;
    var signature = crypto_js_1.default.enc.Hex.stringify(crypto_js_1.default.HmacSHA256(stringtosign, api.key));
    const headers = {
        Accept: 'application/json', 'Content-Type': 'application/json',
        va: api.va,
        signature: signature,
        timestamp: (0, moment_1.default)().format("YYYYMMDDhhmmss")
    };
    return (await axios_1.default.post(url, body, {
        headers: headers
    })).data;
    /**
     * Status
     * 0 Pending
     * 1 Success
     * 2 Failed
     */
}
exports.checkPayment = checkPayment;
