import Axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import * as SecureStore from "expo-secure-store";
import CookieManager from "@react-native-cookies/cookies";

export const AXIOS_INSTANCE = Axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  withCredentials: true,
});

// API 요청 시 SecureStorage에서 토큰을 꺼내 쿠키에 담아 전송
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
      const axiosError = error as AxiosError;

      // 서버 응답 메시지가 있을 경우 error 객체에 추가
      const message = error.response?.data?.message;
      const status = axiosError.response?.status;

      throw { message, status };
    });

  // @ts-ignore
  promise.cancel = () => {
    source.cancel("Query was cancelled");
  };

  return promise;
};

export default customInstance;
