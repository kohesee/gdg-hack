import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type PersonalityType = 
  | 'leader'
  | 'creative'
  | 'analytical'
  | 'social'
  | 'practical';

export interface User {
  id?: string;
  name: string;
  twitter_handle: string;
  linkedin_url: string;
  personality_type: PersonalityType;
  personality_score: number;
  created_at?: string;
}

export async function createUser(user: Omit<User, 'id' | 'created_at'>): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .insert([user])
    .select()
    .single();

  if (error) {
    console.error('Error creating user:', error);
    return null;
  }

  return data;
}

export async function getMatchedUsers(personalityType: PersonalityType, excludeId?: string): Promise<User[]> {
  let query = supabase
    .from('users')
    .select('*')
    .eq('personality_type', personalityType);

  if (excludeId) {
    query = query.neq('id', excludeId);
  }

  const { data, error } = await query.limit(10);

  if (error) {
    console.error('Error fetching matched users:', error);
    return [];
  }

  return data || [];
}

export async function getAllUsers(): Promise<User[]> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching users:', error);
    return [];
  }

  return data || [];
}
