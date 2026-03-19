// types/express.d.ts
import { $Enums } from "@prisma/client";
import * as express from "express";

// src/types/global.d.ts
declare global {
  namespace Express {
    interface Request {
      user: {
        role: $Enums.UserRole;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        emailVerified: boolean;
        name: string;
        email?: string;
        image?: string;
      };
    }
  }
}
