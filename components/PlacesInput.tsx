import React from "react";
import { StyleSheet, Text, View } from "react-native";
import GooglePlacesTextInput from "react-native-google-places-textinput";

const GOOGLE_PLACES_API_KEY = process.env
  .EXPO_PUBLIC_GOOGLE_PLACES_API_KEY as string;

interface PlacesInputProps {
  label: string;
  placeholder?: string;
  onPlaceSelected: (data: any, details: any) => void;
}

export default function PlacesInput({
  label,
  placeholder = "Search place...",
  onPlaceSelected,
}: PlacesInputProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <GooglePlacesTextInput
        apiKey={GOOGLE_PLACES_API_KEY}
        onPlaceSelect={onPlaceSelected}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
});
