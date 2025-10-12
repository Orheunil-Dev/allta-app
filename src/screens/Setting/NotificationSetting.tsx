import { CustomText } from "@/components/ui/CustomText";
import { colors } from "@/styles";
import { getResponsiveSize } from "@/utils";
import { Pressable, StyleSheet, Switch, View } from "react-native";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";
import {
  useUserControllerGetMarketingAgreementStatus,
  useUserControllerUpdateMarketingAgreementStatus,
} from "@/api/user/user";
import { useQueryClient } from "@tanstack/react-query";

export const NotificationSetting = () => {
  const queryClient = useQueryClient();

  // 마케팅 활용 여부 조회 API
  const { data, isLoading, isError, refetch } =
    useUserControllerGetMarketingAgreementStatus({
      query: {
        queryKey: ["isMarketing"],
      },
    });

  // 마케팅 활용 여부 변경 API
  const {
    mutate: updateMarketingAgreement,
    isPending: updateMarketingAgreementLoading,
  } = useUserControllerUpdateMarketingAgreementStatus();

  // 마케팅 활용 여부 변경
  const handleUpdateAgreementMarking = () => {
    if (!data || updateMarketingAgreementLoading) return;

    updateMarketingAgreement(
      {
        data: {
          isMarketing: !data.isMarketing,
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["isMarketing"] });
        },
      }
    );
  };

  useEffect(() => {
    const checkPermission = async () => {
      const settings = await Notifications.getPermissionsAsync();
      console.log("Notification permission:", settings.granted);
    };

    checkPermission();
  }, []);

  console.log(data);

  return (
    <View style={styles.container}>
      <View style={styles.item}>
        <CustomText fontSize={16}>
          마케팅 활용 및 광고성 정보 수신 동의
        </CustomText>

        <Switch
          value={data?.isMarketing ?? false}
          onValueChange={handleUpdateAgreementMarking}
          trackColor={{ true: colors.point2 }}
          thumbColor={colors.white}
          style={styles.toggle}
        />
      </View>

      <View style={styles.item}>
        <CustomText fontSize={16}>이벤트 • 혜택 및 정보 알림</CustomText>

        <Switch
          value={false}
          trackColor={{ true: colors.point2 }}
          style={styles.toggle}
        />
      </View>

      <View style={styles.line} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: getResponsiveSize(20),
    backgroundColor: colors.white,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingVertical: getResponsiveSize(12),
    paddingHorizontal: getResponsiveSize(20),
  },
  toggle: {
    width: getResponsiveSize(41),
    height: getResponsiveSize(25),
  },
  line: {
    width: "100%",
    height: getResponsiveSize(6),
    marginTop: getResponsiveSize(20),
    backgroundColor: colors.gray1,
  },
});
