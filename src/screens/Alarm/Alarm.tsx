import { SafeAreaView, StyleSheet, Text, View } from "react-native";

export const Alarm = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text>알림</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  bannerCarousel: {
    width: "100%",
    height: 200,
  },
  bannerCard: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: 200,
  },
  bannerImage: {
    width: "90%",
    height: 200,
    borderRadius: 10,
    backgroundColor: "#F3F3F3",
  },
});
