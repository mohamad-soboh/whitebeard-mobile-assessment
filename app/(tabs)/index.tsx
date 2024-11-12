import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  ActivityIndicator,
  Pressable,
  useColorScheme,
  StyleSheet,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import StyledModal from "@/components/StyledModal/StyledModal";
import { useUniversities } from "@/hooks/useUniversities";
import StyledPicker from "@/components/StyledPicker/StyledPicker";
import { IUniversity } from "@/.expo/types/University";
import { useFavorites } from "@/hooks/context"; // Import the custom hook for favorites

const BrowseScreen = () => {
  const colorScheme = useColorScheme();

  // Use the useUniversities hook for university data
  const {
    filteredUniversities,
    isLoading,
    errorMessage,
    searchTerm,
    selectedCountry,
    availableCountries,
    onSearchChange,
    reloadUniversities,
    setSelectedCountry,
  } = useUniversities();

  // Use the useFavorites hook for managing favorite universities
  const { favoriteUniversities, toggleFavorite } = useFavorites();

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedUniversity, setSelectedUniversity] =
    useState<IUniversity | null>(null);

  const openModal = (university: IUniversity) => {
    setSelectedUniversity(university);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedUniversity(null);
  };

  const renderItem = useCallback(
    ({ item }: { item: IUniversity }) => (
      <View style={styles.itemContainer}>
        <Pressable onPress={() => openModal(item)} style={styles.textContainer}>
          <Text style={styles.universityName}>{item.name}</Text>
          <Text style={styles.universityCountry}>{item.country}</Text>
          {item["state-province"] && (
            <Text style={styles.universityState}>{item["state-province"]}</Text>
          )}
        </Pressable>
        <Pressable
          onPress={() => toggleFavorite(item)} // Use the toggleFavorite from context
          style={styles.favoriteIconContainer}
        >
          <MaterialIcons
            name={
              favoriteUniversities.some((fav) => fav.name === item.name)
                ? "favorite"
                : "favorite-border"
            }
            size={28}
            color={colorScheme === "dark" ? "#f0f0f0" : "#333"}
          />
        </Pressable>
      </View>
    ),
    [favoriteUniversities, colorScheme, toggleFavorite]
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 10,
      backgroundColor: colorScheme === "dark" ? "#121212" : "#fff",
    },
    searchInput: {
      borderWidth: 1,
      borderColor: colorScheme === "dark" ? "#f0f0f0" : "#333",
      marginBottom: 10,
      padding: 10,
      fontSize: 14,
      borderRadius: 5,
      color: colorScheme === "dark" ? "#f0f0f0" : "#333",
    },
    itemContainer: {
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderColor: colorScheme === "dark" ? "#444" : "#ddd",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    textContainer: {
      flex: 1,
      paddingRight: 10,
    },
    universityName: {
      fontSize: 18,
      fontWeight: "bold",
      color: colorScheme === "dark" ? "#f0f0f0" : "#333",
    },
    universityCountry: {
      color: colorScheme === "dark" ? "#bbb" : "#555",
    },
    universityState: {
      color: colorScheme === "dark" ? "#bbb" : "#555",
    },
    favoriteIconContainer: {
      justifyContent: "center",
      alignItems: "center",
    },
    fetchStateContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    errorText: {
      fontSize: 24,
      fontWeight: "bold",
      textAlign: "center",
      width: "80%",
      color: colorScheme === "dark" ? "#bbb" : "#555",
    },
  });

  return (
    <View style={styles.container}>
      <StyledPicker
        selectedValue={selectedCountry}
        onValueChange={(value) => setSelectedCountry(value)}
        countries={availableCountries}
      />

      <TextInput
        placeholder="Search"
        value={searchTerm}
        onChangeText={onSearchChange}
        style={styles.searchInput}
      />

      {isLoading ? (
        <View style={styles.fetchStateContainer}>
          <ActivityIndicator size="large" />
        </View>
      ) : errorMessage ? (
        <View style={styles.fetchStateContainer}>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={filteredUniversities}
          renderItem={renderItem}
          onRefresh={reloadUniversities}
          refreshing={isLoading}
          keyExtractor={(item, index) =>
            `${item.alpha_two_code}-${item.name}-${index}`
          }
        />
      )}

      <StyledModal
        visible={modalVisible}
        university={selectedUniversity}
        onClose={closeModal}
      />
    </View>
  );
};

export default BrowseScreen;
