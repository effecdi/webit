const path = require("path");
const fs = require("fs");
const { spawn } = require("child_process");

const projectRoot = path.resolve(__dirname, "..");
const port = process.env.PORT || 5000;
process.env.PORT = String(port);
process.env.HOSTNAME = "0.0.0.0";

const standaloneDir = path.join(projectRoot, ".next", "standalone");
const standalonePath = path.join(standaloneDir, "server.js");

if (fs.existsSync(standalonePath)) {
  const staticSrc = path.join(projectRoot, ".next", "static");
  const staticDest = path.join(standaloneDir, ".next", "static");

  if (fs.existsSync(staticSrc) && !fs.existsSync(staticDest)) {
    console.log("Copying static assets to standalone directory...");
    fs.cpSync(staticSrc, staticDest, { recursive: true });
  }

  const publicSrc = path.join(projectRoot, "public");
  const publicDest = path.join(standaloneDir, "public");

  if (fs.existsSync(publicSrc)) {
    console.log("Copying public assets to standalone directory...");
    fs.cpSync(publicSrc, publicDest, { recursive: true });
  }

  process.chdir(standaloneDir);
  console.log(`Starting Next.js standalone server on port ${port} from ${standaloneDir}...`);
  require(standalonePath);
} else {
  process.chdir(projectRoot);
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
