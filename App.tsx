import { useEffect, useState } from "react";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { KeyboardProvider } from "react-native-keyboard-controller";
import * as Font from "expo-font";
import { StatusBar } from "expo-status-bar";
import * as SecureStore from "expo-secure-store";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { ContainerStack } from "@/navigations";
import { Splash } from "@/screens/Splash";
import "react-native-get-random-values";

export default function App() {
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);

  const [fontsLoaded] = Font.useFonts({
    "Pretendard-Thin": require("./src/assets/fonts/Pretendard-Thin.otf"),
    "Pretendard-ExtraLight": require("./src/assets/fonts/Pretendard-ExtraLight.otf"),
    "Pretendard-Light": require("./src/assets/fonts/Pretendard-Light.otf"),
    "Pretendard-Regular": require("./src/assets/fonts/Pretendard-Regular.otf"),
    "Pretendard-Medium": require("./src/assets/fonts/Pretendard-Medium.otf"),
    "Pretendard-SemiBold": require("./src/assets/fonts/Pretendard-SemiBold.otf"),
    "Pretendard-Bold": require("./src/assets/fonts/Pretendard-Bold.otf"),
    "Pretendard-ExtraBold": require("./src/assets/fonts/Pretendard-ExtraBold.otf"),
    "Pretendard-Black": require("./src/assets/fonts/Pretendard-Black.otf"),
    "Roboto-Regular": require("./src/assets/fonts/Roboto-Regular.ttf"),
    "Roboto-Light": require("./src/assets/fonts/Roboto-Light.ttf"),
  });

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 0,
      },
    },
    queryCache: new QueryCache({
      onError: (error: any) => {
        if (error?.status === 401 && error.code === "TOKEN_REFRESH_FAILED") {
          (async () => {
            await SecureStore.deleteItemAsync("accessToken");
            await SecureStore.deleteItemAsync("refreshToken");

            setShowLoginModal(true);
          })();
        }
      },
    }),
  });

  useEffect(() => {
    const prepare = async () => {
      try {
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
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <QueryClientProvider client={queryClient}>
          <KeyboardProvider>
            <BottomSheetModalProvider>
              <ContainerStack
                showLoginModal={showLoginModal}
                setShowLoginModal={setShowLoginModal}
              />
              <StatusBar style="auto" />
            </BottomSheetModalProvider>
          </KeyboardProvider>
        </QueryClientProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
