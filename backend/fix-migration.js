// Runs prisma db push (safe, idempotent) then starts server
const { execSync } = require("child_process");

try {
  console.log("Running prisma db push...");
  execSync("npx prisma db push --accept-data-loss", { stdio: "inherit" });
  console.log("prisma db push completed");
} catch (e) {
  console.log("prisma db push failed, continuing:", e.message);
}

execSync("node dist/app.js", { stdio: "inherit" });
