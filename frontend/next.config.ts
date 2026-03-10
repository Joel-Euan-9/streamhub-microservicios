import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'image.tmdb.org' },
      { protocol: 'https', hostname: 'm.media-amazon.com' },
      { protocol: 'https', hostname: 'beam-images.warnermediacdn.com' },
      { protocol: 'https', hostname: 'media.revistagq.com' },
      { protocol: 'https', hostname: 'occ-0-8407-2219.1.nflxso.net' },
      { protocol: 'https', hostname: 'sm.ign.com' },
      { protocol: 'https', hostname: 'i.ytimg.com' }
    ],
  },
  webpack: (config) => {
    config.watchOptions = {
      poll: 1000,   // Revisa cambios cada segundo (Vital para Docker en Windows)
      aggregateTimeout: 300,
    };
    return config;
  },
};

export default nextConfig;