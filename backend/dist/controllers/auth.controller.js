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
const node_1 = require("better-auth/node");
const async_handler_1 = require("../utils/async-handler");
const auth_1 = require("../lib/auth");
exports.default = {
    signIn: (0, async_handler_1.tryCatch)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { token } = yield auth_1.auth.api.signInEmail({
            body: { email: "", password: "" },
        });
        console.log("Login successfull", token);
        res.send({ token });
    })),
    signUp: (0, async_handler_1.tryCatch)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { email, password, name } = req.body;
        const { token, user } = yield auth_1.auth.api.signUpEmail({
            body: { email, password, name, rememberMe: true },
        });
        res.send({ token, user });
        res.send(email);
    })),
    signOut: (0, async_handler_1.tryCatch)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        res.send("Signout done");
    })),
    me: (0, async_handler_1.tryCatch)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const session = yield auth_1.auth.api.getSession({
            headers: (0, node_1.fromNodeHeaders)(req.headers),
        });
        res.send(session);
    })),
};
