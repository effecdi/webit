const path = require("path");
const { spawn } = require("child_process");

const projectRoot = path.resolve(__dirname, "..");
process.chdir(projectRoot);

const port = process.env.PORT || 5000;
process.env.PORT = String(port);
process.env.HOSTNAME = "0.0.0.0";

const standalonePath = path.join(projectRoot, ".next", "standalone", "server.js");
const fs = require("fs");

if (fs.existsSync(standalonePath)) {
  console.log(`Starting Next.js standalone server on port ${port}...`);
  require(standalonePath);
} else {
  console.log(`Standalone server not found, using next start on port ${port}...`);
  const server = spawn("npx", ["next", "start", "-p", String(port), "-H", "0.0.0.0"], {
    cwd: projectRoot,
    stdio: "inherit",
    env: { ...process.env },
  });
  server.on("error", (e) => { console.error("Failed:", e); process.exit(1); });
  server.on("close", (code) => { process.exit(code || 0); });
  process.on("SIGTERM", () => server.kill("SIGTERM"));
  process.on("SIGINT", () => server.kill("SIGINT"));
}
