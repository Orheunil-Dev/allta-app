import { StyleSheet, Switch, View } from "react-native";
import { useTranslation } from "react-i18next";
import {
  useUserControllerGetMarketingAgreementStatus,
  useUserControllerUpdateMarketingAgreementStatus,
} from "@/api/user/user";
import { useToastMessage } from "@/hooks";
import { getResponsiveSize } from "@/utils";
import { CustomText } from "../ui/CustomText";
import { colors } from "@/styles";

export const MarketingAgreementSwitch = () => {
  const { t } = useTranslation("mypage");

  const { SuccessToast, ErrorToast } = useToastMessage();

  // 마케팅 활용 여부 조회 API
  const { data, isLoading, isError, refetch } =
    useUserControllerGetMarketingAgreementStatus();

  // 마케팅 활용 여부 변경 API
  const {
    mutate: updateMarketingAgreement,
    isPending: updateMarketingAgreementLoading,
    isError: updateMarketingAgreementError,
  } = useUserControllerUpdateMarketingAgreementStatus();

  // 마케팅 활용 여부 변경
  const handleUpdateMarkingAgreement = () => {
    if (!data || updateMarketingAgreementLoading) return;

    updateMarketingAgreement(
      {
        data: {
          isMarketing: !data.isMarketing,
        },
      },
      {
        onSuccess: () => {
          SuccessToast(
            data.isMarketing ? t("marketing.disagreed") : t("marketing.agreed")
          );
          refetch();
        },
        onError: () => {
          ErrorToast(t("requestError"));
        },
      }
    );
  };

  return (
    <View style={styles.container}>
      <CustomText fontSize={16}>{t("marketing.label")}</CustomText>

      <Switch
        value={data?.isMarketing ?? false}
        onValueChange={handleUpdateMarkingAgreement}
        trackColor={{ true: colors.point2 }}
        thumbColor={colors.white}
        style={styles.switch}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingVertical: getResponsiveSize(12),
  },
  switch: {
    width: getResponsiveSize(41),
    height: getResponsiveSize(25),
  },
});
