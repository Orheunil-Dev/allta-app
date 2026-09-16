import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Image, Pressable, StyleSheet, View } from "react-native";
import { useQueryClient } from "@tanstack/react-query";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useSetAtom } from "jotai";
import {
  useCardControllerChangeMainCard,
  useCardControllerDeleteCard,
} from "@/api/card/card";
import { useToastMessage } from "@/hooks";
import { errorModalAtom } from "@/jotai";
import { getResponsiveSize } from "@/utils";
import { CustomText } from "@/components/ui/CustomText";
import { CustomBottomSheet } from "@/components/ui/CustomBottomSheet";
import { CustomModal } from "../ui/CustomModal";
import { cardIcon, deleteIcon } from "@/assets/images";

interface Props {
  ref: React.RefObject<BottomSheetModal | null>;
  id?: string;
  isMain?: boolean;
  onClose: () => void;
}

export const CardOptionsBottomSheet = ({ ref, id, isMain, onClose }: Props) => {
  const queryClient = useQueryClient();

  const setErrorModal = useSetAtom(errorModalAtom);

  const { t } = useTranslation("payment");

  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  const { SuccessToast, ErrorToast } = useToastMessage();

  // 대표 카드 변경 API
  const {
    mutate: changeMainCard,
    isPending: changeMainCardLoading,
    isError: changeMainCardError,
  } = useCardControllerChangeMainCard();

  // 카드 삭제 API
  const {
    mutate: deleteCard,
    isPending: deleteCardLoading,
    isError: deleteCarError,
  } = useCardControllerDeleteCard();

  // 차량 삭제
  const handleDeleteCar = () => {
    if (!id) return;

    deleteCard(
      { data: { id } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["cards"] });
          setShowDeleteModal(false);
          onClose();
          SuccessToast(t("cardOptions.deleted"));
        },
        onError: (error: any) => {
          setShowDeleteModal(false);
          onClose();
          setErrorModal({
            visible: true,
            message: error?.message ?? t("cardOptions.deleteError"),
          });
        },
      }
    );
  };

  // 대표 차량 변경
  const handleChangeMainCar = () => {
    if (!id) return;

    if (isMain) {
      onClose();
      return ErrorToast(t("cardOptions.alreadyMain"));
    }

    changeMainCard(
      { data: { id } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["cards"] });
          onClose();
          SuccessToast(t("cardOptions.mainChanged"));
        },
        onError: (error: any) => {
          onClose();
          setErrorModal({
            visible: true,
            message: error?.message ?? t("cardOptions.mainChangeError"),
          });
        },
      }
    );
  };

  return (
    <CustomBottomSheet
      ref={ref}
      height={getResponsiveSize(200)}
      onClose={onClose}
    >
      <CustomModal
        visible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        closeButtonText={t("common:cancel")}
        onNext={handleDeleteCar}
        nextButtonText={t("common:delete")}
        isNextButtonDisable={deleteCardLoading}
      >
        <CustomText marginTop={12} fontSize={18} fontWeight={"600"}>
          {t("cardOptions.deleteConfirm")}
        </CustomText>
      </CustomModal>

      <View style={styles.container}>
        <Pressable
          onPress={handleChangeMainCar}
          disabled={changeMainCardLoading}
          style={styles.button}
        >
          <Image source={cardIcon} style={styles.icon} />
          <CustomText marginLeft={12} fontSize={18}>
            {t("cardOptions.setMain")}
          </CustomText>
        </Pressable>

        <Pressable
          onPress={() => setShowDeleteModal(true)}
          disabled={deleteCardLoading}
          style={styles.button}
        >
          <Image source={deleteIcon} style={styles.icon} />
          <CustomText marginLeft={12} fontSize={18}>
            {t("cardOptions.delete")}
          </CustomText>
        </Pressable>
      </View>
    </CustomBottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    paddingTop: getResponsiveSize(12),
  },
  button: {
    flexDirection: "row",
    paddingVertical: getResponsiveSize(16),
  },
  icon: {
    width: getResponsiveSize(24),
    height: getResponsiveSize(24),
  },
});
