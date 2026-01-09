import { NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { supabaseAdmin } from '@/lib/supabase'

// This endpoint manually syncs the current Clerk user to Supabase
// Use this for development/testing when webhooks aren't set up
export async function POST() {
  try {
    const user = await currentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
    }

    console.log('Syncing user to Supabase:', user.id)

    // Upsert user - insert if not exists, update if exists
    const { data, error } = await supabaseAdmin
      .from('users')
      .upsert({
        clerk_user_id: user.id,
        email: user.emailAddresses[0]?.emailAddress || '',
        first_name: user.firstName || null,
        last_name: user.lastName || null,
        image_url: user.imageUrl || null,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'clerk_user_id'
      })
      .select()

    if (error) {
      console.error('Error syncing user to Supabase:', error)
      return NextResponse.json({ error: 'Failed to sync user', details: error.message }, { status: 500 })
    }

    console.log('User synced successfully:', data)
    return NextResponse.json({ success: true, user: data })
  } catch (err) {
    console.error('Sync error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'POST to this endpoint while logged in to sync your Clerk user to Supabase',
    usage: 'Call this from the dashboard or use: fetch("/api/sync-user", { method: "POST" })'
  })
}
