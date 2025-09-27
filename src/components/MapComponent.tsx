'use client';

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import { Restaurant } from '@/types/restaurant';
import { useEffect } from 'react';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in React Leaflet
if (typeof window !== 'undefined') {
  delete (Icon.Default.prototype as { _getIconUrl?: string })._getIconUrl;
  Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
}

interface MapComponentProps {
  restaurants: Restaurant[];
  onRestaurantSelect: (restaurant: Restaurant) => void;
}

// Custom marker icons based on dietary options
const createCustomIcon = (restaurant: Restaurant) => {
  const hasVegan = restaurant.dietaryOptions.vegan;
  const hasVegetarian = restaurant.dietaryOptions.vegetarian;
  const hasGlutenFree = restaurant.dietaryOptions.glutenFree;
  
  let color = '#ff6b35'; // Default orange
  
  if (hasVegan && hasVegetarian) {
    color = '#4ade80'; // Green for vegan/vegetarian friendly
  } else if (hasGlutenFree) {
    color = '#3b82f6'; // Blue for gluten-free options
  } else if (hasVegetarian) {
    color = '#10b981'; // Teal for vegetarian
  }

  return new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
        <path fill="${color}" stroke="#fff" stroke-width="2" d="M12.5 0C5.6 0 0 5.6 0 12.5c0 12.5 12.5 28.5 12.5 28.5s12.5-16 12.5-28.5C25 5.6 19.4 0 12.5 0z"/>
        <circle fill="#fff" cx="12.5" cy="12.5" r="6"/>
        <text x="12.5" y="16" text-anchor="middle" font-size="8" font-weight="bold" fill="${color}">🍽️</text>
      </svg>
    `)}`,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    shadowSize: [41, 41]
  });
};

// Component to update map view when restaurants change
function MapUpdater({ restaurants }: { restaurants: Restaurant[] }) {
  const map = useMap();
  
  useEffect(() => {
    if (restaurants.length > 0) {
      const bounds = restaurants.map(restaurant => [
        33.7756 + (Math.random() - 0.5) * 0.01, // Small random offset for demo
        -84.3963 + (Math.random() - 0.5) * 0.01
      ] as [number, number]);
      
      if (bounds.length > 0) {
        map.fitBounds(bounds, { padding: [20, 20] });
      }
    }
  }, [restaurants, map]);

  return null;
}

export default function MapComponent({ restaurants, onRestaurantSelect }: MapComponentProps) {
  // Tech Square coordinates (approximate center)
  const techSquareCenter: [number, number] = [33.7756, -84.3963];
  
  // Convert restaurant addresses to coordinates (simplified for demo)
  const restaurantsWithCoords = restaurants.map(restaurant => ({
    ...restaurant,
    coordinates: [
      33.7756 + (Math.random() - 0.5) * 0.01, // Small random offset for demo
      -84.3963 + (Math.random() - 0.5) * 0.01
    ] as [number, number]
  }));

  return (
    <MapContainer
      center={techSquareCenter}
      zoom={16}
      style={{ height: '100%', width: '100%' }}
      className="z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      <MapUpdater restaurants={restaurantsWithCoords} />
      
      {restaurantsWithCoords.map((restaurant) => (
        <Marker
          key={restaurant.id}
          position={restaurant.coordinates}
          icon={createCustomIcon(restaurant)}
          eventHandlers={{
            click: () => onRestaurantSelect(restaurant),
          }}
        >
          <Popup className="custom-popup">
            <div className="p-2 min-w-[200px]">
              <h3 className="font-bold text-lg text-gray-900 mb-2">
                {restaurant.name}
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                {restaurant.cuisine} • {restaurant.priceRange}
              </p>
              <div className="flex flex-wrap gap-1 mb-2">
                {Object.entries(restaurant.dietaryOptions)
                  .filter(([, available]) => available)
                  .slice(0, 4)
                  .map(([option]) => {
                    const optionLabels: { [key: string]: string } = {
                      vegan: 'Vegan',
                      vegetarian: 'Vegetarian',
                      glutenFree: 'GF',
                      peanutFree: 'Peanut-Free',
                      dairyFree: 'Dairy-Free',
                      nutFree: 'Nut-Free',
                      soyFree: 'Soy-Free',
                      keto: 'Keto',
                      halal: 'Halal',
                      kosher: 'Kosher',
                    };
                    return (
                      <span
                        key={option}
                        className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800"
                      >
                        {optionLabels[option]}
                      </span>
                    );
                  })}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-sm font-bold text-yellow-700">
                    {restaurant.rating}
                  </span>
                </div>
                <span className="text-xs text-gray-500">{restaurant.distance}</span>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
