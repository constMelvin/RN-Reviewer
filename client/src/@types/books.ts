export type BookTopics = {
  topic_id: string
  topics: string
  deadline: string
  done: boolean
  links: string
  book_id: string
  created_at: string
  updated_at: string
  subtopics?: BookSubTopics[]
}
export type BookSubTopics = {
  subtopic_id: string
  topics: string
  deadline: string
  status: 'Studying' | 'Not Started' | 'Mastered'
  done: boolean
  topic_id: string
  links: string
}
// book_id: string

export type Books = {
  book_id: string
  book_title: string
  book_type: string
  user_id: string
  topics: BookTopics[]
  created_at: string
  updated_at: string
}

export type BooksInput = {
  book_title: string
  book_type: string
}
