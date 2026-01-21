import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import axios from "axios"
import { useNavigate } from "react-router-dom";

axios.defaults.withCredentials = true;

const LoginForm = ({ setUser }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`http://localhost:5000/api/auth/${isLogin ? "signin" : "signup"}`, {
        username,
        password
      })
      navigate("/")
      setUser(data.user)
    } catch (error) {
      console.log(error);

    }
  };

  return (
    <div className="min-h-screen gradient-nature flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 text-3xl animate-float">🌳</div>
        <div className="absolute top-20 right-20 text-2xl animate-float" style={{ animationDelay: '1s' }}>🦋</div>
        <div className="absolute bottom-20 left-20 text-2xl animate-float" style={{ animationDelay: '2s' }}>🌸</div>
        <div className="absolute bottom-10 right-10 text-3xl animate-float" style={{ animationDelay: '0.5s' }}>🌿</div>
      </div>

      <Card className="w-full max-w-md shadow-nature animate-grow">
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto gradient-forest rounded-full flex items-center justify-center text-2xl mb-4 glow-primary">
            🌱
          </div>
          <CardTitle className="text-2xl font-bold text-primary">
            {isLogin ? "Welcome Back!" : "Join the Mission!"}
          </CardTitle>
          <CardDescription>
            {isLogin
              ? "Sign in to continue your environmental journey"
              : "Create an account to start saving the planet"
            }
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="border-primary/20 focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-primary/20 focus:border-primary"
              />
            </div>

            <Button
              type="submit"
              className="w-full gradient-forest hover:opacity-90 transition-opacity glow-primary"
            >
              {isLogin ? "Sign In" : "Create Account"}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary hover:underline text-sm"
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"
              }
            </button>
          </div>

        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;