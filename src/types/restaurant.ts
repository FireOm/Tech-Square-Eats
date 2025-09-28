// Define the structure of restaurant data
export interface Restaurant {
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

// Define the structure of dish/menu item data
export interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  calories: number;
  tags: string[];
  restaurant: {
    id: string;
    name: string;
    address: string;
    rating: number;
    phone: string;
    website?: string;
    hours: string[];
    priceLevel: number;
    distance: string;
  };
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
  cuisine: string;
}