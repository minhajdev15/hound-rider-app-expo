

import type React from "react"
import { useCallback, useEffect, useRef, useState } from "react"
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native"
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps"
import type { Region } from "react-native-maps"
import * as Location from "expo-location"
import { Ionicons } from '@react-native-vector-icons/ionicons';

type LocationCoords = {
  latitude: number
  longitude: number
}

type FetchState = "idle" | "loading" | "ready" | "error"

const DEFAULT_DELTA = { latitudeDelta: 0.01, longitudeDelta: 0.01 }

const CurrentLocationMap: React.FC = () => {
  const mapRef = useRef<MapView>(null)

  const [coords, setCoords] = useState<LocationCoords | null>(null)
  const [region, setRegion] = useState<Region | null>(null)
  const [status, setStatus] = useState<FetchState>("idle")
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const setCenteredRegion = useCallback((c: LocationCoords) => {
    const nextRegion: Region = {
      latitude: c.latitude,
      longitude: c.longitude,
      ...DEFAULT_DELTA,
    }
    setRegion(nextRegion)
    // Animate the camera smoothly to the user location
    requestAnimationFrame(() => {
      mapRef.current?.animateToRegion(nextRegion, 800)
    })
  }, [])

  const requestAndFetchLocation = useCallback(async () => {
    try {
      setStatus("loading")
      setErrorMsg(null)

      const { status: perm } = await Location.requestForegroundPermissionsAsync()
      if (perm !== "granted") {
        setStatus("error")
        setErrorMsg("Location permission not granted.")
        return
      }

      // Try last known position first to be fast; fallback to current if unavailable
      const last = await Location.getLastKnownPositionAsync({})
      let current = last
      if (!current) {
        current = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Highest,
        })
      }

      if (!current?.coords) {
        setStatus("error")
        setErrorMsg("Could not determine current location.")
        return
      }

      const nextCoords: LocationCoords = {
        latitude: current.coords.latitude,
        longitude: current.coords.longitude,
      }
      setCoords(nextCoords)
      setCenteredRegion(nextCoords)
      setStatus("ready")
    } catch (e: any) {
      setStatus("error")
      setErrorMsg(e?.message ?? "Failed to get location.")
    }
  }, [setCenteredRegion])

  const refreshLocation = useCallback(async () => {
    try {
      setStatus("loading")
      setErrorMsg(null)
      const permInfo = await Location.getForegroundPermissionsAsync()
      if (permInfo.status !== "granted") {
        // If not granted anymore, re-request
        const { status: perm } = await Location.requestForegroundPermissionsAsync()
        if (perm !== "granted") {
          setStatus("error")
          setErrorMsg("Location permission not granted.")
          return
        }
      }

      const current = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      })

      const nextCoords: LocationCoords = {
        latitude: current.coords.latitude,
        longitude: current.coords.longitude,
      }
      setCoords(nextCoords)
      setCenteredRegion(nextCoords)
      setStatus("ready")
    } catch (e: any) {
      setStatus("error")
      setErrorMsg(e?.message ?? "Failed to refresh location.")
    }
  }, [setCenteredRegion])

  useEffect(() => {
    requestAndFetchLocation()
  }, [requestAndFetchLocation])

  if (status === "loading" && !coords) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.subtleText}>Fetching location...</Text>
      </View>
    )
  }
if (status === "error" && !coords) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>{errorMsg ?? "An error occurred."}</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Try again"
          onPress={requestAndFetchLocation}
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        >
          <Text style={styles.buttonText}>Try Again</Text>
        </Pressable>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {!!region && (
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={region}
          region={region}
          onRegionChangeComplete={setRegion}
        >
          {coords && (
            <Marker
              coordinate={coords}
              title="You are here"
              description={`Lat: ${coords.latitude.toFixed(5)}, Lng: ${coords.longitude.toFixed(5)}`}
            />
          )}
        </MapView>
      )}

      <View style={styles.controls}>
  <Pressable
    accessibilityRole="button"
    accessibilityLabel="Refresh-location"
    onPress={refreshLocation}
    disabled={status === 'loading'}
    style={({ pressed }) => [
      styles.button,
      pressed && styles.buttonPressed,
      status === 'loading' && { opacity: 0.6 },
    ]}
  >
    {status === 'loading' ? (
      <ActivityIndicator size="small" color="#fff" />
    ) : (
      <Ionicons name="refresh" size={20} color="#fff" />
    )}
  </Pressable>

  {errorMsg ? <Text style={styles.inlineError}>{errorMsg}</Text> : null}
</View>

    </View>
  )
}

export default CurrentLocationMap

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B1220", // neutral background
  },
  map: {
    flex: 1, // full width/height
  },
  controls: {
    position: "absolute",
    left: 130,
    right: 130,
    gap: 8,
    top:50
  },
  button: {
    backgroundColor: "#2563EB", // primary blue
    paddingHorizontal: 4,
    paddingVertical:10,
    borderRadius: 10,
    width:150,
    alignItems: "center",
  },
  buttonPressed: {
    opacity: 0.9,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  centeredContainer: {
    flex: 1,
    backgroundColor: "#0B1220",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingHorizontal: 24,
  },
  subtleText: {
    color: "#94A3B8", // neutral text
    fontSize: 14,
  },
  errorText: {
    color: "#F43F5E", // accent for errors
    fontSize: 16,
    textAlign: "center",
    marginBottom: 12,
  },
  inlineError: {
    color: "#F43F5E",
    fontSize: 12,
    textAlign: "center",
  },
})