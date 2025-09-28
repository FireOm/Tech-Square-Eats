'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import AtlantaHeader from '@/components/AtlantaHeader';
import { Dish } from '@/types/restaurant';

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
  const [selectedDishIndex, setSelectedDishIndex] = useState<number | null>(null);
  const [currentDishIndex, setCurrentDishIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Animation states
  const [isSearchView, setIsSearchView] = useState(true);
  const [animationPhase, setAnimationPhase] = useState<'idle' | 'searching' | 'results'>('idle');



  // Function to get dish recommendations via API
  const handleGetRecommendations = async () => {
    // Start animation sequence
    setAnimationPhase('searching');
    setIsSearchView(false);
    
    // Show placeholder cards immediately
    const placeholderDishes: Dish[] = Array.from({ length: 6 }, (_, i) => ({
      id: `placeholder-${i}`,
      name: 'Loading...',
      description: 'Getting your perfect dish recommendation...',
      price: 0,
      calories: 0,
      tags: [],
      restaurant: {
        id: `placeholder-restaurant-${i}`,
        name: 'Loading Restaurant...',
        address: 'Loading address...',
        rating: 0,
        phone: '',
        website: '',
        hours: [],
        priceLevel: 1,
        distance: '',
      },
      cuisine: 'Loading...',
      dietaryOptions: {
        vegan: false, vegetarian: false, glutenFree: false,
        peanutFree: false, dairyFree: false, nutFree: false,
        soyFree: false, keto: false, halal: false, kosher: false,
      },
    }));
    
    setDishes(placeholderDishes);
    setTimeout(() => setAnimationPhase('results'), 300);
    
    setLoading(true);
    setError(null);

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
        const mappedDishes: Dish[] = data.recommendations.map((rec: unknown) => {
          const recommendation = rec as {
            restaurant: {
              id: number;
              name: string;
              address: string;
              rating: number;
              phone: string;
              website?: string;
              opening_hours?: string[];
              price_level?: number;
            };
            name: string;
            description: string;
            price: number;
            calories: number;
            tags?: string[];
          };
          
          // Determine cuisine from tags
          const tags = recommendation.tags || [];
          let cuisine = 'Indian'; // Default
          if (tags.includes('Indian')) cuisine = 'Indian';
          else if (tags.includes('Chinese')) cuisine = 'Chinese';
          else if (tags.includes('Mexican')) cuisine = 'Mexican';
          else if (tags.includes('American')) cuisine = 'American';
          else if (tags.includes('Italian')) cuisine = 'Italian';
          else if (tags.includes('Japanese')) cuisine = 'Japanese';
          else if (tags.includes('Korean')) cuisine = 'Korean';
          else if (tags.includes('Thai')) cuisine = 'Thai';
          else if (tags.includes('Vietnamese')) cuisine = 'Vietnamese';
          else if (tags.includes('Mediterranean')) cuisine = 'Mediterranean';
          else if (tags.includes('Middle Eastern')) cuisine = 'Middle Eastern';
          
          // Determine dietary options from tags and description
          const tagString = tags.join(' ').toLowerCase();
          const descString = recommendation.description.toLowerCase();
          const combinedText = `${tagString} ${descString}`;
          
          return {
            id: `${recommendation.restaurant.id}-${recommendation.name.replace(/\s+/g, '-').toLowerCase()}`,
            name: recommendation.name,
            description: recommendation.description,
            price: recommendation.price,
            calories: recommendation.calories,
            tags: tags,
            restaurant: {
              id: recommendation.restaurant.id.toString(),
              name: recommendation.restaurant.name,
              address: recommendation.restaurant.address,
              rating: recommendation.restaurant.rating,
              phone: recommendation.restaurant.phone,
              website: recommendation.restaurant.website || '',
              hours: recommendation.restaurant.opening_hours || [],
              priceLevel: recommendation.restaurant.price_level || 1,
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
        
        // Replace placeholder cards with real data
        setTimeout(() => {
          setDishes(mappedDishes);
          setSearchLocation('Atlanta, GA');
        }, 1000); // Give users time to see the placeholder animation
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
        
        // Replace placeholder cards with fallback data
        setTimeout(() => {
          setDishes(sampleDishes);
          setSearchLocation('Atlanta, GA');
        }, 1000);
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
      
      // Replace placeholder cards with error fallback data
      setTimeout(() => {
        setDishes(sampleDishes);
        setSearchLocation('Atlanta, GA');
      }, 1000);
    } finally {
      setLoading(false);
    }
  };

  // Handle escape key to close selected dish details
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && selectedDish) {
        setSelectedDish(null);
        setSelectedDishIndex(null);
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [selectedDish]);

  // Typewriter effect for animated dishes
  useEffect(() => {
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
  }, [currentText, isDeleting, currentDishIndex]);

  // Reset animation state when going back to search
  const handleBackToSearch = () => {
    setIsSearchView(true);
    setAnimationPhase('idle');
    setDishes([]);
    setError(null);
    setSelectedDish(null);
    setSelectedDishIndex(null);
  };

  // Handle dish selection with slide-out details
  const handleDishClick = (dish: Dish, index: number) => {
    // If same dish is clicked, close it
    if (selectedDishIndex === index) {
      setSelectedDish(null);
      setSelectedDishIndex(null);
    } else {
      setSelectedDish(dish);
      setSelectedDishIndex(index);
      
      // Scroll to the card with a small delay to ensure slide animation starts
      setTimeout(() => {
        const cardElement = document.getElementById(`dish-card-${index}`);
        if (cardElement) {
          cardElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center',
            inline: 'nearest' 
          });
        }
      }, 200);
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleGetRecommendations();
  };


  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-amber-50 via-[#F5E9D6] to-yellow-50">
      
      {/* Main Content */}
      <div className="relative z-10 min-h-screen">
        
        {/* Top Section - Search and Logo */}
        <div className={`transition-all duration-700 ease-in-out ${
          isSearchView 
            ? 'min-h-screen flex flex-col justify-center p-4 sm:p-6 lg:p-8' 
            : 'sticky top-0 z-20 bg-gradient-to-b from-[#F5E9D6]/95 via-[#F5E9D6]/90 to-[#F5E9D6]/80 backdrop-blur-md border-b border-[#E6D5C3]/50 shadow-lg py-2 px-4 sm:px-6 lg:px-8'
        }`}>
          <div className={`transition-all duration-700 ease-in-out ${
            isSearchView ? 'max-w-6xl mx-auto w-full' : 'max-w-7xl mx-auto w-full'
          }`}>
            
            {/* Search Section Container */}
            <div className={`transition-all duration-700 ease-in-out ${
              isSearchView ? 'flex flex-col items-center' : 'flex flex-row items-center space-x-4'
            }`}>
              
              {/* Atlanta-Themed Header */}
              <div 
                className={`transition-all duration-700 ease-in-out flex items-center ${
                  isSearchView 
                    ? 'transform scale-100 mb-0' 
                    : 'transform scale-100 flex-shrink-0 cursor-pointer hover:scale-80'
                }`}
                onClick={!isSearchView ? handleBackToSearch : undefined}
              >
                <AtlantaHeader />
              </div>

              {/* Search Form */}
              <Card className={`border-0 rounded-2xl transition-all duration-700 backdrop-blur-md bg-[#F5E9D6]/80 ${
                isSearchView ? 'mb-8 w-full' : 'flex-1'
              }`}>
              {isSearchView && (
                <CardHeader className="pb-6 pt-8 sm:pt-12 px-8 sm:px-12 lg:px-16">
                  <CardTitle className="text-4xl font-bold mb-4 text-[#FF3131] text-center">
                    <span className="text-[#FF3131]">I am feeling for </span>
                    <span className="text-[#CC2828] relative">
                      {currentText}
                      <span className="animate-pulse text-gray-400">|</span>
                    </span>
                    <span className="text-[#FF3131]"> at Tech Square</span>
                  </CardTitle>
                  <CardDescription className="text-lg text-[#CC2828] text-center">
                    Tell us what you&apos;re craving and we&apos;ll find the perfect dishes for you
                  </CardDescription>
                </CardHeader>
              )}
          <CardContent className={`transition-all duration-700 ${
            isSearchView ? 'px-8 sm:px-12 lg:px-16 pb-8 sm:pb-12' : 'px-4 py-2'
          }`}>
            <form onSubmit={handleSubmit} className={`transition-all duration-700 ${
              isSearchView ? 'space-y-6' : 'flex items-center space-x-2'
            }`}>
              <div className={`transition-all duration-700 ${
                isSearchView ? 'space-y-4' : 'flex-1'
              }`}>
                <div className="relative">
                  <Input
                    id="searchQuery"
                    type="text"
                    placeholder="Describe what you're craving..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    disabled={loading}
                    className={`pl-14 text-lg border-2 rounded-2xl border-[#E6D5C3] focus:border-[#FF3131] focus:ring-[#FF3131] bg-[#F5E9D6]/90 backdrop-blur-sm transition-all duration-700 ${
                      isSearchView ? 'h-16' : 'h-10'
                    }`}
                  />
                  <svg className={`absolute left-5 top-1/2 transform -translate-y-1/2 text-[#FF3131] transition-all duration-700 ${
                    isSearchView ? 'w-6 h-6' : 'w-4 h-4'
                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              <Button 
                type="submit" 
                disabled={loading || !searchQuery.trim()}
                className={`font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-700  hover:shadow-xl rounded-2xl bg-gradient-to-r from-[#FF3131] to-[#CC2828] hover:from-[#CC2828] hover:to-[#B22222] text-[#F5E9D6] ${
                  isSearchView ? 'w-full h-16 text-xl' : 'px-4 h-10 text-sm flex-shrink-0'
                }`}
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
        
            </div>
          </div>
        </div>
        
        {/* Results Section - Full Width Below */}
        <div className={`transition-all duration-700 ease-in-out ${
          isSearchView ? 'hidden' : 'block'
        } p-4 sm:p-6 lg:p-8`}>
          <div className="max-w-7xl mx-auto">
            
            {/* Animated Results Container */}
            <div className={`transition-all duration-700 ease-out ${
              animationPhase === 'results' 
                ? 'transform translate-y-0 opacity-100' 
                : 'transform translate-y-8 opacity-0'
            }`}>


        {/* Error state */}
        {error && (
          <Card className="mb-6 border-[#FF3131]/30 bg-[#FF3131]/10 backdrop-blur-md ">
            <CardContent className="pt-6">
              <div className="flex items-center text-[#FF3131]">
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

        {/* Results Header */}
        {dishes.length > 0 && (
          <div className={`mb-8 transition-all duration-700 ease-out ${
            animationPhase === 'results' 
              ? 'transform translate-y-0 opacity-100' 
              : 'transform -translate-y-4 opacity-0'
          }`} style={{ transitionDelay: '100ms' }}>
            <div className="text-center mb-6">
              <h2 className="text-3xl lg:text-4xl font-bold mb-3 text-[#FF3131] bg-gradient-to-r from-[#FF3131] to-[#CC2828] bg-clip-text text-transparent">
                Recommended Dishes in {searchLocation}
              </h2>
              <p className="text-lg text-[#CC2828]">
                Found {dishes.length} delicious dishes for you
              </p>
              <div className="flex items-center justify-center mt-4">
                <div className="flex items-center space-x-3 text-sm text-[#CC2828]">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>Updated just now</span>
                </div>
              </div>
            </div>



            {/* Animated Dishes Grid - Full Width */}
            <div className="grid gap-6 grid-cols-1">
              {dishes.map((dish, index) => {
                const isPlaceholder = dish.id.startsWith('placeholder-');
                const isSelected = selectedDishIndex === index;
                
                return (
                  <Card 
                    key={dish.id} 
                    id={`dish-card-${index}`}
                    className={`group hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 border-0 bg-[#F5E9D6]/70 backdrop-blur-lg overflow-hidden ${
                      animationPhase === 'results' 
                        ? 'transform translate-y-0 opacity-100 scale-100' 
                        : 'transform translate-y-8 opacity-0 scale-95'
                    } ${isPlaceholder ? 'animate-pulse' : 'cursor-pointer hover:bg-[#F5E9D6]/80'} ${
                      isSelected ? 'ring-2 ring-[#FF3131]/50 shadow-xl' : ''
                    }`}
                    style={{
                      transitionDelay: `${index * 100 + 200}ms`,
                      transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                  >
                    {isPlaceholder ? (
                      // Placeholder/Skeleton Card
                      <>
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                              <div className="flex items-center space-x-2 mt-1">
                                <div className="h-5 bg-gray-200 rounded-full w-16"></div>
                                <div className="h-4 bg-gray-200 rounded w-12"></div>
                                <div className="h-4 bg-gray-200 rounded w-16"></div>
                              </div>
                              <div className="mt-2">
                                <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
                                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                              </div>
                              <div className="mt-2">
                                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                              </div>
                            </div>
                            <div className="flex items-center ml-4">
                              <div className="h-6 bg-gray-200 rounded-full w-12"></div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="space-y-3">
                            <div className="flex items-start">
                              <div className="w-4 h-4 bg-gray-200 rounded mr-2 mt-0.5"></div>
                              <div className="flex-1">
                                <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
                                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-1 mb-2">
                              {[1, 2, 3].map((i) => (
                                <div key={i} className="h-5 bg-gray-200 rounded-full w-12"></div>
                              ))}
                            </div>
                            <div className="flex items-center justify-between pt-2">
                              <div className="flex items-center space-x-4">
                                <div className="h-4 bg-gray-200 rounded w-16"></div>
                                <div className="h-4 bg-gray-200 rounded w-20"></div>
                              </div>
                              <div className="h-8 bg-gray-200 rounded w-24"></div>
                            </div>
                          </div>
                        </CardContent>
                      </>
                    ) : (
                      // Real Data Card with Slide-out Details
                      <>
                        {/* Summary Section - Always Visible */}
                        <div onClick={() => !isPlaceholder && handleDishClick(dish, index)}>
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <CardTitle className="text-xl font-bold text-[#FF3131] group-hover:text-[#CC2828] transition-colors flex items-center">
                                {dish.name}
                                  <svg className={`w-5 h-5 ml-2 transition-transform duration-300 ${isSelected ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                  </svg>
                              </CardTitle>
                              <CardDescription className="text-base mt-1">
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#FF3131]/20 text-[#FF3131] mr-2">
                                  {dish.cuisine}
                                </span>
                                <span className="text-[#CC2828] mr-2">${dish.price}</span>
                                <span className="text-xs text-[#B22222]">• {dish.calories} cal</span>
                              </CardDescription>
                              <div className="mt-2">
                                <p className="text-sm text-[#CC2828]">{dish.description}</p>
                              </div>
                              <div className="mt-2">
                                <p className="text-xs text-[#B22222]">{dish.restaurant.name}</p>
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
                          <CardContent className="pt-0 pb-3">
                          <div className="space-y-3">
                            <div className="flex items-start">
                              <svg className="w-4 h-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              <p className="text-sm text-[#CC2828] leading-relaxed">
                                {dish.restaurant.address}
                              </p>
                            </div>

                              {/* Quick Tags Preview */}
                            <div className="flex flex-wrap gap-1 mb-2">
                                {dish.tags.slice(0, 3).map((tag, tagIndex) => (
                                <span
                                    key={tagIndex}
                                  className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800"
                                >
                                  {tag}
                                </span>
                              ))}
                                {dish.tags.length > 3 && (
                                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-600">
                                    +{dish.tags.length - 3} more
                                  </span>
                                )}
                            </div>

                              <div className="flex items-center justify-between pt-2">
                                <div className="flex items-center space-x-4 text-sm text-[#B22222]">
                                  <div className="flex items-center">
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
                                  variant="ghost"
                                  size="sm"
                                  className="text-[#FF3131] hover:bg-[#FF3131]/10 text-xs"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDishClick(dish, index);
                                  }}
                                >
                                  {isSelected ? 'Less' : 'More'} Details
                                  <svg className={`w-4 h-4 ml-1 transition-transform duration-300 ${isSelected ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                  </svg>
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </div>
                        
                        {/* Sliding Details Section */}
                        <div className={`transition-all duration-500 ease-in-out overflow-hidden ${
                          isSelected ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
                        }`}>
                          <div className="border-t border-[#E6D5C3]/50 bg-gradient-to-r from-[#F0E6D2]/50 to-[#E6D5C3]/30">
                            <CardContent className="pt-6 pb-6">
                              <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-[#FF3131] flex items-center">
                                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  Detailed Information
                                </h3>
                                <Button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedDish(null);
                                    setSelectedDishIndex(null);
                                  }}
                                  variant="ghost"
                                  size="sm"
                                  className="text-[#FF3131] hover:bg-[#FF3131]/10"
                                >
                                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                  Close
                                </Button>
                              </div>
                              
                              <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                  <h4 className="font-semibold text-[#FF3131] mb-3 flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                    Restaurant & Dish Info
                                  </h4>
                                  <div className="space-y-3 text-sm text-[#CC2828]">
                                    <div className="flex items-start">
                                      <svg className="w-4 h-4 mr-2 mt-0.5 text-[#FF3131] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                      </svg>
                                      <div>
                                        <strong>Restaurant:</strong> {dish.restaurant.name}
                                      </div>
                                    </div>
                                    <div className="flex items-start">
                                      <svg className="w-4 h-4 mr-2 mt-0.5 text-[#FF3131] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                      </svg>
                                      <div>
                                        <strong>Address:</strong> {dish.restaurant.address}
                                      </div>
                                    </div>
                                    <div className="flex items-start">
                                      <svg className="w-4 h-4 mr-2 mt-0.5 text-[#FF3131] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                      </svg>
                                      <div>
                                        <strong>Price:</strong> ${dish.price}
                                      </div>
                                    </div>
                                    <div className="flex items-start">
                                      <svg className="w-4 h-4 mr-2 mt-0.5 text-[#FF3131] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                      </svg>
                                      <div>
                                        <strong>Calories:</strong> {dish.calories}
                                      </div>
                                    </div>
                                    <div className="flex items-start">
                                      <svg className="w-4 h-4 mr-2 mt-0.5 text-[#FF3131] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                      </svg>
                                      <div>
                                        <strong>Rating:</strong> {dish.restaurant.rating}/5
                                      </div>
                                    </div>
                                    <div className="flex items-start">
                                      <svg className="w-4 h-4 mr-2 mt-0.5 text-[#FF3131] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                      </svg>
                                      <div>
                                        <strong>Phone:</strong> {dish.restaurant.phone}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <h4 className="font-semibold text-[#FF3131] mb-3 flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                    </svg>
                                    Tags & Dietary Options
                                  </h4>
                                  <div className="space-y-3">
                                    <div>
                                      <p className="text-sm font-medium text-[#CC2828] mb-2">All Tags:</p>
                                      <div className="flex flex-wrap gap-2">
                                        {dish.tags.map((tag, tagIndex) => (
                                          <span
                                            key={tagIndex}
                                            className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full border border-blue-300"
                                          >
                                            {tag}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-[#CC2828] mb-2">Dietary Options:</p>
                                      <div className="flex flex-wrap gap-2">
                              {Object.entries(dish.dietaryOptions)
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
                                                className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full border border-green-300"
                                    >
                                      {optionLabels[option]}
                                    </span>
                                  );
                                })}
                                        {Object.entries(dish.dietaryOptions)
                                          .filter(([, available]) => available).length === 0 && (
                                          <span className="text-sm text-gray-500 italic">No specific dietary options specified</span>
                                        )}
                            </div>
                                </div>
                                    
                                    {/* Contact Actions */}
                                    <div className="mt-4 pt-4 border-t border-[#E6D5C3]">
                                      <p className="text-sm font-medium text-[#CC2828] mb-3">Quick Actions:</p>
                                      <div className="flex flex-wrap gap-2">
                                        <Button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            window.open(`tel:${dish.restaurant.phone}`, '_self');
                                          }}
                                          variant="outline"
                                          size="sm"
                                          className="border-[#FF3131] text-[#FF3131] hover:bg-[#F5E9D6] hover:border-[#CC2828] cursor-pointer"
                                        >
                                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                  </svg>
                                          Call
                                        </Button>
                                        <Button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            const address = encodeURIComponent(dish.restaurant.address);
                                            window.open(`https://maps.google.com?q=${address}`, '_blank');
                                          }}
                                          variant="outline"
                                          size="sm"
                                          className="border-[#FF3131] text-[#FF3131] hover:bg-[#F5E9D6] hover:border-[#CC2828] cursor-pointer"
                                        >
                                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                          </svg>
                                          Directions
                                        </Button>
                                        {dish.restaurant.website && (
                                          <Button
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              window.open(dish.restaurant.website, '_blank');
                                            }}
                                            variant="outline"
                                            size="sm"
                                            className="border-[#FF3131] text-[#FF3131] hover:bg-[#F5E9D6] hover:border-[#CC2828] cursor-pointer"
                                          >
                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                                            </svg>
                                            Website
                                          </Button>
                                        )}
                                      </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                          </div>
                        </div>
                      </>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && dishes.length === 0 && searchLocation && (
          <Card className="shadow-lg border-0 bg-[#F5E9D6]/90">
            <CardContent className="pt-12 pb-12">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-[#FF3131]/20 to-[#CC2828]/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-[#FF3131]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0118 12a8 8 0 10-8 8 7.962 7.962 0 01-2.291-.5" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-[#FF3131] mb-3">
                  No dishes found
                </h3>
                <p className="text-lg text-[#CC2828] mb-2">
                  We couldn&apos;t find any dishes matching your preferences
                </p>
                <p className="text-sm text-[#B22222] mb-6">
                  Try a different search query or adjust your dietary filters
                </p>
                <Button 
                  onClick={handleBackToSearch}
                  variant="outline"
                  className="border-[#FF3131] text-[#FF3131] hover:bg-[#F5E9D6]"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  New Search
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}