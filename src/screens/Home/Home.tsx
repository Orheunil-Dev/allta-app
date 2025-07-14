import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import PagerView from "react-native-pager-view";

export const Home = () => {
  const bannerData = [
    { image: "", url: "" },
    { image: "", url: "" },
    { image: "", url: "" },
    { image: "", url: "" },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <PagerView initialPage={0} style={styles.bannerCarousel}>
          {bannerData.map((value, index) => (
            <View key={index} style={styles.bannerCard}>
              <View style={styles.bannerImage}>
                <Text>캐러셀 {index}</Text>
              </View>
            </View>
          ))}
        </PagerView>

        <Text>홈</Text>
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
