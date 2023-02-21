"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.duplicate = exports.create = exports.update = exports.checkapi = exports.strategy = exports.strategies = void 0;
const kucoin_1 = require("../@api/kucoin");
const helper_1 = require("../@utils/helper");
const encryption_1 = require("../@utils/encryption");
const strategies_1 = __importDefault(require("../model/strategies"));
exports.strategies = (0, helper_1.asyncBlock)(async (req, res, next) => {
    const s = await strategies_1.default.find({ user: req.user._id });
    if (!s)
        return new helper_1.appError("Could not get data", 400);
    res.status(200).json({
        status: "success",
        data: s
    });
});
exports.strategy = (0, helper_1.asyncBlock)(async (req, res, next) => {
    const s = await strategies_1.default.findById(req.params.id);
    if (!s)
        return new helper_1.appError("Could not get data", 400);
    res.status(200).json({
        status: "success",
        data: s
    });
});
exports.checkapi = (0, helper_1.asyncBlock)(async (req, res, next) => {
    const { api_key, secret_key, passphrase } = req.body;
    const live = (0, kucoin_1.kucoin)({
        symbol: "adausdtm",
        api_key: (0, encryption_1.encrypt)(api_key),
        secret_key: (0, encryption_1.encrypt)(secret_key),
        passphrase: (0, encryption_1.encrypt)(passphrase)
    });
    const account = await live.getAccountOverview();
    res.status(200).json({
        status: "success",
        data: account ? true : false
    });
});
exports.update = (0, helper_1.asyncBlock)(async (req, res, next) => {
    const strategies = await strategies_1.default.findByIdAndUpdate(req.body._id, req.body, { new: true });
    if (!strategies)
        return new helper_1.appError("Could not update data", 400);
    res.status(200).json({
        status: "success",
        data: strategies
    });
});
exports.create = (0, helper_1.asyncBlock)(async (req, res, next) => {
    req.body.user = req.user._id;
    req.body.secret_key = (0, encryption_1.encrypt)(req.body.secret_key);
    req.body.api_key = (0, encryption_1.encrypt)(req.body.api_key);
    req.body.passphrase = (0, encryption_1.encrypt)(req.body.passphrase);
    const strategy = await strategies_1.default.create(req.body);
    if (!strategy)
        return new helper_1.appError("Build failed", 401);
    res.status(200).json({
        status: "success",
        data: strategy
    });
});
exports.duplicate = (0, helper_1.asyncBlock)(async (req, res, next) => {
    delete req.body._id;
    const strategy = await strategies_1.default.create(req.body);
    if (!strategy)
        return new helper_1.appError("Could not copy document", 400);
    res.status(200).json({
        status: "success",
        data: strategy
    });
});
exports.remove = (0, helper_1.asyncBlock)(async (req, res, next) => {
    const strategy = await strategies_1.default.findByIdAndDelete(req.params.id);
    if (!strategy)
        return new helper_1.appError("Could not delete data", 400);
    res.status(200).json({
        status: "success",
    });
});
