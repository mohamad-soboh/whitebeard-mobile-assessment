import React, { useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  useColorScheme,
  Alert,
  SafeAreaView,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { IUniversity } from "@/.expo/types/University";
import { Swipeable } from "react-native-gesture-handler";
import { useFavorites } from "@/hooks/context"; 

const FavoritesScreen = () => {
  const colorScheme = useColorScheme();
  const { favoriteUniversities, toggleFavorite } = useFavorites();

  // Remove university from favorites
  const handleRemoveFavorite = (university: IUniversity) => {
    Alert.alert(
      "Remove from favorites",
      `Are you sure you want to remove ${university.name} from your favorites?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Remove",
          onPress: () => toggleFavorite(university), // Use the toggleFavorite function from context
        },
      ]
    );
  };

  // Render each university item with a swipeable gesture to remove it
  const renderItem = useCallback(
    ({ item }: { item: IUniversity }) => {
      return (
        <SafeAreaView style={{ flex: 1 }}>
          <Swipeable
            renderRightActions={() => (
              <Pressable
                onPress={() => handleRemoveFavorite(item)}
                style={[
                  styles.deleteButton,
                  {
                    backgroundColor:
                      colorScheme === "dark" ? "#d9534f" : "#c9302c",
                  },
                ]}
              >
                <MaterialIcons name="delete" size={28} color="white" />
              </Pressable>
            )}
          >
            <View style={styles.itemContainer}>
              <Pressable style={styles.textContainer}>
                <Text style={styles.universityName}>{item.name}</Text>
                <Text style={styles.universityCountry}>{item.country}</Text>
                {item["state-province"] && (
                  <Text style={styles.universityState}>
                    {item["state-province"]}
                  </Text>
                )}
              </Pressable>
            </View>
          </Swipeable>
        </SafeAreaView>
      );
    },
    [favoriteUniversities, colorScheme, handleRemoveFavorite]
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 10,
      backgroundColor: colorScheme === "dark" ? "#121212" : "#fff",
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
    deleteButton: {
      justifyContent: "center",
      alignItems: "center",
      width: 100,
      height: "100%",
      borderRadius: 5,
      paddingHorizontal: 15,
    },
    emptyMessageContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },
    emptyMessage: {
      fontSize: 24,
      width: "80%",
      lineHeight: 32,
      textAlign: "center",
      color: colorScheme === "dark" ? "#bbb" : "#555",
    },
  });

  // Conditionally render the FlatList or an empty message
  return (
    <View style={styles.container}>
      {favoriteUniversities.length === 0 ? (
        <View style={styles.emptyMessageContainer}>
          <Text style={styles.emptyMessage}>
            No favorites added yet. Start adding some!
          </Text>
        </View>
      ) : (
        <FlatList
          data={favoriteUniversities}
          renderItem={renderItem}
          keyExtractor={(item, index) =>
            `${item.alpha_two_code}-${item.name}-${index}`
          }
        />
      )}
    </View>
  );
};

export default FavoritesScreen;
