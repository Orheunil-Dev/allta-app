import Axios, { AxiosRequestConfig, AxiosResponse } from "axios";

export const AXIOS_INSTANCE = Axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
});

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
      // 서버 응답 메시지가 있을 경우 error 객체에 추가
      const serverMessage = error.response?.data?.message;

      // 에러 메시지를 그대로 throw하거나, error 객체에 직접 붙여도 OK
      if (serverMessage) {
        error.message = serverMessage; // override 기본 message
      }

      throw error.message;
    });

  // @ts-ignore
  promise.cancel = () => {
    source.cancel("Query was cancelled");
  };

  return promise;
};

export default customInstance;
