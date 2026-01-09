import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Service role client for admin operations (use only in server-side code)
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

// Only create admin client on server side and if we have the service key
export const supabaseAdmin = supabaseServiceRoleKey 
  ? createClient(supabaseUrl, supabaseServiceRoleKey)
  : null

// Database types
export interface User {
  id: string
  clerk_user_id: string
  email: string
  first_name: string | null
  last_name: string | null
  image_url: string | null
  created_at: string
  updated_at: string
}