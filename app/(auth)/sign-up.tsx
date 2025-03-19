import * as React from "react";
import { Text, TextInput, View, StyleSheet, Pressable } from "react-native";
import { useSignUp } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import GoogleAuth from "@/components/sso_google";
import GithubAuth from "@/components/sso_github";
import DiscordAuth from "@/components/sso_discord";

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState("");

  const onSignUpPress = async () => {
    if (!isLoaded) return;
    try {
      await signUp.create({ emailAddress, password, firstName, lastName });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  const onVerifyPress = async () => {
    if (!isLoaded) return;
    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });
      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
        router.replace("/");
      } else {
        console.error(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <View style={styles.container}>
      {pendingVerification ? (
        <>
          <Text style={styles.title}>Verify Your Email</Text>
          <TextInput
            style={styles.input}
            value={code}
            placeholder="Enter verification code"
            onChangeText={setCode}
          />

          <Pressable
            style={styles.button}
            onPress={onVerifyPress}
          >
            <Text style={styles.buttontext}>Verify</Text>
          </Pressable>
        </>
      ) : (
        <>
          <View style={styles.ssocontainer}>
            <GoogleAuth />
            <DiscordAuth />
            <GithubAuth />
          </View>
          {/* First Name Input */}
          <TextInput
            style={styles.input}
            value={firstName}
            placeholder="Enter first name"
            onChangeText={(firstName) => setFirstName(firstName)}
          />

          {/* Last Name Input */}
          <TextInput
            style={styles.input}
            value={lastName}
            placeholder="Enter last name"
            onChangeText={(lastName) => setLastName(lastName)}
          />
          <TextInput
            style={styles.input}
            autoCapitalize="none"
            value={emailAddress}
            placeholder="Enter email"
            onChangeText={setEmailAddress}
          />
          <TextInput
            style={styles.input}
            value={password}
            placeholder="Enter password"
            secureTextEntry
            onChangeText={setPassword}
          />
          <Pressable
            style={styles.button}
            onPress={onSignUpPress}
          >
            <Text style={styles.buttontext}>Sign Up</Text>
          </Pressable>
          {/* Sign Up Link */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <Link
              href="/sign-in"
              style={styles.link}
            >
              <Text style={styles.linkText}>Sign In</Text>
            </Link>
          </View>
        </>
      )}
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
