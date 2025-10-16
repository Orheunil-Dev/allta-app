import { Dimensions, Image, StyleSheet, View } from "react-native";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { useSetAtom } from "jotai";
import { errorModalAtom } from "@/jotai";
import { getFontSize, getResponsiveSize } from "@/utils";
import { CustomSafeAreaView } from "@/components/ui/CustomSafeAreaView";
import { CustomText } from "@/components/ui/CustomText";
import { CustomButton } from "@/components/ui/CustomButton";
import { refferalBanner } from "@/assets/images";
import { colors } from "@/styles";
import { useState } from "react";

const { width: screenWidth } = Dimensions.get("window");

export const Refferal = () => {
  const [code, setCode] = useState<string>("");

  const setErrorModal = useSetAtom(errorModalAtom);

  return (
    <CustomSafeAreaView edges={["bottom"]}>
      <ScrollView>
        <Image
          source={refferalBanner}
          style={{
            width: screenWidth,
            height: (screenWidth * 388) / 375,
          }}
        />

        <View style={styles.container}>
          <CustomText textAlign="center" fontSize={16}>
            친구가 내 추천 코드로 가입하면
          </CustomText>
          <View style={{ flexDirection: "row", alignSelf: "center" }}>
            <CustomText color={colors.point2} fontSize={16}>
              무료 세차권 쿠폰
            </CustomText>
            <CustomText fontSize={16}>을 받을 수 있어요!</CustomText>
          </View>

          <View style={styles.refferalCode}>
            <CustomText fontSize={16} fontWeight={"600"}>
              나의 추천 코드
            </CustomText>
            <CustomText fontSize={24} fontWeight={"600"} letterSpacing={0.1}>
              AB12V3
            </CustomText>
          </View>

          <View style={styles.buttonArea}>
            <CustomButton
              flex={1}
              height={getResponsiveSize(50)}
              backgroundColor={colors.point2}
            >
              <CustomText color={colors.white} fontSize={16} fontWeight={"600"}>
                카톡으로 초대하기
              </CustomText>
            </CustomButton>

            <CustomButton
              flex={1}
              height={getResponsiveSize(50)}
              backgroundColor={colors.point2}
            >
              <CustomText color={colors.white} fontSize={16} fontWeight={"600"}>
                추천 코드 복사하기
              </CustomText>
            </CustomButton>
          </View>

          <CustomText marginTop={40} fontSize={18} fontWeight={"600"}>
            추천 코드 등록
          </CustomText>
          <CustomText color={colors.gray5} fontSize={14}>
            추천 코드는 입력 후 변경할 수 없어요.
          </CustomText>
        </View>

        <View style={styles.codeArea}>
          <TextInput
            defaultValue={code}
            onChangeText={(text) => {
              setCode(text);
            }}
            keyboardType="default"
            autoCorrect={false}
            autoCapitalize="none"
            placeholder="추천코드 입력"
            maxLength={30}
            style={styles.codeInput}
          />
          <CustomButton
            width={getResponsiveSize(74)}
            height={getResponsiveSize(45)}
            borderWidth={1}
            borderColor={colors.gray2}
          >
            <CustomText fontSize={15} fontWeight={"500"}>
              쿠폰등록
            </CustomText>
          </CustomButton>
        </View>

        <View style={styles.terms}>
          <CustomText color={colors.gray7} fontSize={14}>
            • 추천 코드는 가입 후 1회만 등록할 수 있으며, 이후 수정은
            불가합니다.
          </CustomText>
          <CustomText color={colors.gray7} fontSize={14}>
            • 본인의 추천 코드를 자신에게 등록할 수 없습니다.
          </CustomText>
          <CustomText color={colors.gray7} fontSize={14}>
            • 추천 보상은 추천을 받은 회원만가 첫 결지급됩니다.
          </CustomText>
          <CustomText color={colors.gray7} fontSize={14}>
            • 부정한 방법(가짜 계정, 반복 등록 등)으로 참여한 경우 혜택은
            회수되며, 서비스 이용이 제한될 수 있습니다.
          </CustomText>
          <CustomText color={colors.gray7} fontSize={14}>
            • 본 이벤트는 당사의 사정에 따라 변경 또는 종료될 수 있습니다.
          </CustomText>
        </View>
      </ScrollView>
    </CustomSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: getResponsiveSize(20),
  },
  refferalCode: {
    alignItems: "center",
    marginTop: getResponsiveSize(20),
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.gray2,
    borderRadius: 12,
  },
  buttonArea: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: getResponsiveSize(20),
    paddingBottom: getResponsiveSize(40),
    gap: getResponsiveSize(16),
    borderBottomWidth: 6,
    borderBottomColor: colors.gray1,
  },
  codeArea: {
    flexDirection: "row",
    marginBottom: getResponsiveSize(40),
    paddingHorizontal: getResponsiveSize(20),
    gap: getResponsiveSize(12),
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  codeInput: {
    flex: 1,
    fontSize: getFontSize(15),
    fontWeight: "500",
    paddingHorizontal: getResponsiveSize(12),
    borderWidth: 1,
    borderColor: colors.gray2,
    borderRadius: 12,
  },
  terms: {
    marginBottom: getResponsiveSize(20),
    paddingVertical: getResponsiveSize(16),
    paddingHorizontal: getResponsiveSize(20),
    backgroundColor: colors.gray1,
  },
});
