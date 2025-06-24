"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { verifyAdminCredentials } from "./admin-auth-server"

interface LoginRecord {
  id: string
  timestamp: Date
  username: string
  success: boolean
  ip?: string
}

interface AdminAuthState {
  isAuthenticated: boolean
  currentUsername: string | null
  loginRecords: LoginRecord[]
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  getLoginRecords: () => LoginRecord[]
}

export const useAdminAuth = create<AdminAuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      currentUsername: null,
      loginRecords: [],

      login: async (username: string, password: string) => {
        try {
          // 使用服务器端验证
          const isValid = await verifyAdminCredentials(username, password)
          const { loginRecords } = get()

          // 记录登录尝试
          const loginRecord: LoginRecord = {
            id: Date.now().toString(),
            timestamp: new Date(),
            username,
            success: isValid,
          }

          set({
            isAuthenticated: isValid,
            currentUsername: isValid ? username : null,
            loginRecords: [loginRecord, ...loginRecords].slice(0, 50), // 保留最近50条记录
          })

          return isValid
        } catch (error) {
          console.error("登录验证失败:", error)
          return false
        }
      },

      logout: () =>
        set({
          isAuthenticated: false,
          currentUsername: null,
        }),

      getLoginRecords: () => get().loginRecords,
    }),
    {
      name: "admin-auth",
      // 只持久化登录状态和记录，不持久化凭据
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        currentUsername: state.currentUsername,
        loginRecords: state.loginRecords,
      }),
    },
  ),
)
