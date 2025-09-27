'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Define the structure of restaurant data
interface Restaurant {
  id: string;
  name: string;
  address: string;
  rating: number;
  cuisine: string;
  priceRange: string;
}

// Define the structure of the API response
interface ApiResponse {
  restaurants: Restaurant[];
  location: string;
  total: number;
}

export default function Home() {
  // State management for the component
  const [location, setLocation] = useState('');
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchLocation, setSearchLocation] = useState('');

  // Function to fetch restaurants from our API route
  const fetchRestaurants = async () => {
    if (!location.trim()) {
      setError('Please enter a location');
      return;
    }

    setLoading(true);
    setError(null);
    setRestaurants([]);

    try {
      // Call our internal Next.js API route
      const response = await fetch(`/api/restaurants?location=${encodeURIComponent(location)}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch restaurants');
      }

      const data: ApiResponse = await response.json();
      setRestaurants(data.restaurants || []);
      setSearchLocation(data.location || location);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRestaurants();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Restaurant Finder
          </h1>
          <p className="text-gray-600">
            Discover great restaurants in your area
          </p>
        </div>

        {/* Search Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Search for Restaurants</CardTitle>
            <CardDescription>
              Enter a location to find nearby restaurants
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  type="text"
                  placeholder="Enter city, address, or neighborhood..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  disabled={loading}
                />
              </div>
              <Button 
                type="submit" 
                disabled={loading || !location.trim()}
                className="w-full"
              >
                {loading ? 'Searching...' : 'Find Restaurants'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Results Section */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="text-red-600">
                <strong>Error:</strong> {error}
              </div>
            </CardContent>
          </Card>
        )}

        {loading && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="text-center text-gray-600">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                Searching for restaurants...
              </div>
            </CardContent>
          </Card>
        )}

        {restaurants.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Restaurants in {searchLocation}
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {restaurants.map((restaurant) => (
                <Card key={restaurant.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{restaurant.name}</CardTitle>
                    <CardDescription>
                      {restaurant.cuisine} • {restaurant.priceRange}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">
                        📍 {restaurant.address}
                      </p>
                      <div className="flex items-center">
                        <span className="text-yellow-500">⭐</span>
                        <span className="ml-1 text-sm font-medium">
                          {restaurant.rating}/5
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {!loading && !error && restaurants.length === 0 && searchLocation && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-gray-600">
                <p>No restaurants found for "{searchLocation}"</p>
                <p className="text-sm mt-1">Try a different location or check your spelling</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}