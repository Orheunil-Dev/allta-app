import {
  Alert,
  Image,
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import * as MediaLibrary from "expo-media-library";
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
import { useEffect, useState } from "react";
import { colors } from "@/styles";
import { albumIcon } from "@/assets/images";

interface Props {
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  receiptScanNavigation: NativeStackNavigationProp<ReceiptScanStackParamList>;
}

export const ReceiptUploadButton = ({
  setIsLoading,
  receiptScanNavigation,
}: Props) => {
  const [firstPhoto, setFirstPhoto] = useState<string | null>(null);

  const {
    mutate: verifyReceipt,
    isPending: verifyReceiptLoading,
    isError: verifyReceiptError,
  } = useReceiptControllerVerifyReceipt();

  // 엘범 접근 권한
  const checkAlbumPermission = async (): Promise<boolean> => {
    let permission = await ImagePicker.getMediaLibraryPermissionsAsync();

    if (permission.status !== "granted") {
      if (!permission.canAskAgain) {
        Alert.alert(
          "앨범 접근 권한이 없습니다",
          "앱 설정에서 앨범 접근 권한을 허용할 수 있습니다. 이동하시겠습니까?",
          [
            { text: "닫기", style: "cancel" },
            { text: "설정", onPress: () => Linking.openSettings() },
          ],
          { cancelable: false }
        );

        return false;
      } else {
        permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        return permission.status === "granted";
      }
    }

    return true; // 이미 허용되어 있는 경우
  };

  // 앨범에서 영수증 업로드
  const handleUploadReceipt = async () => {
    const permission = await checkAlbumPermission();

    if (!permission) return;

    try {
      // 이미지 선택
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: false,
        base64: true,
        quality: 1,
      });

      if (result.canceled || !result.assets[0]) return;

      setIsLoading(true);

      const asset = result.assets[0];

      // 확장자 변환
      const manipResult = await ImageManipulator.manipulateAsync(
        asset.uri,
        [], // actions 없음
        { format: ImageManipulator.SaveFormat.JPEG, base64: true }
      );

      const base64Data = manipResult.base64;

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

      // 파일 경로
      const fileUri =
        Platform.OS === "android" && !manipResult.uri.startsWith("file://")
          ? "file://" + manipResult.uri
          : manipResult.uri;

      // 영수증 이미지 업로드
      const uploadFormData = new FormData();

      uploadFormData.append("bucket", "allta-receipt");
      uploadFormData.append("file", {
        uri: fileUri,
        type: "image/jpeg",
        name: `receipt_${dayjs().format("YYYYMMDDHHmmss")}.jpg`,
      } as any);

      const uploadRes = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/upload/image`,
        {
          method: "POST",
          body: uploadFormData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const uploadResJson = await uploadRes.json();

      console.log(uploadResJson.url);

      const imageUrl = uploadResJson.url;

      // 영수증 검증
      verifyReceipt(
        {
          data: { ...receiptData, image: imageUrl },
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

  useEffect(() => {
    const fetchFirstPhoto = async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") return;

      // 앨범에서 첫 번째 사진 가져오기
      const album = await MediaLibrary.getAssetsAsync({
        first: 1,
        mediaType: ["photo"],
        sortBy: [MediaLibrary.SortBy.creationTime],
      });

      if (album.assets.length > 0) {
        setFirstPhoto(album.assets[0].uri);
      }
    };

    fetchFirstPhoto();
  }, []);

  return (
    <Pressable onPress={handleUploadReceipt} style={styles.album}>
      {firstPhoto ? (
        <Image source={{ uri: firstPhoto }} style={styles.photo} />
      ) : (
        <Image
          source={albumIcon}
          style={{
            width: getResponsiveSize(40),
            height: getResponsiveSize(40),
          }}
        />
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  album: {
    position: "absolute",
    bottom: getResponsiveSize(34),
    left: getResponsiveSize(10),
  },
  photo: {
    width: getResponsiveSize(40),
    height: getResponsiveSize(40),
    backgroundColor: colors.black,
    borderWidth: 1,
    borderColor: colors.white,
    borderRadius: 20,
  },
});
