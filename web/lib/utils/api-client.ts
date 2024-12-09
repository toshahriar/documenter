import axios from 'axios';
import Cookies from 'js-cookie';

const axiosClient = axios.create({
  baseURL: '/api',
  timeout: 10000,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: Array<{ resolve: Function; reject: Function }> = [];

const getAccessToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return Cookies.get('accessToken') || null;
  }
  return null;
};

const getRefreshToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return Cookies.get('refreshToken') || null;
  }
  return null;
};

const processQueue = (error: any = null, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });

  failedQueue = [];
};

axiosClient.interceptors.request.use(
  (config: any) => {
    const token = getAccessToken();

    config.headers = {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      Accept: 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...config.headers,
    };

    return config;
  },
  (error: any) => {
    console.log(error);
    return Promise.reject({
      status: 'error',
      message: error?.message ?? 'Failed to process request',
      data: null,
      meta: null,
      errors: null,
      notify: true,
      requestId: +new Date(),
    });
  }
);

axiosClient.interceptors.response.use(
  (response: { data: any }): any => {
    return {
      status: 'success',
      message: response.data?.message || 'Request successful',
      data: response.data?.data || null,
      meta: response.data?.meta || null,
      errors: null,
      notify: response.data?.notify || false,
      requestId: response.data?.requestId || +new Date(),
    };
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosClient(originalRequest);
          })
          .catch((err: any) =>
            Promise.reject({
              status: 'error',
              message: err?.message || 'Retry failed',
              data: null,
              meta: null,
              errors: null,
              notify: true,
              requestId: +new Date(),
            })
          );
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = getRefreshToken();

        const response = await axios.post('/api/v1/auth/refresh-token', {
          token: refreshToken,
        });

        const newAccessToken = response.data.accessToken;

        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return axiosClient(originalRequest);
      } catch (refreshError: any) {
        processQueue(refreshError, null);

        return Promise.reject({
          status: 'error',
          message: refreshError.response?.data?.message || 'Failed to refresh token',
          data: null,
          meta: null,
          errors: refreshError.response?.data?.errors || null,
          notify: true,
          requestId: refreshError.response?.data?.requestId || +new Date(),
        });
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject({
      status: 'error',
      message: error.response?.data?.message || 'An error occurred',
      data: null,
      meta: null,
      errors: error.response?.data?.errors || null,
      notify: true,
      requestId: error.response?.data?.requestId || +new Date(),
    });
  }
);

export default axiosClient;
