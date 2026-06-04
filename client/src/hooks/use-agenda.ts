import { api } from '@/utils/api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
// import { api } from '@/lib/api'
import { format } from 'date-fns'
import { sileo } from 'sileo'

const TODAY = format(new Date(), 'yyyy-MM-dd')
const YESTERDAY = format(new Date(Date.now() - 86400000), 'yyyy-MM-dd')

export const AGENDA_KEY = ['agenda', TODAY] as const
export const MISSED_KEY = ['agenda', YESTERDAY, 'missed'] as const

export type AgendaItem = {
  id: string
  user_id: string
  title: string
  date: string
  is_done: boolean
  created_at: string
}

type TContext = {
  previousAgenda: AgendaItem[]
}

export function useAgenda() {
  return useQuery<AgendaItem[], Error>({
    queryKey: AGENDA_KEY,
    queryFn: async () => {
      const { data } = await api.get('/v1/agenda')
      return data
    },
  })
}

export function useMissedYesterday() {
  return useQuery<AgendaItem[], Error>({
    queryKey: MISSED_KEY,
    queryFn: async () => {
      const { data } = await api.get('/v1/agenda/missed')
      return data
    },
  })
}

export function useAddAgenda() {
  const queryClient = useQueryClient()
  return useMutation<AgendaItem, Error, string, TContext>({
    mutationFn: async (title: string) => {
      const { data } = await api.post('/v1/agenda', { title, date: TODAY })
      return data
    },
    onMutate: async (title) => {
      await queryClient.cancelQueries({ queryKey: AGENDA_KEY })
      const previousAgenda =
        queryClient.getQueryData<AgendaItem[]>(AGENDA_KEY) || []

      queryClient.setQueryData<AgendaItem[]>(AGENDA_KEY, [
        ...previousAgenda,
        {
          id: Date.now().toString(),
          user_id: 'temp',
          title,
          date: TODAY,
          is_done: false,
          created_at: new Date().toISOString(),
        },
      ])
      return { previousAgenda }
    },
    onError(_err, _title, context) {
      queryClient.setQueryData(AGENDA_KEY, context?.previousAgenda)
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: AGENDA_KEY }),
  })
}

export function useMarkAgendaDone() {
  const queryClient = useQueryClient()
  return useMutation<AgendaItem, Error, string, TContext>({
    mutationFn: async (id: string) => {
      const { data } = await api.patch(`/v1/agenda/${id}/done`)
      return data
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: AGENDA_KEY })
      const previousAgenda =
        queryClient.getQueryData<AgendaItem[]>(AGENDA_KEY) || []

      queryClient.setQueryData<AgendaItem[]>(
        AGENDA_KEY,
        previousAgenda.map((item) =>
          item.id === id ? { ...item, is_done: true } : item,
        ),
      )
      return { previousAgenda }
    },
    onError(_err, _id, context) {
      queryClient.setQueryData(AGENDA_KEY, context?.previousAgenda)
    },
    onSuccess() {
      sileo.success({
        fill: 'white',
        position: 'top-center',
        description: 'Agenda item done! ✅',
        duration: 2000,
        styles: { description: 'text-black!' },
      })
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: AGENDA_KEY }),
  })
}
