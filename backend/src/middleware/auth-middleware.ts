import { Request, Response, NextFunction } from "express";
import { auth } from "../lib/auth";
import { fromNodeHeaders } from "better-auth/node";
import { UserRoleType } from "../types/user-roles.type";
import { prisma } from "../lib/prisma";

export type RoleGuardProps = {
  accessedBy?: UserRoleType[];
  cantAccessBy?: UserRoleType[];
} & (
  | { accessedBy: UserRoleType[]; cantAccessBy?: never }
  | { cantAccessBy: UserRoleType[]; accessedBy?: never }
);

export const authGuard = (options?: RoleGuardProps) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      let sessionUser: any = null;

      // 1. Try cookie-based session (desktop/same-origin)
      const authSession = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
      });

      if (authSession?.user?.id) {
        sessionUser = authSession.user;
      } else {
        // 2. Fallback: Bearer token (mobile / cross-origin)
        const authHeader = req.headers["authorization"];
        const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
        if (token) {
          const sessionDoc = await prisma.session.findFirst({
            where: { token },
            include: { user: true },
          });
          if (sessionDoc?.user) {
            sessionUser = sessionDoc.user;
          }
        }
      }

      if (!sessionUser?.id) {
        return res.status(401).json({ message: "User not logged in" });
      }

      (req as any).user = { ...sessionUser };

      if (!options) return next();

      const userRole = sessionUser.role;

      if (options.cantAccessBy && userRole && options.cantAccessBy.includes(userRole)) {
        return res.status(403).json({ message: "You are not allowed to access this resource" });
      }

      if (options.accessedBy && userRole && !options.accessedBy.includes(userRole)) {
        return res.status(403).json({ message: "You don't have permission to access this resource" });
      }

      next();
    } catch (err) {
      console.error("AuthGuard error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  };
};
