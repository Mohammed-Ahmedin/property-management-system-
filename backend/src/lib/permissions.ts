import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements, adminAc } from "better-auth/plugins/admin/access";

const statement = {
  ...defaultStatements,
  project: ["create", "update", "delete", "share", "view"],
  report: ["view", "export"],
} as const;

const ac = createAccessControl(statement);

export const ADMIN = ac.newRole({
  ...adminAc.statements,
  user: [
    "create",
    "list",
    "set-role",
    "ban",
    "impersonate",
    "delete",
    "set-password",
  ],
  session: ["list", "revoke", "delete"],
  project: ["create", "update", "delete", "share"],
  report: ["view", "export"],
});

export const STAFF = ac.newRole({
  user: ["list"],
  session: ["list"],
  project: ["create", "update"],
  report: ["view"],
});

export const GUEST = ac.newRole({
  user: [],
  session: [],
  project: ["view", "create", "update", "delete"],
});

export { ac };
