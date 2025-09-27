'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import RestaurantMap from '@/components/RestaurantMap';

// Define the structure of restaurant data
interface Restaurant {
  id: string;
  name: string;
  address: string;
  rating: number;
  cuisine: string;
  priceRange: string;
  dietaryOptions: {
    vegan: boolean;
    vegetarian: boolean;
    glutenFree: boolean;
    peanutFree: boolean;
    dairyFree: boolean;
    nutFree: boolean;
    soyFree: boolean;
    keto: boolean;
    halal: boolean;
    kosher: boolean;
  };
  description: string;
  hours: string;
  phone: string;
  website?: string;
  distance: string; // Distance from Tech Square
}

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 p-2 rounded-full mr-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  Tech Square Eats
                </h1>
                <p className="text-sm text-gray-500">Georgia Tech&apos;s dining hub</p>
              </div>
            </div>
            <Button
              onClick={() => setShowMap(!showMap)}
              variant="outline"
              className="flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              {showMap ? 'Hide Map' : 'Show Map'}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Search and Filters */}
        <div className={`${showMap ? 'w-1/2' : 'w-full'} flex flex-col bg-white border-r transition-all duration-300`}>
          <div className="p-6 overflow-y-auto">
            {/* Search Form */}
            <Card className="mb-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl flex items-center">
                  <svg className="w-5 h-5 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Find Your Perfect Meal
                </CardTitle>
                <CardDescription className="text-sm">
                  Search for restaurants, cuisines, or dietary options in Tech Square
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
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
                        className="pl-10 h-10 text-base border-2 focus:border-orange-500 focus:ring-orange-500"
                      />
                      <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="w-full h-10 text-base font-semibold bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Searching...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                <CardContent className="pt-4">
                  <div className="flex items-center text-red-600">
                    <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <strong className="block text-sm">Oops! Something went wrong</strong>
                      <span className="text-xs">{error}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {loading && (
              <Card className="mb-6 shadow-lg">
                <CardContent className="pt-6 pb-6">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mb-3">
                      <svg className="animate-spin w-6 h-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                    <h3 className="text-base font-semibold text-gray-900 mb-1">Finding the best restaurants...</h3>
                    <p className="text-sm text-gray-600">Searching through our database of local favorites</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Filter and Sort Controls */}
            {restaurants.length > 0 && (
              <Card className="mb-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="pt-4">
                  <div className="space-y-4">
                    {/* Dietary Restrictions Filter */}
                    <div>
                      <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                        Dietary Restrictions & Preferences
                      </Label>
                      <div className="flex flex-wrap gap-1">
                        {[
                          { key: 'vegan', label: 'Vegan', color: 'bg-green-100 text-green-800 border-green-300' },
                          { key: 'vegetarian', label: 'Vegetarian', color: 'bg-green-100 text-green-800 border-green-300' },
                          { key: 'glutenFree', label: 'GF', color: 'bg-blue-100 text-blue-800 border-blue-300' },
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
                            className={`px-2 py-1 rounded-full text-xs font-medium border transition-all ${
                              dietaryFilters.includes(option.key)
                                ? `${option.color} ring-1 ring-offset-1`
                                : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Cuisine and Sort Controls */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="flex-1">
                        <Label htmlFor="cuisine-filter" className="text-xs font-semibold text-gray-700 mb-1 block">
                          Filter by Cuisine
                        </Label>
                        <Select value={filterCuisine} onValueChange={setFilterCuisine}>
                          <SelectTrigger className="w-full h-8">
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
                        <Label htmlFor="sort-by" className="text-xs font-semibold text-gray-700 mb-1 block">
                          Sort by
                        </Label>
                        <Select value={sortBy} onValueChange={setSortBy}>
                          <SelectTrigger className="w-full h-8">
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
                          size="sm"
                          onClick={() => {
                            setFilterCuisine('all');
                            setSortBy('rating');
                            setDietaryFilters([]);
                          }}
                          className="border-orange-300 text-orange-600 hover:bg-orange-50 h-8"
                        >
                          Reset
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Results */}
            {restaurants.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-1">
                      🍽️ Restaurants in {searchLocation}
                    </h2>
                    <p className="text-sm text-gray-600">
                      Found {filteredAndSortedRestaurants.length} amazing restaurants near you
                    </p>
                  </div>
                </div>

                {/* Restaurant List */}
                <div className="space-y-4">
                  {filteredAndSortedRestaurants.map((restaurant) => (
                    <Card 
                      key={restaurant.id} 
                      className={`group hover:shadow-lg transition-all duration-300 cursor-pointer border-0 bg-white/90 backdrop-blur-sm ${
                        selectedRestaurant?.id === restaurant.id ? 'ring-2 ring-orange-500' : ''
                      }`}
                      onClick={() => setSelectedRestaurant(restaurant)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                              {restaurant.name}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {restaurant.cuisine} • {restaurant.priceRange} • {restaurant.distance}
                            </p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {Object.entries(restaurant.dietaryOptions)
                                .filter(([, available]) => available)
                                .slice(0, 3)
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
                          </div>
                          <div className="flex items-center ml-4">
                            <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-full">
                              <svg className="w-3 h-3 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              <span className="text-xs font-bold text-yellow-700">
                                {restaurant.rating}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {!loading && !error && restaurants.length === 0 && searchLocation && (
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="pt-8 pb-8">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-orange-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0118 12a8 8 0 10-8 8 7.962 7.962 0 01-2.291-.5" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      No restaurants found
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      We couldn&apos;t find any restaurants for &quot;{searchLocation}&quot;
                    </p>
                    <Button 
                      onClick={() => {
                        setLocation('');
                        setSearchLocation('');
                        setRestaurants([]);
                      }}
                      variant="outline"
                      size="sm"
                      className="border-orange-300 text-orange-600 hover:bg-orange-50"
                    >
                      Try Again
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Right Panel - Map */}
        {showMap && (
          <div className="w-1/2 bg-gray-100">
            <RestaurantMap 
              restaurants={filteredAndSortedRestaurants}
              selectedRestaurant={selectedRestaurant}
              onRestaurantSelect={setSelectedRestaurant}
            />
          </div>
        )}
      </div>
    </div>
  );
}