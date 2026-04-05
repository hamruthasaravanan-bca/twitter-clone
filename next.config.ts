import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    BACKEND_URL: process.env.BACKEND_URL,
  },
};

export default nextConfig;
"@ | Out-File -FilePath next.config.ts -Encoding utf8"
