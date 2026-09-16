import { Image, Pressable, StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { getResponsiveSize } from "@/utils";
import { CustomText } from "@/components/ui/CustomText";
import { CustomBottomSheet } from "@/components/ui/CustomBottomSheet";
import { carIcon, deleteIcon, editIcon } from "@/assets/images";
import {
  useCarControllerChangeMainCar,
  useCarControllerDeleteCar,
} from "@/api/car/car";
import { useToastMessage } from "@/hooks";
import { useSetAtom } from "jotai";
import { errorModalAtom } from "@/jotai";
import { useQueryClient } from "@tanstack/react-query";
import { CustomModal } from "../ui/CustomModal";
import { useState } from "react";

interface Props {
  ref: React.RefObject<BottomSheetModal | null>;
  id?: string;
  isMain?: boolean;
  onClose: () => void;
  handleRouteCarUpdate: () => void;
}

export const CarOptionsBottomSheet = ({
  ref,
  id,
  isMain,
  onClose,
  handleRouteCarUpdate,
}: Props) => {
  const { t } = useTranslation("car");

  const queryClient = useQueryClient();

  const setErrorModal = useSetAtom(errorModalAtom);

  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  const { SuccessToast, ErrorToast } = useToastMessage();

  // 대표 차량 변경 API
  const {
    mutate: changeMainCar,
    isPending: changeMainCarLoading,
    isError: changeMainCarError,
  } = useCarControllerChangeMainCar();

  // 차량 삭제 API
  const {
    mutate: deleteCar,
    isPending: deleteCarLoading,
    isError: deleteCarError,
  } = useCarControllerDeleteCar();

  // 차량 삭제
  const handleDeleteCar = () => {
    if (!id) return;

    deleteCar(
      { data: { id } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["cars"] });
          queryClient.invalidateQueries({ queryKey: ["profile"] });

          setShowDeleteModal(false);
          onClose();
          SuccessToast(t("delete.success"));
        },
        onError: (error: any) => {
          setShowDeleteModal(false);
          onClose();
          setErrorModal({
            visible: true,
            message: error?.message ?? t("delete.error"),
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
      return ErrorToast(t("mainCar.alreadyMain"));
    }

    changeMainCar(
      { data: { id } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["cars"] });
          queryClient.invalidateQueries({ queryKey: ["profile"] });

          onClose();
          SuccessToast(t("mainCar.changed"));
        },
        onError: (error: any) => {
          onClose();
          setErrorModal({
            visible: true,
            message: error?.message ?? t("mainCar.changeError"),
          });
        },
      }
    );
  };

  return (
    <CustomBottomSheet
      ref={ref}
      height={getResponsiveSize(240)}
      onClose={onClose}
    >
      <CustomModal
        visible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        closeButtonText={t("common:cancel")}
        onNext={handleDeleteCar}
        nextButtonText={t("common:delete")}
        isNextButtonDisable={deleteCarLoading}
      >
        <CustomText marginTop={12} fontSize={18} fontWeight={"600"}>
          {t("delete.confirm")}
        </CustomText>
      </CustomModal>

      <View style={styles.container}>
        <Pressable
          onPress={handleChangeMainCar}
          disabled={changeMainCarLoading}
          style={styles.button}
        >
          <Image source={carIcon} style={styles.icon} />
          <CustomText marginLeft={12} fontSize={18}>
            {t("mainCar.setAsMain")}
          </CustomText>
        </Pressable>

        <Pressable onPress={handleRouteCarUpdate} style={styles.button}>
          <Image source={editIcon} style={styles.icon} />
          <CustomText marginLeft={12} fontSize={18}>
            {t("options.edit")}
          </CustomText>
        </Pressable>

        <Pressable
          onPress={() => setShowDeleteModal(true)}
          disabled={deleteCarLoading}
          style={styles.button}
        >
          <Image source={deleteIcon} style={styles.icon} />
          <CustomText marginLeft={12} fontSize={18}>
            {t("options.delete")}
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
