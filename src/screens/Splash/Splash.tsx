import { useEffect, useState } from "react";
import { Linking, Platform, StyleSheet, View } from "react-native";
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
        nextButtonText="업데이트 하기"
      >
        <CustomText marginTop={12} fontSize={18} fontWeight={"600"}>
          업데이트
        </CustomText>

        <CustomText marginTop={8} fontSize={16}>
          안정적인 서비스 이용을 위해
        </CustomText>
        <CustomText fontSize={16}>
          앱을 최신 버전으로 업데이트해주세요.
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
              ? "업데이트가 완료되었습니다."
              : isVersionUpdate
              ? "버전을 확인중입니다."
              : "업데이트를 적용하고 있습니다."}
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
