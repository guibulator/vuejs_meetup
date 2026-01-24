export interface Database {
  public: {
    Tables: {
      questions: {
        Row: {
          id: string
          slide_number: number
          question_text: string
          options: string[]
          active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          slide_number: number
          question_text: string
          options?: string[]
          active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          slide_number?: number
          question_text?: string
          options?: string[]
          active?: boolean
          created_at?: string
        }
      }
      votes: {
        Row: {
          id: string
          question_id: string
          answer: string
          voter_id: string
          created_at: string
        }
        Insert: {
          id?: string
          question_id: string
          answer: string
          voter_id: string
          created_at?: string
        }
        Update: {
          id?: string
          question_id?: string
          answer?: string
          voter_id?: string
          created_at?: string
        }
      }
    }
  }
}

export interface Question {
  id: string
  slide_number: number
  question_text: string
  options: string[]
  active: boolean
  created_at: string
}

export interface Vote {
  id: string
  question_id: string
  answer: string
  voter_id: string
  created_at: string
}

export interface VoteCount {
  [option: string]: number
  total: number
}
