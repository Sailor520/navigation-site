"use server"

// 服务器端管理员认证
export async function verifyAdminCredentials(username: string, password: string): Promise<boolean> {
  // 从环境变量获取管理员凭据
  const adminUsername = process.env.ADMIN_USERNAME || "admin"
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123456"

  return username === adminUsername && password === adminPassword
}

export async function getAdminInfo() {
  // 只返回用户名，不返回密码
  return {
    username: process.env.ADMIN_USERNAME || "admin",
    hasCustomCredentials: !!(process.env.ADMIN_USERNAME && process.env.ADMIN_PASSWORD),
  }
}
