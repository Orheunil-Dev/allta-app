import { Image, Linking, Platform, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { getResponsiveSize } from "@/utils";
import { splashIamge } from "@/assets/images";
import { useEffect, useState } from "react";
import { colors } from "@/styles";
import { CustomText } from "@/components/ui/CustomText";
import { CustomModal } from "@/components/ui/CustomModal";

interface Props {
  isVersionUpdate: boolean;
  isUpdateFinished: boolean;
}

export const Update = ({ isVersionUpdate, isUpdateFinished }: Props) => {
  const [visible, setVisible] = useState(false);

  const logoY = getResponsiveSize(80);

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

      <Image
        source={splashIamge}
        style={{
          width: getResponsiveSize(154),
          height: getResponsiveSize(233),
        }}
      />

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
