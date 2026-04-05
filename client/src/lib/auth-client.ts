import { createAuthClient } from 'better-auth/react'
import { usernameClient } from 'better-auth/client/plugins'

export const authClient = createAuthClient({
  plugins: [usernameClient()],
  // baseURL: window.location.origin,
  baseURL: import.meta.env.VITE_API_URL,
  fetchOptions: {
    credentials: 'include',
  },
})

export const { signIn, signUp, useSession, signOut, isUsernameAvailable } =
  authClient
