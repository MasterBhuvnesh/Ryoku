import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";

export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
  initialRouteName: "(home)",
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Poppins_Regular: require("@/assets/fonts/Poppins-Regular.ttf"),
    Poppins_Medium: require("@/assets/fonts/Poppins-Medium.ttf"),
    Poppins_SemiBold: require("@/assets/fonts/Poppins-SemiBold.ttf"),
    Poppins_Bold: require("@/assets/fonts/Poppins-Bold.ttf"),
    Poppins_Black: require("@/assets/fonts/Poppins-Black.ttf"),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <Stack>
      <Stack.Screen
        name="(home)"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}
