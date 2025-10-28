import { ConfigContext, ExpoConfig } from "@expo/config";
import "dotenv/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "올타",
  slug: "allta-app",
  currentFullName: "@orheunil/allta-user",
  originalFullName: "@orheunil/allta-user",
  scheme: "allta-user",
  version: "1.3.0",
  runtimeVersion: {
    policy: "appVersion",
  },
  orientation: "portrait",
  icon: "./src/assets/images/app-icon.png",
  userInterfaceStyle: "light",
  newArchEnabled: true,
  ios: {
    bundleIdentifier: "io.allta.user",
    googleServicesFile: "./GoogleService-Info.plist",
    icon: "./src/assets/images/app-icon.png",
    supportsTablet: false,
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
        "tmap",
      ],
      NSAppTransportSecurity: {
        NSAllowsArbitraryLoads: true,
      },
    },
  },
  android: {
    package: "io.allta.user",
    googleServicesFile: "./google-services.json",
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
    "@react-native-firebase/app",
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
