import React from "react";
import { Picker } from "@react-native-picker/picker";
import { useColorScheme } from "react-native";
import { Colors } from "@/constants/Colors";
interface CountryPickerProps {
  selectedValue: string;
  onValueChange: (value: string) => void;
  countries: string[];
}

const StyledPicker: React.FC<CountryPickerProps> = ({
  selectedValue,
  onValueChange,
  countries,
}) => {
  const colorScheme = useColorScheme();

  return (
    <Picker selectedValue={selectedValue} onValueChange={onValueChange}>
      <Picker.Item
        label="All Countries"
        value=""
        color={colorScheme === "dark" ? Colors.dark.text : Colors.light.text}
      />
      {countries.map((country, index) => (
        <Picker.Item
          key={index}
          label={country}
          value={country}
          color={colorScheme === "dark" ? Colors.dark.text : Colors.light.text}
        />
      ))}
    </Picker>
  );
};

export default StyledPicker;
