'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { personalityQuestions, calculatePersonality, personalityDescriptions } from '@/lib/questions';
import { createUser, PersonalityType } from '@/lib/supabase';

export default function TestPage() {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<PersonalityType[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [result, setResult] = useState<{ type: PersonalityType; score: number } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userData, setUserData] = useState<{ name: string; twitter_handle: string; linkedin_url: string } | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('forge_user_data');
    if (!stored) {
      router.push('/register');
      return;
    }
    setUserData(JSON.parse(stored));
  }, [router]);

  const handleAnswer = (personality: PersonalityType) => {
    const newAnswers = [...answers, personality];
    setAnswers(newAnswers);

    if (currentQuestion < personalityQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Test complete
      const personalityResult = calculatePersonality(newAnswers);
      setResult(personalityResult);
      setIsComplete(true);
    }
  };

  const handleSaveAndContinue = async () => {
    if (!result || !userData) return;

    setIsSubmitting(true);

    const user = await createUser({
      name: userData.name,
      twitter_handle: userData.twitter_handle,
      linkedin_url: userData.linkedin_url,
      personality_type: result.type,
      personality_score: result.score
    });

    if (user) {
      sessionStorage.setItem('forge_current_user', JSON.stringify(user));
      sessionStorage.removeItem('forge_user_data');
      router.push('/dashboard');
    } else {
      // Still redirect but without saved user
      sessionStorage.setItem('forge_current_user', JSON.stringify({
        name: userData.name,
        twitter_handle: userData.twitter_handle,
        linkedin_url: userData.linkedin_url,
        personality_type: result.type,
        personality_score: result.score
      }));
      router.push('/dashboard');
    }
  };

  if (!userData) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </main>
    );
  }

  const question = personalityQuestions[currentQuestion];
  const progress = ((currentQuestion + (isComplete ? 1 : 0)) / personalityQuestions.length) * 100;

  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-black to-zinc-900" />

      {/* Back button */}
      <Link
        href="/register"
        className="absolute top-8 left-8 text-zinc-500 hover:text-white transition flex items-center gap-2 z-10"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </Link>

      {/* Progress Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-zinc-900">
        <div
          className="h-full bg-white transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="relative z-10 w-full max-w-2xl px-6">
        {!isComplete ? (
          <>
            {/* Question Counter */}
            <div className="text-center mb-8">
              <span className="text-zinc-500 text-sm">
                Question {currentQuestion + 1} of {personalityQuestions.length}
              </span>
            </div>

            {/* Question */}
            <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-10">
              {question.question}
            </h2>

            {/* Options */}
            <div className="space-y-3">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option.personality)}
                  className="w-full p-4 bg-zinc-900 border border-zinc-800 rounded-lg text-left text-white hover:border-zinc-600 hover:bg-zinc-800 transition-all active:scale-[0.99]"
                >
                  {option.text}
                </button>
              ))}
            </div>
          </>
        ) : (
          /* Results */
          <div className="text-center">
            <div className="mb-6">
              <span className="text-zinc-500 text-sm uppercase tracking-wider">Your Personality Type</span>
            </div>
            
            <h2 className="text-4xl sm:text-5xl font-bold text-white capitalize mb-4">
              {result?.type}
            </h2>
            
            <p className="text-zinc-400 mb-8 max-w-md mx-auto">
              {result && personalityDescriptions[result.type]}
            </p>

            <div className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 rounded-full text-zinc-400 mb-10">
              <span>Confidence Score:</span>
              <span className="text-white font-medium">{result?.score}%</span>
            </div>

            <div>
              <button
                onClick={handleSaveAndContinue}
                disabled={isSubmitting}
                className="px-8 py-4 bg-white text-black font-medium rounded-full hover:bg-zinc-200 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? 'Finding Matches...' : 'Find Your Team'}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
