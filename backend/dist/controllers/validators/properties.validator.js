"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePropertySchema = exports.createPropertySchema = void 0;
const client_1 = require("@prisma/client");
const zod_1 = __importDefault(require("zod"));
exports.createPropertySchema = zod_1.default.object({
    name: zod_1.default.string().min(3, "Name must be at least 3 characters"),
    address: zod_1.default.string().min(5, "Address must be at least 5 characters"),
    type: zod_1.default.nativeEnum(client_1.PropertyType).optional(),
    about: zod_1.default
        .object({
        description: zod_1.default
            .string()
            .min(10, "Description must be at least 10 characters"),
    })
        .optional(),
    location: zod_1.default
        .object({
        continent: zod_1.default.string(),
        country: zod_1.default.string(),
        city: zod_1.default.string(),
        subcity: zod_1.default.string(),
        neighborhood: zod_1.default.string().optional(),
        nearby: zod_1.default.string().optional(),
        longitude: zod_1.default.string().optional(),
        latitude: zod_1.default.string().optional(),
    })
        .optional(),
    facilities: zod_1.default.array(zod_1.default.object({ name: zod_1.default.string() })).optional(),
    contact: zod_1.default
        .object({
        phone: zod_1.default.string(),
        email: zod_1.default.string().email(),
    })
        .optional(),
    images: zod_1.default
        .array(zod_1.default.object({
        url: zod_1.default.string().url(),
        name: zod_1.default.string(),
    }))
        .optional(),
});
exports.updatePropertySchema = zod_1.default.object({
    name: zod_1.default.string().min(1).optional(),
    address: zod_1.default.string().min(1).optional(),
    type: zod_1.default.nativeEnum(client_1.PropertyType).optional(),
    about: zod_1.default
        .object({
        description: zod_1.default.string().min(1),
    })
        .optional(),
    location: zod_1.default
        .object({
        continent: zod_1.default.string().optional().default("Africa"),
        country: zod_1.default.string().optional().default("Ethiopia"),
        city: zod_1.default.string().optional().default(""),
        subcity: zod_1.default.string().optional().default(""),
        nearby: zod_1.default.string().optional(),
        latitude: zod_1.default.string().optional(),
        longitude: zod_1.default.string().optional(),
    })
        .optional(),
    facilities: zod_1.default.array(zod_1.default.object({ name: zod_1.default.string() })).optional(),
    contact: zod_1.default
        .object({
        phone: zod_1.default.string(),
        email: zod_1.default.string().email(),
    })
        .optional(),
    images: zod_1.default
        .array(zod_1.default.object({
        url: zod_1.default.string().url(),
        name: zod_1.default.string(),
    }))
        .optional(),
    policies: zod_1.default.any().optional(),
});
