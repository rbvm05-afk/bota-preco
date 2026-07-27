import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Evita Next/Turbopack escolher o lockfile do diretório pai (~/package-lock.json)
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
