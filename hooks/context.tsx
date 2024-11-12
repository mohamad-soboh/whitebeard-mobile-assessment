import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IUniversity } from "@/.expo/types/University";

// Define the type for children prop
interface FavoritesProviderProps {
  children: ReactNode;
}

// Create context with default values
const FavoritesContext = createContext({
  favoriteUniversities: [] as IUniversity[],
  toggleFavorite: (university: IUniversity) => {},
});

// Create a custom hook to use the context
export const useFavorites = () => useContext(FavoritesContext);

// Provider component to wrap your application
export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({ children }) => {
  const [favoriteUniversities, setFavoriteUniversities] = useState<IUniversity[]>([]);

  // Load favorites from AsyncStorage on app load
  useEffect(() => {
    const loadFavorites = async () => {
      const savedFavorites = await AsyncStorage.getItem("favorites");
      if (savedFavorites) {
        setFavoriteUniversities(JSON.parse(savedFavorites));
      }
    };
    loadFavorites();
  }, []);

  // Toggle the favorite status of a university
  const toggleFavorite = async (university: IUniversity) => {
    const newFavorites = [...favoriteUniversities];
    const index = newFavorites.findIndex((item) => item.name === university.name);

    if (index === -1) {
      newFavorites.push(university);
    } else {
      newFavorites.splice(index, 1);
    }

    // Update AsyncStorage immediately after modifying the state
    await AsyncStorage.setItem("favorites", JSON.stringify(newFavorites));

    // Update the local state
    setFavoriteUniversities(newFavorites);
  };

  return (
    <FavoritesContext.Provider value={{ favoriteUniversities, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};
