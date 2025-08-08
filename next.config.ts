import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    // Allow Google profile images and Cloudinary assets
    remotePatterns: [
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
    ],
  },
};

export default nextConfig;
