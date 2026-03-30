// src/store/auth.store.ts
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
}

type AuthState = {
  user: User | null
  isAuthenticated: boolean
  loading: boolean

  setUser: (user: User) => void
  clearUser: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  loading: true,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: true,
      loading: false,
    }),

  clearUser: () =>
    set({
      user: null,
      isAuthenticated: false,
      loading: false,
    }),
}))
