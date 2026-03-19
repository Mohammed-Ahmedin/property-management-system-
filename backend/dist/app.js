"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const cors_1 = __importDefault(require("cors"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const node_1 = require("better-auth/node");
const auth_1 = require("./lib/auth");
const routes_1 = __importDefault(require("./routes"));
const error_handler_1 = __importDefault(require("./middleware/error-handler"));
// import { Server } from "socket.io";
// import registerSocketHandlers from "./sockets";
const swaggerOutput = require("../swagger-output.json");
const app = (0, express_1.default)();
// ---------- Middleware ----------
app.use((0, express_fileupload_1.default)({
    useTempFiles: true,
    tempFileDir: "/tmp/",
}));
app.use((0, cors_1.default)({
    origin: ["http://localhost:4000"], // Allow all origins
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allowed HTTP methods
    credentials: true,
}));
app.all("/api/auth/*splat", (0, node_1.toNodeHandler)(auth_1.auth));
app.use(express_1.default.json());
// ---------- Swagger ----------
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerOutput));
// ---------- Routes ----------
app.use(routes_1.default);
// ---------- Error Handler ----------
app.use(error_handler_1.default);
// // ---------- Create HTTP server ----------
// const server = http.createServer(app);
// // ---------- Socket.IO ----------
// const io = new Server(server, {
//   cors: {
//     origin: ["*"],
//     methods: ["GET", "POST"],
//     credentials: true,
//   },
// });
// ---------- Register Socket Handlers ----------
// registerSocketHandlers(io);
const PORT = process.env.PORT || 3000;
// ---------- Start Server ----------
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📖 Swagger Docs in here http://localhost:${PORT}/api-docs`);
});
