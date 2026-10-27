/* ------------------------------------------------------------
Defines shared source records, account identities and validated analysis results.
---------------------------------------------------------------*/

export type Category = 'love' | 'requests' | 'improve'

export interface Fan {
  id: string
  username: string
  displayName: string
}

export interface Post {
  id: string
  title: string
  caption: string
  publishedAt: string
  thumbnail: string
  format: 'Photo' | 'Video' | 'Live'
}

export interface Comment {
  id: string
  postId: string
  fanId: string
  text: string
  createdAt: string
}

export interface Dataset {
  version: string
  posts: Post[]
  comments: Comment[]
  fans: Fan[]
}

export interface PostSummary {
  postId: string
  summary: string
  opportunity: string | null
}

export interface Insight {
  id: string
  title: string
  category: Category
  summary: string
  opportunity: string | null
  commentIds: string[]
  postSummaries: PostSummary[]
}

export interface AnalysisResult {
  insights: Insight[]
  analysedAt: string
  datasetVersion: string
  model: string
  promptVersion: string
}

export interface Account {
  id: string
  audience_creator_id: string
  fanvue_id: string
  username: string
  display_name: string
  avatar_url: string | null
}

export interface DashboardModel {
  dataset: Dataset
  result: AnalysisResult | null
  account: Account | null
  isPreview: boolean
}

export type JobStage = 'queued' | 'analysing' | 'validating' | 'complete' | 'failed'

export interface AnalysisJob {
  id: string
  audience_creator_id: string
  user_id: string
  cache_key: string
  status: JobStage
  result: AnalysisResult | null
  error: string | null
  created_at: string
  completed_at: string | null
  lease_token: string | null
  attempts: number
}
