/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static HTML export — required for GitHub Pages (no server runtime available)
  output: "export",
  reactStrictMode: true,

  // Site is served from {user}.github.io/blueprint-management.com/
  // Remove basePath once a custom apex domain is set up and CNAME is in place.
  basePath: "/blueprint-management.com",
  assetPrefix: "/blueprint-management.com",

  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "i.scdn.co" }
    ]
  },

  trailingSlash: true
};

export default nextConfig;
