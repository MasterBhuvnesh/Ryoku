import * as React from "react";
import { Text, TextInput, View, StyleSheet, Pressable } from "react-native";
import { useSignIn } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import DiscordAuth from "@/components/sso_discord";
import GithubAuth from "@/components/sso_github";
import GoogleAuth from "@/components/sso_google";

export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");

  const onSignInPress = async () => {
    if (!isLoaded) return;

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/");
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.ssocontainer}>
        <GoogleAuth />
        <DiscordAuth />
        <GithubAuth />
      </View>
      {/* Email Input */}
      <TextInput
        style={styles.input}
        autoCapitalize="none"
        value={emailAddress}
        placeholder="Enter email"
        placeholderTextColor="#999"
        onChangeText={setEmailAddress}
      />

      {/* Password Input */}
      <TextInput
        style={styles.input}
        value={password}
        placeholder="Enter password"
        placeholderTextColor="#999"
        secureTextEntry
        onChangeText={setPassword}
      />

      {/* Sign In Button */}
      <Pressable
        style={styles.button}
        onPress={onSignInPress}
      >
        <Text style={styles.buttontext}>Sign In</Text>
      </Pressable>

      {/* Sign Up Link */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Don't have an account?</Text>
        <Link
          href="/sign-up"
          style={styles.link}
        >
          <Text style={styles.linkText}>Sign up</Text>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  ssocontainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
    flexDirection: "row",
    gap: 8,
  },
  title: {
    fontSize: 24,
    fontFamily: "Poppins_Bold",
    marginBottom: 20,
    color: "#333",
  },
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
    fontFamily: "Poppins_Medium",
  },
  button: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginTop: 10,
  },
  buttontext: { color: "white", fontFamily: "Poppins_Medium" },
  footer: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  footerText: {
    fontSize: 16,
    fontFamily: "Poppins_Medium",
    color: "#666",
  },
  link: {
    marginLeft: 5,
  },
  linkText: {
    fontSize: 16,
    fontFamily: "Poppins_Medium",
    color: "#007bff",
  },
});
