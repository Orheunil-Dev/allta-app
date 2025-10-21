import { useState } from "react";
import { Dimensions, Image, Pressable, StyleSheet, View } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { GetBannerListResponse } from "@/api/models";
import { getResponsiveSize } from "@/utils";
import { CustomText } from "@/components/ui/CustomText";
import { colors } from "@/styles";

const { width: screenWidth } = Dimensions.get("window");

interface Props {
  data: GetBannerListResponse["data"] | undefined;
}

export const SubBanner = ({ data }: Props) => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  const subBanners = data
    ? data
        .filter((item) => item.type === "SUB")
        .sort((a, b) => a.index - b.index)
    : [];

  return (
    <View style={styles.container}>
      <Carousel
        data={subBanners}
        width={screenWidth}
        height={getResponsiveSize(108)}
        loop
        autoPlay
        scrollAnimationDuration={1000}
        autoPlayInterval={2500}
        onSnapToItem={(index) => setCurrentSlide(index)}
        renderItem={({ item, index }) => (
          <Pressable key={index} style={styles.bannerCard}>
            <Image
              source={{ uri: item.image }}
              resizeMode="cover"
              style={styles.bannerImage}
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
          / {subBanners.length}
        </CustomText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    width: "100%",
    height: getResponsiveSize(108),
  },
  bannerCarousel: {
    width: "100%",
    height: "100%",
  },
  bannerCard: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: getResponsiveSize(108),
    paddingHorizontal: getResponsiveSize(20),
  },
  bannerImage: {
    width: "100%",
    height: getResponsiveSize(108),
    borderRadius: 10,
  },
  indicator: {
    position: "absolute",
    flexDirection: "row",
    right: getResponsiveSize(30),
    bottom: getResponsiveSize(10),
    width: "auto",
    height: "auto",
    paddingVertical: getResponsiveSize(2),
    paddingHorizontal: getResponsiveSize(8),
    backgroundColor: "rgba(38, 38, 39, 0.7)",
    borderRadius: 40,
  },
});
