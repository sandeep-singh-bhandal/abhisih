import { useState, useEffect } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import LoginForm from "@/components/LoginForm";
import Dashboard from "@/components/Dashboard";
import QuizGame from "@/components/QuizGame";
import PictureGame from "@/components/PictureGame";

type GameState = 'loading' | 'login' | 'dashboard' | 'quiz' | 'picture';

interface UserStats {
  points: number;
  badges: string[];
  level: number;
  quizzesCompleted: number;
}

const Index = () => {
  const [gameState, setGameState] = useState<GameState>('loading');
  const [username, setUsername] = useState<string>('');
  const [userStats, setUserStats] = useState<UserStats>({
    points: 0,
    badges: [],
    level: 1,
    quizzesCompleted: 0
  });

  const handleLoadingComplete = () => {
    setGameState('login');
  };

  const handleLogin = (user: string) => {
    setUsername(user);
    setGameState('dashboard');
  };

  const handleLogout = () => {
    setUsername('');
    setUserStats({ points: 0, badges: [], level: 1, quizzesCompleted: 0 });
    setGameState('login');
  };

  const handleQuizComplete = (points: number, badges: string[]) => {
    setUserStats(prev => ({
      ...prev,
      points: prev.points + points,
      badges: [...new Set([...prev.badges, ...badges])],
      level: Math.floor((prev.points + points) / 100) + 1,
      quizzesCompleted: prev.quizzesCompleted + 1
    }));
    setGameState('dashboard');
  };

  const handlePictureGameComplete = (points: number, badges: string[]) => {
    setUserStats(prev => ({
      ...prev,
      points: prev.points + points,
      badges: [...new Set([...prev.badges, ...badges])],
      level: Math.floor((prev.points + points) / 100) + 1
    }));
    setGameState('dashboard');
  };

  if (gameState === 'loading') {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  if (gameState === 'login') {
    return <LoginForm onLogin={handleLogin} />;
  }

  if (gameState === 'quiz') {
    return (
      <QuizGame 
        onComplete={handleQuizComplete}
        onBack={() => setGameState('dashboard')}
      />
    );
  }

  if (gameState === 'picture') {
    return (
      <PictureGame 
        onComplete={handlePictureGameComplete}
        onBack={() => setGameState('dashboard')}
      />
    );
  }

  return (
    <Dashboard
      username={username}
      onStartQuiz={() => setGameState('quiz')}
      onStartPictureGame={() => setGameState('picture')}
      onLogout={handleLogout}
      userStats={userStats}
    />
  );
};

export default Index;
