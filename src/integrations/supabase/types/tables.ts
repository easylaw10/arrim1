import { Json } from './json';

interface EmailVerifications {
  Row: {
    id: string
    created_at: string
    email: string
    verification_code: string
    expires_at: string
    verified: boolean
    appeal_submitted: boolean
  }
  Insert: {
    id?: string
    created_at?: string
    email: string
    verification_code: string
    expires_at: string
    verified?: boolean
    appeal_submitted?: boolean
  }
  Update: {
    id?: string
    created_at?: string
    email?: string
    verification_code?: string
    expires_at?: string
    verified?: boolean
    appeal_submitted?: boolean
  }
  Relationships: []
}

interface ExamAppeals {
  Row: {
    content_score: number
    created_at: string
    email: string
    final_score: number
    full_name: string
    id: string
    language_score: number
    organization_score: number
    phone: string
  }
  Insert: {
    content_score: number
    created_at?: string
    email: string
    final_score: number
    full_name: string
    id?: string
    language_score: number
    organization_score: number
    phone: string
  }
  Update: {
    content_score?: number
    created_at?: string
    email?: string
    final_score?: number
    full_name?: string
    id?: string
    language_score?: number
    organization_score?: number
    phone?: string
  }
  Relationships: []
}

interface GptInstructions {
  Row: {
    content: string
    created_at: string
    id: string
    is_active: boolean
    name: string
    rubric_link: string | null
    task_name: string | null
    task_type: number
    updated_at: string
  }
  Insert: {
    content: string
    created_at?: string
    id?: string
    is_active?: boolean
    name: string
    rubric_link?: string | null
    task_name?: string | null
    task_type: number
    updated_at?: string
  }
  Update: {
    content?: string
    created_at?: string
    id?: string
    is_active?: boolean
    name?: string
    rubric_link?: string | null
    task_name?: string | null
    task_type?: number
    updated_at?: string
  }
  Relationships: []
}

export interface Database {
  public: {
    Tables: {
      email_verifications: EmailVerifications
      exam_appeals: ExamAppeals
      gpt_instructions: GptInstructions
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}