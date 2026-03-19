"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddFavoriteSchema = void 0;
const zod_1 = __importDefault(require("zod"));
/* -------------------- Zod Schemas -------------------- */
exports.AddFavoriteSchema = zod_1.default
    .object({
    roomId: zod_1.default.string().uuid().optional(),
    propertyId: zod_1.default.string().uuid().optional(),
})
    .refine((data) => data.roomId || data.propertyId, {
    message: "Either roomId or propertyId is required",
});
