import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Désactive ESLint pendant les builds
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Optionnel: désactive aussi TypeScript errors pendant les builds
    ignoreBuildErrors: true,
  },
  // ... vos autres configurations existantes
};

export default nextConfig;
