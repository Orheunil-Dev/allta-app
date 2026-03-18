import { Image, Linking, Pressable, StyleSheet, View } from "react-native";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useToastMessage } from "@/hooks";
import { getResponsiveSize } from "@/utils";
import { CustomBottomSheet } from "../ui/CustomBottomSheet";
import { CustomText } from "../ui/CustomText";
import { closeIcon, kakaoMapIcon, tmapIcon } from "@/assets/images";

interface Props {
  ref: React.RefObject<BottomSheetModal | null>;
  onClose: () => void;
  lat?: number;
  lng?: number;
  storeName?: string;
}

export const NaviBottomSheet = ({
  ref,
  onClose,
  lat,
  lng,
  storeName,
}: Props) => {
  const { SuccessToast, ErrorToast } = useToastMessage();

  // TMAP 네비게이션 열기
  const handleOpenTmap = async () => {
    if (!lat || !lng) return;

    const destination = encodeURIComponent(storeName ?? "");
    const tmapScheme = `tmap://route?goalname=${destination}&goalx=${lng}&goaly=${lat}`;

    Linking.openURL(tmapScheme);

    SuccessToast("티맵으로 이동합니다.");

    return onClose();
  };

  // TMAP 네비게이션 열기
  const handleOpenKakaoMap = async () => {
    if (!lat || !lng) return;

    const tmapScheme = `kakaomap://route?ep=${lat},${lng}&by=CAR`;
    Linking.openURL(tmapScheme);

    SuccessToast("카카오맵으로 이동합니다.");

    return onClose();
  };

  return (
    <CustomBottomSheet
      ref={ref}
      height={getResponsiveSize(240)}
      onClose={onClose}
    >
      <View style={styles.container}>
        <CustomText textAlign="center" fontSize={18} fontWeight={"600"}>
          길찾기
        </CustomText>

        <Pressable style={styles.closeButton}>
          <Image
            source={closeIcon}
            style={{
              width: getResponsiveSize(24),
              height: getResponsiveSize(24),
            }}
          />
        </Pressable>

        <Pressable onPress={handleOpenKakaoMap} style={styles.button}>
          <Image source={kakaoMapIcon} style={styles.icon} />

          <CustomText marginLeft={12} fontSize={16}>
            카카오맵
          </CustomText>
        </Pressable>

        <Pressable onPress={handleOpenTmap} style={styles.button}>
          <Image source={tmapIcon} style={styles.icon} />

          <CustomText marginLeft={12} fontSize={16}>
            티맵
          </CustomText>
        </Pressable>
      </View>
    </CustomBottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    paddingTop: getResponsiveSize(12),
  },
  closeButton: {
    position: "absolute",
    top: getResponsiveSize(12),
    right: getResponsiveSize(0),
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: getResponsiveSize(16),
  },
  icon: {
    width: getResponsiveSize(40),
    height: getResponsiveSize(40),
  },
});
