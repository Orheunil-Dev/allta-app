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
import { SystemBars } from "react-native-edge-to-edge";
import * as SecureStore from "expo-secure-store";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { ContainerStack } from "@/navigations";
import { Splash } from "@/screens/Splash";
import "react-native-get-random-values";
import Toast from "react-native-toast-message";
import { toastConfig } from "@/libs";
import * as Notifications from "expo-notifications";
import { Alert, Linking, Platform } from "react-native";
import * as Application from "expo-application";
import * as Updates from "expo-updates";
import checkVersion from "react-native-store-version";

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
    "Roboto-Medium": require("./src/assets/fonts/Roboto-Medium.ttf"),
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
    const appEnv = process.env.EXPO_PUBLIC_APP_ENV;

    if (appEnv === "DEV") return;

    const storeUrl = {
      iosStoreURL: "https://apps.apple.com/kr/app/allta/id6467127880",
      androidStoreURL:
        "https://play.google.com/store/apps/details?id=io.allta.user",
    };

    const checkUpdate = async () => {
      try {
        const check = await checkVersion({
          version: Application.nativeApplicationVersion ?? "",
          ...storeUrl,
          country: "kr",
        });

        if (check.result === "new") {
          // 앱 스토어 버전이 새로움
          Alert.alert(
            "ALLTA 업데이트",
            "새로운 버전으로 업데이트 되었습니다. [확인]를 누르시면 스토어로 이동합니다.",
            [
              {
                text: "확인",
                onPress: () => {
                  setTimeout(() => {
                    const _storeUrl =
                      Platform.OS === "android"
                        ? storeUrl.androidStoreURL
                        : storeUrl.iosStoreURL;
                    Linking.openURL(_storeUrl);
                  }, 100);
                },
              },
            ]
          );
        } else {
          const update = await Updates.checkForUpdateAsync();
          if (update.isAvailable) {
            await Updates.fetchUpdateAsync();

            const alertMessage =
              "새로운 버전으로 업데이트 되었습니다. [확인]를 누르시면 업데이트를 위해 앱이 재기동 됩니다.";

            Alert.alert("ALLTA 업데이트", alertMessage, [
              {
                text: "확인",
                onPress: () => {
                  setTimeout(() => {
                    Updates.reloadAsync();
                  }, 100);
                },
              },
            ]);
          }
        }
      } catch (error) {
        console.log("checkUpdate error:", error);
      }
    };

    checkUpdate();
  }, []);

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

  useEffect(() => {
    const setupNotification = async () => {
      // 포그라운드 알림 처리
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true, // 알림 UI
          shouldPlaySound: true, // 사운드
          shouldSetBadge: false, // 앱 아이콘 배지
          shouldShowBanner: true, // iOS 14+ 배너
          shouldShowList: true, // 알림 센터 리스트
        }),
      });

      // 안드로이드 채널 설정
      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "Default",
          importance: Notifications.AndroidImportance.MAX,
          sound: "default",
          vibrationPattern: [0, 250],
        });
      }
    };

    setupNotification();
  }, []);

  if (showSplash) {
    return <Splash />;
  }

  return (
    <SafeAreaProvider style={{ backgroundColor: "#FFFFFF" }}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <QueryClientProvider client={queryClient}>
          <KeyboardProvider>
            <BottomSheetModalProvider>
              <ContainerStack
                showLoginModal={showLoginModal}
                setShowLoginModal={setShowLoginModal}
              />
              <SystemBars style="dark" />
              <StatusBar style="auto" />
              <Toast config={toastConfig} />
            </BottomSheetModalProvider>
          </KeyboardProvider>
        </QueryClientProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
