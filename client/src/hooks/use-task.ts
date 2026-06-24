import { TASKS_KEY } from '@/constant/queryKeys'
import type { CreateTaskInput, Task, UpdateTask } from '@/@types/task'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/store/authStore'
import { sileo } from 'sileo'
import { api } from '@/utils/api'

export type TResponse = Task

type TContext = {
  previousTasks: Task[]
}

export function useTasks() {
  return useQuery<Task[], Error>({
    queryKey: TASKS_KEY,
    queryFn: async () => {
      // const res = await client.api.v1.tasks.$get()
      // return (await res.json()) as Task[]
      const res = await api.get('/v1/tasks')
      return res.data
    },
  })
}

export function useCreateTasks() {
  const queryClient = useQueryClient()
  const { user } = useAuthStore()
  if (!user?.id) throw new Error('Line 27 create Task: User is not Define')
  return useMutation<TResponse, Error, CreateTaskInput, TContext>({
    mutationFn: async (newTask: CreateTaskInput) => {
      try {
        const { data } = await api.post('/v1/tasks/create-task', newTask)
        return data
      } catch (error: any) {
        throw error.response?.data?.message || 'Something went wrong'
      }
    },
    onMutate: async (newTask: CreateTaskInput) => {
      await queryClient.cancelQueries({ queryKey: TASKS_KEY })

      const previousTasks = queryClient.getQueryData<Task[]>(TASKS_KEY) || []

      queryClient.setQueryData<Task[]>(TASKS_KEY, [
        ...previousTasks,
        {
          task_id: Date.now().toString(), // temporary ID
          task_name: newTask.task_name,
          task_type: newTask.task_type as Task['task_type'],
          task_date: newTask.task_date,
          task_link: newTask.task_link,
          task_isComplete: false,
          user_id: 'temp', // optional
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])

      return { previousTasks }
    },
    onError(_err, _newTask, context) {
      queryClient.setQueryData(TASKS_KEY, context?.previousTasks)
    },
    onSuccess(data) {
      sileo.success({
        description: `${data.task_name} Successfully added.`,
        fill: 'white',
        position: 'top-center',
        styles: {
          description: 'text-black!',
        },
      })
    },

    onSettled: () => queryClient.invalidateQueries({ queryKey: TASKS_KEY }),
  })
}

export function useUpdateTasks() {
  const queryClient = useQueryClient()
  return useMutation<TResponse, Error, UpdateTask, TContext>({
    mutationFn: async (updatedTask: UpdateTask) => {
      try {
        const { data } = await api.put(
          `/v1/tasks/update-task/${updatedTask.task_id}`,
          updatedTask,
        )
        return data
      } catch (error: any) {
        throw error.response?.data?.message || 'Something went wrong'
      }
    },
    onMutate: async (updatedTask) => {
      await queryClient.cancelQueries({ queryKey: TASKS_KEY })

      const previousTasks = queryClient.getQueryData<Task[]>(TASKS_KEY) || []

      queryClient.setQueryData<Task[]>(
        TASKS_KEY,
        previousTasks.map((t) =>
          t.task_id === updatedTask.task_id ? { ...t, ...updatedTask } : t,
        ),
      )

      return { previousTasks }
    },
    onError(_err, _newTask, context) {
      queryClient.setQueryData(TASKS_KEY, context?.previousTasks)
    },
    onSuccess() {
      const text = 'Task updated Successfully.'
      sileo.success({
        fill: 'white',
        position: 'top-center',
        description: text,
        duration: 2000,
        styles: {
          description: 'text-black!',
        },
      })
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_KEY })
    },
  })
}

export function useDeleteTask() {
  const queryClient = useQueryClient()
  return useMutation<TResponse, Error, string, TContext>({
    mutationFn: async (task_id: string) => {
      try {
        const { data } = await api.delete(`/v1/tasks/delete-task/${task_id}`)
        return data
      } catch (error: any) {
        throw error.response?.data?.message || 'Something went wrong'
      }
    },
    onMutate: async (task_id: string) => {
      await queryClient.cancelQueries({ queryKey: TASKS_KEY })

      const previousTasks = queryClient.getQueryData<Task[]>(TASKS_KEY) || []

      queryClient.setQueryData<Task[]>(
        TASKS_KEY,
        previousTasks.filter((t) => t.task_id !== task_id),
      )

      return { previousTasks }
    },
    onError(_err, _task_id, context) {
      queryClient.setQueryData(TASKS_KEY, context?.previousTasks)
    },
    onSuccess() {
      const text = 'Task deleted Successfully.'
      sileo.success({
        fill: 'white',
        position: 'top-center',
        description: text,
        duration: 2000,
        styles: {
          description: 'text-black!',
        },
      })
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_KEY })
    },
  })
}
