import { useEffect, useState } from "react";

interface LoadingScreenProps {
  onComplete: () => void;
}

const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    setTimeout(() => setShowText(true), 800);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 gradient-nature flex items-center justify-center z-50">
      <div className="text-center space-y-8">
        {/* Animated Logo/Icon */}
        <div className="relative">
          <div className="w-24 h-24 mx-auto gradient-forest rounded-full animate-bounce-gentle shadow-nature">
            <div className="absolute inset-2 bg-primary/20 rounded-full animate-pulse">
              <div className="absolute inset-2 bg-primary/40 rounded-full animate-ping">
                <div className="flex items-center justify-center h-full text-primary-foreground text-2xl font-bold">
                  🌱
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Game Title */}
        {showText && (
          <div className="animate-grow">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-2 tracking-wider">
              ENVIRONMENT
            </h1>
            <h2 className="text-3xl md:text-4xl font-semibold text-white/90 tracking-wide">
              GAME
            </h2>
          </div>
        )}

        {/* Loading Bar */}
        <div className="w-64 mx-auto">
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full gradient-reward transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-white/80 text-sm mt-2 font-medium">
            Loading... {progress}%
          </p>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 text-2xl animate-float">🍃</div>
          <div className="absolute top-1/3 right-1/4 text-xl animate-float" style={{ animationDelay: '1s' }}>🌿</div>
          <div className="absolute bottom-1/3 left-1/3 text-lg animate-float" style={{ animationDelay: '2s' }}>🌍</div>
          <div className="absolute bottom-1/4 right-1/3 text-xl animate-float" style={{ animationDelay: '0.5s' }}>💚</div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;