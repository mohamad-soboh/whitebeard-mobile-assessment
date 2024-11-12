import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  useColorScheme,
  Pressable,
} from "react-native";
import { WebView } from "react-native-webview";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Colors } from "@/constants/Colors";

interface StyledModalProps {
  visible: boolean;
  university: any;
  onClose: () => void;
}

const StyledModal: React.FC<StyledModalProps> = ({
  visible,
  university,
  onClose,
}) => {
  const colorScheme = useColorScheme();

  const modalStyles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.7)",
    },
    modalContainer: {
      width: "100%",
      height: "90%",
      backgroundColor:
        colorScheme === "dark"
          ? Colors.dark.background
          : Colors.light.background,
      borderRadius: 10,
      padding: 10,
      position: "relative",
    },
    closeButton: {
      padding: 10,
      alignSelf: "flex-start",
    },
    modalTitleContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
      paddingHorizontal: 10,
    },
    modalTitle: {
      fontSize: 22,
      fontWeight: "bold",
      color: colorScheme === "dark" ? Colors.dark.text : Colors.light.text,
      width: "90%",
    },
    webviewContainer: {
      flex: 1,
      borderRadius: 10,
    },
    webview: {
      borderRadius: 10,
    },
  });

  return (
    <Modal
      visible={visible}
      onRequestClose={onClose}
      animationType="slide"
      transparent
    >
      <View style={modalStyles.modalOverlay}>
        <View style={modalStyles.modalContainer}>
          {university && (
            <View style={modalStyles.webviewContainer}>
              <View style={modalStyles.modalTitleContainer}>
                <Text style={modalStyles.modalTitle}>{university.name}</Text>
                <Pressable onPress={onClose} style={modalStyles.closeButton}>
                  <AntDesign
                    name="closecircle"
                    size={32}
                    color={
                      colorScheme === "dark"
                        ? Colors.light.icon
                        : Colors.dark.icon
                    }
                  />
                </Pressable>
              </View>
              <WebView
                source={{ uri: university.web_pages[0] }}
                style={modalStyles.webview}
              />
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default StyledModal;
