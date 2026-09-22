import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx"],
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  experimental: {
    // Standart 1 MB: brend logotipi (3 MB gacha) shuncha joyga sig'maydi (admin/actions/brand.ts).
    serverActions: { bodySizeLimit: "4mb" },
  },
};

export default nextConfig;
