"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const guest_house_routes_1 = require("./v1/property.routes");
const auth_routes_1 = require("./v1/auth.routes");
const user_routes_1 = require("./v1/user.routes");
const rooms_routes_1 = require("./v1/rooms.routes");
const bookings_routes_1 = require("./v1/bookings.routes");
const favorites_routes_1 = require("./v1/favorites.routes");
const dashboard_routes_1 = require("./v1/dashboard.routes");
const managment_routes_1 = require("./v1/managment.routes");
const roles_routes_1 = require("./v1/roles.routes");
const rootRouter = (0, express_1.Router)();
rootRouter.get("/", (req, res) => {
    res.json({
        message: "Server is running successfully",
    });
});
rootRouter.use("/api/v1/properties", guest_house_routes_1.PropertyRouter);
rootRouter.use("/api/v1/auth", auth_routes_1.AuthRouter);
rootRouter.use("/api/v1/users", user_routes_1.UsersRouter);
rootRouter.use("/api/v1/rooms", rooms_routes_1.RoomsRouter);
rootRouter.use("/api/v1/dashboard", dashboard_routes_1.DashboardRouter);
rootRouter.use("/api/v1/bookings", bookings_routes_1.BookingsRouter);
rootRouter.use("/api/v1/roles", roles_routes_1.RolesRouter);
rootRouter.use("/api/v1/favorites", favorites_routes_1.FavoriteRouter);
rootRouter.use("/api/v1/admin", favorites_routes_1.FavoriteRouter);
rootRouter.use("/api/v1/management", managment_routes_1.ManagementRouter);
exports.default = rootRouter;
