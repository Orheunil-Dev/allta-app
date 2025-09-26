import mmkvStorage from "@/libs/mmkv-storage";
import { IS_FIRST_LAUCH } from "@/constants";

export const checkIsFirstLaunch = () => {
  const hasLaunched = mmkvStorage.getBoolean(IS_FIRST_LAUCH);

  if (hasLaunched) {
    return false;
  } else {
    mmkvStorage.setBoolean(IS_FIRST_LAUCH, true);
    return true;
  }
};
