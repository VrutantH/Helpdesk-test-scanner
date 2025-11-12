"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ticketFieldController_1 = require("../../controllers/ticket-module/ticketFieldController");
const router = express_1.default.Router();
router.post('/seed', ticketFieldController_1.seedDefaultTicketFields);
router.get('/', ticketFieldController_1.getTicketFields);
router.get('/:id', ticketFieldController_1.getTicketFieldById);
router.post('/', ticketFieldController_1.createTicketField);
router.put('/:id', ticketFieldController_1.updateTicketField);
router.delete('/:id', ticketFieldController_1.deleteTicketField);
exports.default = router;
//# sourceMappingURL=ticketFieldRoutes.js.map