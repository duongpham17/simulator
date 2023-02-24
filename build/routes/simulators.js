"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authentication_1 = require("../controller/authentication");
const simulators_1 = require("../controller/simulators");
const router = express_1.default.Router();
router.use(authentication_1.protect);
router.get('/', simulators_1.simulators);
router.get('/:id', simulators_1.simulator);
router.post('/simulate', simulators_1.simulate);
router.delete('/:id', simulators_1.remove);
router.get('/resync/:id', simulators_1.resync);
exports.default = router;
