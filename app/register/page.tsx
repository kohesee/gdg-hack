'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    twitter_handle: '',
    linkedin_url: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Store in sessionStorage to pass to test page
    sessionStorage.setItem('forge_user_data', JSON.stringify(formData));
    
    router.push('/test');
  };

  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-black to-zinc-900" />
      
      {/* Back button */}
      <Link 
        href="/"
        className="absolute top-8 left-8 text-zinc-500 hover:text-white transition flex items-center gap-2 z-10"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </Link>

      {/* Form Container */}
      <div className="relative z-10 w-full max-w-md px-6">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-2">Join Forge</h1>
          <p className="text-zinc-500">Tell us a bit about yourself</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm text-zinc-400 mb-2">
              Your Name
            </label>
            <input
              id="name"
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition"
              placeholder="John Doe"
            />
          </div>

          {/* Twitter Handle */}
          <div>
            <label htmlFor="twitter" className="block text-sm text-zinc-400 mb-2">
              Twitter / X Handle
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600">@</span>
              <input
                id="twitter"
                type="text"
                required
                value={formData.twitter_handle}
                onChange={(e) => setFormData({ ...formData, twitter_handle: e.target.value.replace('@', '') })}
                className="w-full pl-8 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition"
                placeholder="username"
              />
            </div>
          </div>

          {/* LinkedIn URL */}
          <div>
            <label htmlFor="linkedin" className="block text-sm text-zinc-400 mb-2">
              LinkedIn Profile URL
            </label>
            <input
              id="linkedin"
              type="url"
              required
              value={formData.linkedin_url}
              onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition"
              placeholder="https://linkedin.com/in/username"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-white text-black font-medium rounded-lg hover:bg-zinc-200 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-8"
          >
            {isLoading ? 'Loading...' : 'Continue to Personality Test'}
          </button>
        </form>

        <p className="text-center text-zinc-600 text-sm mt-8">
          Your information helps us find the perfect teammates for you
        </p>
      </div>
    </main>
  );
}
