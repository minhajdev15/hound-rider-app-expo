import React, { useEffect, useRef } from "react";
import { StyleSheet, View } from "react-native";
import MapView, { LatLng, Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";

interface MapComponentProps {
  source?: LatLng | null;
  destination?: LatLng | null;
}

export default function MapComponent({
  source,
  destination,
}: MapComponentProps) {
  const mapRef = useRef<MapView>(null);
  const GOOGLE_PLACES_API_KEY = process.env
    .EXPO_PUBLIC_GOOGLE_PLACES_API_KEY as string;
  console.log(source, destination);
  useEffect(() => {
    if (source && destination && mapRef.current) {
      mapRef.current.fitToCoordinates([source, destination], {
        edgePadding: { top: 80, right: 80, bottom: 80, left: 80 },
        animated: true,
      });
    }
  }, [source, destination]);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: source?.latitude ?? 10.028,
          longitude: source?.longitude ?? 76.3074,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {/* Source Marker */}
        {source && (
          <Marker
            coordinate={source}
            title="Pickup Location"
            pinColor="green"
          />
        )}

        {/* Destination Marker */}
        {destination && (
          <Marker
            coordinate={destination}
            title="Drop-off Location"
            pinColor="red"
          />
        )}

        {source && destination && (
          <MapViewDirections
            origin={source}
            destination={destination}
            apikey={GOOGLE_PLACES_API_KEY}
            strokeWidth={5}
            strokeColor="dodgerblue"
            lineDashPattern={[0]}
            onError={(errorMessage) =>
              console.warn("Directions Error:", errorMessage)
            }
          />
        )}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
  },
  map: {
    width: "100%",
    height: "100%",
  },
});
