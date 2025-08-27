import { Image, Pressable, StyleSheet, View } from "react-native";
import { getResponsiveSize } from "@/utils";
import { alarmEmpty, alarmUnread, alltaHeaderLogo } from "@/assets/images";
import { colors } from "@/styles";

interface Props {
  alarmCount?: number;
  onPressAlarm: () => void;
}

export const HomeHeader = ({ alarmCount, onPressAlarm }: Props) => {
  return (
    <View style={styles.container}>
      <Image source={alltaHeaderLogo} style={styles.headerLogo} />

      <Pressable onPress={onPressAlarm}>
        {alarmCount ? (
          <Image source={alarmUnread} style={styles.alarm} />
        ) : (
          <Image source={alarmEmpty} style={styles.alarm} />
        )}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: getResponsiveSize(60),
    paddingHorizontal: getResponsiveSize(20),
    backgroundColor: colors.white,
    zIndex: 1,
  },
  headerLogo: {
    width: getResponsiveSize(58),
    height: getResponsiveSize(28),
  },
  alarm: {
    width: getResponsiveSize(24),
    height: getResponsiveSize(24),
  },
});
