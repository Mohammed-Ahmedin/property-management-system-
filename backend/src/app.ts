import express from "express";
import swaggerUi from "swagger-ui-express";
import cors from "cors";
import fileUpload from "express-fileupload";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import rootRouter from "./routes";
import errorHandlerMiddleware from "./middleware/error-handler";

const swaggerOutput = require("../swagger-output.json");

const app = express();

// ---------- Middleware ----------
app.set("trust proxy", 1);

const CLIENT_FRONTEND_URL = process.env.CLIENT_FRONTEND_URL;
const ADMIN_FRONTEND_URL = process.env.ADMIN_FRONTEND_URL;

const orgin = [
  CLIENT_FRONTEND_URL,
  ADMIN_FRONTEND_URL,
  "https://solomongetnet.pro.et",
  "http://localhost:4000",
];

app.use(
  cors({
    origin: [...orgin],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allowed HTTP methods
    credentials: true,
  })
);

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

app.all("/api/auth/*splat", toNodeHandler(auth));
app.use(express.json());

// ---------- Swagger ----------
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerOutput));

// ---------- Routes ----------
app.use(rootRouter);

// ---------- Error Handler ----------
app.use(errorHandlerMiddleware);

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

// export default app
// ---------- Start Server ----------
app.listen(PORT as any, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🚀 The new version is running`);
  console.log(`🚀 Friday 13 - hmmmm`);
  console.log(`📖 Swagger Docs in here http://localhost:${PORT}/api-docs`);
});

// app.listen(PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
//   console.log(`🚀 The new version is running`);
//   console.log(`📖 Swagger Docs in here http://localhost:${PORT}/api-docs`);
// });
