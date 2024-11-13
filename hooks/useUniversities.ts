import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IUniversity } from "@/.expo/types/University";

export const useUniversities = () => {
  const [allUniversities, setAllUniversities] = useState<IUniversity[]>([]);
  const [universitiesByCountry, setUniversitiesByCountry] = useState<
    IUniversity[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [availableCountries, setAvailableCountries] = useState<
    { label: string; value: string }[]
  >([]);

  // Function to load all universities
  const loadAllUniversities = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await axios.get(
        "http://universities.hipolabs.com/search"
      );
      const universitiesData: IUniversity[] = response.data;

      universitiesData.sort((a, b) => a.name.localeCompare(b.name));
      setAllUniversities(universitiesData);

      // Extract unique countries and sort them alphabetically
      const countriesList = [
        ...new Set(
          universitiesData.map(
            (university: { country: string }) => university.country
          )
        ),
      ];

     
      const availableCountries = [
        { label: "All Countries", value: "" },
        ...countriesList
          .sort((a, b) => a.localeCompare(b))
          .map((country) => ({
            label: country, 
            value: country,
          })),
      ];

      setAvailableCountries(availableCountries); 

      // If there is a selected country in AsyncStorage, load universities for that country
      const savedCountry = await AsyncStorage.getItem("selectedCountry");
      if (savedCountry) {
        setSelectedCountry(savedCountry);
        loadUniversitiesByCountry(savedCountry);
      } else {
        setUniversitiesByCountry(universitiesData);
      }
    } catch (err) {
      setErrorMessage(
        "Oops! We couldn't load the universities. Please try again."
      );
    }

    setIsLoading(false);
  };

  // Function to load universities for a specific country
  const loadUniversitiesByCountry = async (country: string) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await axios.get(
        "http://universities.hipolabs.com/search",
        {
          params: { country },
        }
      );
      const universitiesData: IUniversity[] = response.data;

      universitiesData.sort((a, b) => a.name.localeCompare(b.name));
      setUniversitiesByCountry(universitiesData);
    } catch (err) {
      setErrorMessage(
        "Oops! We couldn't load the universities for the selected country. Please try again."
      );
    }

    setIsLoading(false);
  };

  // Function to handle country selection change
  const handleSelectCountry = async (country: string) => {
    setSelectedCountry(country);
    await AsyncStorage.setItem("selectedCountry", country); // Save selected country to AsyncStorage
    loadUniversitiesByCountry(country); // Trigger the university reload for the selected country
  };

  const reloadUniversities = useCallback(() => {
    if (selectedCountry === "") {
      loadAllUniversities();
    } else {
      loadUniversitiesByCountry(selectedCountry); 
    }
  }, [selectedCountry]);

  useEffect(() => {
    loadAllUniversities();
  }, []);

  // Function to filter universities based on search term
  const filterUniversities = (searchTerm: string) => {
    let universitiesToFilter = selectedCountry
      ? allUniversities.filter(
          (university) => university.country === selectedCountry
        )
      : allUniversities;

    if (searchTerm.trim() === "") {
      setUniversitiesByCountry(universitiesToFilter);
      return;
    }

    universitiesToFilter = universitiesToFilter.filter((university) =>
      university.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setUniversitiesByCountry(universitiesToFilter);
  };

  return {
    filteredUniversities: universitiesByCountry,
    allUniversities,
    isLoading,
    errorMessage,
    searchTerm,
    selectedCountry,
    availableCountries,
    onSearchChange: (text: string) => {
      setSearchTerm(text);
      filterUniversities(text);
    },
    setSelectedCountry: handleSelectCountry,
    reloadUniversities,
  };
};
