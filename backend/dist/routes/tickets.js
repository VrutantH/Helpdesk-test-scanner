"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Get tickets endpoint - to be implemented',
    });
});
router.post('/', (req, res) => {
    res.json({
        success: true,
        message: 'Create ticket endpoint - to be implemented',
    });
});
router.get('/:id', (req, res) => {
    res.json({
        success: true,
        message: `Get ticket ${req.params.id} endpoint - to be implemented`,
    });
});
router.put('/:id', (req, res) => {
    res.json({
        success: true,
        message: `Update ticket ${req.params.id} endpoint - to be implemented`,
    });
});
exports.default = router;
//# sourceMappingURL=tickets.js.map