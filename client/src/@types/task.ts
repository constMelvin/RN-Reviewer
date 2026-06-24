// export type Task = {
//   task_id: string
//   task_name: string
//   task_type: 'Lecture' | 'Pre-Intensive' | 'Post Test'
//   task_date: string
//   task_link: string
// }

export type Task = {
  task_id: string
  task_name: string
  task_type: 'Lecture' | 'Pre-Intensive' | 'Post Test'
  task_date: string
  task_link: string
  task_isComplete: boolean
  user_id: string
  created_at: string
  updated_at: string
}

export type CreateTaskInput = {
  task_name: string
  task_link: string
  task_type: string
  task_date: string
}
export type UpdateTask = {
  task_id: string
  task_name: string
  task_type: 'Lecture' | 'Pre-Intensive' | 'Post Test'
  task_date: string
  task_link: string
  task_isComplete: boolean
}
