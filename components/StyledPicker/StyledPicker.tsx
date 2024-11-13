import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useColorScheme } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Colors } from "@/constants/Colors";

interface CountryPickerProps {
  selectedValue: string;
  onValueChange: (value: string) => void;
  countries: { label: string; value: string }[]; // Modify countries prop to accept objects
}

const CountryPicker: React.FC<CountryPickerProps> = ({
  selectedValue,
  onValueChange,
  countries,
}) => {
  const [value, setValue] = useState<string | null>(selectedValue);
  const [isFocus, setIsFocus] = useState(false);
  const colorScheme = useColorScheme();

  const styles = StyleSheet.create({
    container: {
      marginBottom: 10,
    },
    dropdown: {
      borderWidth: 1,
      borderColor:
        colorScheme === "dark"
          ? Colors.light.background
          : Colors.dark.background,
      marginBottom: 10,
      padding: 10,
      fontSize: 14,
      borderRadius: 5,
      backgroundColor:
        colorScheme === "dark"
          ? Colors.dark.background
          : Colors.light.background,
      color: colorScheme === "dark" ? Colors.light.text : Colors.dark.text,
    },
    icon: {
      marginRight: 5,
    },
    label: {
      position: "absolute",
      left: 22,
      top: 8,
      zIndex: 999,
      paddingHorizontal: 8,
      fontSize: 14,
    },
    placeholderStyle: {
      fontSize: 16,
      color: colorScheme === "dark" ? Colors.dark.text : Colors.light.text,
    },
    selectedTextStyle: {
      fontSize: 16,
      color: colorScheme === "dark" ? Colors.dark.text : Colors.light.text,
    },
    iconStyle: {
      width: 20,
      height: 20,
    },
    inputSearchStyle: {
      fontSize: 16,
      backgroundColor:
        colorScheme === "dark"
          ? Colors.dark.background
          : Colors.light.background,
      color: colorScheme === "dark" ? Colors.light.text : Colors.dark.text,
    },
    dropdownContainer: {
      backgroundColor:
        colorScheme === "dark"
          ? Colors.dark.background
          : Colors.light.background,
      borderRadius: 5,
    },
    dropdownItem: {
      backgroundColor:
        colorScheme === "dark"
          ? Colors.dark.background
          : Colors.light.background,
      color: colorScheme === "dark" ? Colors.dark.text : Colors.light.text,
      paddingVertical: 10,
    },
    dropdownItemText: {
      color: colorScheme === "dark" ? Colors.dark.text : Colors.light.text,
    },
    dropdownFocus: {
      borderColor:
        colorScheme === "dark" ? Colors.dark.text : Colors.light.text,
    },
  });

  return (
    <View style={styles.container}>
      <Dropdown
        style={[styles.dropdown, isFocus && styles.dropdownFocus]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={countries}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={"Select Country"}
        searchPlaceholder="Search..."
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item) => {
          setValue(item.value);
          onValueChange(item.value); // Notify parent with the selected value
          setIsFocus(false);
        }}
        renderItem={(item) => (
          <View style={[styles.dropdownItem]}>
            <Text style={styles.dropdownItemText}>{item.label}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default CountryPicker;
