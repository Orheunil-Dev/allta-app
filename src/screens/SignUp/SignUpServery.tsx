import {
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LoginStackParamList } from "@/navigations";
import { CustomText } from "@/components/ui/CustomText";
import { colors } from "@/styles";
import { CustomButton } from "@/components/ui/CustomButton";
import { getResponsiveSize, regexCarNumber } from "@/utils";
import { SignUpTextInput } from "@/components/ui/TextInput";
import { useState } from "react";
import { z } from "zod";
import { CustomKeyboardAvoidingView } from "@/components/ui/CustomKeyboardAvoidingView";
import Checkbox from "expo-checkbox";
import { joinPathOptions } from "@/constants";
import { checkedRadioIcon, radioIcon } from "@/assets/images";

type SignUpServeyRouteProp = RouteProp<LoginStackParamList, "SignUpServey">;

// 유효성 검사
const joinPathSchema = z.string().min(1);

export const SignUpServey = () => {
  const route = useRoute<SignUpServeyRouteProp>();

  const loginStackNavigation =
    useNavigation<NativeStackNavigationProp<LoginStackParamList>>();

  const [joinPath, setjoinPath] = useState("");
  const [isShow, setIsShow] = useState(false);

  const isValid = joinPathSchema.safeParse(joinPath).success;

  const handlePressJoinPath = (value: string) => {
    setIsShow(false);
    setjoinPath(value);
  };

  const handlePressEtc = () => {
    setIsShow(true);
    setjoinPath("");
  };

  const handleNextStep = () => {
    loginStackNavigation.navigate("SignUpComplete");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <CustomKeyboardAvoidingView>
        <View style={styles.container}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
          >
            <CustomText fontSize={24} fontWeight={"600"} marginBottom={32}>
              올타를 어떻게 알게 되셨나요?
            </CustomText>

            {joinPathOptions.map((value, index) => (
              <Pressable
                key={index}
                onPress={() => handlePressJoinPath(value)}
                style={styles.checkBoxContainer}
              >
                {joinPath === value ? (
                  <Image source={checkedRadioIcon} style={styles.radioButton} />
                ) : (
                  <Image source={radioIcon} style={styles.radioButton} />
                )}

                <CustomText fontSize={18}>{value}</CustomText>
              </Pressable>
            ))}

            <Pressable
              onPress={handlePressEtc}
              style={styles.checkBoxContainer}
            >
              {isShow ? (
                <Image source={checkedRadioIcon} style={styles.radioButton} />
              ) : (
                <Image source={radioIcon} style={styles.radioButton} />
              )}

              <CustomText fontSize={18}>기타</CustomText>
            </Pressable>
            {isShow && (
              <SignUpTextInput
                value={joinPath}
                onChangeText={(text) => setjoinPath(text)}
                maxLength={50}
                placeholder="직접 입력"
              />
            )}
          </ScrollView>

          <CustomButton
            onPress={handleNextStep}
            isDisabled={!isValid}
            backgroundColor={isValid ? colors.main : colors.gray2}
          >
            <CustomText
              color={isValid ? colors.white : colors.gray5}
              fontSize={16}
              fontWeight={"600"}
            >
              다음
            </CustomText>
          </CustomButton>
        </View>
      </CustomKeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    flex: 1,
    paddingHorizontal: getResponsiveSize(20),
    paddingVertical: getResponsiveSize(10),
  },
  checkBoxContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: getResponsiveSize(8),
  },
  radioButton: {
    width: getResponsiveSize(24),
    height: getResponsiveSize(24),
    marginRight: getResponsiveSize(8),
  },
});
