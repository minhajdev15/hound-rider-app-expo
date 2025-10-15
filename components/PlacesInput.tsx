import { useThemeColor } from "@/hooks/use-theme-color";
import React from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import GooglePlacesTextInput from "react-native-google-places-textinput";

const GOOGLE_PLACES_API_KEY = process.env
  .EXPO_PUBLIC_GOOGLE_PLACES_API_KEY as string;

interface PlacesInputProps {
  label: string;
  placeholder?: string;
  onPlaceSelected: (data: any, details: any) => void;
  containerStyle?: ViewStyle;
}

export default function PlacesInput({
  label,
  placeholder = "Search place...",
  onPlaceSelected,
  containerStyle,
}: PlacesInputProps) {
  const textColor = useThemeColor({}, "text");
  const background = useThemeColor({}, "background");
  const isDark = background !== "#fff"; 
  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={[styles.label, { color: textColor }]}>{label}</Text>
      <View
        style={[
          styles.inputWrapper,
          {
            backgroundColor: "transparent",
            borderColor: isDark ? "rgba(255,255,255,0.10)" : "#e6e7e6ff",
          },
        ]}
      >
        <GooglePlacesTextInput
          apiKey={GOOGLE_PLACES_API_KEY}
          onPlaceSelect={onPlaceSelected}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  inputWrapper: {
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
});
