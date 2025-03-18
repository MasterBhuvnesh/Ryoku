import { SignedIn, SignedOut, useAuth, useUser } from "@clerk/clerk-expo";
import { Link } from "expo-router";
import { StyleSheet, View, Text, Button } from "react-native";

export default function HomeScreen() {
  const { user } = useUser();
  const { signOut } = useAuth();
  return (
    <View style={styles.container}>
      <SignedIn></SignedIn>
      <SignedOut>
        <Link href="/(auth)/sign-in">
          <Text>Sign in</Text>
        </Link>
        <Link href="/(auth)/sign-up">
          <Text>Sign up</Text>
        </Link>
      </SignedOut>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontFamily: "Poppins_Bold",
  },
});
