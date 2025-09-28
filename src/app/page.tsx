'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import FoodTruckBackground from '@/components/FoodTruckBackground';
import AtlantaHeader from '@/components/AtlantaHeader';
import { Restaurant, Dish } from '@/types/restaurant';

// Define the structure of the API response (for future use)
// interface ApiResponse {
//   restaurants: Restaurant[];
//   location: string;
//   total: number;
// }

export default function Home() {
  // State management for the component
  const [searchQuery, setSearchQuery] = useState('');
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchLocation, setSearchLocation] = useState('');
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [currentDishIndex, setCurrentDishIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);


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

  // Function to get dish recommendations via API
  const handleGetRecommendations = async () => {
    setLoading(true);
    setError(null);
    setDishes([]);

    try {
      const backendUrl = 'https://openmenu-3.onrender.com'
      console.log("this is the backendUrl", backendUrl);
      const response = await fetch(`${backendUrl}/recommend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: searchQuery.trim()
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("API Response:", data);
      
      // Check if we got valid recommendation data
      if (data && data.recommendations && Array.isArray(data.recommendations)) {
        // Map the API response to our Dish interface
        const mappedDishes: Dish[] = data.recommendations.map((rec: any) => {
          // Determine cuisine from tags
          const tags = rec.tags || [];
          let cuisine = 'Indian'; // Default
          if (tags.includes('Indian')) cuisine = 'Indian';
          else if (tags.includes('Chinese')) cuisine = 'Chinese';
          else if (tags.includes('Mexican')) cuisine = 'Mexican';
          else if (tags.includes('American')) cuisine = 'American';
          
          // Determine dietary options from tags and description
          const tagString = tags.join(' ').toLowerCase();
          const descString = rec.description.toLowerCase();
          const combinedText = `${tagString} ${descString}`;
          
          return {
            id: `${rec.restaurant.id}-${rec.name.replace(/\s+/g, '-').toLowerCase()}`,
            name: rec.name,
            description: rec.description,
            price: rec.price,
            calories: rec.calories,
            tags: tags,
            restaurant: {
              id: rec.restaurant.id.toString(),
              name: rec.restaurant.name,
              address: rec.restaurant.address,
              rating: rec.restaurant.rating,
              phone: rec.restaurant.phone,
              website: rec.restaurant.website || '',
              hours: rec.restaurant.opening_hours || [],
              priceLevel: rec.restaurant.price_level || 1,
              distance: '0.5 miles', // Would need to be calculated based on location
            },
            cuisine: cuisine,
            dietaryOptions: {
              vegan: combinedText.includes('vegan'),
              vegetarian: combinedText.includes('vegetarian') || combinedText.includes('veggie'),
              glutenFree: combinedText.includes('gluten-free') || combinedText.includes('gluten free'),
              peanutFree: combinedText.includes('peanut-free') || combinedText.includes('peanut free'),
              dairyFree: combinedText.includes('dairy-free') || combinedText.includes('dairy free'),
              nutFree: combinedText.includes('nut-free') || combinedText.includes('nut free'),
              soyFree: combinedText.includes('soy-free') || combinedText.includes('soy free'),
              keto: combinedText.includes('keto') || combinedText.includes('low-carb'),
              halal: combinedText.includes('halal'),
              kosher: combinedText.includes('kosher'),
            },
          };
        });
        
        setDishes(mappedDishes);
        setSearchLocation('Atlanta, GA');
      } else {
        // Fallback: Create sample dishes for demo
        const sampleDishes: Dish[] = [
          {
            id: '1-sample-dish',
            name: 'Chicken Biryani',
            description: 'Aromatic basmati rice with spiced chicken',
            price: 15.95,
            calories: 650,
            tags: ['Indian', 'Chicken', 'Rice', 'Spicy'],
            restaurant: {
              id: '1',
              name: 'Sample Indian Kitchen',
              address: '123 Tech Square, Atlanta, GA',
              rating: 4.2,
              phone: '(404) 123-4567',
              website: '',
              hours: ['11:00 AM - 10:00 PM'],
              priceLevel: 2,
              distance: '0.3 miles',
            },
            cuisine: 'Indian',
            dietaryOptions: {
              vegan: false, vegetarian: false, glutenFree: false,
              peanutFree: true, dairyFree: false, nutFree: true,
              soyFree: true, keto: false, halal: false, kosher: false,
            },
          }
        ];
        
        setDishes(sampleDishes);
        setSearchLocation('Atlanta, GA');
      }
      
    } catch (err) {
      console.error('API call failed, using fallback data:', err);
      
      // Fallback: Create sample dishes on API failure
      const sampleDishes: Dish[] = [
        {
          id: '1-fallback-dish',
          name: 'Sample Dish',
          description: 'A delicious sample dish for demonstration',
          price: 12.99,
          calories: 500,
          tags: ['Sample', 'Demo'],
          restaurant: {
            id: '1',
            name: 'Sample Restaurant',
            address: '123 Tech Square, Atlanta, GA',
            rating: 4.0,
            phone: '(404) 123-4567',
            website: '',
            hours: ['11:00 AM - 10:00 PM'],
            priceLevel: 2,
            distance: '0.3 miles',
          },
          cuisine: 'American',
          dietaryOptions: {
            vegan: false, vegetarian: false, glutenFree: false,
            peanutFree: true, dairyFree: false, nutFree: true,
            soyFree: true, keto: false, halal: false, kosher: false,
          },
        }
      ];
      
      setDishes(sampleDishes);
      setSearchLocation('Atlanta, GA');
    } finally {
      setLoading(false);
    }
  };

  // Animated dishes for typewriter effect
  const animatedDishes = [
    'spicy tacos',
    'creamy pasta',
    'fresh sushi',
    'crispy pizza',
    'juicy burgers',
    'healthy salads',
    'sweet desserts',
    'hot coffee',
    'Thai curry',
    'BBQ ribs'
  ];

  // Typewriter effect for animated dishes
  useEffect(() => {
    const currentDish = animatedDishes[currentDishIndex];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        // Typing
        if (currentText.length < currentDish.length) {
          setCurrentText(currentDish.slice(0, currentText.length + 1));
        } else {
          // Start deleting after a pause
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        // Deleting
        if (currentText.length > 0) {
          setCurrentText(currentText.slice(0, -1));
        } else {
          // Move to next dish
          setIsDeleting(false);
          setCurrentDishIndex((prev) => (prev + 1) % animatedDishes.length);
        }
      }
    }, isDeleting ? 50 : 100);

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentDishIndex, animatedDishes]);

  // Load all dishes on component mount
  useEffect(() => {
    handleGetRecommendations();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleGetRecommendations();
  };


  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-orange-100 via-white to-orange-50">
      {/* Animated Food Truck Background */}
      <FoodTruckBackground />
      

      {/* Main Content */}
      <div className="relative z-10 p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Atlanta-Themed Header */}
          <AtlantaHeader />

            {/* Search Form */}
            <Card className="mb-8 shadow-lg border-0 rounded-2xl hover:shadow-xl transition-all duration-300 backdrop-blur-md bg-white/80">
              <CardHeader className="pb-6 pt-8 px-8">
                <CardTitle className="text-4xl font-bold mb-4 text-gray-900 text-center">
                  <span className="text-orange-600">I am feeling for </span>
                  <span className="text-blue-600 relative">
                    {currentText}
                    <span className="animate-pulse text-gray-400">|</span>
                  </span>
                  <span className="text-gray-700"> at Tech Square</span>
                </CardTitle>
                <CardDescription className="text-lg text-gray-600 text-center">
                  Tell us what you're craving and we'll find the perfect dishes for you
                </CardDescription>
              </CardHeader>
          <CardContent className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="relative">
                  <Input
                    id="searchQuery"
                    type="text"
                    placeholder="Describe what you're craving..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    disabled={loading}
                    className="pl-14 h-16 text-lg border-2 rounded-2xl border-gray-200 focus:border-orange-500 focus:ring-orange-500 bg-white/90 backdrop-blur-sm shadow-inner"
                  />
                  <svg className="absolute left-5 top-1/2 transform -translate-y-1/2 w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              <Button 
                type="submit" 
                disabled={loading || !searchQuery.trim()}
                className="w-full h-16 text-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
              >
                {loading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Getting Recommendations...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    Find Dishes
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Results Section */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50/80 backdrop-blur-md shadow-lg">
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
          <Card className="mb-6 shadow-lg bg-white/80 backdrop-blur-md">
            <CardContent className="pt-8 pb-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mb-4">
                  <svg className="animate-spin w-8 h-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Getting personalized dish recommendations...</h3>
                <p className="text-gray-600">Analyzing your preferences to find the perfect dishes</p>
                
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

            {dishes.length > 0 && (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-4xl font-bold mb-3 text-gray-900">
                      Recommended Dishes in {searchLocation}
                    </h2>
                    <p className="text-xl text-gray-600">
                      Found {dishes.length} delicious dishes for you
                    </p>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="hidden md:flex items-center space-x-3 text-sm text-gray-500">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span>Updated just now</span>
                    </div>
                  </div>
                </div>


                {/* Selected Dish Details */}
                {selectedDish && (
                  <Card className="mb-6 shadow-xl border-2 border-amber-300 bg-gradient-to-r from-amber-100/80 to-yellow-100/80 backdrop-blur-md">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-2xl text-amber-900 flex items-center">
                            <span className="mr-2 text-3xl">🍽️</span>
                            {selectedDish.name}
                          </CardTitle>
                          <CardDescription className="text-lg text-amber-800">
                            {selectedDish.cuisine} • ${selectedDish.price} • {selectedDish.calories} cal
                          </CardDescription>
                        </div>
                        <Button
                          onClick={() => setSelectedDish(null)}
                          variant="outline"
                          size="sm"
                          className="border-amber-400 text-amber-700 hover:bg-amber-50"
                        >
                          ✕
                        </Button>
                      </div>
                    </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-amber-900 mb-2 flex items-center">
                        <span className="mr-2">🍽️</span>
                        Dish Details
                      </h4>
                      <div className="space-y-2 text-sm text-amber-800">
                        <p><strong>📍 Restaurant:</strong> {selectedDish.restaurant.name}</p>
                        <p><strong>📍 Address:</strong> {selectedDish.restaurant.address}</p>
                        <p><strong>💰 Price:</strong> ${selectedDish.price}</p>
                        <p><strong>🔥 Calories:</strong> {selectedDish.calories}</p>
                        <p><strong>⭐ Restaurant Rating:</strong> ⭐ {selectedDish.restaurant.rating}/5</p>
                        <p><strong>📜 Description:</strong> {selectedDish.description}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-amber-900 mb-2 flex items-center">
                        <span className="mr-2">🏷️</span>
                        Tags & Dietary Options
                      </h4>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {selectedDish.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full border border-blue-300"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(selectedDish.dietaryOptions)
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
                                className="px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full border border-purple-300"
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
              {dishes.map((dish) => (
                <Card key={dish.id} className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-0 bg-white/70 backdrop-blur-lg">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                          {dish.name}
                        </CardTitle>
                        <CardDescription className="text-base mt-1">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 mr-2">
                            {dish.cuisine}
                          </span>
                          <span className="text-gray-600 mr-2">${dish.price}</span>
                          <span className="text-xs text-gray-500">• {dish.calories} cal</span>
                        </CardDescription>
                        <div className="mt-2">
                          <p className="text-sm text-gray-600">{dish.description}</p>
                        </div>
                        <div className="mt-2">
                          <p className="text-xs text-gray-500">📍 {dish.restaurant.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center ml-4">
                        <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-full">
                          <svg className="w-4 h-4 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="text-sm font-bold text-yellow-700">
                            {dish.restaurant.rating}
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
                          {dish.restaurant.address}
                        </p>
        </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mb-2">
                        {dish.tags.slice(0, 4).map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Dietary Options */}
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(dish.dietaryOptions)
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
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                            <span>${dish.price}</span>
                          </div>
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <span>{dish.restaurant.phone}</span>
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium"
                          onClick={() => setSelectedDish(dish)}
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

        {!loading && !error && dishes.length === 0 && searchLocation && (
          <Card className="shadow-lg border-0 bg-white/90">
            <CardContent className="pt-12 pb-12">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-orange-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0118 12a8 8 0 10-8 8 7.962 7.962 0 01-2.291-.5" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  No dishes found
                </h3>
                <p className="text-lg text-gray-600 mb-2">
                  We couldn&apos;t find any dishes matching your preferences
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  Try a different search query or adjust your dietary filters
                </p>
                <Button 
                  onClick={() => {
                    setSearchQuery('');
                    setSearchLocation('');
                    setDishes([]);
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