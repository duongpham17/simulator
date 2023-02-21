"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authentication_1 = require("../controller/authentication");
const trades_1 = require("../controller/trades");
const router = express_1.default.Router();
router.use(authentication_1.protect);
router.get('/load/:id', trades_1.load);
router.get('/:id', trades_1.trades);
router.post('/price', trades_1.price);
router.post('/trade', trades_1.trade);
router.post('/close', trades_1.close);
exports.default = router;
