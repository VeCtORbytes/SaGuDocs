import { createMDX } from 'fumadocs-mdx/next';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const withMDX = createMDX();

// Set NEXT_PUBLIC_BASE_PATH=/SaGuSDK when deploying to GitHub Pages project URLs.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || undefined;

/** @type {import('next').NextConfig} */
const config = {
  output: 'export',
  reactStrictMode: true,
  basePath,
  trailingSlash: true,
  turbopack: {
    root: dirname(fileURLToPath(import.meta.url)),
  },
};

export default withMDX(config);
