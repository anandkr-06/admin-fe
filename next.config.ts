import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

const nextConfig = {
  experimental: {
    allowedDevOrigins: [
      "http://devtest.anylicence.com:3200",
      "http://devadmin.anylicence.com:3200",
    ],
  },
};

module.exports = nextConfig;

export default nextConfig;


