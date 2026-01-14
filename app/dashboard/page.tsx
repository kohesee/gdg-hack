'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getMatchedUsers, User, PersonalityType } from '@/lib/supabase';
import { personalityDescriptions } from '@/lib/questions';

// Dummy users for each personality type (shown when no database matches)
const dummyUsers: User[] = [
  {
    id: 'dummy-1',
    name: 'Alex Chen',
    twitter_handle: 'alexchendev',
    linkedin_url: 'https://linkedin.com/in/alexchen',
    personality_type: 'leader',
    personality_score: 80
  },
  {
    id: 'dummy-2',
    name: 'Sarah Kim',
    twitter_handle: 'sarahkimux',
    linkedin_url: 'https://linkedin.com/in/sarahkim',
    personality_type: 'creative',
    personality_score: 90
  },
  {
    id: 'dummy-3',
    name: 'Marcus Johnson',
    twitter_handle: 'marcusjdata',
    linkedin_url: 'https://linkedin.com/in/marcusjohnson',
    personality_type: 'analytical',
    personality_score: 85
  },
  {
    id: 'dummy-4',
    name: 'Emily Rodriguez',
    twitter_handle: 'emilyrsocial',
    linkedin_url: 'https://linkedin.com/in/emilyrodriguez',
    personality_type: 'social',
    personality_score: 75
  },
  {
    id: 'dummy-5',
    name: 'David Park',
    twitter_handle: 'davidparkdev',
    linkedin_url: 'https://linkedin.com/in/davidpark',
    personality_type: 'practical',
    personality_score: 88
  },
  {
    id: 'dummy-6',
    name: 'Jessica Wang',
    twitter_handle: 'jessicawang',
    linkedin_url: 'https://linkedin.com/in/jessicawang',
    personality_type: 'leader',
    personality_score: 70
  },
  {
    id: 'dummy-7',
    name: 'Ryan Mitchell',
    twitter_handle: 'ryanmdesign',
    linkedin_url: 'https://linkedin.com/in/ryanmitchell',
    personality_type: 'creative',
    personality_score: 82
  },
  {
    id: 'dummy-8',
    name: 'Lisa Thompson',
    twitter_handle: 'lisatanalytics',
    linkedin_url: 'https://linkedin.com/in/lisathompson',
    personality_type: 'analytical',
    personality_score: 92
  },
  {
    id: 'dummy-9',
    name: 'Chris Anderson',
    twitter_handle: 'chrisacomm',
    linkedin_url: 'https://linkedin.com/in/chrisanderson',
    personality_type: 'social',
    personality_score: 78
  },
  {
    id: 'dummy-10',
    name: 'Amanda Lee',
    twitter_handle: 'amandaleedev',
    linkedin_url: 'https://linkedin.com/in/amandalee',
    personality_type: 'practical',
    personality_score: 86
  }
];

export default function DashboardPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [matchedUsers, setMatchedUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const stored = sessionStorage.getItem('forge_current_user');
      if (!stored) {
        router.push('/register');
        return;
      }

      const user = JSON.parse(stored) as User;
      setCurrentUser(user);

      // Fetch matched users from Supabase
      const dbMatches = await getMatchedUsers(user.personality_type, user.id);
      
      // If no DB matches, use dummy users with matching personality
      if (dbMatches.length === 0) {
        const dummyMatches = dummyUsers.filter(u => u.personality_type === user.personality_type);
        setMatchedUsers(dummyMatches);
      } else {
        setMatchedUsers(dbMatches);
      }

      setIsLoading(false);
    };

    fetchData();
  }, [router]);

  const handleLogout = () => {
    sessionStorage.removeItem('forge_current_user');
    sessionStorage.removeItem('forge_user_data');
    router.push('/');
  };

  if (isLoading || !currentUser) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Finding your matches...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-black to-zinc-900" />

      {/* Header */}
      <header className="relative z-10 border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-white">
            Forge
          </Link>
          <button
            onClick={handleLogout}
            className="text-zinc-500 hover:text-white transition text-sm"
          >
            Start Over
          </button>
        </div>
      </header>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        {/* User Profile Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Welcome, {currentUser.name}!
              </h1>
              <p className="text-zinc-500">
                {personalityDescriptions[currentUser.personality_type]}
              </p>
            </div>
            <div className="flex flex-col items-start sm:items-end gap-2">
              <span className="px-4 py-2 bg-white text-black font-medium rounded-full capitalize">
                {currentUser.personality_type}
              </span>
              <span className="text-zinc-500 text-sm">
                {currentUser.personality_score}% match confidence
              </span>
            </div>
          </div>
        </div>

        {/* Matched Users Section */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Your Matches</h2>
          <p className="text-zinc-500 mb-8">
            People with similar personalities who'd make great teammates
          </p>

          {matchedUsers.length === 0 ? (
            <div className="text-center py-12 text-zinc-500">
              No matches found yet. Check back later!
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {matchedUsers.map((user) => (
                <div
                  key={user.id}
                  className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition"
                >
                  {/* Avatar placeholder */}
                  <div className="w-12 h-12 bg-zinc-800 rounded-full mb-4 flex items-center justify-center text-white font-medium">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </div>

                  <h3 className="text-lg font-semibold text-white mb-1">
                    {user.name}
                  </h3>
                  
                  <p className="text-zinc-500 text-sm capitalize mb-4">
                    {user.personality_type} • {user.personality_score}% match
                  </p>

                  {/* Social Links */}
                  <div className="flex gap-3">
                    <a
                      href={`https://twitter.com/${user.twitter_handle}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm text-zinc-300 transition"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                      @{user.twitter_handle}
                    </a>
                    <a
                      href={user.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm text-zinc-300 transition"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                      LinkedIn
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
