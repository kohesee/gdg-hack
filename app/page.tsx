'use client'

import { AuthButton } from '@/components/auth'
import { useUser } from '@clerk/nextjs'

export default function Home() {
  const { isSignedIn, user } = useUser()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="absolute top-4 right-4">
        <AuthButton />
      </div>
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome!</h1>
          <p className="text-gray-600 mb-8 text-lg">
            GDG Sprint 1 - Next.js with Tailwind CSS
          </p>
          {isSignedIn ? (
            <div className="space-y-4">
              <p className="text-green-600 font-semibold">
                Hello, {user.firstName || user.emailAddresses[0]?.emailAddress}!
              </p>
              <p className="text-sm text-gray-600 mb-4">
                You are successfully authenticated and your user data has been saved to Supabase.
              </p>
              <button 
                onClick={() => window.location.href = '/dashboard'}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 ease-in-out transform hover:scale-105"
              >
                Go to Dashboard
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-600 mb-4">
                Sign in or sign up to get started with your personalized dashboard.
              </p>
              <div className="flex flex-col gap-3">
                <AuthButton />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
