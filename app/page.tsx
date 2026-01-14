import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-black to-zinc-900" />
      
      {/* Minimal grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
          backgroundSize: '100px 100px'
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-4">
        {/* Logo/Name */}
        <h1 className="text-7xl sm:text-8xl lg:text-9xl font-bold text-white tracking-tighter mb-4">
          Forge
        </h1>
        
        {/* Tagline */}
        <p className="text-zinc-500 text-lg sm:text-xl mb-12 max-w-md mx-auto">
          Find your perfect hackathon team through personality matching
        </p>

        {/* Get Started Button */}
        <Link
          href="/register"
          className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-medium rounded-full hover:bg-zinc-200 transition-all hover:scale-105 active:scale-95"
        >
          Get Started
          <svg 
            className="w-4 h-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M17 8l4 4m0 0l-4 4m4-4H3" 
            />
          </svg>
        </Link>
      </div>

      {/* Bottom text */}
      <div className="absolute bottom-8 text-zinc-600 text-sm">
        Match • Connect • Build
      </div>
    </main>
  );
}
