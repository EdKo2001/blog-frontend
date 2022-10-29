import axios from "axios";

// import { Navigate } from "react-router-dom";

const instance: any = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

instance.interceptors.request.use(
  (config: any) => {
    config.headers!.Authorization =
      "Bearer " + window.localStorage.getItem("token");

    return config;
  },
  (error: any) => {
    if (error?.response?.status === 401) {
      console.log("error");
      // return <Navigate to="/" />;
    }

    return Promise.reject(error);
  }
);

export default instance;
