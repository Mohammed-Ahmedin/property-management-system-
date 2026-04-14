// Starts the server. Schema changes should be applied manually via 'npx prisma db push'.
// Removed automatic db push to prevent any risk of data loss on redeploy.
const { execSync } = require("child_process");

execSync("node dist/app.js", { stdio: "inherit" });
