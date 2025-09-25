import { ConfigContext, ExpoConfig } from "@expo/config";

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
          CFBundleURLSchemes: [process.env.EXPO_PUBLIC_KAKAO_APP_KEY],
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
    edgeToEdgeEnabled: true,
    permissions: [
      "POST_NOTIFICATIONS",
      "CAMERA",
      "ACCESS_FINE_LOCATION",
      "ACCESS_COARSE_LOCATION",
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
      projectId: "ab52a19e-7d67-49bf-a87d-60ce99c3e048",
    },
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
  ],
  owner: "orheunil-dev",
  // experiments: {
  //   typedRoutes: true,
  // },
});
