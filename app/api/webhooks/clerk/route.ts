import { NextRequest, NextResponse } from 'next/server'
import { verifyWebhook } from '@clerk/nextjs/webhooks'
import { supabaseAdmin } from '@/lib/supabase'

// GET endpoint to test if the webhook route is accessible
export async function GET() {
  return NextResponse.json({ 
    status: 'Webhook endpoint is working',
    supabaseConfigured: !!supabaseAdmin,
    webhookSecretConfigured: !!process.env.CLERK_WEBHOOK_SIGNING_SECRET
  })
}

export async function POST(req: NextRequest) {
  console.log('=== WEBHOOK RECEIVED ===')
  
  try {
    // Verify the webhook using Clerk's built-in function
    // This uses CLERK_WEBHOOK_SIGNING_SECRET environment variable automatically
    const evt = await verifyWebhook(req)
    
    const eventType = evt.type
    console.log(`Webhook received: ${eventType}`)
    console.log('Webhook payload:', JSON.stringify(evt.data, null, 2))

    if (eventType === 'user.created') {
      const { id, email_addresses, first_name, last_name, image_url } = evt.data

      // Check if Supabase admin client is available
      if (!supabaseAdmin) {
        console.error('Supabase admin client not configured - missing SUPABASE_SERVICE_ROLE_KEY')
        return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
      }

      console.log('Creating user in Supabase:', {
        clerk_user_id: id,
        email: email_addresses[0]?.email_address,
        first_name,
        last_name
      })

      // Insert user into Supabase
      const { data, error } = await supabaseAdmin
        .from('users')
        .insert({
          clerk_user_id: id,
          email: email_addresses[0]?.email_address || '',
          first_name: first_name || null,
          last_name: last_name || null,
          image_url: image_url || null,
        })
        .select()

      if (error) {
        console.error('Error creating user in Supabase:', error)
        return NextResponse.json({ error: 'Error creating user', details: error.message }, { status: 500 })
      }

      console.log('User created successfully in Supabase:', data)
    }

    if (eventType === 'user.updated') {
      const { id, email_addresses, first_name, last_name, image_url } = evt.data

      if (!supabaseAdmin) {
        console.error('Supabase admin client not configured')
        return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
      }

      const { data, error } = await supabaseAdmin
        .from('users')
        .update({
          email: email_addresses[0]?.email_address || '',
          first_name: first_name || null,
          last_name: last_name || null,
          image_url: image_url || null,
          updated_at: new Date().toISOString(),
        })
        .eq('clerk_user_id', id)
        .select()

      if (error) {
        console.error('Error updating user in Supabase:', error)
        return NextResponse.json({ error: 'Error updating user', details: error.message }, { status: 500 })
      }

      console.log('User updated successfully:', data)
    }

    if (eventType === 'user.deleted') {
      const { id } = evt.data

      if (!supabaseAdmin) {
        console.error('Supabase admin client not configured')
        return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
      }

      const { error } = await supabaseAdmin
        .from('users')
        .delete()
        .eq('clerk_user_id', id)

      if (error) {
        console.error('Error deleting user from Supabase:', error)
        return NextResponse.json({ error: 'Error deleting user', details: error.message }, { status: 500 })
      }

      console.log('User deleted successfully:', id)
    }

    return NextResponse.json({ received: true, event: eventType })
  } catch (err) {
    console.error('Webhook verification failed:', err)
    return new Response('Webhook verification failed', { status: 400 })
  }
}