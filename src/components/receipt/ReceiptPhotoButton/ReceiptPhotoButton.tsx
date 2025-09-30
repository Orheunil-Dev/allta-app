import { Image, Pressable, StyleSheet } from "react-native";
import { CameraView } from "expo-camera";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ReceiptScanStackParamList } from "@/navigations";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";
import { useReceiptControllerVerifyReceipt } from "@/api/receipt/receipt";
import {
  formatApprovalDate,
  formatStorePhoneNumber,
  getResponsiveSize,
} from "@/utils";
import { cameraButton } from "@/assets/images";

interface Props {
  cameraRef: React.RefObject<CameraView | null>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  receiptScanNavigation: NativeStackNavigationProp<ReceiptScanStackParamList>;
}

export const ReceiptPhotoButton = ({
  cameraRef,
  isLoading,
  setIsLoading,
  receiptScanNavigation,
}: Props) => {
  const {
    mutate: verifyReceipt,
    isPending: verifyReceiptLoading,
    isError: verifyReceiptError,
  } = useReceiptControllerVerifyReceipt();

  // 영수증 촬영
  const handleTakePhoto = async () => {
    if (!cameraRef.current) return;

    setIsLoading(true);

    // 사진 촬영
    const photo = await cameraRef.current.takePictureAsync({
      base64: true,
    });

    const base64Data = photo.base64;

    try {
      // 클로바 OCR API 요청
      const res = await axios.post(
        `${process.env.EXPO_PUBLIC_CLOVA_OCR_API_URL}`,
        {
          version: "V2",
          requestId: uuidv4(),
          timestamp: dayjs().format("YYYYMMDDHHmmss"),
          images: [
            {
              format: "jpg",
              name: `receipt_${dayjs().format("YYYYMMDDHHmmss")}`,
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

      const raw = res.data.images[0].receipt.result;

      const approvalDate = formatApprovalDate(
        raw.paymentInfo.date.text.replace(/\D/g, ""),
        raw.paymentInfo.time.text
      ).replace(/\D/g, "");

      const receiptData = {
        amount: Number(raw.totalPrice.price.text.replace(/\D/g, "")),
        confirmNumber: raw.paymentInfo.confirmNum.text.replace(/\D/g, ""),
        storePhoneNumber: formatStorePhoneNumber(
          raw.storeInfo.tel?.[0]?.text.replace(/\D/g, "")
        ),
        approvalDate,
      };

      // 영수증 검증
      verifyReceipt(
        {
          data: {
            ...receiptData,
          },
        },
        {
          onSuccess: (res) => {
            setIsLoading(false);

            if (!res.ok) {
              return receiptScanNavigation.navigate("ReceiptScanError", {
                code: res.code,
                message: res.message,
              });
            }
            if (res.ok && res.data) {
              return receiptScanNavigation.navigate("ReceiptScanComplete", {
                storeName: res.data.storeName,
                discountType: res.data.discountType,
                discountValue: res.data.discountValue,
                createdAt: res.data.createdAt,
                expiredAt: res.data.expiredAt,
              });
            }
          },
          onError: () => {
            setIsLoading(false);

            return receiptScanNavigation.navigate("ReceiptScanError", {
              code: "001",
              message: "영수증 인식에 실패했습니다.",
            });
          },
        }
      );
    } catch (error: any) {
      setIsLoading(false);

      if (error.code && error.message) {
        return receiptScanNavigation.navigate("ReceiptScanError", {
          code: error.code,
          message: error.message,
        });
      } else {
        return receiptScanNavigation.navigate("ReceiptScanError", {
          code: "001",
          message: "영수증 인식에 실패했습니다.",
        });
      }
    }
  };

  return (
    <Pressable
      disabled={isLoading}
      onPress={handleTakePhoto}
      style={styles.cameraButton}
    >
      <Image
        source={cameraButton}
        style={{
          width: getResponsiveSize(66),
          height: getResponsiveSize(66),
        }}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  cameraButton: {
    position: "absolute",
    bottom: getResponsiveSize(20),
  },
});
