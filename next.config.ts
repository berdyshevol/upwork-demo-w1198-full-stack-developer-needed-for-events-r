import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Playwright drives the dev server over 127.0.0.1; without this the dev-only
  // cross-origin guard blocks the client chunks and nothing hydrates.
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  // The prototype lives inside a larger workspace; pin the root so Turbopack
  // does not walk up to an unrelated lockfile.
  turbopack: { root: path.resolve(process.cwd()) },
};

export default nextConfig;
