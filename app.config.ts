import { ConfigContext, ExpoConfig } from "@expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "allta-app",
  slug: "allta-app",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./src/assets/images/icon.png",
  scheme: "alltaapp",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  ios: {
    bundleIdentifier: "io.allta.user",
    supportsTablet: true,
    config: {
      usesNonExemptEncryption: false,
    },
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
  },
  plugins: [
    // "expo-router",
    [
      "expo-splash-screen",
      {
        image: "./src/assets/images/splash-icon.png",
        imageWidth: 200,
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
      "@react-native-kakao/core",
      {
        nativeAppKey: process.env.EXPO_PUBLIC_KAKAO_APP_KEY,
      },
    ],
    [
      "@react-native-seoul/kakao-login",
      {
        kakaoAppKey: process.env.EXPO_PUBLIC_KAKAO_APP_KEY,
      },
    ],
  ],
  // experiments: {
  //   typedRoutes: true,
  // },
});
