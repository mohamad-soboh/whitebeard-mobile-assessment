import React, { useCallback, useState } from "react";
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
import { Swipeable } from "react-native-gesture-handler";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { IUniversity } from "@/.expo/types/University";
import { useFavorites } from "@/hooks/FavoritesContext";
import StyledModal from "@/components/StyledModal/StyledModal"; 
import { Colors } from "@/constants/Colors";

const FavoritesScreen = () => {
  const colorScheme = useColorScheme();
  const { favoriteUniversities, toggleFavorite } = useFavorites();

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedUniversity, setSelectedUniversity] =
    useState<IUniversity | null>(null);

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

  const openModal = (university: IUniversity) => {
    setSelectedUniversity(university);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedUniversity(null);
  };

  const renderItem = useCallback(
    ({ item }: { item: IUniversity }) => {
      return (
        <View style={styles.itemWrapper}>
          <Swipeable
            renderRightActions={() => (
              <Pressable
                onPress={() => handleRemoveFavorite(item)}
                style={[
                  styles.deleteButton,
                  {
                    backgroundColor: "#d9534f",
                  },
                ]}
              >
                <MaterialIcons
                  name="delete"
                  size={28}
                  color={Colors.light.background}
                />
              </Pressable>
            )}
          >
            <View style={styles.itemContainer}>
              <Pressable
                style={styles.textContainer}
                onPress={() => openModal(item)}
              >
                <Text style={styles.universityName} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={styles.universityCountry}>{item.country}</Text>
                {item["state-province"] && (
                  <Text style={styles.universityState}>
                    {item["state-province"]}
                  </Text>
                )}
              </Pressable>
            </View>
          </Swipeable>
        </View>
      );
    },
    [favoriteUniversities, colorScheme, handleRemoveFavorite]
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:
        colorScheme === "dark"
          ? Colors.dark.background
          : Colors.light.background,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      textAlign: "center",
      marginVertical: 20,
      color:
        colorScheme === "dark"
          ? Colors.light.background
          : Colors.dark.background,
    },
    itemWrapper: {
      flex: 1,
      paddingHorizontal: 10,
    },
    itemContainer: {
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderColor:
        colorScheme === "dark" ? Colors.dark.text : Colors.light.text,
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
    universityCountry: {
      color: colorScheme === "dark" ? Colors.dark.text : Colors.light.text,
    },
    universityState: {
      color: colorScheme === "dark" ? Colors.dark.text : Colors.light.text,
    },
    deleteButton: {
      justifyContent: "center",
      alignItems: "center",
      width: "20%",
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
      color: colorScheme === "dark" ? Colors.dark.text : Colors.light.text,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Favorite Universities</Text>
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

      {/* Modal to show university details */}
      <StyledModal
        visible={modalVisible}
        university={selectedUniversity}
        onClose={closeModal}
      />
    </SafeAreaView>
  );
};

export default FavoritesScreen;
