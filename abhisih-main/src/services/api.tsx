const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiService {
  private getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  // Auth Methods
  async signup(username: string, email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Signup failed');
    }
    
    const data = await response.json();
    localStorage.setItem('authToken', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  }

  async signin(email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/auth/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }
    
    const data = await response.json();
    localStorage.setItem('authToken', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  }

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }

  isAuthenticated() {
    return !!localStorage.getItem('authToken');
  }

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  // Quiz Game Methods
  async saveQuizResult(quizData: {
    score: number;
    totalQuestions: number;
    difficulty: string;
    topic?: string;
    answers: Array<{
      questionId: string;
      question: string;
      userAnswer: string;
      correctAnswer: string;
      isCorrect: boolean;
    }>;
  }) {
    const response = await fetch(`${API_BASE_URL}/quiz/save`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(quizData)
    });
    
    if (!response.ok) throw new Error('Failed to save quiz results');
    return await response.json();
  }

  async getQuizHistory() {
    const response = await fetch(`${API_BASE_URL}/quiz/history`, {
      headers: this.getAuthHeaders()
    });
    
    if (!response.ok) throw new Error('Failed to fetch quiz history');
    return await response.json();
  }

  async getQuizStats() {
    const response = await fetch(`${API_BASE_URL}/quiz/stats`, {
      headers: this.getAuthHeaders()
    });
    
    if (!response.ok) throw new Error('Failed to fetch quiz stats');
    return await response.json();
  }

  // Picture Game Methods
  async savePictureGameResult(gameData: {
    score: number;
    level: number;
    imagesIdentified: Array<{
      imageId: string;
      imageName: string;
      category: string;
      isCorrect: boolean;
      timeSpent: number;
    }>;
    totalTime: number;
  }) {
    const response = await fetch(`${API_BASE_URL}/picture/save`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(gameData)
    });
    
    if (!response.ok) throw new Error('Failed to save picture game results');
    return await response.json();
  }

  async getPictureGameHistory() {
    const response = await fetch(`${API_BASE_URL}/picture/history`, {
      headers: this.getAuthHeaders()
    });
    
    if (!response.ok) throw new Error('Failed to fetch picture game history');
    return await response.json();
  }

  async getPictureGameStats() {
    const response = await fetch(`${API_BASE_URL}/picture/stats`, {
      headers: this.getAuthHeaders()
    });
    
    if (!response.ok) throw new Error('Failed to fetch picture game stats');
    return await response.json();
  }

  // User Profile Methods
  async getUserProfile() {
    const response = await fetch(`${API_BASE_URL}/user/profile`, {
      headers: this.getAuthHeaders()
    });
    
    if (!response.ok) throw new Error('Failed to fetch profile');
    return await response.json();
  }

  async getOverallStats() {
    const response = await fetch(`${API_BASE_URL}/user/overall-stats`, {
      headers: this.getAuthHeaders()
    });
    
    if (!response.ok) throw new Error('Failed to fetch overall stats');
    return await response.json();
  }
}

export const api = new ApiService();