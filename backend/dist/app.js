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
exports.io = void 0;
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const cors_1 = __importDefault(require("cors"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const node_1 = require("better-auth/node");
const auth_1 = require("./lib/auth");
const routes_1 = __importDefault(require("./routes"));
const error_handler_1 = __importDefault(require("./middleware/error-handler"));
const chat_socket_1 = require("./sockets/chat.socket");
const swaggerOutput = require("../swagger-output.json");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
// ---------- Middleware ----------
app.set("trust proxy", 1);
const CLIENT_FRONTEND_URL = process.env.CLIENT_FRONTEND_URL;
const ADMIN_FRONTEND_URL = process.env.ADMIN_FRONTEND_URL;
const allowedOriginPatterns = [
    /^https:\/\/property-management-system[\w-]*\.vercel\.app$/,
    /^https:\/\/property-management-system[\w-]*-mohammed-ahmedins-projects\.vercel\.app$/,
    /^https:\/\/solomongetnet\.pro\.et$/,
    /^http:\/\/localhost:(4000|5173|3000)$/,
];
const staticOrigins = [
    CLIENT_FRONTEND_URL,
    ADMIN_FRONTEND_URL,
].filter(Boolean);
const corsOriginFn = (origin, callback) => {
    if (!origin)
        return callback(null, true);
    if (staticOrigins.includes(origin))
        return callback(null, true);
    if (allowedOriginPatterns.some((p) => p.test(origin)))
        return callback(null, true);
    callback(new Error(`CORS blocked: ${origin}`));
};
app.use((0, cors_1.default)({ origin: corsOriginFn, methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], credentials: true }));
// ---------- Socket.IO ----------
exports.io = new socket_io_1.Server(server, {
    cors: {
        origin: (origin, callback) => corsOriginFn(origin, callback),
        methods: ["GET", "POST"],
        credentials: true,
    },
    transports: ["websocket", "polling"],
});
(0, chat_socket_1.registerChatSocket)(exports.io);
app.use((0, express_fileupload_1.default)({ useTempFiles: true, tempFileDir: "/tmp/" }));
app.all("/api/auth/*splat", (0, node_1.toNodeHandler)(auth_1.auth));
app.use(express_1.default.json());
// ---------- Swagger ----------
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerOutput));
// ---------- Routes ----------
app.use(routes_1.default);
// ---------- Error Handler ----------
app.use(error_handler_1.default);
const PORT = process.env.PORT || 3000;
function autoApproveProperties() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { prisma } = yield Promise.resolve().then(() => __importStar(require("./lib/prisma")));
            const result = yield prisma.property.updateMany({
                where: { status: "PENDING" },
                data: { status: "APPROVED", visibility: true },
            });
            if (result.count > 0)
                console.log(`✅ Auto-approved ${result.count} pending properties`);
        }
        catch (e) {
            console.error("Auto-approve failed:", e);
        }
    });
}
server.listen(PORT, "0.0.0.0", () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📖 Swagger Docs: http://localhost:${PORT}/api-docs`);
    yield autoApproveProperties();
}));
