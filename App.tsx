import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { KeyboardProvider } from "react-native-keyboard-controller";
import * as SplashScreen from "expo-splash-screen";
import { ContainerStack } from "@/navigations";
import { Splash } from "@/screens/Splash";

SplashScreen.preventAutoHideAsync();

export default function App() {
  const queryClient = new QueryClient();

  const [showSplash, setShowSplash] = useState<boolean>(true);

  useEffect(() => {
    const prepare = async () => {
      try {
        await SplashScreen.hideAsync();

        await new Promise((resolve) => setTimeout(resolve, 1250));
      } catch (e) {
        console.warn(e);
      } finally {
        setShowSplash(false);
      }
    };

    prepare();
  }, []);

  if (showSplash) {
    return <Splash />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <KeyboardProvider>
            <BottomSheetModalProvider>
              <ContainerStack />
              <StatusBar style="auto" />
            </BottomSheetModalProvider>
          </KeyboardProvider>
        </SafeAreaProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
