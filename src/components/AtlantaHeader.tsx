'use client';

import { useState, useEffect } from 'react';

export default function AtlantaHeader() {
  const [currentGreeting, setCurrentGreeting] = useState(0);
  
  const greetings = [
    "Welcome to the ATL! 🍑",
    "Hey y'all! Let's eat! 🤠",
    "Atlanta's finest dining 🏆",
    "Southern hospitality awaits 🏡",
    "Tech Square's got the goods! 🎓"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentGreeting(prev => (prev + 1) % greetings.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [greetings.length]);

  return (
    <div className="relative text-center mb-12">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
        <div className="absolute top-4 right-1/3 w-1 h-1 bg-orange-400 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-8 left-1/2 w-1.5 h-1.5 bg-red-400 rounded-full animate-ping" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center mb-4 sm:mb-6 relative z-10">
        {/* Georgia Tech Logo */}
        <div className="bg-gradient-to-r from-gold-500 to-yellow-500 p-3 rounded-full mb-4 sm:mb-0 sm:mr-4 shadow-lg">
          <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
        </div>
        
        {/* Main Title */}
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gold-600 via-orange-600 to-red-600 bg-clip-text text-transparent animate-pulse">
            Tech Square Eats
          </h1>
          <div className="text-lg sm:text-xl text-gray-600 mb-2 animate-fade-in">
            {greetings[currentGreeting]}
          </div>
          <p className="text-sm text-gray-500 flex items-center justify-center">
            <span className="mr-2">🍑</span>
            Georgia Tech&apos;s dining hub with Atlanta soul
            <span className="ml-2">🎵</span>
          </p>
        </div>
      </div>

      {/* Atlanta-themed decorative elements */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold-400 to-transparent opacity-50"></div>
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-orange-400 to-transparent opacity-50"></div>
      
      {/* Floating Atlanta icons */}
      <div className="absolute top-2 left-8 text-2xl opacity-20 animate-bounce">🏛️</div>
      <div className="absolute top-4 right-12 text-xl opacity-20 animate-bounce" style={{animationDelay: '1s'}}>🌳</div>
      <div className="absolute bottom-2 left-12 text-xl opacity-20 animate-bounce" style={{animationDelay: '2s'}}>🎵</div>
      <div className="absolute bottom-4 right-8 text-2xl opacity-20 animate-bounce" style={{animationDelay: '0.5s'}}>🍑</div>
    </div>
  );
}
