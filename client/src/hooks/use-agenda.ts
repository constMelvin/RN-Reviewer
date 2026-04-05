import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'

export type AgendaItem = {
  id: string
  title: string
  date: string
  is_done: boolean
}

const TODAY = format(new Date(), 'yyyy-MM-dd')
const YESTERDAY = format(new Date(Date.now() - 86400000), 'yyyy-MM-dd')

export function useAgenda() {
  return useQuery({
    queryKey: ['agenda', TODAY],
    queryFn: async () => {
      const res = await fetch(`/api/agenda?date=${TODAY}`)
      if (!res.ok) throw new Error('Failed to fetch agenda')
      return res.json() as Promise<AgendaItem[]>
    },
  })
}

export function useMissedYesterday() {
  return useQuery({
    queryKey: ['agenda', YESTERDAY, 'missed'],
    queryFn: async () => {
      const res = await fetch(`/api/agenda/missed`)
      if (!res.ok) throw new Error('Failed to fetch missed')
      return res.json() as Promise<AgendaItem[]>
    },
  })
}

export function useAddAgenda() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (title: string) => {
      const res = await fetch('/api/agenda', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, date: TODAY }),
      })
      if (!res.ok) throw new Error('Failed to add')
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['agenda', TODAY] }),
  })
}

export function useMarkAgendaDone() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/agenda/${id}/done`, { method: 'PATCH' })
      if (!res.ok) throw new Error('Failed to mark done')
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['agenda', TODAY] }),
  })
}
