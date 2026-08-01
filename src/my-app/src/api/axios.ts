import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3003';

export default axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
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
    if (accessToken && config.headers) {
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
      prevRequest &&
      !prevRequest._retry
    ) {
      prevRequest._retry = true;
      try {
        const response = await axios.post(
          `${BASE_URL}/api/refresh-token`,
          {},
          {
            withCredentials: true,
          }
        );
        const newAccessToken = response.data.accessToken;
        setAccessToken(newAccessToken);

        if (prevRequest.headers) {
          prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        }
        return axiosPrivate(prevRequest);
      } catch (err) {
        setAccessToken("");
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);