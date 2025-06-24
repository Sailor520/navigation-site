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
  // 确保正确处理客户端组件
  transpilePackages: ['zustand'],
  // 允许的开发源配置，解决跨域警告
  experimental: {
    allowedDevOrigins: ['192.168.1.4:3000', 'localhost:3000'],
  },
  // 优化 webpack 配置以解决代码分割问题
  webpack: (config, { dev, isServer }) => {
    if (dev) {
      // 开发环境优化
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: {
            minChunks: 1,
            priority: -20,
            reuseExistingChunk: true
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: -10,
            chunks: 'all'
          }
        }
      }
      
      // 增加超时时间
      config.output.chunkLoadTimeout = 120000 // 2分钟
    }
    
    return config
  },
  // 移除废弃的 devIndicators 配置
  // devIndicators 在 Next.js 15+ 中已废弃且不再可配置
}

export default nextConfig
