// src/store/auth.store.ts
import { applyTheme } from '@/lib/themes'
import { api } from '@/utils/api'
import { create } from 'zustand'

export type User = {
  id: string
  email: string
  emailVerified: boolean
  name: string
  createdAt: Date
  updatedAt: Date
  image?: string | null | undefined
  username?: string | null | undefined
  displayUsername?: string | null | undefined
  themeColor?: string | null | undefined
}
export type UserProfile = {
  id: string
  name: string
  email: string
  username: string | null
  displayUsername: string | null
  image: string | null
  themeColor: string | null
}

type AuthState = {
  user: User | null
  userProfile: UserProfile | null
  isAuthenticated: boolean
  loading: boolean

  setUser: (user: User) => void
  getUserProfile: () => void
  clearUser: () => void
  setTheme: (themeColor: string) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  userProfile: null,
  isAuthenticated: false,
  loading: true,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: true,
      loading: false,
    }),

  getUserProfile: async () => {
    try {
      const { data: user } = await api.get("/user/profile")

      if (user) {
        set({ userProfile: user })


        if (user.themeColor) {
          console.log('Applying theme:', user.themeColor)
          applyTheme(user.themeColor)
        } else {
          console.log('Applying fallback theme: yellow')
          applyTheme('yellow') // fallback
        }
      }
    } catch (error) {
      applyTheme('yellow')
    }
  },

  clearUser: () =>
    set({
      user: null,
      isAuthenticated: false,
      loading: false,
    }),

  setTheme: (themeColor) =>
    set((state) => ({
      userProfile: state.userProfile ? { ...state.userProfile, themeColor } : state.userProfile,
    })),
}))

