import { Dimensions, Image, Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import {
  CommonActions,
  RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import dayjs from "dayjs";
import { useEventControllerGetEventDetail } from "@/api/event/event";
import { ContainerStackParamList, EventStackParamList } from "@/navigations";
import { getFontSize, getResponsiveSize } from "@/utils";
import { CustomSafeAreaView } from "@/components/ui/CustomSafeAreaView";
import { CustomText } from "@/components/ui/CustomText";
import { headerBackArrow, shareIcon } from "@/assets/images";
import { colors } from "@/styles";
import { CustomImage } from "@/components/ui/CustomImage";
import RenderHTML from "react-native-render-html";

const { width: screenWidth } = Dimensions.get("window");

type EventDetailRouteProp = RouteProp<EventStackParamList, "EventDetail">;

export const EventDetail = () => {
  const router = useRoute<EventDetailRouteProp>();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const containerNavigation =
    useNavigation<NativeStackNavigationProp<ContainerStackParamList>>();

  const { data: eventData } = useEventControllerGetEventDetail(
    router.params.id,
    {
      query: {
        enabled: !!router.params.id,
      },
    }
  );

  const handleGoBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      // 뒤로 갈 화면이 없으면 홈으로
      containerNavigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            {
              name: "BottomTab",
              params: { screen: "Home" },
            },
          ],
        })
      );
    }
  };

  return (
    <CustomSafeAreaView edges={["top", "bottom"]}>
      <View
        style={[
          styles.header,
          { paddingTop: insets.top + getResponsiveSize(10) },
        ]}
      >
        <Pressable onPress={handleGoBack}>
          <Image source={headerBackArrow} style={styles.icon} />
        </Pressable>

        <CustomText fontSize={16} fontWeight={"600"}>
          이벤트
        </CustomText>

        {/* <Pressable>
          <Image source={shareIcon} style={styles.icon} />
        </Pressable> */}

        <View style={styles.icon} />
      </View>

      {eventData?.data && (
        <ScrollView style={styles.container}>
          <View style={styles.title}>
            <CustomText fontSize={22} fontWeight={"600"}>
              {eventData.data.title}
            </CustomText>
            <CustomText color={colors.gray5} fontSize={16}>
              {eventData.data.startDate
                ? dayjs(eventData.data.startDate).format("YYYY.MM.DD")
                : ""}
              {eventData.data.startDate || eventData.data.endDate ? " ~" : ""}
              {eventData.data.endDate
                ? dayjs(eventData.data.endDate).format(" YYYY.MM.DD")
                : ""}
            </CustomText>
          </View>

          <CustomImage
            uri={eventData.data.mainImage}
            width={screenWidth}
            marginTop={24}
          />

          {eventData.data.note && (
            <View style={styles.note}>
              <RenderHTML
                contentWidth={screenWidth - getResponsiveSize(40)}
                source={{ html: eventData.data.note }}
                tagsStyles={{
                  h3: {
                    fontFamily: "Pretendard-SemiBold",
                    color: colors.black,
                    fontSize: getFontSize(16),
                    fontWeight: "600",
                    lineHeight: getFontSize(14) * 1.5,
                  },
                  p: {
                    fontFamily: "Pretendard-Regular",
                    color: colors.black,
                    fontSize: getFontSize(14),
                    lineHeight: getFontSize(14) * 1.5,
                  },
                  li: {
                    fontFamily: "Pretendard-Regular",
                    color: colors.black,
                    fontSize: getFontSize(14),
                    lineHeight: getFontSize(14) * 1.5,
                  },
                }}
              />
            </View>
          )}
        </ScrollView>
      )}
    </CustomSafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingVertical: getResponsiveSize(10),
    paddingHorizontal: getResponsiveSize(20),
    backgroundColor: colors.white,
    zIndex: 2,
  },
  icon: {
    width: getResponsiveSize(24),
    height: getResponsiveSize(24),
  },
  container: {
    marginTop: getResponsiveSize(48),
    paddingVertical: getResponsiveSize(20),
  },
  title: {
    paddingHorizontal: getResponsiveSize(20),
  },
  note: {
    marginTop: getResponsiveSize(40),
    paddingVertical: getResponsiveSize(16),
    paddingHorizontal: getResponsiveSize(20),
    backgroundColor: colors.gray1,
  },
});
