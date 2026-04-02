"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
exports.propertyCommissionSchema = exports.platformCommissionSchema = void 0;
const zod_1 = __importDefault(require("zod"));
// --------------------
exports.platformCommissionSchema = zod_1.default.object({
    platformPercent: (_a = zod_1.default.number()) === null || _a === void 0 ? void 0 : _a.min(0).max(100).optional(),
    brokerPercent: (_b = zod_1.default.number()) === null || _b === void 0 ? void 0 : _b.min(0).max(100).optional(),
    isActive: zod_1.default.boolean().optional(),
});
exports.propertyCommissionSchema = zod_1.default.object({
    propertyId: zod_1.default.string().uuid(),
    platformPercent: (_c = zod_1.default.number()) === null || _c === void 0 ? void 0 : _c.min(0).max(100).optional(),
    brokerPercent: (_d = zod_1.default.number()) === null || _d === void 0 ? void 0 : _d.min(0).max(100).optional(),
    isActive: zod_1.default.boolean().optional(),
});
