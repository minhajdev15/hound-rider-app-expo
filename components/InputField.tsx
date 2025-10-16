import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

interface InputFieldProps {
  label: string;
  placeholder?: string;
  updateValue?: (text: string) => void;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  placeholder = "Type here...",
  updateValue,
}) => {
  const [value, setValue] = useState("");

  const handleChange = (text: string) => {
    setValue(text);
    if (updateValue) updateValue(text);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={handleChange}
        placeholder={placeholder}
        placeholderTextColor="#999"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: "#fff",
    color: "#333",
  },
});

export default InputField;
