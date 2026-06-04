import { TASKS_KEY } from '@/constant/queryKeys'
import { client } from '@/lib/client'
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

        // const res = await client.api.v1.tasks['create-task'].$post({
        //   json: newTask,
        // })
        // return await res.json()
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
      alert(`${data.task_name} Successfully added.`)
    },

    onSettled: () => queryClient.invalidateQueries({ queryKey: TASKS_KEY }),
  })
}

export function useUpdateTasks() {
  const queryClient = useQueryClient()
  return useMutation<TResponse, Error, UpdateTask, TContext>({
    mutationFn: async (updatedTask: UpdateTask) => {
      try {
        const res = await client.api.v1.tasks['update-task'][':id'].$put({
          json: { task_isComplete: updatedTask.task_isComplete },
          param: { id: updatedTask.task_id },
        })
        const data = await res.json()
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
    onSuccess(data) {
      const text = data.task_isComplete
        ? `${data.task_name} Mark as Done!`
        : `${data.task_name} Mark as Undone!`
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
