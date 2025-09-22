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
import { useEffect, useRef } from "react";
import { colors } from "@/styles";
import {
  getResponsiveSize,
  regexReceiptApproveTime,
  regexStorePhoneNumber,
} from "@/utils";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import {
  cameraButton,
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
import { useReceiptControllerVerifyReceipt } from "@/api/receipt/receipt";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export const ReceiptScanner = () => {
  const navigation = useNavigation();

  const [permission, requestPermission] = useCameraPermissions();

  const cameraRef = useRef<CameraView>(null);

  const {
    mutate: verifyReceipt,
    isPending: verifyReceiptLoading,
    isError: verifyReceiptError,
  } = useReceiptControllerVerifyReceipt();

  // 영수증 촬영
  const handleTakePhoto = async () => {
    if (!cameraRef.current) return;

    const photo = await cameraRef.current.takePictureAsync({
      base64: true,
    });

    const base64Data = photo.base64;

    const receipt = {
      amount: 0,
      billNumber: "",
      phoneNumber: "",
      approveDate: "",
    };

    try {
      const res = await axios.post(
        `${process.env.EXPO_PUBLIC_CLOVA_OCR_API_URL}`,
        {
          version: "V2",
          requestId: uuidv4(),
          timestamp: dayjs().format("YYYYMMDDHHmmss"),
          images: [
            {
              format: "jpg",
              name: "test",
              data: base64Data,
            },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-OCR-SECRET": process.env.EXPO_PUBLIC_CLOVA_OCR_SECRET_KEY,
          },
        }
      );

      console.log(res.data);

      const fields = await res.data.images[0].fields;

      for (let i = 0; i < fields.length; i++) {
        const text = fields[i].inferText.replace(/\s/g, "").toLowerCase();

        // 승인번호 추출
        if (
          !receipt.billNumber.length &&
          (text.includes("승인번호") || text.includes("승인no"))
        ) {
          if (fields[i + 1]) {
            receipt.billNumber = fields[i + 1].inferText.replace(/[^0-9]/g, "");
          }
        }

        // 승인시간 추출
        if (
          !receipt.approveDate.length &&
          text.match(regexReceiptApproveTime)
        ) {
          if (fields[i - 1]) {
            const datePart = fields[i - 1].inferText.replace(/[^0-9]/g, "");
            const timePart = fields[i].inferText.replace(/[^0-9]/g, "");

            receipt.approveDate = datePart + timePart;
          }
        }

        // 합계금액 추출
        if (receipt.amount === 0 && text.includes("합계금액")) {
          if (fields[i + 1]) {
            receipt.amount = fields[i + 1].inferText.replace(/[^0-9]/g, "");
          }
        }

        // 매장 전화번호 추출
        if (!receipt.phoneNumber.length) {
          const match = text.match(regexStorePhoneNumber);

          if (match) {
            receipt.phoneNumber = match[0].replace(/-/g, "");
          }
        }

        if (
          receipt.amount > 0 &&
          receipt.phoneNumber.length > 0 &&
          receipt.billNumber.length > 0 &&
          receipt.approveDate
        )
          break;
      }

      console.log(receipt);
    } catch (error) {
      console.error("OCR error:", error);
    }
  };

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
      <CameraView style={styles.cameraView} ref={cameraRef}>
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
            영수증의 매장정보와 결제 정보가
          </CustomText>
          <CustomText color={colors.white} fontSize={20} fontWeight={"600"}>
            잘 나오게 찍어주세요
          </CustomText>
        </Animated.View>

        <SafeAreaView edges={["top", "bottom"]}>
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

            <Pressable onPress={handleTakePhoto} style={styles.cameraButton}>
              <Image
                source={cameraButton}
                style={{
                  width: getResponsiveSize(66),
                  height: getResponsiveSize(66),
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
