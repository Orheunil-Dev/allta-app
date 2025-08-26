import { ConfigContext, ExpoConfig } from "@expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "올타",
  slug: "allta-app",
  currentFullName: "@orheunil/allta-user",
  originalFullName: "@orheunil/allta-user",
  scheme: "allta-user",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./src/assets/images/icon.png",
  userInterfaceStyle: "light",
  newArchEnabled: true,
  ios: {
    bundleIdentifier: "io.allta.user",
    supportsTablet: true,
    config: {
      usesNonExemptEncryption: false,
    },
    usesAppleSignIn: true,
  },
  android: {
    package: "io.allta.user",
    adaptiveIcon: {
      foregroundImage: "./src/assets/images/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    edgeToEdgeEnabled: true,
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./src/assets/images/favicon.png",
  },
  extra: {
    apiUrl: process.env.EXPO_PUBLIC_API_URL,
    googleClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
    googleIosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_ID,
    googleAndroidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_ID,
  },
  plugins: [
    // "expo-router",
    [
      "expo-splash-screen",
      {
        image: "./src/assets/images/splash-image.png",
        imageWidth: 154,
        resizeMode: "contain",
        backgroundColor: "#ffffff",
      },
    ],
    [
      "expo-build-properties",
      {
        android: {
          compileSdkVersion: 35,
          targetSdkVersion: 35,
          minSdkVersion: 25,
          buildToolsVersion: "35.0.0",
          kotlinVersion: "2.0.21",
          gradlePluginVersion: "8.4.0",
          extraMavenRepos: [
            "https://devrepo.kakao.com/nexus/content/groups/public/",
          ],
        },
      },
    ],
    ["expo-secure-store"],
    [
      "@react-native-seoul/kakao-login",
      {
        kakaoAppKey: process.env.EXPO_PUBLIC_KAKAO_APP_KEY,
        kotlinVersion: "2.0.21",
        overrideKakaoSDKVersion: "2.22.0",
      },
    ],
    ["expo-apple-authentication"],
  ],
  // experiments: {
  //   typedRoutes: true,
  // },
});
