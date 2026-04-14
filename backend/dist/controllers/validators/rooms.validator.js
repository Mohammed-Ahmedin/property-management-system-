"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateServiceSchema = exports.serviceSchema = exports.createRoomSchema = void 0;
const client_1 = require("@prisma/client");
const zod_1 = __importDefault(require("zod"));
exports.createRoomSchema = zod_1.default.object({
    name: zod_1.default.string().min(2, "Room name must be at least 2 characters"),
    roomId: zod_1.default.string().min(2, "Room ID is required"),
    type: zod_1.default.nativeEnum(client_1.RoomType).optional(),
    price: zod_1.default.number().int().min(0).optional().default(0),
    description: zod_1.default.string().optional().default(""),
    availability: zod_1.default.boolean().optional(),
    squareMeters: zod_1.default.number().int().min(0).optional().default(0),
    maxOccupancy: zod_1.default.number().int().min(0).optional().default(1),
    propertyId: zod_1.default.string().uuid(),
    // ✅ Simplified features (replace old living/kitchen/accessibility/hygiene)
    features: zod_1.default
        .array(zod_1.default.object({
        category: zod_1.default.string().optional(), // e.g., "kitchen", "livingroom", "bathroom"
        name: zod_1.default.string().min(1, "Feature name required"), // e.g., "wifi", "tv"
        value: zod_1.default.string().optional(), // e.g., "true", "2 queen beds"
    }))
        .optional(),
    // ✅ Optional images (unchanged logic)
    images: zod_1.default
        .array(zod_1.default.object({
        url: zod_1.default.string().url("Must be a valid URL"),
        name: zod_1.default.string().optional(),
    }))
        .optional(),
    // ✅ New: Additional services (paid or free)
    services: zod_1.default
        .array(zod_1.default.object({
        name: zod_1.default.string().min(2, "Service name required"), // e.g., "Breakfast"
        description: zod_1.default.string().optional(),
        price: zod_1.default.number().int().min(0).optional(), // null = free service
        isActive: zod_1.default.boolean().optional(),
    }))
        .optional(),
});
exports.serviceSchema = zod_1.default.object({
    name: zod_1.default.string().min(2, "Service name is required"),
    description: zod_1.default.string().optional(),
    price: zod_1.default.number().int().positive().optional(),
    isActive: zod_1.default.boolean().optional(),
});
exports.updateServiceSchema = zod_1.default.object({
    name: zod_1.default.string().min(2, "Service name is required").optional(),
    description: zod_1.default.string().optional(),
    price: zod_1.default.number().int().positive().nullable().optional(),
    isActive: zod_1.default.boolean().optional(),
});
