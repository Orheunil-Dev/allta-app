import {
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEventControllerGetEventList } from "@/api/event/event";
import { EventStackParamList } from "@/navigations";
import { getResponsiveSize } from "@/utils";
import { CustomSafeAreaView } from "@/components/ui/CustomSafeAreaView";
import { CustomText } from "@/components/ui/CustomText";
import { colors } from "@/styles";

const { width: screenWidth } = Dimensions.get("window");

export const EventList = () => {
  const eventStackNavigation =
    useNavigation<NativeStackNavigationProp<EventStackParamList>>();

  // 이벤트 목록 조회 API
  const {
    data: eventData,
    isLoading: eventLoading,
    isError: eventError,
  } = useEventControllerGetEventList();

  return (
    <CustomSafeAreaView edges={["bottom"]}>
      <View style={styles.container}>
        <View style={{ flexDirection: "row" }}>
          <CustomText fontSize={16} fontWeight={"600"}>
            진행중인 이벤트
          </CustomText>
          <CustomText
            marginLeft={4}
            color={colors.point2}
            fontSize={16}
            fontWeight={"600"}
          >
            {eventData?.data.length ?? 0}
          </CustomText>
        </View>

        <FlatList
          data={eventData?.data}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item, index }) => (
            <Pressable
              onPress={() =>
                eventStackNavigation.navigate("EventDetail", {
                  id: item.id,
                })
              }
              style={styles.card}
            >
              <ImageBackground
                source={{ uri: item.thumbnail }}
                style={styles.thumbnail}
                resizeMode="cover"
              />
            </Pressable>
          )}
        />

        {!eventLoading && eventData?.data.length === 0 && (
          <View style={styles.emptyBox}>
            <CustomText
              marginBottom={4}
              color={colors.gray5}
              fontSize={20}
              fontWeight={"600"}
            >
              현재 진행 중인 이벤트가 없습니다.
            </CustomText>
            <CustomText marginBottom={40} color={colors.gray5} fontSize={16}>
              이벤트 소식을 곧 전해드릴게요!
            </CustomText>
          </View>
        )}
      </View>
    </CustomSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: getResponsiveSize(20),
  },
  listContainer: {
    marginTop: getResponsiveSize(8),
    gap: getResponsiveSize(16),
  },
  card: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: getResponsiveSize(142),
    borderRadius: 12,
    overflow: "hidden",
  },
  thumbnail: {
    width: screenWidth - getResponsiveSize(20),
    height: getResponsiveSize(142),
  },
  emptyBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
