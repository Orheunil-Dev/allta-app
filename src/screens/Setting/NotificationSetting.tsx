import { StyleSheet, Switch, View } from "react-native";
import { getResponsiveSize } from "@/utils";
import {
  MarketingAgreementSwitch,
  NotificationAgreementSwitch,
} from "@/components/setting";
import { colors } from "@/styles";

export const NotificationSetting = () => {
  return (
    <View style={styles.container}>
      <MarketingAgreementSwitch />
      <NotificationAgreementSwitch />
      <View style={styles.line} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: getResponsiveSize(20),
    backgroundColor: colors.white,
  },
  line: {
    width: "100%",
    height: getResponsiveSize(6),
    marginTop: getResponsiveSize(20),
    backgroundColor: colors.gray1,
  },
});
