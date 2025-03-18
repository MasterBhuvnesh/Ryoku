import { useAuth, useUser } from "@clerk/clerk-expo";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { StyleSheet, Text, View, Pressable, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function ProfileScreen() {
  const { user } = useUser();
  const { isSignedIn, signOut } = useAuth();

  return (
    <LinearGradient
      colors={["#6a11cb", "#2575fc"]} // Purple to blue gradient
      style={styles.gradient}
    >
      <View style={styles.container}>
        {/* Profile Image */}
        <Image
          source={user?.imageUrl ? { uri: user.imageUrl } : undefined}
          style={styles.profileImage}
        />

        {/* Email Address */}
        <Text style={styles.emailText}>
          Hello, {user?.emailAddresses[0].emailAddress}
        </Text>

        {/* Edit Profile Link */}
        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed, // Add pressed state
          ]}
        >
          <Link href="/profile/edit">
            <Text style={styles.buttonText}>Edit Profile</Text>
          </Link>
        </Pressable>

        {/* Sign Out Button */}
        <Pressable
          style={({ pressed }) => [
            styles.button,
            styles.outlineButton,
            pressed && styles.outlineButtonPressed, // Add pressed state
          ]}
          onPress={async () => {
            await signOut();
            <Link href="/" />;
          }}
        >
          <Text style={[styles.buttonText, styles.outlineButtonText]}>
            Sign Out
          </Text>
        </Pressable>
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
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75, // Circular image
    borderWidth: 3,
    borderColor: "#fff",
    marginBottom: 20,
  },
  emailText: {
    fontSize: 20,
    fontFamily: "Poppins_SemiBold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 30,
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
