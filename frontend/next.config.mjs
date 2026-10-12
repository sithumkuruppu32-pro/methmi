import { existsSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Locally, npm workspaces hoist node_modules to the repo root. On Vercel the
// frontend service may be installed on its own, so fall back to this folder.
const workspaceRoot = existsSync(join(__dirname, "..", "node_modules", "next"))
  ? join(__dirname, "..")
  : __dirname;

// Must be set at build time too — rewrites are resolved during the build.
// Set BACKEND_URL on Vercel when the backend is a separate Vercel project.
const BACKEND_URL = (process.env.BACKEND_URL || "http://localhost:4000").replace(/\/$/, "");
const isVercel = process.env.VERCEL === "1";
const hasExternalBackend = Boolean(process.env.BACKEND_URL);

/** @type {import('next').NextConfig} */
const nextConfig = {
  agentRules: false,
  turbopack: {
    root: workspaceRoot,
  },

  async rewrites() {
    // Single-project Vercel Services deploy: vercel.json routes /api itself.
    if (isVercel && !hasExternalBackend) {
      return [];
    }

    // Local dev, or a separate backend project: proxy /api/* to the backend.
    return [
      {
        source: "/api/:path*",
        destination: `${BACKEND_URL}/api/:path*`,
      },
    ];
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "*.supabase.in",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
