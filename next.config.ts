import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // The landing page needs no server at runtime on Vercel.
  ...(process.env.RITLI_STATIC_EXPORT === '1' ? { output: 'export' } : {}),
};

export default nextConfig;
