const { withSentryConfig } = require("@sentry/nextjs");

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/workflows",
        permanent: false,
      },
    ];
  },
  reactCompiler: true,
};

module.exports = withSentryConfig(nextConfig, {
  org: "zlaark",
  project: "flowgent",

  silent: !process.env.CI,

  widenClientFileUpload: true,

  // tunnelRoute: "/monitoring",

  webpack: {
    automaticVercelMonitors: true,
    treeshake: {
      removeDebugLogging: true,
    },
  },
});
