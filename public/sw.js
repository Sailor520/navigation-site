// 简单的服务工作者，缓存关键资源以减少加载失败
const CACHE_NAME = 'ai-tools-nav-v1'
const CRITICAL_RESOURCES = [
  '/',
  '/manifest.json',
  // 这些路径会在运行时动态添加
]

self.addEventListener('install', (event) => {
  console.log('🔧 [Service Worker] 安装中...')
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('🔧 [Service Worker] 缓存关键资源')
        return cache.addAll(CRITICAL_RESOURCES)
      })
      .catch((error) => {
        console.warn('🔧 [Service Worker] 缓存失败:', error)
      })
  )
})

self.addEventListener('fetch', (event) => {
  // 只处理导航请求和关键资源
  if (event.request.mode === 'navigate' || 
      event.request.url.includes('_next/static/chunks/')) {
    
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          // 网络失败时，尝试从缓存获取
          console.warn('🔧 [Service Worker] 网络请求失败，尝试缓存:', event.request.url)
          return caches.match(event.request)
            .then((cachedResponse) => {
              if (cachedResponse) {
                return cachedResponse
              }
              // 如果是导航请求且缓存中没有，返回离线页面
              if (event.request.mode === 'navigate') {
                return caches.match('/')
              }
              throw new Error('Resource not available offline')
            })
        })
    )
  }
})

self.addEventListener('activate', (event) => {
  console.log('🔧 [Service Worker] 激活中...')
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName))
      )
    })
  )
}) 