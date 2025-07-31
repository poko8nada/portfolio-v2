import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare'
import type { NextConfig } from 'next'

initOpenNextCloudflareForDev()

const nextConfig: NextConfig = {
  webpack(config) {
    // Markdown files as string assets
    config.module.rules.push({
      test: /\.md$/,
      type: 'asset/source',
    })
    return config
  },
  turbopack: {
    rules: {
      '*.md': {
        as: '*.js',
        loaders: [], // asset/source doesn't need loaders
      },
    },
  },
}

export default nextConfig
