'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import InteractiveMap from '@/components/InteractiveMap';
import FoodTruckBackground from '@/components/FoodTruckBackground';
import AtlantaHeader from '@/components/AtlantaHeader';
import { Restaurant } from '@/types/restaurant';

// Define the structure of the API response (for future use)
// interface ApiResponse {
//   restaurants: Restaurant[];
//   location: string;
//   total: number;
// }

export default function Home() {
  // State management for the component
  const [location, setLocation] = useState('');
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchLocation, setSearchLocation] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [filterCuisine, setFilterCuisine] = useState('all');
  const [dietaryFilters, setDietaryFilters] = useState<string[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [showMap, setShowMap] = useState(true);

  // Sample Tech Square restaurants data
  const techSquareRestaurants: Restaurant[] = [
    {
      id: '1',
      name: 'Rise-n-Dine',
      address: '1040 W Peachtree St NW, Atlanta, GA 30309',
      rating: 4.5,
      cuisine: 'American',
      priceRange: '$$',
      dietaryOptions: {
        vegan: false,
        vegetarian: true,
        glutenFree: true,
        peanutFree: false,
        dairyFree: false,
        nutFree: false,
        soyFree: false,
        keto: true,
        halal: false,
        kosher: false,
      },
      description: 'Popular breakfast and brunch spot with fresh ingredients',
      hours: '7:00 AM - 3:00 PM',
      phone: '(404) 892-1000',
      website: 'https://risendine.com',
      distance: '0.2 miles',
    },
    {
      id: '2',
      name: 'Tin Lizzy\'s Cantina',
      address: '1040 W Peachtree St NW, Atlanta, GA 30309',
      rating: 4.2,
      cuisine: 'Mexican',
      priceRange: '$$',
      dietaryOptions: {
        vegan: true,
        vegetarian: true,
        glutenFree: true,
        peanutFree: true,
        dairyFree: true,
        nutFree: true,
        soyFree: false,
        keto: false,
        halal: false,
        kosher: false,
      },
      description: 'Fresh Mexican cuisine with extensive vegan options',
      hours: '11:00 AM - 10:00 PM',
      phone: '(404) 892-1001',
      distance: '0.1 miles',
    },
    {
      id: '3',
      name: 'Chipotle Mexican Grill',
      address: '1040 W Peachtree St NW, Atlanta, GA 30309',
      rating: 4.0,
      cuisine: 'Mexican',
      priceRange: '$',
      dietaryOptions: {
        vegan: true,
        vegetarian: true,
        glutenFree: true,
        peanutFree: true,
        dairyFree: true,
        nutFree: true,
        soyFree: true,
        keto: true,
        halal: false,
        kosher: false,
      },
      description: 'Build your own burrito with fresh, customizable ingredients',
      hours: '10:30 AM - 10:00 PM',
      phone: '(404) 892-1002',
      distance: '0.1 miles',
    },
    {
      id: '4',
      name: 'Subway',
      address: '1040 W Peachtree St NW, Atlanta, GA 30309',
      rating: 3.8,
      cuisine: 'Sandwiches',
      priceRange: '$',
      dietaryOptions: {
        vegan: true,
        vegetarian: true,
        glutenFree: true,
        peanutFree: true,
        dairyFree: true,
        nutFree: true,
        soyFree: true,
        keto: true,
        halal: true,
        kosher: false,
      },
      description: 'Fresh subs and salads with extensive customization options',
      hours: '7:00 AM - 9:00 PM',
      phone: '(404) 892-1003',
      distance: '0.1 miles',
    },
    {
      id: '5',
      name: 'Starbucks',
      address: '1040 W Peachtree St NW, Atlanta, GA 30309',
      rating: 4.1,
      cuisine: 'Coffee',
      priceRange: '$$',
      dietaryOptions: {
        vegan: true,
        vegetarian: true,
        glutenFree: true,
        peanutFree: false,
        dairyFree: true,
        nutFree: false,
        soyFree: true,
        keto: true,
        halal: true,
        kosher: false,
      },
      description: 'Coffee, tea, and light bites with many dietary options',
      hours: '5:30 AM - 9:00 PM',
      phone: '(404) 892-1004',
      distance: '0.0 miles',
    },
    {
      id: '6',
      name: 'Panda Express',
      address: '1040 W Peachtree St NW, Atlanta, GA 30309',
      rating: 3.9,
      cuisine: 'Chinese',
      priceRange: '$',
      dietaryOptions: {
        vegan: false,
        vegetarian: true,
        glutenFree: false,
        peanutFree: false,
        dairyFree: true,
        nutFree: false,
        soyFree: false,
        keto: false,
        halal: false,
        kosher: false,
      },
      description: 'American Chinese fast food with some vegetarian options',
      hours: '10:00 AM - 10:00 PM',
      phone: '(404) 892-1005',
      distance: '0.2 miles',
    },
    {
      id: '7',
      name: 'Chick-fil-A',
      address: '1040 W Peachtree St NW, Atlanta, GA 30309',
      rating: 4.3,
      cuisine: 'American',
      priceRange: '$',
      dietaryOptions: {
        vegan: false,
        vegetarian: false,
        glutenFree: true,
        peanutFree: true,
        dairyFree: false,
        nutFree: true,
        soyFree: false,
        keto: true,
        halal: false,
        kosher: false,
      },
      description: 'Chicken sandwiches and nuggets with gluten-free options',
      hours: '6:30 AM - 10:00 PM',
      phone: '(404) 892-1006',
      distance: '0.1 miles',
    },
    {
      id: '8',
      name: 'Freshii',
      address: '1040 W Peachtree St NW, Atlanta, GA 30309',
      rating: 4.4,
      cuisine: 'Healthy',
      priceRange: '$$',
      dietaryOptions: {
        vegan: true,
        vegetarian: true,
        glutenFree: true,
        peanutFree: true,
        dairyFree: true,
        nutFree: true,
        soyFree: true,
        keto: true,
        halal: true,
        kosher: false,
      },
      description: 'Fresh salads, bowls, and wraps with extensive dietary options',
      hours: '8:00 AM - 8:00 PM',
      phone: '(404) 892-1007',
      distance: '0.1 miles',
    },
  ];

  // Function to fetch restaurants from Tech Square data
  const fetchRestaurants = async () => {
    setLoading(true);
    setError(null);
    setRestaurants([]);

    try {
      // Simulate API call with delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Filter Tech Square restaurants based on search
      let filteredRestaurants = techSquareRestaurants;
      
      if (location.trim()) {
        const searchTerm = location.toLowerCase();
        filteredRestaurants = techSquareRestaurants.filter(restaurant => 
          restaurant.name.toLowerCase().includes(searchTerm) ||
          restaurant.cuisine.toLowerCase().includes(searchTerm) ||
          restaurant.description.toLowerCase().includes(searchTerm) ||
          Object.entries(restaurant.dietaryOptions)
            .filter(([, available]) => available)
            .some(([option]) => option.toLowerCase().includes(searchTerm))
        );
      }

      setRestaurants(filteredRestaurants);
      setSearchLocation('Tech Square, Atlanta');
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Load all restaurants on component mount
  useEffect(() => {
    fetchRestaurants();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRestaurants();
  };

  // Get unique cuisines for filter
  const uniqueCuisines = Array.from(new Set(restaurants.map(r => r.cuisine)));

  // Filter and sort restaurants
  const filteredAndSortedRestaurants = restaurants
    .filter(restaurant => {
      // Filter by cuisine
      const cuisineMatch = filterCuisine === 'all' || restaurant.cuisine === filterCuisine;
      
      // Filter by dietary restrictions
      const dietaryMatch = dietaryFilters.length === 0 || 
        dietaryFilters.every(filter => restaurant.dietaryOptions[filter as keyof typeof restaurant.dietaryOptions]);
      
      return cuisineMatch && dietaryMatch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price':
          const priceOrder = { '$': 1, '$$': 2, '$$$': 3, '$$$$': 4 };
          return (priceOrder[a.priceRange as keyof typeof priceOrder] || 0) - 
                 (priceOrder[b.priceRange as keyof typeof priceOrder] || 0);
        case 'distance':
          return parseFloat(a.distance) - parseFloat(b.distance);
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Food Truck Background */}
      <FoodTruckBackground />
      
      {/* Main Content */}
      <div className="relative z-10 p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Atlanta-Themed Header */}
          <AtlantaHeader />

        {/* Search Form */}
        <Card className="mb-8 shadow-2xl border-2 border-gold-200 bg-white/95 hover:shadow-3xl transition-all duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl flex items-center animate-pulse">
              <span className="mr-2">🍽️</span>
              <span className="bg-gradient-to-r from-gold-600 to-orange-600 bg-clip-text text-transparent">
                Find Your Perfect Meal
              </span>
            </CardTitle>
            <CardDescription className="text-base text-gray-700">
              Search for restaurants, cuisines, or dietary options in Tech Square
              <span className="ml-2">🎯</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="location" className="text-sm font-semibold text-gray-700">
                  What are you craving?
                </Label>
                <div className="relative">
                  <Input
                    id="location"
                    type="text"
                    placeholder="Search restaurants, cuisines, or dietary options..."
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    disabled={loading}
                    className="pl-12 h-12 text-lg border-2 focus:border-orange-500 focus:ring-orange-500"
                  />
                  <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </div>
              <Button 
                type="submit" 
                disabled={loading || !location.trim()}
                className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-gold-500 via-orange-500 to-red-500 hover:from-gold-600 hover:via-orange-600 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                {loading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Searching...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Find Restaurants
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Results Section */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center text-red-600">
                <svg className="w-6 h-6 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <strong className="block">Oops! Something went wrong</strong>
                  <span className="text-sm">{error}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {loading && (
          <Card className="mb-6 shadow-lg">
            <CardContent className="pt-8 pb-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mb-4">
                  <svg className="animate-spin w-8 h-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Finding the best restaurants...</h3>
                <p className="text-gray-600">Searching through our database of local favorites</p>
                
                {/* Loading Skeleton */}
                <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="animate-pulse">
                      <CardHeader>
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="h-3 bg-gray-200 rounded w-full"></div>
                          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {restaurants.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  🍽️ Restaurants in {searchLocation}
                </h2>
                <p className="text-gray-600">
                  Found {filteredAndSortedRestaurants.length} amazing restaurants near you
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>Updated just now</span>
                </div>
                <Button
                  onClick={() => setShowMap(!showMap)}
                  variant="outline"
                  className="border-orange-300 text-orange-600 hover:bg-orange-50"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  {showMap ? 'Hide Map' : 'Show Map'}
                </Button>
              </div>
            </div>

            {/* Interactive Map */}
            {showMap && (
              <div className="mb-8">
                <Card className="shadow-xl border-0 bg-white/95">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl flex items-center">
                      <svg className="w-5 h-5 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                      Interactive Tech Square Map
                    </CardTitle>
                    <CardDescription>
                      Click on restaurant blocks to explore! Size and color indicate dietary options available.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <InteractiveMap
                      restaurants={restaurants}
                      dietaryFilters={dietaryFilters}
                      onRestaurantClick={setSelectedRestaurant}
                      selectedRestaurant={selectedRestaurant}
                    />
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Filter and Sort Controls */}
            <Card className="mb-6 shadow-lg border-0 bg-white/90">
              <CardContent className="pt-6">
                <div className="space-y-6">
                  {/* Dietary Restrictions Filter */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <Label className="text-sm font-semibold text-gray-700">
                        Dietary Restrictions & Preferences
                      </Label>
                      {dietaryFilters.length > 0 && (
                        <div className="flex items-center text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          {dietaryFilters.length} filter{dietaryFilters.length > 1 ? 's' : ''} active
                        </div>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { key: 'vegan', label: 'Vegan', color: 'bg-green-100 text-green-800 border-green-300' },
                        { key: 'vegetarian', label: 'Vegetarian', color: 'bg-green-100 text-green-800 border-green-300' },
                        { key: 'glutenFree', label: 'Gluten-Free', color: 'bg-blue-100 text-blue-800 border-blue-300' },
                        { key: 'peanutFree', label: 'Peanut-Free', color: 'bg-red-100 text-red-800 border-red-300' },
                        { key: 'dairyFree', label: 'Dairy-Free', color: 'bg-purple-100 text-purple-800 border-purple-300' },
                        { key: 'nutFree', label: 'Nut-Free', color: 'bg-red-100 text-red-800 border-red-300' },
                        { key: 'soyFree', label: 'Soy-Free', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
                        { key: 'keto', label: 'Keto', color: 'bg-orange-100 text-orange-800 border-orange-300' },
                        { key: 'halal', label: 'Halal', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
                        { key: 'kosher', label: 'Kosher', color: 'bg-indigo-100 text-indigo-800 border-indigo-300' },
                      ].map((option) => (
                        <button
                          key={option.key}
                          onClick={() => {
                            setDietaryFilters(prev => 
                              prev.includes(option.key) 
                                ? prev.filter(f => f !== option.key)
                                : [...prev, option.key]
                            );
                          }}
                          className={`px-3 py-1 rounded-full text-sm font-medium border transition-all ${
                            dietaryFilters.includes(option.key)
                              ? `${option.color} ring-2 ring-offset-1`
                              : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Cuisine and Sort Controls */}
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <Label htmlFor="cuisine-filter" className="text-sm font-semibold text-gray-700 mb-2 block">
                        Filter by Cuisine
                      </Label>
                      <Select value={filterCuisine} onValueChange={setFilterCuisine}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="All cuisines" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Cuisines</SelectItem>
                          {uniqueCuisines.map((cuisine) => (
                            <SelectItem key={cuisine} value={cuisine}>
                              {cuisine}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex-1">
                      <Label htmlFor="sort-by" className="text-sm font-semibold text-gray-700 mb-2 block">
                        Sort by
                      </Label>
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="rating">Highest Rating</SelectItem>
                          <SelectItem value="name">Name (A-Z)</SelectItem>
                          <SelectItem value="price">Price (Low to High)</SelectItem>
                          <SelectItem value="distance">Distance (Closest First)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-end">
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setFilterCuisine('all');
                          setSortBy('rating');
                          setDietaryFilters([]);
                        }}
                        className="border-orange-300 text-orange-600 hover:bg-orange-50"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Reset All
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Selected Restaurant Details */}
            {selectedRestaurant && (
              <Card className="mb-6 shadow-xl border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-red-50">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl text-orange-800">
                        🎯 {selectedRestaurant.name}
                      </CardTitle>
                      <CardDescription className="text-lg">
                        {selectedRestaurant.cuisine} • {selectedRestaurant.priceRange} • {selectedRestaurant.distance}
                      </CardDescription>
                    </div>
                    <Button
                      onClick={() => setSelectedRestaurant(null)}
                      variant="outline"
                      size="sm"
                      className="border-orange-300 text-orange-600 hover:bg-orange-50"
                    >
                      ✕
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Restaurant Details</h4>
                      <div className="space-y-2 text-sm">
                        <p><strong>Address:</strong> {selectedRestaurant.address}</p>
                        <p><strong>Hours:</strong> {selectedRestaurant.hours}</p>
                        <p><strong>Phone:</strong> {selectedRestaurant.phone}</p>
                        <p><strong>Rating:</strong> ⭐ {selectedRestaurant.rating}/5</p>
                        <p><strong>Description:</strong> {selectedRestaurant.description}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Dietary Options</h4>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(selectedRestaurant.dietaryOptions)
                          .filter(([, available]) => available)
                          .map(([option]) => {
                            const optionLabels: { [key: string]: string } = {
                              vegan: 'Vegan',
                              vegetarian: 'Vegetarian',
                              glutenFree: 'Gluten-Free',
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
                                className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full"
                              >
                                {optionLabels[option]}
                              </span>
                            );
                          })}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredAndSortedRestaurants.map((restaurant) => (
                <Card key={restaurant.id} className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-0 bg-white/95">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                          {restaurant.name}
                        </CardTitle>
                        <CardDescription className="text-base mt-1">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 mr-2">
                            {restaurant.cuisine}
                          </span>
                          <span className="text-gray-600 mr-2">{restaurant.priceRange}</span>
                          <span className="text-xs text-gray-500">• {restaurant.distance}</span>
                        </CardDescription>
                        <div className="mt-2">
                          <p className="text-sm text-gray-600">{restaurant.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center ml-4">
                        <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-full">
                          <svg className="w-4 h-4 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="text-sm font-bold text-yellow-700">
                            {restaurant.rating}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <svg className="w-4 h-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {restaurant.address}
                        </p>
        </div>

                      {/* Dietary Options */}
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(restaurant.dietaryOptions)
                          .filter(([, available]) => available)
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
                      
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{restaurant.hours}</span>
                          </div>
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <span>{restaurant.phone}</span>
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium"
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {!loading && !error && restaurants.length === 0 && searchLocation && (
          <Card className="shadow-lg border-0 bg-white/90">
            <CardContent className="pt-12 pb-12">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-orange-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0118 12a8 8 0 10-8 8 7.962 7.962 0 01-2.291-.5" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  No restaurants found
                </h3>
                <p className="text-lg text-gray-600 mb-2">
                  We couldn&apos;t find any restaurants for &quot;{searchLocation}&quot;
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  Try a different location, check your spelling, or search for a nearby city
                </p>
                <Button 
                  onClick={() => {
                    setLocation('');
                    setSearchLocation('');
                    setRestaurants([]);
                  }}
                  variant="outline"
                  className="border-orange-300 text-orange-600 hover:bg-orange-50"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        </div>
      </div>
    </div>
  );
}