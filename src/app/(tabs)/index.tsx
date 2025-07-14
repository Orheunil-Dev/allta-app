import { StyleSheet, Text, View } from "react-native";
import PagerView from "react-native-pager-view";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const bannerData = [
    { image: "", url: "" },
    { image: "", url: "" },
    { image: "", url: "" },
    { image: "", url: "" },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <PagerView initialPage={0} style={styles.bannerImage}>
          {bannerData.map((value, index) => (
            <View key={index} style={styles.bannerImage}>
              <Text>캐러셀 {index}</Text>
            </View>
          ))}
        </PagerView>

        <Text>홈</Text>
      </View>
    </SafeAreaView>
  );
}

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
  bannerImage: {
    width: "100%",
    height: 200,
    backgroundColor: "#F3F3F3",
  },
});
