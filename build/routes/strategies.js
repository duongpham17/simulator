"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authentication_1 = require("../controller/authentication");
const strategies_1 = require("../controller/strategies");
const router = express_1.default.Router();
router.use(authentication_1.protect);
router.get('/', strategies_1.strategies);
router.get('/:id', strategies_1.strategy);
router.post('/', strategies_1.create);
router.patch('/', strategies_1.update);
router.post('/duplicate', strategies_1.duplicate);
router.delete('/:id', strategies_1.remove);
router.post('/check', strategies_1.checkapi);
exports.default = router;
