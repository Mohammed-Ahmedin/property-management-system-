"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManagementRouter = void 0;
const express_1 = require("express");
const management_controller_1 = __importDefault(require("../../controllers/management.controller"));
const router = (0, express_1.Router)();
exports.ManagementRouter = router;
// /management
router.get("/property/get-staffs", management_controller_1.default.getGusetHouseStaffs);
router.delete("/property/remove-staff", management_controller_1.default.removeStaffFromProperty);
router.post("/add-staff", management_controller_1.default.addStaffToProperty);
