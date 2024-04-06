const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtYXZrZnZ1anVsemh2cGludmp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTIzOTgyNDAsImV4cCI6MjAyNzk3NDI0MH0.UQUSw5jXuOSdLlM4E96Z9RRkWF95p_JmEyNKVUAnQL4'

const PROJECT_URL = 'https://smavkfvujulzhvpinvju.supabase.co'

import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(PROJECT_URL, API_KEY)
