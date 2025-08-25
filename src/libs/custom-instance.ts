import Axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import * as SecureStore from "expo-secure-store";
import CookieManager from "@react-native-cookies/cookies";

interface AxiosRequestConfigWithRetry extends AxiosRequestConfig {
  _retry?: boolean;
}

export const AXIOS_INSTANCE = Axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  withCredentials: true,
});

// 엑세스 토큰 재발급
const getNewAccessToken = async (): Promise<void> => {
  const refreshToken = await SecureStore.getItemAsync("refreshToken");

  if (!refreshToken) {
    throw {
      message: "로그인이 만료되었습니다.",
      status: 401,
    };
  }

  const response = await AXIOS_INSTANCE.post(
    "/token/refresh",
    {},
    {
      headers: { Cookie: `refreshToken=${refreshToken}` },
    }
  );

  const newAccessToken = response.data.accessToken;
  const newRefreshToken = response.data.refreshToken;

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
};

// Request 인터셉터
AXIOS_INSTANCE.interceptors.request.use(
  async (config) => {
    const accessToken = await SecureStore.getItemAsync("accessToken");
    const refreshToken = await SecureStore.getItemAsync("refreshToken");

    if (accessToken && refreshToken) {
      await CookieManager.set(process.env.EXPO_PUBLIC_API_URL!, {
        name: "accessToken",
        value: accessToken,
        path: "/",
        httpOnly: false,
      });

      await CookieManager.set(process.env.EXPO_PUBLIC_API_URL!, {
        name: "refreshToken",
        value: refreshToken,
        path: "/",
        httpOnly: false,
      });
    }

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
      } catch (error) {
        throw {
          message: "로그인 후 사용해주세요.",
          status: 401,
        };
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
      if ((error as AxiosError).isAxiosError) {
        const axiosError = error as AxiosError;

        // 서버 응답 메시지가 있을 경우 error 객체에 추가
        const message = error.response?.data?.message;
        const status = axiosError.response?.status;

        throw { message, status };
      } else {
        const message = (error as any)?.message ?? "에러가 발생했습니다.";
        const status = (error as any)?.status ?? 500;

        throw { message, status };
      }
    });

  // @ts-ignore
  promise.cancel = () => {
    source.cancel("Query was cancelled");
  };

  return promise;
};

export default customInstance;
