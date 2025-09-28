'use client';

import { useEffect, useState } from 'react';
import { 
  FaUtensils, 
  FaPizzaSlice, 
  FaIceCream, 
  FaCoffee, 
  FaBuilding, 
  FaTree, 
  FaMusic
} from 'react-icons/fa';
import { 
  GiTacos, 
  GiHamburger, 
  GiCookingPot, 
  GiKnifeFork, 
  GiSpoon,
  GiShop
} from 'react-icons/gi';
import { MdRestaurant, MdLocationCity } from 'react-icons/md';

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
             {getTruckIcon(truck.type)}
            
            {/* Truck wheels */}
            <div className="absolute -bottom-1 left-1 w-2 h-2 bg-gray-600 rounded-full"></div>
            <div className="absolute -bottom-1 right-1 w-2 h-2 bg-gray-600 rounded-full"></div>
            
            {/* Movement trail effect */}
            <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-4 h-1 bg-gray-400 opacity-30 rounded-full"></div>
          </div>
        </div>
      ))}

       {/* Elegant Large Food Images - Strategic 4-Image Layout */}
       <div className="absolute inset-0">
         {[
           // Top Left - Gourmet Burger
           { 
             src: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=800&fit=crop&crop=center&q=90', 
             alt: 'Gourmet Burger',
             left: 5, top: 8, 
             size: 'w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96',
             dish: 'Gourmet Burger'
           },
           
           // Top Right - Authentic Ramen
           { 
             src: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&h=800&fit=crop&crop=center&q=90', 
             alt: 'Authentic Ramen Bowl',
             left: 70, top: 5, 
             size: 'w-44 h-44 sm:w-60 sm:h-60 md:w-72 md:h-72 lg:w-80 lg:h-80',
             dish: 'Authentic Ramen'
           },
           
           // Bottom Left - Italian Pasta
           { 
             src: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=800&h=800&fit=crop&crop=center&q=90', 
             alt: 'Fresh Pasta',
             left: 8, top: 60, 
             size: 'w-52 h-52 sm:w-68 sm:h-68 md:w-84 md:h-84 lg:w-96 lg:h-96',
             dish: 'Fresh Pasta'
           },
           
           // Bottom Right - Artisan Pizza
           { 
             src: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&h=800&fit=crop&crop=center&q=90', 
             alt: 'Artisan Pizza',
             left: 75, top: 65, 
             size: 'w-40 h-40 sm:w-56 sm:h-56 md:w-68 md:h-68 lg:w-76 lg:h-76',
             dish: 'Artisan Pizza'
           }
         ].map((item, i) => (
           <div
             key={i}
             className={`absolute ${item.size} opacity-8 hover:opacity-12 transition-all duration-1000 rounded-3xl overflow-hidden`}
             style={{
               left: `${item.left}%`,
               top: `${item.top}%`,
               filter: 'blur(0.5px)',
               mixBlendMode: 'soft-light'
             }}
             title={item.dish}
           >
             <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/10 rounded-3xl"></div>
             <img
               src={item.src}
               alt={item.alt}
               className="w-full h-full object-cover rounded-3xl hover:scale-102 transition-transform duration-700"
               loading="lazy"
               style={{
                 filter: 'saturate(0.8) contrast(0.9) brightness(1.1)'
               }}
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-white/5 rounded-3xl"></div>
           </div>
         ))}
       </div>

       {/* Food-themed decorative elements */}
       <div className="absolute inset-0">
         {/* Large food icons for visual impact */}
         <div className="absolute top-10 left-10 text-6xl opacity-5 animate-pulse" style={{animationDuration: '8s'}}>
           <FaUtensils className="text-gray-400" />
         </div>
         <div className="absolute top-20 right-20 text-5xl opacity-5 animate-pulse" style={{animationDuration: '6s', animationDelay: '2s'}}>
           <GiKnifeFork className="text-gray-400" />
         </div>
         <div className="absolute bottom-20 left-20 text-5xl opacity-5 animate-pulse" style={{animationDuration: '7s', animationDelay: '1s'}}>
           <GiSpoon className="text-gray-400" />
         </div>
         <div className="absolute bottom-10 right-10 text-6xl opacity-5 animate-pulse" style={{animationDuration: '9s', animationDelay: '0.5s'}}>
           <MdRestaurant className="text-gray-400" />
         </div>
         
         {/* Restaurant and food service icons */}
         <div className="absolute top-1/3 left-1/4 text-4xl opacity-8 animate-bounce" style={{animationDuration: '5s', animationDelay: '1.5s'}}>
           <GiShop className="text-blue-400" />
         </div>
         <div className="absolute top-2/3 right-1/3 text-4xl opacity-8 animate-bounce" style={{animationDuration: '6s', animationDelay: '2.5s'}}>
           <FaPizzaSlice className="text-orange-400" />
         </div>
         <div className="absolute top-1/2 left-1/2 text-3xl opacity-6 animate-pulse" style={{animationDuration: '4s', animationDelay: '3s'}}>
           <GiCookingPot className="text-yellow-400" />
         </div>
         
         {/* Atlanta-themed elements */}
         <div className="absolute top-5 left-5 text-3xl opacity-10 animate-pulse" style={{animationDuration: '4s'}}>
           <FaBuilding className="text-gray-400" />
         </div>
         <div className="absolute top-15 right-15 text-2xl opacity-10 animate-pulse" style={{animationDuration: '5s', animationDelay: '1s'}}>
           <FaTree className="text-green-400" />
         </div>
         <div className="absolute bottom-15 left-15 text-2xl opacity-10 animate-pulse" style={{animationDuration: '3s', animationDelay: '2s'}}>
           <MdLocationCity className="text-gray-400" />
         </div>
         <div className="absolute bottom-5 right-5 text-3xl opacity-10 animate-pulse" style={{animationDuration: '6s', animationDelay: '0.5s'}}>
           <FaMusic className="text-purple-400" />
         </div>
       </div>

      {/* Subtle food pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full" style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 10px,
            rgba(255,255,255,0.1) 10px,
            rgba(255,255,255,0.1) 20px
          )`
        }}></div>
      </div>
    </div>
  );
}
