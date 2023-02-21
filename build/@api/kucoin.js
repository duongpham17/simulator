"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.kucoin = void 0;
const kucoin_futures_node_api_1 = __importDefault(require("kucoin-futures-node-api"));
const encryption_1 = require("../@utils/encryption");
const crypto_1 = __importDefault(require("crypto"));
;
;
const kucoin = ({ api_key, secret_key, passphrase, symbol }) => {
    const apiLive = new kucoin_futures_node_api_1.default();
    apiLive.init({
        apiKey: (0, encryption_1.decrypt)(api_key),
        secretKey: (0, encryption_1.decrypt)(secret_key),
        passphrase: (0, encryption_1.decrypt)(passphrase),
        environment: 'live'
    });
    class Kucoin {
        symbol;
        constructor(symbol) {
            this.symbol = symbol;
        }
        ;
        async getAccountOverview() {
            const account = await apiLive.getAccountOverview();
            return account;
        }
        async getPrice() {
            try {
                const response = await apiLive.getTicker(this.symbol);
                return Number(response.data.price);
            }
            catch (_) {
                return null;
            }
        }
        ;
        async placePosition(position) {
            const useAllUSDTBalanceSize = Math.trunc((position.usdtBalance / position.price * position.leverage) / 10);
            const params = {
                clientOid: crypto_1.default.randomUUID(),
                type: "market",
                symbol: this.symbol.toUpperCase(),
                leverage: position.leverage,
                side: position.side,
                price: position.price,
                size: position.size ? Math.trunc(position.size) : useAllUSDTBalanceSize
            };
            try {
                const r = await apiLive.placeOrder(params);
                return r.data.orderId;
            }
            catch (err) {
                return null;
            }
            ;
        }
        ;
        async closePosition(clientOid) {
            const params = {
                clientOid,
                closeOrder: true,
                symbol: this.symbol.toUpperCase(),
                type: "market"
            };
            try {
                const r = await apiLive.placeOrder(params);
                return r.data.orderId;
            }
            catch (_) {
                return null;
            }
        }
        ;
        async getPosition() {
            try {
                const r = await apiLive.getPosition({ symbol: this.symbol });
                return r;
            }
            catch (_) {
                return null;
            }
            ;
        }
        ;
    }
    return new Kucoin(symbol);
};
exports.kucoin = kucoin;
