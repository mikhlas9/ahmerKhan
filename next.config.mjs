/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Uncomment the line below if you want static export (creates 'out' folder)
  // output: 'export',
}

export default nextConfig
