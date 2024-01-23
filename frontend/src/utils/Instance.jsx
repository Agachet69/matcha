import axios from "axios";

export const getAuthorizedInstance = (token) => {
  const instance = axios.create({
    baseURL: "http://localhost:8000",
  });

  instance.interceptors.request.use(
    (config) => {
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  return instance;
};
