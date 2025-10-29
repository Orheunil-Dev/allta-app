import { Image, Platform, Pressable, StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useUserControllerGetUserProfile } from "@/api/user/user";
import { ContainerStackParamList } from "@/navigations";
import { getResponsiveSize } from "@/utils";
import { CustomText } from "@/components/ui/CustomText";
import { CustomSafeAreaView } from "@/components/ui/CustomSafeAreaView";
import {
  addressIcon,
  cardIcon,
  carIcon,
  contactIcon,
  couponIcon,
  eventIcon,
  inquiryIcon,
  noticeIcon,
  passIcon,
  purchaseIcon,
  referralIcon,
  rigthArrowIcon,
  serviceHistoryIcon,
  settingIcon,
} from "@/assets/images";
import { colors } from "@/styles";

export const MyPage = () => {
  const containerNavigation =
    useNavigation<NativeStackNavigationProp<ContainerStackParamList>>();

  const insets = useSafeAreaInsets();

  const { data: userProfileData, error } = useUserControllerGetUserProfile({
    query: {
      retry: false,
      gcTime: 0,
    },
  });

  return (
    <CustomSafeAreaView edges={["top"]}>
      <View
        style={[
          styles.header,
          { paddingTop: insets.top + getResponsiveSize(10) },
        ]}
      >
        <View style={{ width: getResponsiveSize(24) }} />

        <CustomText fontSize={16} fontWeight={"600"}>
          마이페이지
        </CustomText>

        <Pressable
          onPress={() =>
            containerNavigation.navigate("SettingStack", {
              screen: "Setting",
            })
          }
        >
          <Image
            source={settingIcon}
            style={{
              width: getResponsiveSize(24),
              height: getResponsiveSize(24),
            }}
          />
        </Pressable>
      </View>

      <ScrollView style={styles.container}>
        {userProfileData ? (
          <View style={styles.box}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <CustomText fontSize={20} fontWeight={"600"}>
                {userProfileData.name} 님
              </CustomText>

              <Pressable>
                <Image source={rigthArrowIcon} style={styles.icon} />
              </Pressable>
            </View>

            <View style={styles.divider} />

            {userProfileData.mainCarNumber ? (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <CustomText fontSize={15} fontWeight={"600"}>
                  {userProfileData.mainCarNumber}
                </CustomText>

                <View style={styles.mainCar}>
                  <CustomText
                    color={colors.point2}
                    fontSize={12}
                    fontWeight={"500"}
                  >
                    대표차량
                  </CustomText>
                </View>
              </View>
            ) : (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <CustomText fontSize={15} fontWeight={"600"}>
                  차량을 등록해주세요
                </CustomText>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.box}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <CustomText
                color={colors.point2}
                fontSize={20}
                fontWeight={"600"}
              >
                로그인
              </CustomText>

              <Pressable>
                <Image source={rigthArrowIcon} style={styles.icon} />
              </Pressable>
            </View>

            <CustomText color={colors.gray5} fontSize={16}>
              로그인하고 더 많은 기능을 이용해보세요!
            </CustomText>
          </View>
        )}

        <View style={styles.box}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Pressable
              onPress={() =>
                containerNavigation.navigate("PassStack", {
                  screen: "PassList",
                  params: { passType: "PREMIUM" },
                })
              }
              style={styles.pass}
            >
              <CustomText color={colors.gray7} fontSize={15} fontWeight={"500"}>
                프리미엄
              </CustomText>
              <CustomText
                marginTop={4}
                color={colors.point2}
                fontSize={22}
                fontWeight={"600"}
              >
                {userProfileData?.totalPremiums ?? 0}
              </CustomText>
            </Pressable>

            <View style={styles.rowDivider} />

            <Pressable
              onPress={() =>
                containerNavigation.navigate("PassStack", {
                  screen: "PassList",
                  params: { passType: "STANDARD" },
                })
              }
              style={styles.pass}
            >
              <CustomText color={colors.gray7} fontSize={15} fontWeight={"500"}>
                스탠다드
              </CustomText>
              <CustomText
                marginTop={4}
                color={colors.point2}
                fontSize={22}
                fontWeight={"600"}
              >
                {userProfileData?.totalStandards ?? 0}
              </CustomText>
            </Pressable>

            <View style={styles.rowDivider} />

            <Pressable
              onPress={() =>
                containerNavigation.navigate("PassStack", {
                  screen: "PassList",
                  params: { passType: "TICKET" },
                })
              }
              style={styles.pass}
            >
              <CustomText color={colors.gray7} fontSize={15} fontWeight={"500"}>
                일회권
              </CustomText>
              <CustomText
                marginTop={4}
                color={colors.point2}
                fontSize={22}
                fontWeight={"600"}
              >
                {userProfileData?.totalTickets ?? 0}
              </CustomText>
            </Pressable>
          </View>
        </View>

        <View style={styles.box}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Pressable
              onPress={() =>
                containerNavigation.navigate("CarStack", {
                  screen: "CarList",
                })
              }
              style={styles.button}
            >
              <Image source={carIcon} style={styles.icon} />
              <CustomText fontSize={16}>차량 관리</CustomText>
            </Pressable>

            <Pressable
              onPress={() =>
                containerNavigation.navigate("CardStack", {
                  screen: "CardList",
                })
              }
              style={styles.button}
            >
              <Image source={cardIcon} style={styles.icon} />
              <CustomText fontSize={16}>카드 관리</CustomText>
            </Pressable>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Pressable
              onPress={() =>
                containerNavigation.navigate("AddressStack", {
                  screen: "AddressList",
                })
              }
              style={styles.button}
            >
              <Image source={addressIcon} style={styles.icon} />
              <CustomText fontSize={16}>주소 관리</CustomText>
            </Pressable>

            <Pressable
              onPress={() =>
                containerNavigation.navigate("PassStack", {
                  screen: "PassList",
                  params: {},
                })
              }
              style={styles.button}
            >
              <Image source={passIcon} style={styles.icon} />
              <CustomText fontSize={16}>보유 이용권</CustomText>
            </Pressable>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Pressable
              onPress={() => containerNavigation.navigate("ServiceHistory")}
              style={styles.button}
            >
              <Image source={serviceHistoryIcon} style={styles.icon} />
              <CustomText fontSize={16}>이용 내역</CustomText>
            </Pressable>

            <Pressable
              onPress={() =>
                containerNavigation.navigate("PurchaseStack", {
                  screen: "PurchaseList",
                })
              }
              style={styles.button}
            >
              <Image source={purchaseIcon} style={styles.icon} />
              <CustomText fontSize={16}>결제 내역</CustomText>
            </Pressable>
          </View>
        </View>

        <View style={styles.box}>
          <Pressable
            onPress={() => containerNavigation.navigate("Coupon")}
            style={styles.button}
          >
            <Image source={couponIcon} style={styles.icon} />
            <CustomText fontSize={16}>쿠폰</CustomText>
          </Pressable>

          <Pressable
            onPress={() =>
              containerNavigation.navigate("EventStack", {
                screen: "EventList",
              })
            }
            style={styles.button}
          >
            <Image source={eventIcon} style={styles.icon} />
            <CustomText fontSize={16}>이벤트</CustomText>
          </Pressable>

          <Pressable
            onPress={() => containerNavigation.navigate("Referral")}
            style={styles.button}
          >
            <Image source={referralIcon} style={styles.icon} />
            <CustomText fontSize={16}>친구 초대</CustomText>
          </Pressable>
        </View>

        <View
          style={[
            styles.box,
            Platform.OS === "android" && {
              marginBottom: getResponsiveSize(40),
            },
          ]}
        >
          <Pressable
            onPress={() =>
              containerNavigation.navigate("NoticeStack", {
                screen: "NoticeList",
              })
            }
            style={styles.button}
          >
            <Image source={noticeIcon} style={styles.icon} />
            <CustomText fontSize={16}>공지사항</CustomText>
          </Pressable>

          {/* <Pressable style={styles.button}>
            <Image source={inquiryIcon} style={styles.icon} />
            <CustomText fontSize={16}>1:1 문의</CustomText>
          </Pressable> */}

          <Pressable
            onPress={() => containerNavigation.navigate("Faq")}
            style={styles.button}
          >
            <Image source={contactIcon} style={styles.icon} />
            <CustomText fontSize={16}>고객센터</CustomText>
          </Pressable>
        </View>
      </ScrollView>
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
  container: {
    marginTop: getResponsiveSize(48),
    paddingVertical: getResponsiveSize(20),
    paddingHorizontal: getResponsiveSize(20),
    backgroundColor: colors.bg,
  },
  box: {
    marginBottom: getResponsiveSize(16),
    padding: getResponsiveSize(16),
    gap: getResponsiveSize(4),
    backgroundColor: colors.white,
    borderRadius: 12,
  },
  divider: {
    width: "100%",
    height: 2,
    backgroundColor: colors.gray1,
    marginVertical: getResponsiveSize(8),
  },
  mainCar: {
    paddingVertical: getResponsiveSize(3),
    paddingHorizontal: getResponsiveSize(7),
    marginLeft: getResponsiveSize(8),
    borderWidth: 1,
    borderColor: colors.point2,
    borderRadius: 20,
  },
  pass: {
    minWidth: getResponsiveSize(90),
    alignItems: "center",
  },
  rowDivider: {
    width: 2,
    height: "100%",
    backgroundColor: colors.back4,
  },
  button: {
    flexDirection: "row",
    flex: 1,
    paddingVertical: getResponsiveSize(12),
    gap: getResponsiveSize(8),
  },
  icon: {
    width: getResponsiveSize(24),
    height: getResponsiveSize(24),
  },
});
