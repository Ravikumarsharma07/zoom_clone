/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['lh3.googleusercontent.com/'], // Add external image domains here
      },
      eslint: {
        ignoreDuringBuilds: true,
      },
};

export default nextConfig;
