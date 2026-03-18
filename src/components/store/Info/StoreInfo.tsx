import { useRef } from "react";
import { Dimensions, Image, StyleSheet, View } from "react-native";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import RenderHTML from "react-native-render-html";
import { getFontSize, getResponsiveSize } from "@/utils";
import { CustomText } from "@/components/ui/CustomText";
import { CustomButton } from "@/components/ui/CustomButton";
import { KakaoMap } from "../KakaoMap";
import { naviIcon } from "@/assets/images";
import { colors } from "@/styles";
import { NaviBottomSheet } from "@/components/bottom-sheet";

interface Props {
  storeName: string;
  lat: number;
  lng: number;
  description?: string | null;
  policy?: string | null;
}

const { width: screenWidth } = Dimensions.get("window");

export const StoreInfo = ({
  storeName,
  lat,
  lng,
  description,
  policy,
}: Props) => {
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const handleOpenBottomSheet = () => {
    bottomSheetRef?.current?.present();
  };
  const handleCloseBottomSheet = () => {
    bottomSheetRef?.current?.close();
  };

  return (
    <View style={styles.container}>
      <NaviBottomSheet
        ref={bottomSheetRef}
        onClose={handleCloseBottomSheet}
        lat={lat}
        lng={lng}
        storeName={storeName}
      />

      <CustomText fontSize={18} fontWeight={"600"}>
        위치
      </CustomText>

      <View style={styles.map}>
        <KakaoMap lat={lat} lng={lng} height={getResponsiveSize(168)} />
      </View>

      <CustomButton
        onPress={handleOpenBottomSheet}
        height={getResponsiveSize(34)}
        marginTop={8}
        borderWidth={1}
        borderColor={colors.gray2}
      >
        <Image source={naviIcon} style={styles.naviIcon} />
        <CustomText fontSize={13} fontWeight={"500"}>
          길찾기
        </CustomText>
      </CustomButton>

      {description?.trim() && (
        <View>
          <CustomText
            marginTop={40}
            marginBottom={12}
            fontSize={18}
            fontWeight={"600"}
          >
            매장 소개
          </CustomText>

          <RenderHTML
            source={{ html: description }}
            contentWidth={screenWidth - getResponsiveSize(40)}
            tagsStyles={{
              p: {
                fontFamily: "Pretendard-Regular",
                color: colors.black,
                fontSize: getFontSize(16),
                lineHeight: getFontSize(16) * 1.5,
              },
            }}
          />
        </View>
      )}

      {policy?.trim() && (
        <View>
          <CustomText
            marginTop={40}
            marginBottom={12}
            fontSize={18}
            fontWeight={"600"}
          >
            매장 유의사항
          </CustomText>

          <RenderHTML
            source={{ html: policy }}
            contentWidth={screenWidth - getResponsiveSize(40)}
            tagsStyles={{
              p: {
                fontFamily: "Pretendard-Regular",
                color: colors.black,
                fontSize: getFontSize(16),
                lineHeight: getFontSize(16) * 1.5,
              },
            }}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: getResponsiveSize(20),
  },
  map: {
    marginTop: getResponsiveSize(12),
    borderWidth: 1,
    borderColor: colors.gray2,
    borderRadius: 8,
    overflow: "hidden",
  },
  naviIcon: {
    width: getResponsiveSize(16),
    height: getResponsiveSize(16),
    marginRight: getResponsiveSize(4),
  },
});
