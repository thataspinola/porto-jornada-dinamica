import type { NextConfig } from "next";

const path = require("node:path");

const nextConfig: NextConfig = {
  output: "standalone",
  distDir: "/dist/react-ssr-corp-hubv-dinamic-journey",
  sassOptions: {
    includePaths: [path.join(__dirname, "src")],
    silenceDeprecations: ["legacy-js-api"],
    implementation: "sass-embedded",
    quietDeps: true,
  },
};

export default nextConfig;
