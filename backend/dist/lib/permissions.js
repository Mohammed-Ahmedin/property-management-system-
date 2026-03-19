"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ac = exports.GUEST = exports.STAFF = exports.ADMIN = void 0;
const access_1 = require("better-auth/plugins/access");
const access_2 = require("better-auth/plugins/admin/access");
const statement = Object.assign(Object.assign({}, access_2.defaultStatements), { project: ["create", "update", "delete", "share", "view"], report: ["view", "export"] });
const ac = (0, access_1.createAccessControl)(statement);
exports.ac = ac;
exports.ADMIN = ac.newRole(Object.assign(Object.assign({}, access_2.adminAc.statements), { user: [
        "create",
        "list",
        "set-role",
        "ban",
        "impersonate",
        "delete",
        "set-password",
    ], session: ["list", "revoke", "delete"], project: ["create", "update", "delete", "share"], report: ["view", "export"] }));
exports.STAFF = ac.newRole({
    user: ["list"],
    session: ["list"],
    project: ["create", "update"],
    report: ["view"],
});
exports.GUEST = ac.newRole({
    user: [],
    session: [],
    project: ["view", "create", "update", "delete"],
});
