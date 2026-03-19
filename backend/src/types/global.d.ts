// src/types/global.d.ts
import "express";

declare global {
  namespace ExpressTypes {
    type Request = import("express").Request;
    type Response = import("express").Response;
    type NextFunction = import("express").NextFunction;
  }
}
