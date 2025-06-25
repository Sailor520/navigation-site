// 优化的服务工作者，提升资源加载稳定性并防护扩展错误
const CACHE_NAME = 'ai-tools-nav-v2'
const STATIC_CACHE_NAME = 'ai-tools-nav-static-v2'

// 需要缓存的静态资源
const STATIC_RESOURCES = [
  '/',
  '/manifest.json',
  // 运行时会动态添加更多资源
]

// 安装阶段
self.addEventListener('install', (event) => {
  console.log('🔧 [SW] 安装服务工作者...')
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE_NAME).then(cache => 
        cache.addAll(STATIC_RESOURCES).catch(err => 
          console.warn('🔧 [SW] 部分资源缓存失败:', err.message)
        )
      ),
      self.skipWaiting() // 立即激活新的服务工作者
    ])
  )
})

// 激活阶段
self.addEventListener('activate', (event) => {
  console.log('🔧 [SW] 激活服务工作者...')
  event.waitUntil(
    Promise.all([
      // 清理旧缓存
      caches.keys().then(cacheNames =>
        Promise.all(
          cacheNames
            .filter(name => name !== CACHE_NAME && name !== STATIC_CACHE_NAME)
            .map(name => caches.delete(name))
        )
      ),
      self.clients.claim() // 立即控制所有客户端
    ])
  )
})

// 网络请求拦截
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)
  
  // 忽略 Chrome 扩展请求
  if (url.protocol === 'chrome-extension:' || url.protocol === 'moz-extension:') {
    return // 不处理扩展请求
  }
  
  // 忽略非 HTTP(S) 请求
  if (!url.protocol.startsWith('http')) {
    return
  }
  
  // 处理导航请求和静态资源
  if (request.mode === 'navigate' || request.destination === 'document') {
    event.respondWith(handleNavigationRequest(request))
  } else if (request.url.includes('/_next/static/') || request.url.includes('/static/')) {
    event.respondWith(handleStaticRequest(request))
  } else if (request.url.includes('/_next/') || request.method === 'GET') {
    event.respondWith(handleAssetRequest(request))
  }
})

// 处理导航请求
async function handleNavigationRequest(request) {
  try {
    // 首先尝试网络请求
    const response = await fetch(request)
    if (response.ok) {
      return response
    }
    throw new Error(`HTTP ${response.status}`)
  } catch (error) {
    console.warn('🔧 [SW] 导航请求失败，使用缓存:', error.message)
    // 网络失败时使用缓存
    const cachedResponse = await caches.match('/')
    return cachedResponse || new Response('网络连接失败，请检查网络连接', {
      status: 503,
      statusText: 'Service Unavailable'
    })
  }
}

// 处理静态资源请求
async function handleStaticRequest(request) {
  try {
    // 先查缓存
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }
    
    // 缓存未命中，请求网络
    const response = await fetch(request)
    if (response.ok) {
      // 缓存成功的响应
      const cache = await caches.open(STATIC_CACHE_NAME)
      cache.put(request, response.clone()).catch(err => 
        console.warn('🔧 [SW] 缓存失败:', err.message)
      )
    }
    return response
  } catch (error) {
    console.warn('🔧 [SW] 静态资源请求失败:', error.message)
    // 返回缓存的版本（如果有）
    return await caches.match(request) || new Response('资源加载失败', {
      status: 404,
      statusText: 'Not Found'
    })
  }
}

// 处理其他资源请求
async function handleAssetRequest(request) {
  try {
    const response = await fetch(request)
    return response
  } catch (error) {
    console.warn('🔧 [SW] 资源请求失败:', error.message)
    return await caches.match(request) || new Response('', { status: 404 })
  }
}

// 错误处理
self.addEventListener('error', (event) => {
  console.error('🔧 [SW] 服务工作者错误:', event.error)
})

self.addEventListener('unhandledrejection', (event) => {
  console.error('🔧 [SW] 未处理的Promise拒绝:', event.reason)
  event.preventDefault()
}) 