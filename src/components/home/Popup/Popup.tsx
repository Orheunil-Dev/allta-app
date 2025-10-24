import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Dimensions, Image, Pressable, StyleSheet, View } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import mmkvStorage from "@/libs/mmkv-storage";
import { GetBannerListResponse } from "@/api/models";
import { getResponsiveSize } from "@/utils";
import { CustomText } from "@/components/ui/CustomText";
import { POPUP_CLOSE_DATE } from "@/constants";
import { colors } from "@/styles";
import { useAtom } from "jotai";
import { popupAtom } from "@/jotai";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

interface Props {
  data: GetBannerListResponse["data"] | undefined;
}

export const Popup = ({ data }: Props) => {
  const insets = useSafeAreaInsets();

  const popupRef = useRef<BottomSheetModal>(null);

  const [popup, setPopup] = useAtom(popupAtom);

  const TAB_HEIGHT =
    screenHeight < 680 ? getResponsiveSize(365) : getResponsiveSize(350);

  const snapPoints = useMemo(() => [insets.bottom + TAB_HEIGHT], []);

  const [currentSlide, setCurrentSlide] = useState<number>(0);

  const popups = data
    ? data
        .filter((item) => item.type === "POPUP")
        .sort((a, b) => a.index - b.index)
    : [];

  const handleClose = (isHideForToday: boolean) => () => {
    if (isHideForToday) {
      const today = new Date().toISOString().split("T")[0];
      mmkvStorage.setString(POPUP_CLOSE_DATE, today);
    }

    popupRef?.current?.close();
  };

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const lastClosed = mmkvStorage.getString(POPUP_CLOSE_DATE);

    if (!popup && (!lastClosed || lastClosed !== today) && popups.length > 0) {
      popupRef.current?.present();
      setPopup(true);
    }
  }, [popups, popup]);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        pressBehavior="close"
      />
    ),
    []
  );

  return (
    <BottomSheetModal
      ref={popupRef}
      snapPoints={snapPoints}
      enablePanDownToClose={false}
      enableHandlePanningGesture={false}
      handleComponent={() => null}
      backdropComponent={renderBackdrop}
      backgroundComponent={() => <View />}
    >
      <BottomSheetView style={styles.container}>
        <View style={styles.carouselContainer}>
          <Carousel
            data={popups}
            width={screenWidth}
            height={getResponsiveSize(300)}
            loop
            onSnapToItem={(index) => setCurrentSlide(index)}
            renderItem={({ item, index }) => (
              <Pressable key={index} style={styles.popupCard}>
                <Image
                  source={{ uri: item.image }}
                  resizeMode="cover"
                  style={styles.popupImage}
                />
              </Pressable>
            )}
          />

          <View style={styles.indicator}>
            <CustomText color={colors.white} fontSize={12} fontWeight={"700"}>
              {currentSlide + 1}
            </CustomText>

            <CustomText color="rgba(255, 255, 255, 0.7)" fontSize={12}>
              {" "}
              / {popups.length}
            </CustomText>
          </View>

          <View style={styles.buttonBox}>
            <Pressable onPress={handleClose(true)}>
              <CustomText fontSize={15}>오늘 하루 보지 않기</CustomText>
            </Pressable>

            <Pressable onPress={handleClose(false)}>
              <CustomText fontSize={15}>닫기</CustomText>
            </Pressable>
          </View>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    height: "100%",
    paddingBottom: getResponsiveSize(40),
    backgroundColor: colors.white,
    borderTopRightRadius: 32,
    borderTopLeftRadius: 32,
    overflow: "hidden",
  },
  carouselContainer: {
    position: "relative",
    width: "100%",
    height: getResponsiveSize(300),
  },
  popupCard: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: getResponsiveSize(300),
  },
  popupImage: {
    width: "100%",
    height: getResponsiveSize(300),
  },
  indicator: {
    position: "absolute",
    flexDirection: "row",
    right: getResponsiveSize(20),
    top: getResponsiveSize(20),
    width: "auto",
    height: "auto",
    paddingVertical: getResponsiveSize(4),
    paddingHorizontal: getResponsiveSize(8),
    backgroundColor: "rgba(38, 38, 39, 0.7)",
    borderRadius: 40,
  },
  buttonBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: getResponsiveSize(20),
    paddingHorizontal: getResponsiveSize(30),
  },
});
