import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

const SUPABASE_URL = "https://lmbyrsueyvlgloeijavu.supabase.co"
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxtYnlyc3VleXZsZ2xvZWlqYXZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUyMDY2OTAsImV4cCI6MjA1MDc4MjY5MH0.Rwe_xQw5JjKOS4zzgrSzcnrqlu18w7qUITPuI8AH2yE"

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)