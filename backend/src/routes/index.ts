import { Router } from "express";
import { PropertyRouter } from "./v1/property.routes";
import { AuthRouter } from "./v1/auth.routes";
import { UsersRouter } from "./v1/users.routes";
import { RoomsRouter } from "./v1/rooms.routes";
import { BookingsRouter } from "./v1/bookings.routes";
import { FavoriteRouter } from "./v1/favorites.routes";
import { DashboardRouter } from "./v1/dashboard.routes";
import { RegistrationRequestRouter } from "./v1/registration-request.routes";
import { CommisionRouter } from "./v1/commision.routes";
import { PaymentsRouter } from "./v1/payments.routes";
import { AiRouter } from "./v1/ai.routes";

const rootRouter = Router();

rootRouter.get("/", (req, res) => {
  res.json({ message: "Server is running successfully" });
});

rootRouter.get("/api/v1/health", (req, res) => {
  res.json({ ok: true });
});

rootRouter.use("/api/v1/properties", PropertyRouter);
rootRouter.use("/api/v1/auth", AuthRouter);
rootRouter.use("/api/v1/users", UsersRouter);
rootRouter.use("/api/v1/rooms", RoomsRouter);
rootRouter.use("/api/v1/dashboard", DashboardRouter);
rootRouter.use("/api/v1/bookings", BookingsRouter);
rootRouter.use("/api/v1/favorites", FavoriteRouter);
rootRouter.use("/api/v1/payments", PaymentsRouter);
rootRouter.use("/api/v1/commision-settings", CommisionRouter);
rootRouter.use("/api/v1/registration-requests", RegistrationRequestRouter);
rootRouter.use("/api/v1/ai", AiRouter);

export default rootRouter;
