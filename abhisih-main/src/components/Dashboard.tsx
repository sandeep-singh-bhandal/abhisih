import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface DashboardProps {
  username: string;
  onStartQuiz: () => void;
  onStartPictureGame: () => void;
  onLogout: () => void;
  userStats: {
    points: number;
    badges: string[];
    level: number;
    quizzesCompleted: number;
  };
}

const Dashboard = ({ username, onStartQuiz, onStartPictureGame, onLogout, userStats }: DashboardProps) => {
  const nextLevelPoints = (userStats.level + 1) * 100;
  const progressToNextLevel = (userStats.points % 100);

  return (
    <div className="min-h-screen gradient-nature p-4">
      {/* Header */}
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 gradient-forest rounded-full flex items-center justify-center text-xl glow-primary">
              🌱
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Environment Game</h1>
              <p className="text-white/80">Welcome back, {username}!</p>
            </div>
          </div>
          <Button 
            onClick={onLogout}
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            Logout
          </Button>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-nature animate-grow">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="text-2xl">⭐</span>
                Level {userStats.level}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{progressToNextLevel}/100 XP</span>
                </div>
                <Progress value={progressToNextLevel} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-nature animate-grow" style={{ animationDelay: '0.1s' }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="text-2xl">💎</span>
                {userStats.points} Points
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Keep playing to earn more rewards!
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-nature animate-grow" style={{ animationDelay: '0.2s' }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="text-2xl">🏆</span>
                {userStats.badges.length} Badges
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1">
                {userStats.badges.map((badge, index) => (
                  <Badge key={index} className="gradient-reward text-gold-foreground glow-reward">
                    {badge}
                  </Badge>
                ))}
                {userStats.badges.length === 0 && (
                  <p className="text-muted-foreground text-sm">Play games to earn badges!</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Games Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="shadow-nature hover:shadow-lg transition-shadow cursor-pointer animate-grow" style={{ animationDelay: '0.3s' }}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 gradient-forest rounded-lg flex items-center justify-center text-2xl">
                    🧠
                  </div>
                  <div>
                    <CardTitle>Environment Quiz</CardTitle>
                    <CardDescription>Test your environmental knowledge</CardDescription>
                  </div>
                </div>
                <Badge variant="outline" className="border-primary text-primary">
                  +20 XP
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Answer questions about climate change, recycling, and environmental protection.
              </p>
              <Button 
                onClick={onStartQuiz}
                className="w-full gradient-forest hover:opacity-90 transition-opacity glow-primary"
              >
                Start Quiz 🌍
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-nature hover:shadow-lg transition-shadow cursor-pointer animate-grow" style={{ animationDelay: '0.4s' }}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 gradient-earth-sky rounded-lg flex items-center justify-center text-2xl">
                    📸
                  </div>
                  <div>
                    <CardTitle>Picture Selection</CardTitle>
                    <CardDescription>Choose the eco-friendly option</CardDescription>
                  </div>
                </div>
                <Badge variant="outline" className="border-accent text-accent-foreground">
                  +15 XP
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Identify sustainable practices and environmental solutions through images.
              </p>
              <Button 
                onClick={onStartPictureGame}
                className="w-full gradient-earth-sky hover:opacity-90 transition-opacity"
              >
                Start Game 📷
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="shadow-nature animate-grow" style={{ animationDelay: '0.5s' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-xl">📊</span>
              Your Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">{userStats.quizzesCompleted}</div>
                <div className="text-sm text-muted-foreground">Quizzes Completed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">{userStats.level}</div>
                <div className="text-sm text-muted-foreground">Current Level</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">{userStats.points}</div>
                <div className="text-sm text-muted-foreground">Total Points</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">{userStats.badges.length}</div>
                <div className="text-sm text-muted-foreground">Badges Earned</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Floating Animation Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 text-2xl animate-float opacity-30">🌿</div>
        <div className="absolute top-40 right-20 text-xl animate-float opacity-30" style={{ animationDelay: '1s' }}>🍃</div>
        <div className="absolute bottom-40 left-20 text-lg animate-float opacity-30" style={{ animationDelay: '2s' }}>🌱</div>
        <div className="absolute bottom-20 right-10 text-2xl animate-float opacity-30" style={{ animationDelay: '0.5s' }}>🌍</div>
      </div>
    </div>
  );
};

export default Dashboard;