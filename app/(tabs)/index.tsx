import React, { FC, useCallback, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  ActivityIndicator,
  Pressable,
  useColorScheme,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import StyledModal from "@/components/StyledModal/StyledModal";
import StyledPicker from "@/components/StyledPicker/StyledPicker";
import { useUniversities } from "@/hooks/useUniversities";
import { useFavorites } from "@/hooks/FavoritesContext";
import { IUniversity } from "@/.expo/types/University";
import { Colors } from "@/constants/Colors";

const BrowseScreen: FC = () => {
  const colorScheme = useColorScheme();
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
          onPress={() => toggleFavorite(item)}
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
      backgroundColor:
        colorScheme === "dark"
          ? Colors.dark.background
          : Colors.light.background,
    },
    searchInput: {
      borderWidth: 1,
      borderColor:
        colorScheme === "dark"
          ? Colors.light.background
          : Colors.dark.background,
      marginBottom: 10,
      padding: 10,
      fontSize: 14,
      borderRadius: 5,
      color: colorScheme === "dark" ? Colors.dark.text : Colors.light.text,
    },
    itemContainer: {
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderColor:
        colorScheme === "dark"
          ? Colors.dark.background
          : Colors.dark.background,
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
      color: colorScheme === "dark" ? Colors.dark.text : Colors.light.text,
    },
    screenTitle: {
      fontSize: 24,
      fontWeight: "bold",
      textAlign: "center",
      color: colorScheme === "dark" ? Colors.dark.text : Colors.light.text,
    },
    universityCountry: {
      color: colorScheme === "dark" ? Colors.dark.text : Colors.light.text,
    },
    universityState: {
      color: colorScheme === "dark" ? Colors.dark.text : Colors.light.text,
    },
    favoriteIconContainer: {
      justifyContent: "center",
      alignItems: "center",
    },
    fetchStateContainer: {
      height: "100%",
      alignItems: "center",
      justifyContent: "center",
    },
    errorText: {
      fontSize: 24,
      fontWeight: "bold",
      textAlign: "center",
      width: "80%",
      color: colorScheme === "dark" ? Colors.dark.text : Colors.light.text,
    },
    reloadButton: {
      marginTop: 20,
      padding: 10,
      backgroundColor:
        colorScheme === "dark" ? Colors.dark.text : Colors.light.text,
      borderRadius: 5,
    },
    reloadButtonText: {
      color: "#fff",
      fontSize: 16,
      textAlign: "center",
    },

    titleContainer: {
      paddingTop: 10,
      paddingBottom: 15,
    },
    screenChildrenContainer: {
      paddingHorizontal: 10,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.screenChildrenContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.screenTitle}>Universities</Text>
        </View>
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
            <Pressable onPress={reloadUniversities} style={styles.reloadButton}>
              <Text style={styles.reloadButtonText}>Reload</Text>
            </Pressable>
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
    </SafeAreaView>
  );
};

export default BrowseScreen;
