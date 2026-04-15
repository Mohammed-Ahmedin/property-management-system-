"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersRouter = void 0;
const express_1 = require("express");
const users_controller_1 = __importDefault(require("../../controllers/users.controller"));
const auth_middleware_1 = require("../../middleware/auth-middleware");
const router = (0, express_1.Router)();
exports.UsersRouter = router;
router.get("/management", (0, auth_middleware_1.authGuard)({ accessedBy: ["ADMIN"] }), users_controller_1.default.getUsers);
router.get("/management/stats", (0, auth_middleware_1.authGuard)({ accessedBy: ["ADMIN"] }), users_controller_1.default.getStats);
router.get("/clients", (0, auth_middleware_1.authGuard)({ accessedBy: ["BROKER", "ADMIN"] }), users_controller_1.default.getClients);
router.put("/management/:id", (0, auth_middleware_1.authGuard)({ accessedBy: ["ADMIN"] }), users_controller_1.default.updateUser);
router.post("/management/:id/ban", (0, auth_middleware_1.authGuard)({ accessedBy: ["ADMIN"] }), users_controller_1.default.banUser);
router.post("/management/:id/unban", (0, auth_middleware_1.authGuard)({ accessedBy: ["ADMIN"] }), users_controller_1.default.unbanUser);
router.delete("/management/:id", (0, auth_middleware_1.authGuard)({ accessedBy: ["ADMIN"] }), users_controller_1.default.deleteUser);
// Get current authenticated user (used as mobile fallback for profile tab)
router.get("/me", (0, auth_middleware_1.authGuard)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    res.json({ user });
}));
// Upload avatar image for current user
router.post("/upload-avatar", (0, auth_middleware_1.authGuard)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { v2: cloudinary } = yield Promise.resolve().then(() => __importStar(require("cloudinary")));
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });
        const files = req.files;
        const file = files === null || files === void 0 ? void 0 : files.file;
        if (!file)
            return res.status(400).json({ message: "No file provided" });
        const buffer = Buffer.isBuffer(file.data) ? file.data : Buffer.from(file.data);
        const base64 = buffer.toString("base64");
        const mimeType = file.mimetype || "image/jpeg";
        const dataUri = `data:${mimeType};base64,${base64}`;
        const result = yield cloudinary.uploader.upload(dataUri, { folder: "avatars" });
        res.json({ url: result.secure_url });
    }
    catch (e) {
        res.status(500).json({ message: (e === null || e === void 0 ? void 0 : e.message) || "Upload failed" });
    }
}));
