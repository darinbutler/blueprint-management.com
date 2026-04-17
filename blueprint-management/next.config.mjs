/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static HTML export — required for GitHub Pages (no server runtime available)
  output: "export",
  reactStrictMode: true,

  // Required for `output: 'export'` — Next's image optimizer can't run on Pages
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "i.scdn.co" }
    ]
  },

  // Produces /path/index.html for cleaner GitHub Pages URLs
  trailingSlash: true
};

export default nextConfig;
