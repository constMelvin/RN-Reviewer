// import { AppType } from './server'
import type { AppType } from '../../../server/src/index'
import { hc } from 'hono/client'

export const client = hc<AppType>('http://localhost:4001', {
  // export const client = hc<AppType>('http://192.168.2.4:4001', {
  fetch: (input: URL | RequestInfo, init?: RequestInit) =>
    fetch(input, { ...init, credentials: 'include' }),
})
