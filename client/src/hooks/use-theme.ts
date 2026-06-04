import { useEffect } from 'react'
import { useMutation } from '@tanstack/react-query'
import { api } from '@/utils/api'
import { useAuthStore } from '@/store/authStore'
import { applyTheme, type ThemeName } from '@/lib/themes'
import { sileo } from 'sileo'

// ─── Apply theme from store on mount ─────────────────────────────────────────

/** Call once near the app root. Reads user.themeColor and applies CSS vars. */
export function useTheme() {
  const user = useAuthStore((s) => s.user)

  useEffect(() => {
    if (user?.themeColor) {
      applyTheme(user.themeColor as ThemeName) // only apply when we actually have a theme
    }
  }, [user?.themeColor])
}

// ─── Update theme (optimistic + persist to DB) ────────────────────────────────

export function useUpdateTheme() {
  const { setTheme } = useAuthStore()

  return useMutation({
    mutationFn: async (themeColor: ThemeName) => {
      const res = await api.patch('/user/theme', { themeColor })
      return res.data
    },
    onMutate: (themeColor) => {
      // Optimistic: apply immediately

      applyTheme(themeColor)
      setTheme(themeColor)
    },
    onError: (_err, _vars, _ctx) => {
      sileo.error({ title: 'Failed to save theme', duration: 2000 })
    },
    onSuccess: () => {
      sileo.success({ title: 'Theme updated!', duration: 1500 })
    },
  })
}
