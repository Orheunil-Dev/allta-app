import { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  Linking,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { CameraView, useCameraPermissions } from "expo-camera";
import { QrScanStackParamList } from "@/navigations";
import { usePassControllerVerifyQrCode } from "@/api/pass/pass";
import { getResponsiveSize } from "@/utils";
import { CustomText } from "@/components/ui/CustomText";
import { Spinner } from "@/components/ui/Spinner";
import {
  qrFrame1,
  qrFrame2,
  qrFrame3,
  qrFrame4,
  whiteCloseIcon,
} from "@/assets/images";
import { colors } from "@/styles";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export const QrScan = () => {
  const navigation = useNavigation();

  const qrScanNavigation =
    useNavigation<NativeStackNavigationProp<QrScanStackParamList>>();

  const cameraRef = useRef<CameraView>(null);

  const isFocused = useIsFocused();

  const [permission, requestPermission] = useCameraPermissions();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    mutate: verifyQrCode,
    isError: verifyQrCodeError,
    isPending: verifyQrCodeLoading,
  } = usePassControllerVerifyQrCode();

  // 카메라 권한 확인
  const checkCameraPermission = async () => {
    if (!permission) return;

    if (permission.status !== "granted") {
      if (!permission.canAskAgain) {
        Alert.alert(
          "카메라 접근 권한이 없습니다",
          "앱 설정에서 카메라 접근 권한을 허용할 수 있습니다. 이동하시겠습니까?",
          [
            {
              text: "취소",
              style: "cancel",
              onPress: () => navigation.goBack(),
            },
            {
              text: "설정 열기",
              onPress: () => {
                Linking.openSettings();
              },
            },
          ],
          { cancelable: false }
        );
      } else {
        requestPermission();
      }
    }
  };

  // QR코드 스캔
  const scanQrCode = (id: string) => {
    verifyQrCode(
      {
        data: {
          id,
        },
      },
      {
        onSuccess: (res) => {
          if (!res.ok) {
            return qrScanNavigation.navigate("QrScanError", {
              code: res.code,
              storeId: id,
            });
          }

          if (res.ok) {
            return qrScanNavigation.navigate("QrScanCompelete", {
              storeId: id,
              storeName: res.storeName,
            });
          }
        },
        onError: (error: any) => {
          return qrScanNavigation.navigate("QrScanError", {
            code: "",
            storeId: id,
          });
        },
      }
    );
  };

  // 오버레이 애니메이션
  const overlayOpacity = useSharedValue(1);

  const overlayAnimatedStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  useFocusEffect(
    useCallback(() => {
      const checkPermission = async () => {
        await checkCameraPermission();
      };

      checkPermission();
    }, [permission])
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      overlayOpacity.value = withTiming(0, {
        duration: 750,
        easing: Easing.out(Easing.cubic),
      });
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <SafeAreaProvider style={{ backgroundColor: colors.black }}>
      {isLoading && (
        <View style={styles.loadingView}>
          <Spinner size={60} thickness={5} />
        </View>
      )}

      {isFocused && permission?.status === "granted" && (
        <CameraView
          ref={cameraRef}
          barcodeScannerSettings={{
            barcodeTypes: ["qr"],
          }}
          onBarcodeScanned={({ data }) => {
            if (!data) return;

            scanQrCode(data);
          }}
          style={styles.cameraView}
        >
          <View style={styles.frame}>
            <Animated.View
              style={[overlayAnimatedStyle, styles.textView]}
              pointerEvents="none"
            >
              <CustomText
                textAlign="center"
                color={colors.white}
                fontSize={20}
                fontWeight={"600"}
              >
                매장 QR을 스캔해
              </CustomText>
              <CustomText
                textAlign="center"
                color={colors.white}
                fontSize={20}
                fontWeight={"600"}
              >
                이용권을 확인해주세요!
              </CustomText>
            </Animated.View>

            <View style={styles.frameTop}>
              <Image
                source={qrFrame1}
                style={{
                  width: getResponsiveSize(32),
                  height: getResponsiveSize(32),
                }}
              />
              <Image
                source={qrFrame2}
                style={{
                  width: getResponsiveSize(32),
                  height: getResponsiveSize(32),
                }}
              />
            </View>
            <View style={styles.frameBottom}>
              <Image
                source={qrFrame3}
                style={{
                  width: getResponsiveSize(32),
                  height: getResponsiveSize(32),
                }}
              />
              <Image
                source={qrFrame4}
                style={{
                  width: getResponsiveSize(32),
                  height: getResponsiveSize(32),
                }}
              />
            </View>
          </View>

          <Animated.View
            style={[styles.overlay, overlayAnimatedStyle]}
            pointerEvents="none"
          />

          <SafeAreaView edges={["top"]}>
            <View style={styles.container}>
              <Pressable
                onPress={() => navigation.goBack()}
                style={styles.closeButton}
              >
                <Image
                  source={whiteCloseIcon}
                  style={{
                    width: getResponsiveSize(28),
                    height: getResponsiveSize(28),
                  }}
                />
              </Pressable>
            </View>
          </SafeAreaView>
        </CameraView>
      )}
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  loadingView: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(38, 38, 39, 0.7)",
    zIndex: 2,
  },
  cameraView: {
    position: "relative",
    flex: 1,
    width: "100%",
    justifyContent: "center",
    paddingHorizontal: getResponsiveSize(20),
    backgroundColor: colors.black,
  },
  container: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    paddingHorizontal: getResponsiveSize(20),
  },
  overlay: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    width: screenWidth,
    height: screenHeight,
    backgroundColor: "#000",
    zIndex: 2,
  },
  closeButton: {
    position: "absolute",
    top: getResponsiveSize(20),
    right: 0,
  },
  frame: {
    position: "absolute",
    justifyContent: "space-between",
    alignSelf: "center",
    width: screenWidth - getResponsiveSize(160),
    height: screenWidth - getResponsiveSize(160),
    zIndex: 3,
  },
  frameTop: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  frameBottom: { flexDirection: "row", justifyContent: "space-between" },
  cameraButton: {
    position: "absolute",
    bottom: getResponsiveSize(20),
  },
  textView: {
    position: "absolute",
    alignSelf: "center",
    top: -getResponsiveSize(100),
  },
});
