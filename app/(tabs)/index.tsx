import MapComponent from "@/components/MapComponent";
import PlacesInput from "@/components/PlacesInput";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
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
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.titleContainer}>
        <ThemedText type="title">Hound Mobility</ThemedText>
      </View>

      {/* Input Fields Card */}
      <View style={styles.inputCard}>
        <PlacesInput
          onPlaceSelected={(data) => handlePlaceInput(data, "source")}
          label="From"
        />
        <View style={styles.divider} />
        <PlacesInput
          onPlaceSelected={(data) => handlePlaceInput(data, "destination")}
          label="To"
        />
      </View>

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
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  inputCard: {
    borderRadius: 12,
    paddingVertical: 4,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    marginBottom: 12,
    shadowColor: "transparent",
    shadowOpacity: 0,
    shadowRadius: 0,
    shadowOffset: { width: 0, height: 0 },
    elevation: 0,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.08)",
    marginHorizontal: 10,
  },
  mapWrapper: {
    flex: 1,
  },
  distanceCard: {
    marginTop: 16,
    backgroundColor: "rgba(77, 189, 16, 0.08)",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(77, 189, 16, 0.25)",
    shadowColor: "#000",
    marginBottom: 74,
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  distanceLabel: {
    fontSize: 14,
    color: "#9BA1A6",
    marginBottom: 4,
    letterSpacing: 0.4,
  },
  distanceValue: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.dark.tint,
  },
});
