import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface PictureQuestion {
  id: number;
  question: string;
  description: string;
  options: {
    emoji: string;
    label: string;
    description: string;
    isCorrect: boolean;
  }[];
  explanation: string;
}

interface PictureGameProps {
  onComplete: (score: number, earnedBadges: string[]) => void;
  onBack: () => void;
}

const pictureQuestions: PictureQuestion[] = [
  {
    id: 1,
    question: "Which transportation method is most eco-friendly for short distances?",
    description: "Choose the best option for reducing carbon emissions on trips under 5 miles.",
    options: [
      { emoji: "🚗", label: "Car", description: "Gasoline vehicle", isCorrect: false },
      { emoji: "🚲", label: "Bicycle", description: "Human-powered transport", isCorrect: true },
      { emoji: "🏍️", label: "Motorcycle", description: "Motor vehicle", isCorrect: false },
      { emoji: "🚌", label: "Bus", description: "Public transport", isCorrect: false }
    ],
    explanation: "Bicycles produce zero emissions and are perfect for short-distance travel while providing health benefits."
  },
  {
    id: 2,
    question: "Which energy source is the most sustainable?",
    description: "Select the renewable energy option that has the least environmental impact.",
    options: [
      { emoji: "☀️", label: "Solar", description: "Photovoltaic panels", isCorrect: true },
      { emoji: "⛽", label: "Gas", description: "Natural gas", isCorrect: false },
      { emoji: "⚡", label: "Nuclear", description: "Atomic energy", isCorrect: false },
      { emoji: "🔥", label: "Coal", description: "Fossil fuel", isCorrect: false }
    ],
    explanation: "Solar energy is completely renewable, produces no emissions during operation, and has minimal environmental impact."
  },
  {
    id: 3,
    question: "What's the most effective way to reduce waste?",
    description: "Choose the approach that has the greatest positive environmental impact.",
    options: [
      { emoji: "♻️", label: "Recycle", description: "Process materials again", isCorrect: false },
      { emoji: "🚫", label: "Refuse", description: "Don't use unnecessary items", isCorrect: true },
      { emoji: "🔄", label: "Reuse", description: "Use items multiple times", isCorrect: false },
      { emoji: "🗑️", label: "Dispose", description: "Throw away properly", isCorrect: false }
    ],
    explanation: "Refusing unnecessary items prevents waste from being created in the first place - the most effective approach!"
  },
  {
    id: 4,
    question: "Which shopping choice is most environmentally friendly?",
    description: "Select the option that minimizes packaging waste and carbon footprint.",
    options: [
      { emoji: "🛒", label: "Local Market", description: "Fresh, local produce", isCorrect: true },
      { emoji: "📦", label: "Online Shopping", description: "Delivered products", isCorrect: false },
      { emoji: "🏪", label: "Chain Store", description: "Large retail chain", isCorrect: false },
      { emoji: "🛍️", label: "Mall Shopping", description: "Shopping center", isCorrect: false }
    ],
    explanation: "Local markets typically offer fresh, unpackaged produce with minimal transportation emissions."
  }
];

const PictureGame = ({ onComplete, onBack }: PictureGameProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);

  const question = pictureQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / pictureQuestions.length) * 100;

  const handleOptionSelect = (optionIndex: number) => {
    setSelectedOption(optionIndex);
    setShowResult(true);
    
    if (question.options[optionIndex].isCorrect) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < pictureQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
      setShowResult(false);
    } else {
      // Game complete
      setGameComplete(true);
      const earnedBadges = [];
      if (score >= 3) earnedBadges.push("📸 Picture Perfect");
      if (score === 4) earnedBadges.push("🌟 Visual Expert");
      if (score >= 1) earnedBadges.push("👁️ Sharp Eye");
      
      setTimeout(() => {
        onComplete(score * 15, earnedBadges);
      }, 2000);
    }
  };

  if (gameComplete) {
    return (
      <div className="min-h-screen gradient-nature flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl shadow-nature animate-grow">
          <CardHeader className="text-center">
            <div className="w-20 h-20 mx-auto gradient-earth-sky rounded-full flex items-center justify-center text-3xl mb-4 glow-primary">
              📸
            </div>
            <CardTitle className="text-3xl font-bold text-primary">Picture Game Complete!</CardTitle>
            <CardDescription className="text-xl">
              You scored {score} out of {pictureQuestions.length}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="space-y-4">
              <div className="text-4xl font-bold gradient-earth-sky bg-clip-text text-transparent">
                +{score * 15} Points
              </div>
              <p className="text-muted-foreground">
                {score >= 3 ? "Amazing visual recognition! You're an eco-champion!" :
                 score >= 2 ? "Good eye for sustainable choices!" :
                 score >= 1 ? "Keep practicing your environmental awareness!" :
                 "Every choice matters! Keep learning about sustainability!"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-nature p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Button 
            onClick={onBack}
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            ← Back to Dashboard
          </Button>
          <Badge className="gradient-earth-sky text-white">
            Picture {currentQuestion + 1} of {pictureQuestions.length}
          </Badge>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white font-medium">Progress</span>
            <span className="text-white/80">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-3" />
        </div>

        {/* Game Card */}
        <Card className="shadow-nature animate-grow">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <span className="text-2xl">📷</span>
              {question.question}
            </CardTitle>
            <CardDescription className="text-base">
              {question.description}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {!showResult ? (
              <div className="grid grid-cols-2 gap-4">
                {question.options.map((option, index) => (
                  <Button
                    key={index}
                    onClick={() => handleOptionSelect(index)}
                    variant="outline"
                    className="h-32 flex flex-col items-center justify-center p-4 hover:bg-primary/10 hover:border-primary transition-all"
                  >
                    <div className="text-4xl mb-2">{option.emoji}</div>
                    <div className="font-semibold">{option.label}</div>
                    <div className="text-xs text-muted-foreground text-center mt-1">
                      {option.description}
                    </div>
                  </Button>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {question.options.map((option, index) => (
                    <div
                      key={index}
                      className={`h-32 flex flex-col items-center justify-center p-4 rounded-lg border-2 ${
                        option.isCorrect
                          ? 'border-primary bg-primary/10'
                          : index === selectedOption && !option.isCorrect
                          ? 'border-destructive bg-destructive/10'
                          : 'border-muted bg-muted/50'
                      }`}
                    >
                      <div className="text-4xl mb-2">{option.emoji}</div>
                      <div className={`font-semibold ${
                        option.isCorrect ? 'text-primary' : 
                        index === selectedOption && !option.isCorrect ? 'text-destructive' : ''
                      }`}>
                        {option.label}
                        {option.isCorrect && <span className="ml-2">✓</span>}
                        {index === selectedOption && !option.isCorrect && <span className="ml-2">✗</span>}
                      </div>
                      <div className="text-xs text-muted-foreground text-center mt-1">
                        {option.description}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="bg-accent/50 p-4 rounded-lg">
                  <h4 className="font-semibold text-accent-foreground mb-2 flex items-center gap-2">
                    💡 Why this matters:
                  </h4>
                  <p className="text-accent-foreground">{question.explanation}</p>
                </div>
                
                <Button 
                  onClick={nextQuestion}
                  className="w-full gradient-earth-sky hover:opacity-90 transition-opacity"
                >
                  {currentQuestion < pictureQuestions.length - 1 ? 'Next Picture →' : 'Complete Game 🏆'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PictureGame;