import { ConfigContext, ExpoConfig } from "@expo/config";
import "dotenv/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "올타",
  slug: "allta-app",
  currentFullName: "@orheunil/allta-user",
  originalFullName: "@orheunil/allta-user",
  scheme: "allta-user",
  version: "1.3.1",
  runtimeVersion: {
    policy: "appVersion",
  },
  orientation: "portrait",
  icon: "./src/assets/images/app-icon.png",
  userInterfaceStyle: "light",
  newArchEnabled: true,
  ios: {
    bundleIdentifier: "io.allta.user",
    googleServicesFile: "./cert/GoogleService-Info.plist",
    icon: "./src/assets/images/app-icon.png",
    supportsTablet: false,
    config: {
      usesNonExemptEncryption: false,
    },
    usesAppleSignIn: true,
    associatedDomains: [
      "applinks:allta.airbridge.io",
      "applinks:allta.abr.ge",
      "applinks:app.allta.io",
    ],
    infoPlist: {
      NSCameraUsageDescription:
        "需要相機權限，以掃描 QR Code 確認使用券，以及拍攝加油收據以享優惠。",
      NSPhotoLibraryUsageDescription:
        "需要照片存取權限，以上傳加油收據圖片享有優惠。",
      NSLocationWhenInUseUsageDescription:
        "需要位置資訊權限，以查詢目前位置的天氣並推薦附近門市。",
      NSUserTrackingUsageDescription:
        "需要追蹤權限，以改善 App 使用體驗並提供個人化廣告。",
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
        "tmap",
        "kakaomap",
      ],
      NSAppTransportSecurity: {
        NSAllowsArbitraryLoads: true,
      },

      UIBackgroundModes: [],
    },
  },
  android: {
    package: "io.allta.user",
    googleServicesFile: "./cert/google-services.json",
    icon: "./src/assets/images/app-icon.png",
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
      "READ_MEDIA_IMAGES",
      "READ_MEDIA_VIDEO",
      "NOTIFICATIONS",
      "FOREGROUND_SERVICE",
      "com.google.android.gms.permission.AD_ID",
    ],
    intentFilters: [
      {
        autoVerify: true,
        action: "VIEW",
        data: { scheme: "https", host: "allta.airbridge.io" },
        category: ["BROWSABLE", "DEFAULT"],
      },
      {
        autoVerify: true,
        action: "VIEW",
        data: { scheme: "https", host: "allta.abr.ge" },
        category: ["BROWSABLE", "DEFAULT"],
      },
      {
        autoVerify: true,
        action: "VIEW",
        data: { scheme: "https", host: "app.allta.io" },
        category: ["BROWSABLE", "DEFAULT"],
      },
    ],
  },
  web: {
    bundler: "metro",
    output: "single",
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
    ["expo-updates"],
    [
      "expo-build-properties",
      {
        android: {
          extraMavenRepos: [
            "https://devrepo.kakao.com/nexus/content/groups/public/",
          ],
          usesCleartextTraffic: true,
        },
        ios: {
          useFrameworks: "static",
          forceStaticLinking: ["RNFBApp", "RNFBAuth", "RNFBFirestore"],
        },
      },
    ],
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
      "@react-native-kakao/core",
      {
        nativeAppKey: process.env.EXPO_PUBLIC_KAKAO_APP_KEY,
        android: {
          authCodeHandlerActivity: true,
        },
        ios: {
          handleKakaoOpenUrl: true,
          forwardKakaoLinkIntentFilterToMainActivity: true,
        },
      },
    ],
    ["expo-tracking-transparency"],
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
      "expo-image-picker",
      {
        photosPermission: "需要照片存取權限，以上傳收據照片。",
      },
    ],
    [
      "airbridge-expo-sdk",
      {
        appName: process.env.EXPO_PUBLIC_AIRBRIDGE_APP_NAME,
        appToken: process.env.EXPO_PUBLIC_AIRBRIDGE_APP_SDK_TOKEN,
      },
    ],
    "./plugins/withAndroidManifestFix",
  ],
  owner: "orheunil-dev",
  // experiments: {
  //   typedRoutes: true,
  // },
});
