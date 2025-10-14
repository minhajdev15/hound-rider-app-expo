import { HelloWave } from "@/components/hello-wave";
import MapComponent from "@/components/MapComponent";
import PlacesInput from "@/components/PlacesInput";
import { ThemedButton } from "@/components/themed-button";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { getPreciseDistance } from "geolib";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { LatLng } from "react-native-maps";

async function getCoordinates(placeId: string) {
  const GOOGLE_PLACES_API_KEY = process.env
    .EXPO_PUBLIC_GOOGLE_PLACES_API_KEY as string;
  if (!GOOGLE_PLACES_API_KEY) {
    console.error("API key is missing");
  }
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_PLACES_API_KEY}`
  );
  const data = await response.json();

  if (data?.result?.geometry?.location) {
    const { lat, lng } = data.result.geometry.location;
    console.log("Latitude:", lat, "Longitude:", lng);
    return { latitude: lat, longitude: lng };
  } else {
    console.warn("No geometry found for this place ID");
    return null;
  }
}

export default function HomeScreen() {
  const [sourceCoords, setSourceCoords] = useState<LatLng | null>(null);
  const [destCoords, setDestCoords] = useState<LatLng | null>(null);

  const handlePlaceInput = async (
    data: any,
    type: "source" | "destination"
  ) => {
    const coords = (await getCoordinates(data.placeId)) as any;
    if (type === "source") setSourceCoords(coords);
    if (type === "destination") setDestCoords(coords);
  };

  const distanceInKm =
    sourceCoords && destCoords
      ? (getPreciseDistance(sourceCoords, destCoords) / 1000).toFixed(2)
      : null;

  return (
    <View style={styles.container}>
      {/* Header */}
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Hound mobility</ThemedText>
        <HelloWave />
      </ThemedView>

      {/* Input Fields */}
      <ThemedView style={styles.inputSection}>
        <PlacesInput
          onPlaceSelected={(data) => handlePlaceInput(data, "source")}
          label="Source"
        />
        <PlacesInput
          onPlaceSelected={(data) => handlePlaceInput(data, "destination")}
          label="Destination"
        />
      </ThemedView>

      {/* Action Button */}
      <ThemedButton
        label="Select ride"
        onPress={() => {}}
        style={styles.button}
      />

      {/* Map container */}
      <View style={styles.mapWrapper}>
        <MapComponent source={sourceCoords} destination={destCoords} />
      </View>

      {/* Distance Card BELOW the map */}
      {distanceInKm && (
        <View style={styles.distanceCard}>
          <Text style={styles.distanceLabel}>Estimated Distance</Text>
          <Text style={styles.distanceValue}>{distanceInKm} km</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#0d0d0d",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  inputSection: {
    gap: 20,
    marginBottom: 30,
  },
  button: {
    alignSelf: "center",
    width: "60%",
    marginBottom: 20,
  },
  mapWrapper: {
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
  },
  distanceCard: {
    marginTop: 16,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  distanceLabel: {
    fontSize: 16,
    color: "#ccc",
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  distanceValue: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#4dbd10ff",
  },
});
