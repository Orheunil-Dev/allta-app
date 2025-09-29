import { CameraView, useCameraPermissions } from "expo-camera";
import { CustomText } from "@/components/ui/CustomText";
import {
  Alert,
  Dimensions,
  Image,
  Linking,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import { colors } from "@/styles";
import { getResponsiveSize } from "@/utils";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import {
  receptFrame1,
  receptFrame2,
  receptFrame3,
  receptFrame4,
  whiteCloseIcon,
} from "@/assets/images";
import { useNavigation } from "@react-navigation/native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { QrScanStackParamList } from "@/navigations";
import { Spinner } from "@/components/ui/Spinner";
import { usePassControllerVerifyQrCode } from "@/api/pass/pass";
import { errorModalAtom } from "@/recoil";
import { useSetAtom } from "jotai";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export const QrScan = () => {
  const navigation = useNavigation();

  const qrScanNavigation =
    useNavigation<NativeStackNavigationProp<QrScanStackParamList>>();

  const cameraRef = useRef<CameraView>(null);

  const [permission, requestPermission] = useCameraPermissions();

  const setErrorModal = useSetAtom(errorModalAtom);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    mutate: verifyQrCode,
    isError: verifyQrCodeError,
    isPending: verifyQrCodeLoading,
  } = usePassControllerVerifyQrCode();

  // 카메라 및 앨범 권한 확인
  const checkPermissions = async () => {
    if (!permission) return; // 권한 정보가 없으면 리턴

    if (permission.status !== "granted") {
      // 권한이 거부되었을 때
      if (!permission.canAskAgain) {
        // 권한을 다시 물어볼 수 없을 때 설정을 엽니다.
        Alert.alert(
          "권한 필요",
          "앱 설정에서 카메라 권한을 변경해주세요.",
          [
            { text: "취소", style: "cancel" },
            {
              text: "설정 열기",
              onPress: () => {
                Linking.openSettings(); // 설정을 여는 기능
              },
            },
          ],
          { cancelable: false }
        );
      } else {
        // 권한을 다시 요청할 수 있을 때
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
            if (res.code === "002") {
              return qrScanNavigation.navigate("QrScanError", {
                storeId: id,
              });
            }

            return setErrorModal({
              visible: true,
              message: "유효하지 않은 QR입니다.\nQR코드를 다시 확인해주세요.",
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
          setErrorModal({
            visible: true,
            message: error?.message ?? "QR코드 스캔에 실패했습니다.",
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

  useEffect(() => {
    checkPermissions(); // 컴포넌트가 마운트될 때 권한 상태 확인
  }, [permission]);

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
    <SafeAreaProvider>
      {isLoading && (
        <View style={styles.loadingView}>
          <Spinner size={60} thickness={5} />
        </View>
      )}

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
          <View style={styles.frameTop}>
            <Image
              source={receptFrame1}
              style={{
                width: getResponsiveSize(32),
                height: getResponsiveSize(32),
              }}
            />
            <Image
              source={receptFrame2}
              style={{
                width: getResponsiveSize(32),
                height: getResponsiveSize(32),
              }}
            />
          </View>
          <View style={styles.frameBottom}>
            <Image
              source={receptFrame3}
              style={{
                width: getResponsiveSize(32),
                height: getResponsiveSize(32),
              }}
            />
            <Image
              source={receptFrame4}
              style={{
                width: getResponsiveSize(32),
                height: getResponsiveSize(32),
              }}
            />
          </View>
        </View>

        <Animated.View style={[styles.overlay, overlayAnimatedStyle]}>
          <CustomText color={colors.white} fontSize={20} fontWeight={"600"}>
            매장의 QR코드를 스캔해주세요
          </CustomText>
        </Animated.View>

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
    width: screenWidth - getResponsiveSize(80),
    height: screenWidth - getResponsiveSize(40),
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
});
