import type { ScoreItem } from '@/hooks/use-score'

export type CreateScoreInput = Omit<ScoreItem, 'score_id' | 'user_id'>
