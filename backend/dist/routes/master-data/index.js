"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const stateRoutes_1 = __importDefault(require("./stateRoutes"));
const cityRoutes_1 = __importDefault(require("./cityRoutes"));
const centerRoutes_1 = __importDefault(require("./centerRoutes"));
const otherRoutes_1 = __importDefault(require("./otherRoutes"));
const router = (0, express_1.Router)();
router.use('/states', stateRoutes_1.default);
router.use('/cities', cityRoutes_1.default);
router.use('/centers', centerRoutes_1.default);
router.use('/', otherRoutes_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map