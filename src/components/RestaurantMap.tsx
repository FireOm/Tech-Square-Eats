'use client';

import dynamic from 'next/dynamic';
import { Restaurant } from '@/types/restaurant';
import { useState, useEffect } from 'react';

// Dynamically import the map to avoid SSR issues
const MapComponent = dynamic(() => import('./MapComponent'), { 
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-2"></div>
        <p className="text-sm text-gray-600">Loading map...</p>
      </div>
    </div>
  )
});

interface RestaurantMapProps {
  restaurants: Restaurant[];
  selectedRestaurant?: Restaurant | null;
  onRestaurantSelect: (restaurant: Restaurant) => void;
}

export default function RestaurantMap({ restaurants, onRestaurantSelect }: RestaurantMapProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full rounded-lg overflow-hidden shadow-lg">
      <MapComponent 
        restaurants={restaurants}
        onRestaurantSelect={onRestaurantSelect}
      />
    </div>
  );
}