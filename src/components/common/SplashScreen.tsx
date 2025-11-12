import { useEffect, useState } from 'react';

export default function SplashScreen() {
  const [dots, setDots] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev + 1) % 4);
    }, 300);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center">
      <div className="mb-8 animate-bounce">
        <div className="relative w-32 h-32">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path
              d="M20 50 L20 80 L50 80 L50 50 L35 35 L35 20 L65 20 L65 35 L80 50 L80 80 L50 80"
              fill="#FF6B9D"
              stroke="#FF6B9D"
              strokeWidth="4"
              strokeLinejoin="round"
            />
            <path
              d="M50 20 L70 10 L75 25 L65 30 Z"
              fill="#4ADE80"
            />
            <circle cx="42" cy="45" r="3" fill="white" />
            <circle cx="42" cy="60" r="3" fill="white" />
          </svg>
        </div>
      </div>

      <h1 className="text-3xl font-bold mb-2">FlavorFusion</h1>
      <p className="text-gray-500 mb-8">Your Culinary Companion</p>

      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full transition-all ${
              i <= dots ? 'bg-red-400 scale-100' : 'bg-gray-200 scale-75'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
