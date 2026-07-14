import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  // Keep development chunks isolated so `next build` cannot invalidate a
  // running `next dev` server's webpack manifest.
  distDir: process.env.NODE_ENV === 'development' ? '.next-dev' : '.next',
  output: 'standalone',
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
