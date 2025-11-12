interface WelcomeScreenProps {
  onGetStarted: () => void;
  onSignIn: () => void;
}

export default function WelcomeScreen({ onGetStarted, onSignIn }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
      </div>

      <div className="relative min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full space-y-8">
          <div>
            <div className="mb-6 inline-block">
              <div className="w-20 h-20 mx-auto">
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
                </svg>
              </div>
            </div>

            <h1 className="text-4xl font-bold text-white mb-3">
              Welcome to<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-pink-400">
                FlavorFusion 👋
              </span>
            </h1>
            <p className="text-gray-300 text-lg">
              The best cooking and food recipes<br />app of the century.
            </p>
          </div>

          <div className="space-y-4 pt-8">
            <button
              onClick={onGetStarted}
              className="w-full py-4 bg-gradient-to-r from-red-400 to-pink-400 text-white rounded-full font-semibold text-lg hover:from-red-500 hover:to-pink-500 transition-all transform hover:scale-105 shadow-xl"
            >
              Get Started
            </button>

            <button
              onClick={onSignIn}
              className="w-full py-4 bg-white/10 backdrop-blur-md text-white rounded-full font-semibold text-lg hover:bg-white/20 transition-all border border-white/20"
            >
              I Already Have an Account
            </button>
          </div>

          <div className="pt-6">
            <div className="flex items-center gap-4 text-white/60 text-sm">
              <div className="flex-1 h-px bg-white/20" />
              <span>or continue with</span>
              <div className="flex-1 h-px bg-white/20" />
            </div>

            <div className="mt-4 flex justify-center gap-4">
              <button className="w-14 h-14 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg">
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
