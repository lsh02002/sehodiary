import axios from "axios";
import { BASE_URL } from "./BASE_URL";
import { toast } from "react-toastify";
import { CommentRequestType, DiaryRequestType, UserSignupType } from "../types/type";

export const api = axios.create({
  baseURL: BASE_URL,
});

// 요청 인터셉터: 매 요청마다 토큰 자동 추가
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    if (accessToken && refreshToken) {
      config.headers["accessToken"] = accessToken;
      config.headers["refreshToken"] = refreshToken;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ✅ 응답 인터셉터: 새 accessToken이 오면 자동 저장
api.interceptors.response.use(
  (response) => {
    const newAccessToken = response.headers["accesstoken"]; // 헤더 키 이름은 서버와 동일하게
    if (newAccessToken) {
      localStorage.setItem("accessToken", newAccessToken);
    }
    return response;
  },
  (error) => {
    // ✅ detailMessage가 있으면 가장 먼저 콘솔에 출력
    if (error.response?.data?.detailMessage) {
      toast.error(error.response.data.detailMessage);
    }
    // 그 외의 에러도 같이 로깅
    if (error.message) {
      console.error(error.message);
    }
    console.error("⚠️ Axios Error:", error);
    return Promise.reject(error);
  },
);

const UserLoginApi = async (email: string, password: string) => {
  return api.post(`/user/login`, {
    email,
    password,
  });
};

const UserSignupApi = async (data: UserSignupType) => {
  return api.post(`/user/sign-up`, data);
};

const UserLogoutApi = async () => {
  return api.delete(`/user/logout`);
};

const getUserInfosApi = async () => {
  return api.get(`/user`);
};

const getAllDiariesApi = async () => {
  return api.get(`/diary/all`);
}

const getDiariesByUserApi = async () => {
  return api.get(`/diary/user`);
}

const getOneDiaryApi = async(diaryId: number) => {
  return api.get(`/diary/${diaryId}`);
}

const createDiaryApi = async (data: DiaryRequestType) => {
  return api.post(`/diary/create`, data);
};

const editDiaryApi = async (diaryId: number, data: DiaryRequestType) => {
  return api.post(`/diary/edit/${diaryId}`, data);
}

const getCommentsByDiaryApi = async (diaryId: number) => {
  return api.get(`/comment/diary/${diaryId}`);
}

const createCommentApi = async (data: CommentRequestType) => {
  return api.post(`/comment/create`, data);
}

export {
  UserLoginApi,
  UserSignupApi,
  UserLogoutApi,
  getUserInfosApi,
  getAllDiariesApi,
  getDiariesByUserApi,
  getOneDiaryApi,
  createDiaryApi,
  editDiaryApi,
  getCommentsByDiaryApi,
  createCommentApi,
};
