import { useEffect, useState } from "react";
import { Platform } from "react-native";
import "react-native-reanimated";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { KeyboardProvider } from "react-native-keyboard-controller";
import "react-native-get-random-values";
import Toast from "react-native-toast-message";
import checkVersion from "react-native-store-version";
import * as Font from "expo-font";
import { StatusBar } from "expo-status-bar";
import { SystemBars } from "react-native-edge-to-edge";
import * as Updates from "expo-updates";
import * as SecureStore from "expo-secure-store";
import * as Notifications from "expo-notifications";
import * as Linking from "expo-linking";
import * as Application from "expo-application";
import analytics from "@react-native-firebase/analytics";
import { initializeKakaoSDK } from "@react-native-kakao/core";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { toastConfig } from "@/libs";
import { ContainerStack } from "@/navigations";
import { Update } from "@/screens/Update";
import { Splash } from "@/screens/Splash";
import { colors } from "@/styles";

initializeKakaoSDK(process.env.EXPO_PUBLIC_KAKAO_APP_KEY);

export default function App() {
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [showUpdate, setShowUpdate] = useState<boolean>(false);
  const [isCheckingUpdate, setIsCheckingUpdate] = useState(true);
  const [isVersionUpdate, setIsVersionUpdate] = useState<boolean>(false);
  const [isUpdateFinished, setIsUpdateFinished] = useState<boolean>(false);
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

  // 파이어 베이스 초기화
  useEffect(() => {
    async function initializeApp() {
      try {
        await analytics().setAnalyticsCollectionEnabled(true);
        console.log("firebase 초기화 성공");
      } catch (error) {
        console.error("firebase 초기화 실패:", error);
      }
    }

    initializeApp();
  }, []);

  // 앱 업데이트 체크
  useEffect(() => {
    const appEnv = process.env.EXPO_PUBLIC_APP_ENV;

    if (appEnv !== "PROD") {
      setIsCheckingUpdate(false);
      setShowSplash(true);
      return;
    }

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

        // 앱 버전 업데이트
        if (check.result === "new") {
          setIsCheckingUpdate(false);
          setShowUpdate(true);
          setIsVersionUpdate(true);
        } else {
          const update = await Updates.checkForUpdateAsync();

          // Expo-Updates(코드 푸시)
          if (update.isAvailable) {
            setIsCheckingUpdate(false);
            setShowUpdate(true);
            setIsUpdateFinished(false);

            const start = performance.now();

            await Updates.fetchUpdateAsync();

            const elapsed = performance.now() - start;
            const remaining = Math.max(1000 - elapsed, 0);

            await new Promise((resolve) => setTimeout(resolve, remaining));

            setIsUpdateFinished(true);

            setTimeout(async () => {
              await Updates.reloadAsync();
            }, 250);
          }
        }
      } catch (error: any) {
        setIsCheckingUpdate(false);
        setShowUpdate(false);
        setIsVersionUpdate(false);
        setIsUpdateFinished(false);

        console.log(error.message ?? error);
      } finally {
        setIsCheckingUpdate(false);
      }
    };

    checkUpdate();
  }, []);

  // 스플래시 화면 제거
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

  // 푸시알림 딥링크 처리
  useEffect(() => {
    const listener = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const url = response.notification.request.content.data?.url;

        if (url) {
          Linking.openURL(url as string);
        }
      }
    );

    return () => listener.remove();
  }, []);

  // 포그라운드 알림 처리
  useEffect(() => {
    const setupNotification = async () => {
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

  if (isCheckingUpdate) {
    return null;
  }

  if (showUpdate) {
    return (
      <Update
        isVersionUpdate={isVersionUpdate}
        isUpdateFinished={isUpdateFinished}
      />
    );
  }

  if (showSplash) {
    return <Splash />;
  }

  return (
    <SafeAreaProvider style={{ backgroundColor: colors.bg }}>
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
