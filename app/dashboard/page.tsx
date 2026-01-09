'use client'

import { ProtectedRoute, AuthButton } from '@/components/auth'
import { useUser } from '@clerk/nextjs'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function Dashboard() {
  const { user } = useUser()
  const [supabaseUser, setSupabaseUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [syncMessage, setSyncMessage] = useState<string | null>(null)

  const fetchSupabaseUser = async () => {
    if (user && process.env.NEXT_PUBLIC_SUPABASE_URL) {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('clerk_user_id', user.id)
          .single()

        if (!error) {
          setSupabaseUser(data)
        } else {
          console.log('User not found in Supabase or Supabase not configured')
          setSupabaseUser(null)
        }
      } catch (error) {
        console.error('Error fetching user from Supabase:', error)
      }
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchSupabaseUser()
  }, [user])

  const handleSyncUser = async () => {
    setSyncing(true)
    setSyncMessage(null)
    try {
      const response = await fetch('/api/sync-user', { method: 'POST' })
      const data = await response.json()
      
      if (response.ok) {
        setSyncMessage('✅ User synced successfully!')
        await fetchSupabaseUser() // Refresh the Supabase user data
      } else {
        setSyncMessage(`❌ Sync failed: ${data.error || data.details || 'Unknown error'}`)
      }
    } catch (error) {
      setSyncMessage('❌ Sync failed: Network error')
    }
    setSyncing(false)
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
              </div>
              <div className="flex items-center">
                <AuthButton />
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Welcome to your Dashboard!</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                      Clerk User Information
                    </h3>
                    {user && (
                      <div className="space-y-2">
                        <p><strong>ID:</strong> {user.id}</p>
                        <p><strong>Email:</strong> {user.emailAddresses[0]?.emailAddress}</p>
                        <p><strong>First Name:</strong> {user.firstName || 'N/A'}</p>
                        <p><strong>Last Name:</strong> {user.lastName || 'N/A'}</p>
                        <p><strong>Created:</strong> {new Date(user.createdAt || '').toLocaleDateString()}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                      Supabase User Information
                    </h3>
                    {loading ? (
                      <p>Loading...</p>
                    ) : !process.env.NEXT_PUBLIC_SUPABASE_URL ? (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <p className="text-yellow-800 font-semibold">⚠️ Supabase Not Configured</p>
                        <p className="text-yellow-700 text-sm mt-1">
                          Set up your .env.local file with Supabase credentials to see user data sync.
                        </p>
                      </div>
                    ) : supabaseUser ? (
                      <div className="space-y-2">
                        <p><strong>Supabase ID:</strong> {supabaseUser.id}</p>
                        <p><strong>Clerk ID:</strong> {supabaseUser.clerk_user_id}</p>
                        <p><strong>Email:</strong> {supabaseUser.email}</p>
                        <p><strong>First Name:</strong> {supabaseUser.first_name || 'N/A'}</p>
                        <p><strong>Last Name:</strong> {supabaseUser.last_name || 'N/A'}</p>
                        <p><strong>Created:</strong> {new Date(supabaseUser.created_at).toLocaleDateString()}</p>
                      </div>
                    ) : (
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                        <p className="text-orange-800 font-semibold">⚠️ User not found in Supabase</p>
                        <p className="text-orange-700 text-sm mt-1">
                          Click "Sync to Supabase" below to manually sync your account.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Sync and Navigation buttons */}
              <div className="mt-8 flex flex-wrap gap-4">
                <button 
                  onClick={handleSyncUser}
                  disabled={syncing}
                  className="bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
                >
                  {syncing ? 'Syncing...' : 'Sync to Supabase'}
                </button>
                <button 
                  onClick={() => window.location.href = '/'}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
                >
                  Back to Home
                </button>
              </div>
              
              {syncMessage && (
                <div className={`mt-4 p-4 rounded-lg ${syncMessage.startsWith('✅') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                  {syncMessage}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}