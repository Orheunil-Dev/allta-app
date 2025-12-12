import Axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import * as SecureStore from "expo-secure-store";
import CookieManager from "@react-native-cookies/cookies";
import { Airbridge } from "airbridge-react-native-sdk";
import { CustomError } from "@/types";

interface AxiosRequestConfigWithRetry extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export const AXIOS_INSTANCE = Axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  withCredentials: true,
});

const AXIOS_INSTANCE_REFRESH = Axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  withCredentials: true,
});

// 엑세스 토큰 재발급
const getNewAccessToken = async (): Promise<void> => {
  try {
    const refreshToken = await SecureStore.getItemAsync("refreshToken");

    if (!refreshToken) {
      const error: CustomError = {
        message: "로그인이 만료되었습니다.",
        status: 401,
        code: "TOKEN_REFRESH_FAILED",
      };

      Airbridge.clearUser();

      throw error;
    }

    await AXIOS_INSTANCE_REFRESH.post("auth/token/refresh", {});

    const cookies = await CookieManager.get(process.env.EXPO_PUBLIC_API_URL!);
    const newAccessToken = cookies.accessToken?.value;
    const newRefreshToken = cookies.refreshToken?.value;

    if (!newAccessToken || !newRefreshToken) {
      const error: CustomError = {
        message: "로그인이 만료되었습니다.",
        status: 401,
        code: "TOKEN_REFRESH_FAILED",
      };

      Airbridge.clearUser();

      throw error;
    }

    // SecureStore 갱신
    await SecureStore.setItemAsync("accessToken", newAccessToken);
    await SecureStore.setItemAsync("refreshToken", newRefreshToken);

    // 쿠키 갱신
    await CookieManager.set(process.env.EXPO_PUBLIC_API_URL!, {
      name: "accessToken",
      value: newAccessToken,
      path: "/",
    });
    await CookieManager.set(process.env.EXPO_PUBLIC_API_URL!, {
      name: "refreshToken",
      value: newRefreshToken,
      path: "/",
    });
  } catch (e) {
    const error: CustomError = {
      message: "로그인이 만료되었습니다.",
      status: 401,
      code: "TOKEN_REFRESH_FAILED",
    };

    Airbridge.clearUser();

    throw error;
  }
};

// Request 인터셉터
AXIOS_INSTANCE.interceptors.request.use(
  async (config: AxiosRequestConfigWithRetry) => {
    const accessToken = await SecureStore.getItemAsync("accessToken");
    const refreshToken = await SecureStore.getItemAsync("refreshToken");

    if (accessToken) {
      await CookieManager.set(process.env.EXPO_PUBLIC_API_URL, {
        name: "accessToken",
        value: accessToken,
        path: "/",
        httpOnly: false,
      });
    }
    // else {
    //   await CookieManager.clearByName(
    //     process.env.EXPO_PUBLIC_API_URL,
    //     "accessToken"
    //   );
    // }

    if (refreshToken) {
      await CookieManager.set(process.env.EXPO_PUBLIC_API_URL, {
        name: "refreshToken",
        value: refreshToken,
        path: "/",
        httpOnly: false,
      });
    }
    // else {
    //   await CookieManager.clearByName(
    //     process.env.EXPO_PUBLIC_API_URL,
    //     "refreshToken"
    //   );
    // }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response 인터셉터
AXIOS_INSTANCE.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfigWithRetry;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    // 401 && 아직 재시도 안 한 요청
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // 엑세스 토큰 재발급 요청
      try {
        await getNewAccessToken();
        // 새로운 토큰으로 원래 요청 재시도
        return AXIOS_INSTANCE(originalRequest);
      } catch (error: any) {
        const customError: CustomError = {
          message: "로그인 후 사용해주세요.",
          status: 401,
          code: "TOKEN_REFRESH_FAILED",
        };

        Airbridge.clearUser();

        return Promise.reject(customError);
      }
    }

    return Promise.reject(error);
  }
);

export const customInstance = <T = any>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig
): Promise<T> => {
  const source = Axios.CancelToken.source();

  const promise = AXIOS_INSTANCE({
    ...config,
    ...options,
    cancelToken: source.token,
  })
    .then((response: AxiosResponse<T>) => response.data)
    .catch((error) => {
      if (error.code === "TOKEN_REFRESH_FAILED") {
        throw error;
      }

      if ((error as AxiosError).isAxiosError) {
        const axiosError = error as AxiosError;

        // 서버 응답 메시지가 있을 경우 error 객체에 추가
        const message = (axiosError.response?.data as any)?.message;
        const status = axiosError.response?.status;

        throw { message, status } as CustomError;
      } else {
        const message = (error as any)?.message ?? "오류가 발생했습니다.";
        const status = (error as any)?.status ?? 500;

        throw { message, status } as CustomError;
      }
    });

  // @ts-ignore
  promise.cancel = () => {
    source.cancel("Query was cancelled");
  };

  return promise;
};

export default customInstance;
