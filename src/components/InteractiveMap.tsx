'use client';

import { useState } from 'react';
import { Restaurant } from '@/app/page';

interface InteractiveMapProps {
  restaurants: Restaurant[];
  dietaryFilters: string[];
  onRestaurantClick: (restaurant: Restaurant) => void;
  selectedRestaurant?: Restaurant | null;
}

interface MapPosition {
  x: number;
  y: number;
}

// Define positions for restaurants on the map (relative to container)
const restaurantPositions: { [key: string]: MapPosition } = {
  '1': { x: 20, y: 30 }, // Rise-n-Dine
  '2': { x: 40, y: 25 }, // Tin Lizzy's Cantina
  '3': { x: 60, y: 35 }, // Chipotle
  '4': { x: 80, y: 20 }, // Subway
  '5': { x: 15, y: 60 }, // Starbucks
  '6': { x: 35, y: 70 }, // Panda Express
  '7': { x: 55, y: 65 }, // Chick-fil-A
  '8': { x: 75, y: 75 }, // Freshii
};

export default function InteractiveMap({ 
  restaurants, 
  dietaryFilters, 
  onRestaurantClick, 
  selectedRestaurant 
}: InteractiveMapProps) {
  const [hoveredRestaurant, setHoveredRestaurant] = useState<string | null>(null);

  // Filter restaurants based on dietary selections
  const visibleRestaurants = restaurants.filter(restaurant => {
    if (dietaryFilters.length === 0) return true;
    return dietaryFilters.every(filter => 
      restaurant.dietaryOptions[filter as keyof typeof restaurant.dietaryOptions]
    );
  });

  const getRestaurantColor = (restaurant: Restaurant) => {
    const dietaryCount = Object.values(restaurant.dietaryOptions).filter(Boolean).length;
    
    if (dietaryCount >= 7) return 'bg-green-500';
    if (dietaryCount >= 5) return 'bg-blue-500';
    if (dietaryCount >= 3) return 'bg-yellow-500';
    return 'bg-orange-500';
  };

  const getRestaurantSize = (restaurant: Restaurant) => {
    const dietaryCount = Object.values(restaurant.dietaryOptions).filter(Boolean).length;
    
    if (dietaryCount >= 7) return 'w-8 h-8';
    if (dietaryCount >= 5) return 'w-7 h-7';
    if (dietaryCount >= 3) return 'w-6 h-6';
    return 'w-5 h-5';
  };

  const getDietaryBadges = (restaurant: Restaurant) => {
    return Object.entries(restaurant.dietaryOptions)
      .filter(([, available]) => available)
      .slice(0, 3) // Show max 3 badges
      .map(([option]) => {
        const labels: { [key: string]: string } = {
          vegan: 'V',
          vegetarian: 'VG',
          glutenFree: 'GF',
          peanutFree: 'PF',
          dairyFree: 'DF',
          nutFree: 'NF',
          soyFree: 'SF',
          keto: 'K',
          halal: 'H',
          kosher: 'K',
        };
        return labels[option] || option.charAt(0).toUpperCase();
      });
  };

  return (
    <div className="relative w-full h-64 sm:h-80 md:h-96 bg-gradient-to-br from-blue-100 to-green-100 rounded-2xl overflow-hidden border-2 border-gray-200 shadow-lg">
      {/* Map Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="grid grid-cols-8 grid-rows-6 h-full">
          {Array.from({ length: 48 }).map((_, i) => (
            <div key={i} className="border border-gray-300"></div>
          ))}
        </div>
      </div>

      {/* Map Title */}
      <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-white/90 backdrop-blur-sm px-2 py-1 sm:px-3 sm:py-2 rounded-lg shadow-md">
        <h3 className="text-xs sm:text-sm font-bold text-gray-800">Tech Square Map</h3>
        <p className="text-xs text-gray-600">
          {visibleRestaurants.length} restaurants visible
        </p>
      </div>

      {/* Legend */}
      <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-white/90 backdrop-blur-sm px-2 py-1 sm:px-3 sm:py-2 rounded-lg shadow-md">
        <div className="text-xs font-semibold text-gray-800 mb-1">Dietary Options</div>
        <div className="flex space-x-1">
          <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
          <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-sm"></div>
          <div className="w-3 h-3 bg-orange-500 rounded-sm"></div>
        </div>
        <div className="text-xs text-gray-600 mt-1">7+ • 5+ • 3+ • 1+</div>
      </div>

      {/* Restaurant Lego Blocks */}
      {restaurants.map((restaurant) => {
        const position = restaurantPositions[restaurant.id];
        const isVisible = visibleRestaurants.includes(restaurant);
        const isSelected = selectedRestaurant?.id === restaurant.id;
        const isHovered = hoveredRestaurant === restaurant.id;

        if (!position) return null;

        return (
          <div
            key={restaurant.id}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
              isVisible ? 'opacity-100 scale-100' : 'opacity-30 scale-75'
            } ${isSelected ? 'z-20' : 'z-10'} ${isHovered ? 'z-30' : ''}`}
            style={{
              left: `${position.x}%`,
              top: `${position.y}%`,
            }}
            onMouseEnter={() => setHoveredRestaurant(restaurant.id)}
            onMouseLeave={() => setHoveredRestaurant(null)}
            onClick={() => onRestaurantClick(restaurant)}
          >
            {/* Lego Block */}
            <div
              className={`
                ${getRestaurantColor(restaurant)} 
                ${getRestaurantSize(restaurant)} 
                rounded-lg shadow-lg border-2 border-white cursor-pointer
                transform transition-all duration-300 hover:scale-110 hover:shadow-xl
                ${isSelected ? 'ring-4 ring-orange-400 ring-opacity-50' : ''}
                ${isHovered ? 'scale-110 shadow-2xl' : ''}
                flex items-center justify-center text-white font-bold text-xs
              `}
            >
              {restaurant.name.charAt(0)}
            </div>

            {/* Restaurant Info Popup */}
            {(isHovered || isSelected) && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-white rounded-lg shadow-xl border-2 border-gray-200 p-3 min-w-48 z-40">
                <div className="text-sm font-bold text-gray-900 mb-1">
                  {restaurant.name}
                </div>
                <div className="text-xs text-gray-600 mb-2">
                  {restaurant.cuisine} • {restaurant.priceRange}
                </div>
                
                {/* Dietary Badges */}
                <div className="flex flex-wrap gap-1 mb-2">
                  {getDietaryBadges(restaurant).map((badge, index) => (
                    <span
                      key={index}
                      className="px-1 py-0.5 bg-green-100 text-green-800 text-xs rounded"
                    >
                      {badge}
                    </span>
                  ))}
                </div>

                <div className="text-xs text-gray-500">
                  ⭐ {restaurant.rating} • 📍 {restaurant.distance}
                </div>
              </div>
            )}

            {/* Connection Line to Center (when selected) */}
            {isSelected && (
              <div className="absolute top-1/2 left-1/2 w-0.5 h-8 bg-orange-400 transform -translate-x-1/2 -translate-y-1/2 opacity-50"></div>
            )}
          </div>
        );
      })}

      {/* Center Point */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg z-50">
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-bold text-red-600 bg-white px-1 rounded">
          You
        </div>
      </div>

      {/* Map Instructions */}
      <div className="absolute bottom-2 left-2 right-2 sm:bottom-4 sm:left-4 sm:right-4 bg-white/90 backdrop-blur-sm px-2 py-1 sm:px-3 sm:py-2 rounded-lg shadow-md">
        <div className="text-xs text-gray-600 text-center">
          <span className="hidden sm:inline">🎯 Click on restaurant blocks to view details • 🏗️ Size = dietary options • 🎨 Color = dietary variety</span>
          <span className="sm:hidden">🎯 Tap blocks for details</span>
        </div>
      </div>
    </div>
  );
}
