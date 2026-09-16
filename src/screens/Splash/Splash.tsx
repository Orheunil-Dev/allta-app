import { useEffect, useState } from "react";
import { Linking, Platform, StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { getResponsiveSize } from "@/utils";
import { CustomModal } from "@/components/ui/CustomModal";
import { CustomText } from "@/components/ui/CustomText";
import { splashIamge } from "@/assets/images";
import { colors } from "@/styles";

interface Props {
  showUpdate: boolean;
  isVersionUpdate: boolean;
  isUpdateFinished: boolean;
}

export const Splash = ({
  showUpdate,
  isVersionUpdate,
  isUpdateFinished,
}: Props) => {
  const { t } = useTranslation("home");

  const [visible, setVisible] = useState(false);

  // 앱 버전 업데이트
  const handleOpenStore = async () => {
    const storeUrl =
      Platform.OS === "ios"
        ? "https://apps.apple.com/app/id6467127880"
        : "https://play.google.com/store/apps/details?id=io.allta.user";

    try {
      await Linking.openURL(storeUrl);
    } catch (error: any) {
      console.log(error.message ?? error);
    }
  };

  const logoY = getResponsiveSize(80);

  const splashAnimatedStyle = useAnimatedStyle(() => {
    "worklet";

    return {
      marginTop: withTiming(visible ? 0 : logoY, {
        duration: 500,
      }),
      opacity: withTiming(visible ? 1 : 0, { duration: 500 }),
    };
  });

  const progressBarAnimatedStyle = useAnimatedStyle(() => {
    "worklet";

    if (isVersionUpdate) {
      return {
        width: "0%",
      };
    }

    return {
      width: withTiming(visible ? "100%" : "0%", {
        duration: 1000,
      }),
    };
  });

  useEffect(() => {
    setVisible(true);
  }, []);

  return (
    <View style={styles.container}>
      <CustomModal
        visible={isVersionUpdate}
        onNext={handleOpenStore}
        nextButtonText={t("splash.update.button")}
      >
        <CustomText marginTop={12} fontSize={18} fontWeight={"600"}>
          {t("splash.update.title")}
        </CustomText>

        <CustomText marginTop={8} fontSize={16}>
          {t("splash.update.description1")}
        </CustomText>
        <CustomText fontSize={16}>
          {t("splash.update.description2")}
        </CustomText>
      </CustomModal>

      <Animated.Image
        source={splashIamge}
        style={[
          {
            marginTop: logoY,
            opacity: 0,
            width: getResponsiveSize(154),
            height: getResponsiveSize(233),
          },
          splashAnimatedStyle,
        ]}
      />

      {showUpdate && (
        <View style={styles.loading}>
          <CustomText textAlign="center" marginBottom={12} fontSize={14}>
            {isUpdateFinished
              ? t("splash.status.finished")
              : isVersionUpdate
              ? t("splash.status.checkingVersion")
              : t("splash.status.applying")}
          </CustomText>

          <View style={styles.track}>
            <Animated.View style={[styles.bar, progressBarAnimatedStyle]} />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    backgroundColor: "white",
    zIndex: 99,
  },
  loading: {
    position: "absolute",
    bottom: getResponsiveSize(120),
  },
  track: {
    width: getResponsiveSize(191),
    height: getResponsiveSize(4),
    backgroundColor: colors.gray3,
    borderRadius: 20,
  },
  bar: {
    height: "100%",
    backgroundColor: colors.point2,
    borderRadius: 20,
  },
});
