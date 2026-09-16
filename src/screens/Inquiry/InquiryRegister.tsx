import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { useQueryClient } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { errorModalAtom } from "@/jotai";
import { useInquiryControllerRegisterInquiry } from "@/api/inquiry/inquiry";
import { RegisterInquiryRequest } from "@/api/models";
import { InquiryStackParamList } from "@/navigations";
import { useToastMessage } from "@/hooks";
import { getFontSize, getResponsiveSize } from "@/utils";
import { CustomSafeAreaView } from "@/components/ui/CustomSafeAreaView";
import { CustomKeyboardAvoidingView } from "@/components/ui/CustomKeyboardAvoidingView";
import { CustomText } from "@/components/ui/CustomText";
import { CustomButton } from "@/components/ui/CustomButton";
import { BottomButtonArea } from "@/components/layout/BottomButtonArea";
import { colors } from "@/styles";
import { Spinner } from "@/components/ui/Spinner";

const MIN_CONTENT_LENGTH = 10;
const MAX_CONTENT_LENGTH = 500;

export const InquiryRegister = () => {
  const { t } = useTranslation("mypage");

  const queryClient = useQueryClient();

  const inquiryNavigation =
    useNavigation<NativeStackNavigationProp<InquiryStackParamList>>();

  const { SuccessToast, ErrorToast } = useToastMessage();

  const setErrorModal = useSetAtom(errorModalAtom);

  const [inquiry, setInquiry] = useState<RegisterInquiryRequest>({
    content: "",
  });

  // 문의 등록 API
  const {
    mutate: registerInquiry,
    isPending: registerLoading,
    isError: registerError,
  } = useInquiryControllerRegisterInquiry();

  // 문의 등록
  const handleSubmit = () => {
    if (inquiry.content.length < MIN_CONTENT_LENGTH) {
      return ErrorToast(
        t("inquiry.contentMinLength", { count: MIN_CONTENT_LENGTH })
      );
    }

    if (inquiry.content.length > MAX_CONTENT_LENGTH) {
      return ErrorToast(
        t("inquiry.contentMaxLength", { count: MAX_CONTENT_LENGTH })
      );
    }

    registerInquiry(
      {
        data: {
          content: inquiry.content,
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["inquiries"] });
          SuccessToast(t("inquiry.registerSuccess"));

          return inquiryNavigation.goBack();
        },
        onError: (error: any) => {
          return setErrorModal({
            visible: true,
            message: error?.message ?? t("inquiry.registerError"),
          });
        },
      }
    );
  };

  return (
    <CustomSafeAreaView edges={["bottom"]}>
      <CustomKeyboardAvoidingView>
        <ScrollView style={styles.container}>
          <View style={{ position: "relative" }}>
            <TextInput
              value={inquiry.content}
              onChangeText={(text) =>
                setInquiry((prev) => ({ ...prev, content: text }))
              }
              multiline
              maxLength={MAX_CONTENT_LENGTH}
              placeholder={t("inquiry.contentPlaceholder")}
              style={styles.contentInput}
            />

            <View style={styles.counter}>
              <CustomText fontSize={14} color={colors.gray5}>
                {inquiry.content.length}/{MAX_CONTENT_LENGTH}
              </CustomText>
            </View>
          </View>
        </ScrollView>

        <BottomButtonArea>
          <CustomButton
            onPress={handleSubmit}
            isDisabled={registerLoading}
            width={"100%"}
            height={getResponsiveSize(53)}
            backgroundColor={colors.point2}
          >
            {registerLoading ? (
              <Spinner />
            ) : (
              <CustomText color={colors.white} fontSize={18} fontWeight={"600"}>
                {t("common:register")}
              </CustomText>
            )}
          </CustomButton>
        </BottomButtonArea>
      </CustomKeyboardAvoidingView>
    </CustomSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: getResponsiveSize(20),
  },
  titleInput: {
    padding: getResponsiveSize(12),
    fontSize: getFontSize(16),
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 8,
  },
  contentInput: {
    height: getResponsiveSize(214),
    paddingTop: getResponsiveSize(12),
    paddingBottom: getResponsiveSize(34),
    paddingHorizontal: getResponsiveSize(12),
    fontSize: getFontSize(16),
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 8,
  },
  counter: {
    position: "absolute",
    bottom: getResponsiveSize(12),
    right: getResponsiveSize(12),
  },
});
