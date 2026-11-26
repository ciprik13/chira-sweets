import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export: the site is served as plain files from Cloudflare (D-019).
  output: "export",
  trailingSlash: true,
  images: {
    // Image optimisation needs a server; images are optimised at build time instead.
    unoptimized: true,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
