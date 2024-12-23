/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['lh3.googleusercontent.com/'], // Add external image domains here
      },
      eslint: {
        dirs: ['app', 'components'], 
      },
};

export default nextConfig;
