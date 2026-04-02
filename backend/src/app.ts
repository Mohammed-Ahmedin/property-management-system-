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

const allowedOriginPatterns = [
  /^https:\/\/property-management-system[\w-]*\.vercel\.app$/,
  /^https:\/\/property-management-system[\w-]*-mohammed-ahmedins-projects\.vercel\.app$/,
  /^https:\/\/solomongetnet\.pro\.et$/,
  /^http:\/\/localhost:(4000|5173|3000)$/,
];

const staticOrigins = [
  CLIENT_FRONTEND_URL,
  ADMIN_FRONTEND_URL,
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (staticOrigins.includes(origin)) return callback(null, true);
      if (allowedOriginPatterns.some((p) => p.test(origin))) return callback(null, true);
      callback(new Error(`CORS blocked: ${origin}`));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
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

// Auto-approve all PENDING properties on startup
async function autoApproveProperties() {
  try {
    const { prisma } = await import("./lib/prisma");
    const result = await prisma.property.updateMany({
      where: { status: "PENDING" },
      data: { status: "APPROVED", visibility: true },
    });
    if (result.count > 0) {
      console.log(`✅ Auto-approved ${result.count} pending properties`);
    }
  } catch (e) {
    console.error("Auto-approve failed:", e);
  }
}

// ---------- Start Server ----------
app.listen(PORT as any, "0.0.0.0", async () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🚀 The new version is running`);
  console.log(`📖 Swagger Docs in here http://localhost:${PORT}/api-docs`);
  await autoApproveProperties();
});

// app.listen(PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
//   console.log(`🚀 The new version is running`);
//   console.log(`📖 Swagger Docs in here http://localhost:${PORT}/api-docs`);
// });
