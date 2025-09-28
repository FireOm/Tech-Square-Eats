'use client';

import { useEffect, useState } from 'react';
import { 
  FaPizzaSlice, 
  FaIceCream, 
  FaCoffee, 
  FaUtensils
} from 'react-icons/fa';
import { 
  GiTacos, 
  GiHamburger
} from 'react-icons/gi';

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
        speed: 0.2,
        direction: 'right',
        type: 'taco',
        color: 'bg-[#FF3131]'
      },
      {
        id: '2',
        x: 110,
        y: 40,
        speed: 0.2,
        direction: 'left',
        type: 'burger',
        color: 'bg-[#CC2828]'
      },
      {
        id: '3',
        x: -80,
        y: 60,
        speed: 0.2,
        direction: 'right',
        type: 'pizza',
        color: 'bg-[#FF3131]'
      },
      {
        id: '4',
        x: 120,
        y: 80,
        speed: 0.2,
        direction: 'left',
        type: 'ice-cream',
        color: 'bg-[#CC2828]'
      },
      {
        id: '5',
        x: -60,
        y: 10,
        speed: 0.2,
        direction: 'right',
        type: 'coffee',
        color: 'bg-[#B22222]'
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
        return <GiTacos className="text-2xl" />;
      case 'burger':
        return <GiHamburger className="text-2xl" />;
      case 'pizza':
        return <FaPizzaSlice className="text-2xl" />;
      case 'ice-cream':
        return <FaIceCream className="text-2xl" />;
      case 'coffee':
        return <FaCoffee className="text-2xl" />;
      default:
        return <FaUtensils className="text-2xl" />;
    }
  };

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">

      {/* Animated Food Trucks */}
      {trucks.map((truck) => (
        <div
          key={truck.id}
          className="absolute"
          style={{
            left: `${truck.x}%`,
            top: `${truck.y}%`,
            transform: truck.direction === 'left' ? 'scaleX(-1)' : 'scaleX(1)'
          }}
        >
           <div className={`${truck.color} w-16 h-8 rounded-lg shadow-lg flex items-center justify-center text-white font-bold text-lg relative`}>
             {getTruckIcon(truck.type)}
            
            {/* Truck wheels */}
            <div className="absolute -bottom-1 left-1 w-2 h-2 bg-gray-600 rounded-full"></div>
            <div className="absolute -bottom-1 right-1 w-2 h-2 bg-gray-600 rounded-full"></div>
            
            {/* Movement trail effect */}
            <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-4 h-1 bg-gray-400 opacity-30 rounded-full"></div>
          </div>
        </div>
      ))}



    </div>
  );
}
