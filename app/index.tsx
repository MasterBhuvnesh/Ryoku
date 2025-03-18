import { SignedIn, SignedOut, useAuth, useUser } from "@clerk/clerk-expo";
import { Link } from "expo-router";
import { StyleSheet, View, Text, Pressable, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function HomeScreen() {
  const { user } = useUser();

  return (
    <LinearGradient
      colors={["#6a11cb", "#2575fc"]} // Purple to blue gradient
      style={styles.gradient}
    >
      <View style={styles.container}>
        <SignedIn>
          <Text style={styles.title}>Welcome back, {user?.fullName}!</Text>
          <Text style={styles.subtitle}>You're all set to explore.</Text>
          <Pressable
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
            ]}
          >
            <Link href="/(home)/profile">
              <Text style={styles.buttonText}>View Profile</Text>
            </Link>
          </Pressable>
        </SignedIn>
        <SignedOut>
          <Text style={styles.title}>Welcome to Your App!</Text>
          <Text style={styles.subtitle}>
            Sign in or sign up to get started.
          </Text>
          <Pressable
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed, // Add pressed state
            ]}
          >
            <Link href="/(auth)/sign-in">
              <Text style={styles.buttonText}>Sign In</Text>
            </Link>
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.button,
              styles.outlineButton,
              pressed && styles.outlineButtonPressed, // Add pressed state
            ]}
          >
            <Link href="/(auth)/sign-up">
              <Text style={[styles.buttonText, styles.outlineButtonText]}>
                Sign Up
              </Text>
            </Link>
          </Pressable>
        </SignedOut>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontFamily: "Poppins_Bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "Poppins_Medium",
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    marginBottom: 40,
  },
  button: {
    width: "80%",
    backgroundColor: "#fff", // White background
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5, // For Android
  },
  buttonPressed: {
    transform: [{ scale: 0.95 }], // Slightly shrink on press
    opacity: 0.9, // Slightly fade on press
  },
  buttonText: {
    fontSize: 16,
    fontFamily: "Poppins_SemiBold",
    color: "#2575fc", // Blue text
  },
  outlineButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#fff", // White border
  },
  outlineButtonPressed: {
    backgroundColor: "rgba(255, 255, 255, 0.1)", // Slight white overlay on press
  },
  outlineButtonText: {
    color: "#fff", // White text
  },
});
