import { Image, Pressable, StyleSheet, View } from "react-native";
import { getResponsiveSize } from "@/utils";
import { alarmEmpty, alarmUnread, alltaHeaderLogo } from "@/assets/images";
import { colors } from "@/styles";

interface Props {
  unreadCount?: number;
  onPressAlarm: () => void;
}

export const HomeHeader = ({ unreadCount, onPressAlarm }: Props) => {
  return (
    <View style={styles.container}>
      <Image source={alltaHeaderLogo} style={styles.headerLogo} />

      <Pressable onPress={onPressAlarm}>
        {unreadCount ? (
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
    paddingTop: getResponsiveSize(12),
    paddingBottom: getResponsiveSize(20),
    paddingHorizontal: getResponsiveSize(20),
    backgroundColor: colors.bg,
    zIndex: 1,
  },
  headerLogo: {
    width: getResponsiveSize(58),
    aspectRatio: 58 / 27,
  },
  alarm: {
    width: getResponsiveSize(24),
    height: getResponsiveSize(24),
  },
});
