import React, { Suspense } from "react"
import { ActivityIndicator, View, StyleSheet } from "react-native"

const CurrentLocationMap = React.lazy(() => import("../../components/current-location-map"))

export default function Page() {
  return (
    <Suspense fallback={
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    }>
      <CurrentLocationMap />
    </Suspense>
  )
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0B1220',
  },
})
