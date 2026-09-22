import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import {
  CommonActions,
  RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";
import { useQueryClient } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import dayjs from "dayjs";
import {
  useInquiryControllerDeleteInquiry,
  useInquiryControllerGetInquiryDetail,
} from "@/api/inquiry/inquiry";
import { InquiryStackParamList } from "@/navigations";
import { errorModalAtom } from "@/jotai";
import { useToastMessage } from "@/hooks";
import { getResponsiveSize } from "@/utils";
import { CustomSafeAreaView } from "@/components/ui/CustomSafeAreaView";
import { CustomText } from "@/components/ui/CustomText";
import { CustomModal } from "@/components/ui/CustomModal";
import { colors } from "@/styles";

type InquiryDetailRouteProp = RouteProp<InquiryStackParamList, "InquiryDetail">;

export const InquiryDetail = () => {
  const { t } = useTranslation("mypage");

  const router = useRoute<InquiryDetailRouteProp>();
  const navigation = useNavigation();

  const queryClient = useQueryClient();

  const { SuccessToast, ErrorToast } = useToastMessage();

  const setErrorModal = useSetAtom(errorModalAtom);

  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  // 문의 상세 조회 API
  const { data: inquiryData } = useInquiryControllerGetInquiryDetail(
    router.params.id,
    {
      query: {
        enabled: !!router.params.id,
      },
    }
  );

  // 문의 삭제 API
  const {
    mutate: deleteInquiry,
    isPending: deleteLoading,
    isError: deleteError,
  } = useInquiryControllerDeleteInquiry();

  // 문의 삭제
  const handleDeleteInquiry = () => {
    if (!inquiryData) return;

    if (inquiryData.data.isAnswered) {
      ErrorToast(t("inquiry.deleteAnsweredError"));
      return setShowDeleteModal(false);
    }

    deleteInquiry(
      {
        data: {
          id: inquiryData.data.id,
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["inquiries"] });

          SuccessToast(t("inquiry.deleteSuccess"));
          setShowDeleteModal(false);

          return navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: "InquiryList" }],
            })
          );
        },
        onError: (error: any) => {
          setShowDeleteModal(false);

          return setErrorModal({
            visible: true,
            message: error?.message ?? t("inquiry.deleteError"),
          });
        },
      }
    );
  };

  return (
    <CustomSafeAreaView edges={["bottom"]}>
      <CustomModal
        visible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        closeButtonText={t("common:cancel")}
        onNext={handleDeleteInquiry}
        nextButtonText={t("common:delete")}
      >
        <CustomText marginTop={16} fontSize={18} fontWeight={"600"}>
          {t("inquiry.deleteConfirm")}
        </CustomText>
      </CustomModal>

      {inquiryData ? (
        <ScrollView style={styles.container}>
          <View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View style={styles.mark}>
                  <CustomText
                    fontSize={16}
                    color={colors.white}
                    fontWeight={"500"}
                  >
                    Q
                  </CustomText>
                </View>

                <CustomText
                  fontSize={16}
                  color={
                    inquiryData.data.isAnswered ? colors.point2 : colors.gray5
                  }
                  fontWeight={"500"}
                >
                  {inquiryData.data.isAnswered
                    ? t("inquiry.answered")
                    : t("inquiry.pending")}
                </CustomText>
              </View>

              {!inquiryData.data.isAnswered && (
                <Pressable
                  onPress={() => setShowDeleteModal(true)}
                  style={styles.deleteButton}
                >
                  <CustomText color={colors.gray5} fontSize={13}>
                    {t("common:delete")}
                  </CustomText>
                </Pressable>
              )}
            </View>

            <CustomText marginTop={12} fontSize={16}>
              {inquiryData.data.content}
            </CustomText>

            <CustomText
              marginTop={4}
              fontSize={13}
              color={colors.gray5}
              fontWeight={"500"}
            >
              {dayjs(inquiryData.data.createdAt).format("YYYY.MM.DD")}
            </CustomText>
          </View>

          {inquiryData.data.answer && (
            <View style={styles.answer}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View style={styles.mark}>
                  <CustomText
                    fontSize={15}
                    color={colors.white}
                    fontWeight={"500"}
                  >
                    A
                  </CustomText>
                </View>

                <CustomText
                  fontSize={16}
                  color={colors.point2}
                  fontWeight={"500"}
                >
                  {t("inquiry.answered")}
                </CustomText>
              </View>

              <CustomText marginTop={12} fontSize={16}>
                {inquiryData.data.answer}
              </CustomText>

              <CustomText
                marginTop={4}
                fontSize={13}
                color={colors.gray5}
                fontWeight={"500"}
              >
                {dayjs(inquiryData.data.answeredAt).format("YYYY.MM.DD")}
              </CustomText>
            </View>
          )}
        </ScrollView>
      ) : (
        <View style={styles.emptyBox}>
          <CustomText color={colors.gray5} fontSize={20} fontWeight={"600"}>
            {t("inquiry.empty")}
          </CustomText>
        </View>
      )}
    </CustomSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: getResponsiveSize(20),
  },
  answer: {
    marginTop: getResponsiveSize(16),
    paddingVertical: getResponsiveSize(20),
    paddingHorizontal: getResponsiveSize(16),
    backgroundColor: colors.bg,
    borderRadius: 8,
  },
  mark: {
    justifyContent: "center",
    alignItems: "center",
    width: getResponsiveSize(24),
    height: getResponsiveSize(24),
    marginRight: getResponsiveSize(8),
    backgroundColor: colors.point1,
    borderRadius: 40,
  },
  deleteButton: {
    paddingVertical: getResponsiveSize(3),
    paddingHorizontal: getResponsiveSize(6),
    borderWidth: 1,
    borderColor: colors.gray3,
    borderRadius: 6,
  },
  emptyBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
