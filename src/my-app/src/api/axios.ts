import axios from "axios";

const BASE_URL = "http://localhost:3003/api";

export default axios.create({
  baseURL: BASE_URL,
});

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

let accessToken = "";

export const setAccessToken = (token: string) => {
  accessToken = token;
};

axiosPrivate.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosPrivate.interceptors.response.use(
  (response) => response,
  async (error) => {
    const prevRequest = error.config;
    if (
      (error.response?.status === 403 || error.response?.status === 401) &&
      !prevRequest._retry
    ) {
      prevRequest._retry = true;
      try {
        const response = await axios.post(
          `${BASE_URL}/refresh-token`,
          {},
          {
            withCredentials: true,
          }
        );
        const newAccessToken = response.data.accessToken;
        setAccessToken(newAccessToken);

        prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return axiosPrivate(prevRequest);
      } catch (err) {
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);
