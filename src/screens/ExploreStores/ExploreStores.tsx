import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

export const ExploreStores = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView>
        <View style={styles.container}>
          <Text>매장 둘러보기</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 60,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    zIndex: 1,
  },
  headerLogo: {
    width: 58,
    height: 28,
  },
  alarm: {
    width: 24,
    height: 24,
  },
  container: {
    height: "100%",
    alignItems: "center",
    paddingVertical: 20,
    backgroundColor: "#fff",
  },
  carouselContainer: { position: "relative", width: "100%", height: 200 },
  bannerCarousel: {
    width: "100%",
    height: "100%",
  },
  bannerCard: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  bannerImage: {
    width: "100%",
    height: 200,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  indicator: {
    position: "absolute",
    flexDirection: "row",
    right: 30,
    bottom: 10,
    width: "auto",
    height: "auto",
    paddingVertical: 4,
    paddingHorizontal: 8,
    fontSize: 12,
    backgroundColor: "rgba(38, 38, 39, 0.7)",
    borderRadius: 40,
  },
});
