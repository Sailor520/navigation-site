"use client"

import type React from "react"
import { createContext, useContext, useEffect, useReducer, useState } from "react"
import { verifyAdminCredentials } from "./admin-auth-server"
import { getFromLocalStorage, setToLocalStorage } from "./json-utils"

// 定义登录记录类型
interface LoginRecord {
  id: string
  timestamp: Date
  username: string
  success: boolean
}

// 定义认证状态
interface AuthState {
  isAuthenticated: boolean
  currentUsername: string | null
  loginRecords: LoginRecord[]
}

// 定义认证上下文
interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  getLoginRecords: () => LoginRecord[]
}

// 创建上下文
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// 定义 reducer 动作类型
type AuthAction =
  | { type: "LOGIN_SUCCESS"; username: string; record: LoginRecord }
  | { type: "LOGIN_FAILURE"; record: LoginRecord }
  | { type: "LOGOUT" }
  | { type: "INIT_STATE"; state: AuthState }

// 认证状态 reducer
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return {
        ...state,
        isAuthenticated: true,
        currentUsername: action.username,
        loginRecords: [action.record, ...state.loginRecords].slice(0, 50),
      }
    case "LOGIN_FAILURE":
      return {
        ...state,
        isAuthenticated: false,
        currentUsername: null,
        loginRecords: [action.record, ...state.loginRecords].slice(0, 50),
      }
    case "LOGOUT":
      return {
        ...state,
        isAuthenticated: false,
        currentUsername: null,
      }
    case "INIT_STATE":
      return action.state
    default:
      return state
  }
}

// 初始状态
const initialState: AuthState = {
  isAuthenticated: false,
  currentUsername: null,
  loginRecords: [],
}

// 认证提供者组件
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  // 确保组件已挂载
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // 从本地存储加载状态
  useEffect(() => {
    if (!isMounted) return

    try {
      const savedState = getFromLocalStorage<AuthState>("admin-auth-state", initialState)
      if (savedState && savedState !== initialState) {
        // 转换日期字符串回 Date 对象
        if (savedState.loginRecords && Array.isArray(savedState.loginRecords)) {
          savedState.loginRecords = savedState.loginRecords.map((record: any) => ({
            ...record,
            timestamp: new Date(record.timestamp),
          }))
        }
        dispatch({ type: "INIT_STATE", state: savedState })
      }
    } catch (error) {
      console.error("Failed to load auth state:", error)
    } finally {
      setIsLoaded(true)
    }
  }, [isMounted])

  // 保存状态到本地存储
  useEffect(() => {
    if (isLoaded && isMounted) {
      const success = setToLocalStorage("admin-auth-state", state)
      if (!success) {
        console.error("Failed to save auth state to localStorage")
      }
    }
  }, [state, isLoaded, isMounted])

  // 登录函数
  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      // 使用服务器端验证
      const isValid = await verifyAdminCredentials(username, password)

      // 记录登录尝试
      const loginRecord: LoginRecord = {
        id: Date.now().toString(),
        timestamp: new Date(),
        username,
        success: isValid,
      }

      if (isValid) {
        dispatch({ type: "LOGIN_SUCCESS", username, record: loginRecord })
      } else {
        dispatch({ type: "LOGIN_FAILURE", record: loginRecord })
      }

      return isValid
    } catch (error) {
      console.error("登录验证失败:", error)

      // 记录失败的登录尝试
      const loginRecord: LoginRecord = {
        id: Date.now().toString(),
        timestamp: new Date(),
        username,
        success: false,
      }

      dispatch({ type: "LOGIN_FAILURE", record: loginRecord })
      return false
    }
  }

  // 登出函数
  const logout = () => {
    dispatch({ type: "LOGOUT" })
  }

  // 获取登录记录
  const getLoginRecords = () => {
    return state.loginRecords
  }

  // 提供上下文值
  const value = {
    ...state,
    login,
    logout,
    getLoginRecords,
  }

  // 只有在客户端挂载并加载完成后才渲染子组件
  if (!isMounted || !isLoaded) {
    return (
      <AuthContext.Provider
        value={{
          isAuthenticated: false,
          currentUsername: null,
          loginRecords: [],
          login,
          logout,
          getLoginRecords,
        }}
      >
        {children}
      </AuthContext.Provider>
    )
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// 使用认证的自定义 Hook
export function useAdminAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAdminAuth must be used within an AuthProvider")
  }
  return context
}
