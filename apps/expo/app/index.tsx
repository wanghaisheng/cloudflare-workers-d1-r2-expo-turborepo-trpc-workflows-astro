import { useUser } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";
import { Text } from "react-native";

export default function Index() {
  const user = useUser();
  if (user.isLoaded && user.isSignedIn) {
    return <Redirect href="/(tabs)/add" />;
  }

  if (user.isLoaded && !user.isSignedIn) {
    return <Redirect href="/(auth)/sign-up" />;
  }

  if (!user.isLoaded) {
    return <Text>Loading...</Text>;
  }
}