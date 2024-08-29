// const withNextra = require("nextra")({
//   theme: "nextra-theme-blog",
//   themeConfig: "./theme.config.js",
//   // optional: add `unstable_staticImage: true` to enable Nextra's auto image import
// });

/** @type {import('next').NextConfig} */
const nextConfig = {
  // any configs you need
  publicRuntimeConfig: {
    staticUserId: process.env.STATIC_USER_ID || '',
    bucketName: process.env.BUCKET_NAME || 'demo01-nextjs-blog'
  }
};

// module.exports = withNextra(nextConfig);
module.exports = nextConfig;
