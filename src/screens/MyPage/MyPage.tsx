import { useEffect } from "react";
import { Image, Platform, Pressable, StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useIsFocused, useNavigation } from "@react-navigation/native";
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
  const { t } = useTranslation("mypage");

  const containerNavigation =
    useNavigation<NativeStackNavigationProp<ContainerStackParamList>>();

  const isFocus = useIsFocused();

  const insets = useSafeAreaInsets();

  // 회원 프로필 조회 API
  const {
    data: userProfileData,
    isPending: userProfileLoading,
    error: userProfileError,
    refetch: userProfileRefetch,
  } = useUserControllerGetUserProfile({
    query: {
      queryKey: ["profile"],
      retry: false,
      gcTime: 0,
    },
  });

  useEffect(() => {
    if (isFocus) {
      userProfileRefetch();
    }
  }, [isFocus]);

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
          {t("title")}
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
          <View style={styles.profileBox}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <CustomText fontSize={20} fontWeight={"600"}>
                {t("profile.greeting", { name: userProfileData.name })}
              </CustomText>

              <Pressable
                onPress={() =>
                  containerNavigation.navigate("Profile", {
                    name: userProfileData.name,
                    phoneNumber: userProfileData.phoneNumber,
                    loginKind: userProfileData.loginKind,
                    email: userProfileData.email ?? null,
                  })
                }
              >
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
                    {t("car:mainCar.badge")}
                  </CustomText>
                </View>
              </View>
            ) : (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <CustomText
                  color={colors.gray5}
                  fontSize={15}
                  fontWeight={"600"}
                >
                  {t("car:list.empty")}
                </CustomText>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.profileBox}>
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
                {t("common:auth.login")}
              </CustomText>

              <Pressable>
                <Image source={rigthArrowIcon} style={styles.icon} />
              </Pressable>
            </View>

            <CustomText color={colors.gray5} fontSize={16}>
              {t("profile.loginPrompt")}
            </CustomText>
          </View>
        )}

        <View style={styles.profileBox}>
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
                {t("passType.premium")}
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
                {t("passType.standard")}
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
                {t("passType.ticket")}
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
              <CustomText fontSize={16}>{t("menu.carManagement")}</CustomText>
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
              <CustomText fontSize={16}>{t("menu.cardManagement")}</CustomText>
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
              <CustomText fontSize={16}>{t("menu.addressManagement")}</CustomText>
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
              <CustomText fontSize={16}>{t("menu.myPasses")}</CustomText>
            </Pressable>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Pressable
              onPress={() => containerNavigation.navigate("ServiceHistory")}
              style={styles.button}
            >
              <Image source={serviceHistoryIcon} style={styles.icon} />
              <CustomText fontSize={16}>{t("menu.serviceHistory")}</CustomText>
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
              <CustomText fontSize={16}>{t("menu.purchaseHistory")}</CustomText>
            </Pressable>
          </View>
        </View>

        <View style={styles.box}>
          <Pressable
            onPress={() => containerNavigation.navigate("Coupon")}
            style={styles.button}
          >
            <Image source={couponIcon} style={styles.icon} />
            <CustomText fontSize={16}>{t("menu.coupon")}</CustomText>
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
            <CustomText fontSize={16}>{t("menu.event")}</CustomText>
          </Pressable>

          <Pressable
            onPress={() => containerNavigation.navigate("Referral")}
            style={styles.button}
          >
            <Image source={referralIcon} style={styles.icon} />
            <CustomText fontSize={16}>{t("menu.referral")}</CustomText>
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
            <CustomText fontSize={16}>{t("menu.notice")}</CustomText>
          </Pressable>

          <Pressable
            onPress={() => containerNavigation.navigate("Faq")}
            style={styles.button}
          >
            <Image source={contactIcon} style={styles.icon} />
            <CustomText fontSize={16}>{t("menu.faq")}</CustomText>
          </Pressable>

          <Pressable
            onPress={() =>
              containerNavigation.navigate("InquiryStack", {
                screen: "InquiryList",
              })
            }
            style={styles.button}
          >
            <Image source={inquiryIcon} style={styles.icon} />
            <CustomText fontSize={16}>{t("menu.inquiry")}</CustomText>
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
  profileBox: {
    marginBottom: getResponsiveSize(16),
    padding: getResponsiveSize(16),
    gap: getResponsiveSize(4),
    backgroundColor: colors.white,
    borderRadius: 12,
  },
  box: {
    marginBottom: getResponsiveSize(16),
    paddingVertical: getResponsiveSize(4),
    paddingHorizontal: getResponsiveSize(16),
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
