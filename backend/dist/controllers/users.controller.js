"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const async_handler_1 = require("../utils/async-handler");
const prisma_1 = require("../lib/prisma");
exports.default = {
    getUsers: (0, async_handler_1.tryCatch)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const users = yield prisma_1.prisma.user.findMany();
        res.json(users);
    })),
    removeUser: (0, async_handler_1.tryCatch)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const userIdToRemove = req.params.id;
        const userDoc = yield prisma_1.prisma.user.findFirst({
            where: {
                id: userIdToRemove,
            },
        });
        if (!userDoc) {
            res.status(404).json({
                message: "There is no user with this id",
                success: false,
            });
            return;
        }
        yield prisma_1.prisma.user.delete({
            where: {
                id: userIdToRemove,
            },
        });
        res.status(200).json({
            message: "User deleted successfully",
            success: true,
        });
    })),
};
