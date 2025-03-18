import { Redirect, Stack } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";

export default function AuthRoutesLayout() {
  const { isSignedIn } = useAuth();

  if (isSignedIn) {
    return <Redirect href={"/"} />;
  }

  return (
    <Stack>
      <Stack.Screen
        name="sign-in"
        options={{
          headerTitle: "Sign In",
          headerBackVisible: false, // Hide back button
          headerShadowVisible: false, // Hide shadow
          headerTitleAlign: "center",
          //   headerTransparent: true, // Hide header background
          headerTintColor: "#000",
          headerTitleStyle: {
            fontFamily: "Poppins_Black",
          },
        }}
      />
      <Stack.Screen
        name="sign-up"
        options={{
          headerTitle: "Sign Up",
          headerBackVisible: false, // Hide back button
          headerShadowVisible: false, // Hide shadow
          headerTitleAlign: "center",
          //   headerTransparent: true, // Hide header background
          headerTintColor: "#000",
          headerTitleStyle: {
            fontFamily: "Poppins_Black",
          },
        }}
      />
    </Stack>
  );
}
