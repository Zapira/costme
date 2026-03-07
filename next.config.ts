import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin-allow-popups",
          },
        ],
      },
    ];
  },

  async redirects() {
    return [
      {
        source: "/history",
        destination: "/404",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;