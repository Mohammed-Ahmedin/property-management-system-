// Runs prisma db push (safe, additive only) then starts server
const { execSync } = require("child_process");

try {
  console.log("Running prisma db push...");
  // NOTE: No --accept-data-loss flag — this ensures only additive changes (new tables/columns)
  // are applied. Destructive changes are never auto-applied to protect existing data.
  execSync("npx prisma db push", { stdio: "inherit" });
  console.log("prisma db push completed");
} catch (e) {
  console.log("prisma db push failed, continuing:", e.message);
}

execSync("node dist/app.js", { stdio: "inherit" });
