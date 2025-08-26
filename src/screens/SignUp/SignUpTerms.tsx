import { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LoginStackParamList } from "@/navigations";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import RenderHtml from "react-native-render-html";
import { getResponsiveSize } from "@/utils";
import { CustomText } from "@/components/ui/CustomText";
import { CustomButton } from "@/components/ui/CustomButton";
import { CustomKeyboardAvoidingView } from "@/components/ui/CustomKeyboardAvoidingView";
import { terms } from "@/constants/terms";
import { CustomSafeAreaView } from "@/components/ui/CustomSafeAreaView";
import { CustomBottomSheet } from "@/components/ui/CustomBottomSheet";
import {
  checkAllButton,
  checkedCheckAllButton,
  rigthArrowIcon,
  termsCheckedIcon,
  termsUncheckedIcon,
} from "@/assets/images";
import { colors } from "@/styles";

const { width: screenWidth } = Dimensions.get("window");

type SignUpUserInfoRouteProp = RouteProp<LoginStackParamList, "SignUpTerms">;

export const SignUpTerms = () => {
  const route = useRoute<SignUpUserInfoRouteProp>();

  const loginStackNavigation =
    useNavigation<NativeStackNavigationProp<LoginStackParamList>>();

  const termsBottomSheetRef = useRef<BottomSheetModal>(null);

  const [checked, setChecked] = useState<boolean[]>(terms.map(() => false));
  const [termsDetail, setTermsDetail] = useState<number | null>(null);
  const [isValid, setIsValid] = useState<boolean>(false);

  // 전체 동의
  const checkAll = () => {
    const allChecked = checked.every(Boolean);
    setChecked(checked.map(() => !allChecked));
  };

  // 개별 동의
  const checkOne = (index: number) => () => {
    const newChecked = [...checked];
    newChecked[index] = !newChecked[index];

    setChecked(newChecked);
  };

  // 약관 세부사항 보기
  const handleOpenDetail = (index: number) => () => {
    setTermsDetail(index);
    termsBottomSheetRef?.current?.present();
  };

  const handleCloseDetail = () => {
    setTermsDetail(null);
    termsBottomSheetRef?.current?.close();
  };

  const goNextStep = () => {
    return loginStackNavigation.navigate("SignUpUserInfo", {
      ...route.params,
      isMarketing: checked[4] ?? false,
    });
  };

  useEffect(() => {
    const requiredChecked = terms
      .map((t, i) => (t.isRequired ? checked[i] : true))
      .every(Boolean);

    setIsValid(requiredChecked);
  }, [checked]);

  return (
    <CustomSafeAreaView edges={["bottom"]}>
      <CustomBottomSheet
        bottomSheetRef={termsBottomSheetRef}
        title={termsDetail !== null ? terms[termsDetail].title : ""}
        onClose={handleCloseDetail}
      >
        {termsDetail !== null && (
          <ScrollView style={styles.termsScrollView}>
            <RenderHtml
              contentWidth={screenWidth - getResponsiveSize(40)}
              source={{ html: terms[termsDetail].content }}
            />
          </ScrollView>
        )}

        <CustomButton
          onPress={handleCloseDetail}
          width={"100%"}
          backgroundColor={colors.main}
        >
          <CustomText color={colors.white} fontSize={18} fontWeight={"600"}>
            확인
          </CustomText>
        </CustomButton>
      </CustomBottomSheet>

      <CustomKeyboardAvoidingView>
        <View style={styles.container}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
          >
            <CustomText fontSize={24} fontWeight={"600"}>
              반가워요!{"\n"}약관에 동의해주세요.
            </CustomText>

            <View style={styles.termsBox}>
              <View style={styles.checkAll}>
                <Pressable onPress={checkAll} style={styles.checkAllButton}>
                  <Image
                    source={
                      checked.every(Boolean)
                        ? checkedCheckAllButton
                        : checkAllButton
                    }
                    style={{
                      width: getResponsiveSize(24),
                      height: getResponsiveSize(24),
                      marginRight: getResponsiveSize(8),
                    }}
                  />

                  <CustomText fontSize={18} fontWeight={"600"}>
                    전체 동의
                  </CustomText>
                </Pressable>
              </View>

              {terms.map((value, index) => (
                <View key={index} style={styles.termsItem}>
                  <Pressable
                    style={styles.termsButton}
                    onPress={checkOne(index)}
                  >
                    <Image
                      source={
                        checked[index] ? termsCheckedIcon : termsUncheckedIcon
                      }
                      style={{
                        width: getResponsiveSize(24),
                        height: getResponsiveSize(24),
                      }}
                    />

                    <CustomText fontSize={16}>
                      {value.title} {value.isRequired ? "[필수]" : "[선택]"}
                    </CustomText>
                  </Pressable>

                  <Pressable onPress={handleOpenDetail(index)}>
                    <Image
                      source={rigthArrowIcon}
                      style={{
                        width: getResponsiveSize(24),
                        height: getResponsiveSize(24),
                      }}
                    />
                  </Pressable>
                </View>
              ))}
            </View>
          </ScrollView>

          <CustomButton
            onPress={goNextStep}
            isDisabled={!isValid}
            backgroundColor={isValid ? colors.main : colors.gray2}
          >
            <CustomText
              color={isValid ? colors.white : colors.gray5}
              fontSize={18}
              fontWeight={"600"}
            >
              다음
            </CustomText>
          </CustomButton>
        </View>
      </CustomKeyboardAvoidingView>
    </CustomSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: getResponsiveSize(20),
    paddingVertical: getResponsiveSize(10),
  },
  termsBox: {
    marginTop: getResponsiveSize(30),
  },
  termsItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: getResponsiveSize(12),
  },
  checkAll: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: getResponsiveSize(12),
    borderBottomWidth: 1,
    borderBottomColor: colors.gray2,
  },
  checkAllButton: { flexDirection: "row", alignItems: "center" },
  termsButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  termsScrollView: {
    flex: 1,
    width: screenWidth - getResponsiveSize(40),
  },
});
