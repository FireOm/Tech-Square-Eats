'use client';

import { useEffect, useState } from 'react';

interface FoodTruck {
  id: string;
  x: number;
  y: number;
  speed: number;
  direction: 'left' | 'right';
  type: 'taco' | 'burger' | 'pizza' | 'ice-cream' | 'coffee';
  color: string;
}

export default function FoodTruckBackground() {
  const [trucks, setTrucks] = useState<FoodTruck[]>([]);

  useEffect(() => {
    // Initialize food trucks
    const initialTrucks: FoodTruck[] = [
      {
        id: '1',
        x: -100,
        y: 20,
        speed: 0.5,
        direction: 'right',
        type: 'taco',
        color: 'bg-orange-500'
      },
      {
        id: '2',
        x: 110,
        y: 40,
        speed: 0.3,
        direction: 'left',
        type: 'burger',
        color: 'bg-red-500'
      },
      {
        id: '3',
        x: -80,
        y: 60,
        speed: 0.4,
        direction: 'right',
        type: 'pizza',
        color: 'bg-yellow-500'
      },
      {
        id: '4',
        x: 120,
        y: 80,
        speed: 0.6,
        direction: 'left',
        type: 'ice-cream',
        color: 'bg-pink-500'
      },
      {
        id: '5',
        x: -60,
        y: 10,
        speed: 0.7,
        direction: 'right',
        type: 'coffee',
        color: 'bg-amber-600'
      }
    ];

    setTrucks(initialTrucks);

    // Animation loop
    const animate = () => {
      setTrucks(prevTrucks => 
        prevTrucks.map(truck => {
          let newX = truck.x + (truck.direction === 'right' ? truck.speed : -truck.speed);
          
          // Reset position when truck goes off screen
          if (truck.direction === 'right' && newX > 120) {
            newX = -100;
          } else if (truck.direction === 'left' && newX < -100) {
            newX = 120;
          }

          return { ...truck, x: newX };
        })
      );
    };

    const interval = setInterval(animate, 50);
    return () => clearInterval(interval);
  }, []);

  const getTruckIcon = (type: string) => {
    switch (type) {
      case 'taco':
        return '🌮';
      case 'burger':
        return '🍔';
      case 'pizza':
        return '🍕';
      case 'ice-cream':
        return '🍦';
      case 'coffee':
        return '☕';
      default:
        return '🚚';
    }
  };

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Atlanta Skyline Silhouette */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-800 to-transparent opacity-20">
        <div className="flex items-end h-full">
          {/* Building silhouettes */}
          <div className="w-8 h-24 bg-gray-700 ml-4"></div>
          <div className="w-6 h-20 bg-gray-700 ml-2"></div>
          <div className="w-10 h-28 bg-gray-700 ml-2"></div>
          <div className="w-7 h-22 bg-gray-700 ml-2"></div>
          <div className="w-12 h-32 bg-gray-700 ml-2"></div>
          <div className="w-8 h-26 bg-gray-700 ml-2"></div>
          <div className="w-6 h-18 bg-gray-700 ml-2"></div>
          <div className="w-9 h-30 bg-gray-700 ml-2"></div>
          <div className="w-5 h-16 bg-gray-700 ml-2"></div>
          <div className="w-11 h-34 bg-gray-700 ml-2"></div>
        </div>
      </div>

      {/* Animated Food Trucks */}
      {trucks.map((truck) => (
        <div
          key={truck.id}
          className="absolute transition-all duration-75 ease-linear"
          style={{
            left: `${truck.x}%`,
            top: `${truck.y}%`,
            transform: truck.direction === 'left' ? 'scaleX(-1)' : 'scaleX(1)'
          }}
        >
          <div className={`${truck.color} w-16 h-8 rounded-lg shadow-lg flex items-center justify-center text-white font-bold text-lg relative`}>
            <span className="text-2xl">{getTruckIcon(truck.type)}</span>
            
            {/* Truck wheels */}
            <div className="absolute -bottom-1 left-1 w-2 h-2 bg-gray-600 rounded-full"></div>
            <div className="absolute -bottom-1 right-1 w-2 h-2 bg-gray-600 rounded-full"></div>
            
            {/* Movement trail effect */}
            <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-4 h-1 bg-gray-400 opacity-30 rounded-full"></div>
          </div>
        </div>
      ))}

      {/* Floating Food Particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="absolute text-2xl opacity-20 animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          >
            {['🍎', '🥕', '🥬', '🍅', '🥒', '🌶️', '🧄', '🧅'][Math.floor(Math.random() * 8)]}
          </div>
        ))}
      </div>

      {/* Atlanta-themed floating elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 text-4xl opacity-10 animate-pulse">🏛️</div>
        <div className="absolute top-20 right-20 text-3xl opacity-10 animate-pulse">🌳</div>
        <div className="absolute bottom-20 left-20 text-3xl opacity-10 animate-pulse">🏢</div>
        <div className="absolute bottom-10 right-10 text-4xl opacity-10 animate-pulse">🎵</div>
      </div>
    </div>
  );
}
