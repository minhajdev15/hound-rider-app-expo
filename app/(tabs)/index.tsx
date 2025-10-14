import { Image } from "expo-image";
import { StyleSheet } from "react-native";

import { HelloWave } from "@/components/hello-wave";
import InputField from "@/components/InputField";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedButton } from "@/components/themed-button";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Hound mobility</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView>
        <InputField label="source" placeholder="select a source" />
      </ThemedView>
      <ThemedView>
        <InputField label="destination" placeholder="select a destination" />
      </ThemedView>

      <ThemedButton
        label="Select ride"
        onPress={() => {}}
        style={{ alignSelf: "center" }}
      />
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
