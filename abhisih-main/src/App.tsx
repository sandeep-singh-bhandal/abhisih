import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { useEffect, useState } from "react";
import api from "./lib/axios";
import LoginForm from "./components/LoginForm";


const App = () => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await api.post("/auth/is-auth")
      setUser(data.user)
    }
    checkAuth()
  }, [])


  return (
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={user ? <Index setUser={setUser} /> : <Navigate to={"/login"} />} />
          <Route
            path="/login"
            element={!user ? <LoginForm setUser={setUser} /> : <Navigate to={"/"} />}
          />
          { }
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  )
};

export default App;
