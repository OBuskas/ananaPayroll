/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ["10.14.200.205:3000", "*10.14.200.205:3000"],
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
