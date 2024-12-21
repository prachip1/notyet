import { useState,useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Home from './Home'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
function App() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    // Check if user exists in localStorage
    const savedUser = localStorage.getItem('anxietyCompanionUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleUserSetup = (userData) => {
    setUser(userData);
    localStorage.setItem('anxietyCompanionUser', JSON.stringify(userData));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {!user ? (
        <Welcome onComplete={handleUserSetup} />
      ) : (
        <div className="p-4">
          {/* Your conversation component will go here */}
          <Conversation user={user} />
        </div>
      )}
    </div>
  );
};

export default App
