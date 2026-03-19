import { VercelRequest, VercelResponse } from "@vercel/node";
import app from "../src/app";
import { createServer, IncomingMessage, ServerResponse } from "http";

const server = createServer((req: IncomingMessage, res: ServerResponse) => {
  app(req as any, res as any);
});

export default function handler(req: VercelRequest, res: VercelResponse) {
  return server.emit("request", req, res);
}
