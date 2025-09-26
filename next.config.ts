import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // 🚨 Ignora errores de ESLint durante el build
    ignoreDuringBuilds: true,
  },
  typescript: {
    // 🚨 Ignora errores de Typescript durante el build
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
