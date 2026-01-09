'use client'

import { UserButton, useUser, SignInButton, SignUpButton } from '@clerk/nextjs'

export function AuthButton() {
  const { isSignedIn, user, isLoaded } = useUser()

  if (!isLoaded) {
    return <div>Loading...</div>
  }

  if (!isSignedIn) {
    return (
      <div className="flex gap-4">
        <SignInButton mode="modal">
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200">
            Sign In
          </button>
        </SignInButton>
        <SignUpButton mode="modal">
          <button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200">
            Sign Up
          </button>
        </SignUpButton>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-4">
      <span className="text-gray-700">Welcome, {user.firstName || user.emailAddresses[0]?.emailAddress}!</span>
      <UserButton afterSignOutUrl="/" />
    </div>
  )
}

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoaded } = useUser()

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    )
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="mb-4">Please sign in to access this page.</p>
          <AuthButton />
        </div>
      </div>
    )
  }

  return <>{children}</>
}