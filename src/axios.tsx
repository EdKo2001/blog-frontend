import axios from "axios";

const instance: any = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

instance.interceptors.request.use((config: any) => {
  config.headers!.Authorization = window.localStorage.getItem("token");

  return config;
});

export default instance;
