import { ConfigContext, ExpoConfig } from "@expo/config";
import "dotenv/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "올타",
  slug: "allta-app",
  currentFullName: "@orheunil/allta-user",
  originalFullName: "@orheunil/allta-user",
  scheme: "allta-user",
  version: "1.2.2",
  orientation: "portrait",
  icon: "./src/assets/images/app-icon.png",
  userInterfaceStyle: "light",
  newArchEnabled: true,
  ios: {
    jsEngine: "hermes",
    bundleIdentifier: "io.allta.user",
    icon: "./src/assets/images/app-icon.png",
    supportsTablet: true,
    config: {
      usesNonExemptEncryption: false,
    },
    usesAppleSignIn: true,
    infoPlist: {
      NSCameraUsageDescription: "카메라 접근 권한이 필요합니다.",
      NSPhotoLibraryUsageDescription: "사진 접근 권한이 필요합니다.",
      NSLocationWhenInUseUsageDescription: "위치 정보 접근 권한이 필요합니다.",
      NSUserTrackingUsageDescription:
        "광고 맞춤화를 위해 추적 허용이 필요합니다.",
      CFBundleURLTypes: [
        {
          CFBundleTypeRole: "Editor",
          CFBundleURLSchemes: [
            process.env.EXPO_PUBLIC_KAKAO_APP_KEY,
            "allta-user",
          ],
        },
      ],
      LSApplicationQueriesSchemes: [
        "kakaokompassauth",
        "storykompassauth",
        "kakaolink",
        "kakaoplus",
        "kakaotalk",
      ],
      NSAppTransportSecurity: {
        NSAllowsArbitraryLoads: true,
      },
    },
  },
  android: {
    jsEngine: "hermes",
    package: "io.allta.user",
    adaptiveIcon: {
      foregroundImage: "./src/assets/images/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    permissions: [
      "POST_NOTIFICATIONS",
      "CAMERA",
      "ACCESS_FINE_LOCATION",
      "ACCESS_COARSE_LOCATION",
      "READ_MEDIA_IMAGES",
      "READ_EXTERNAL_STORAGE",
      "WRITE_EXTERNAL_STORAGE",
    ],
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
    eas: {
      projectId: process.env.EXPO_PUBLIC_EAS_PROJECT_ID,
    },
  },
  updates: {
    checkAutomatically: "ON_LOAD",
    fallbackToCacheTimeout: 0,
    url: `https://u.expo.dev/${process.env.EXPO_PUBLIC_EAS_PROJECT_ID}`,
  },
  plugins: [
    "expo-router",
    [
      "expo-splash-screen",
      {
        image: "./src/assets/images/empty-image.png",
        imageWidth: 154,
        resizeMode: "contain",
        backgroundColor: "#ffffff",
      },
    ],
    [
      "expo-build-properties",
      {
        android: {
          compileSdkVersion: 36,
          targetSdkVersion: 36,
          minSdkVersion: 25,
          buildToolsVersion: "36.0.0",
          kotlinVersion: "2.0.21",
          gradlePluginVersion: "8.4.0",
          extraMavenRepos: [
            "https://devrepo.kakao.com/nexus/content/groups/public/",
          ],
          usesCleartextTraffic: true,
        },
      },
    ],
    ["expo-secure-store"],
    ["expo-apple-authentication"],
    [
      "react-native-edge-to-edge",
      {
        android: {
          parentTheme: "Default",
        },
      },
    ],
    [
      "expo-video",
      {
        supportsBackgroundPlayback: true,
        supportsPictureInPicture: true,
      },
    ],
    [
      "expo-image-picker",
      {
        photosPermission:
          "영수증 사진 업로드를 위해 사진 접근 권한이 필요합니다.",
      },
    ],
  ],
  owner: "orheunil-dev",
  // experiments: {
  //   typedRoutes: true,
  // },
});
