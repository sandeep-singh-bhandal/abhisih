import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface QuizGameProps {
  onComplete: (score: number, earnedBadges: string[]) => void;
  onBack: () => void;
}

const questions: Question[] = [
  {
    id: 1,
    question: "What percentage of plastic waste is actually recycled globally?",
    options: ["9%", "25%", "45%", "60%"],
    correctAnswer: 0,
    explanation: "Only about 9% of plastic waste is recycled globally. Most plastic ends up in landfills or the environment.",
    difficulty: 'medium'
  },
  {
    id: 2,
    question: "Which gas is the primary contributor to the greenhouse effect?",
    options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"],
    correctAnswer: 2,
    explanation: "Carbon dioxide (CO2) is the primary greenhouse gas responsible for climate change.",
    difficulty: 'easy'
  },
  {
    id: 3,
    question: "How long does it take for a plastic bottle to decompose naturally?",
    options: ["50 years", "100 years", "450 years", "1000 years"],
    correctAnswer: 2,
    explanation: "Plastic bottles take approximately 450 years to decompose completely in natural conditions.",
    difficulty: 'hard'
  },
  {
    id: 4,
    question: "What is the most effective way to reduce your carbon footprint?",
    options: ["Recycling more", "Using renewable energy", "Eating less meat", "Walking instead of driving"],
    correctAnswer: 1,
    explanation: "Using renewable energy sources has the greatest impact on reducing individual carbon footprints.",
    difficulty: 'medium'
  },
  {
    id: 5,
    question: "Which of these activities saves the most water?",
    options: ["Taking shorter showers", "Fixing leaky faucets", "Using efficient appliances", "Collecting rainwater"],
    correctAnswer: 1,
    explanation: "A single dripping faucet can waste over 3,000 gallons per year, making repairs highly effective.",
    difficulty: 'easy'
  }
];

const QuizGame = ({ onComplete, onBack }: QuizGameProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameComplete, setGameComplete] = useState(false);

  useEffect(() => {
    if (timeLeft > 0 && !showExplanation) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showExplanation) {
      handleAnswer(-1); // Time's up, incorrect answer
    }
  }, [timeLeft, showExplanation]);

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowExplanation(true);
    
    if (answerIndex === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setTimeLeft(30);
    } else {
      // Game complete
      setGameComplete(true);
      const earnedBadges = [];
      if (score >= 3) earnedBadges.push("🌟 Quiz Master");
      if (score === 5) earnedBadges.push("🏆 Perfect Score");
      if (score >= 1) earnedBadges.push("🌱 Eco Learner");
      
      setTimeout(() => {
        onComplete(score * 20, earnedBadges);
      }, 2000);
    }
  };

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  if (gameComplete) {
    return (
      <div className="min-h-screen gradient-nature flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl shadow-nature animate-grow">
          <CardHeader className="text-center">
            <div className="w-20 h-20 mx-auto gradient-reward rounded-full flex items-center justify-center text-3xl mb-4 glow-reward">
              🏆
            </div>
            <CardTitle className="text-3xl font-bold text-primary">Quiz Complete!</CardTitle>
            <CardDescription className="text-xl">
              You scored {score} out of {questions.length}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="space-y-4">
              <div className="text-4xl font-bold gradient-reward bg-clip-text text-transparent">
                +{score * 20} Points
              </div>
              <p className="text-muted-foreground">
                {score >= 4 ? "Excellent work! You're an eco champion!" :
                 score >= 3 ? "Great job! You know your environmental facts!" :
                 score >= 2 ? "Good effort! Keep learning about the environment!" :
                 "Keep studying! Every bit of environmental knowledge helps!"}
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
          <Badge className="gradient-reward text-gold-foreground glow-reward">
            Question {currentQuestion + 1} of {questions.length}
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

        {/* Quiz Card */}
        <Card className="shadow-nature animate-grow">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant={question.difficulty === 'easy' ? 'outline' : 
                                question.difficulty === 'medium' ? 'secondary' : 'destructive'}>
                    {question.difficulty.toUpperCase()}
                  </Badge>
                  <div className="text-2xl">
                    {question.difficulty === 'easy' ? '🌱' :
                     question.difficulty === 'medium' ? '🌿' : '🌳'}
                  </div>
                </div>
                <CardTitle className="text-xl">{question.question}</CardTitle>
              </div>
              <div className="text-right">
                <div className={`text-2xl font-bold ${timeLeft <= 10 ? 'text-destructive' : 'text-primary'}`}>
                  {timeLeft}s
                </div>
                <div className="text-sm text-muted-foreground">Time left</div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            {!showExplanation ? (
              <div className="space-y-3">
                {question.options.map((option, index) => (
                  <Button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    variant="outline"
                    className="w-full text-left justify-start h-auto p-4 hover:bg-primary/10 hover:border-primary transition-all"
                  >
                    <span className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-3 text-primary font-semibold">
                      {String.fromCharCode(65 + index)}
                    </span>
                    {option}
                  </Button>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  {question.options.map((option, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border-2 ${
                        index === question.correctAnswer
                          ? 'border-primary bg-primary/10'
                          : index === selectedAnswer && index !== question.correctAnswer
                          ? 'border-destructive bg-destructive/10'
                          : 'border-muted bg-muted/50'
                      }`}
                    >
                      <div className="flex items-center">
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm font-semibold ${
                          index === question.correctAnswer
                            ? 'bg-primary text-primary-foreground'
                            : index === selectedAnswer && index !== question.correctAnswer
                            ? 'bg-destructive text-destructive-foreground'
                            : 'bg-muted-foreground/20 text-muted-foreground'
                        }`}>
                          {index === question.correctAnswer ? '✓' : 
                           index === selectedAnswer && index !== question.correctAnswer ? '✗' :
                           String.fromCharCode(65 + index)}
                        </span>
                        {option}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="bg-accent/50 p-4 rounded-lg">
                  <h4 className="font-semibold text-accent-foreground mb-2">💡 Explanation:</h4>
                  <p className="text-accent-foreground">{question.explanation}</p>
                </div>
                
                <Button 
                  onClick={nextQuestion}
                  className="w-full gradient-forest hover:opacity-90 transition-opacity glow-primary"
                >
                  {currentQuestion < questions.length - 1 ? 'Next Question →' : 'Complete Quiz 🏆'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuizGame;