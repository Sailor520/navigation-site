/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  serverExternalPackages: ['cheerio'],
  // 禁用静态优化以避免服务器端渲染问题
  output: 'standalone',
  // 确保正确处理客户端组件
  transpilePackages: ['zustand'],
  // 允许的开发源配置，解决跨域警告
  experimental: {
    allowedDevOrigins: ['192.168.1.4:3000', 'localhost:3000'],
  },
}

export default nextConfig
