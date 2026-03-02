export type UserSignupType = {
  email: string;
  nickname: string;
  profileImage: string;
  password: string;
  passwordConfirm: string;  
};

export type DiaryRequestType = {
    title: string;
    content: string;
    visibility: string;
    weather: string;
};

export type DiaryResponseType = {
    id: number;
    nickname: string;
    title: string;
    content: string;
    visibility: string;
    weather: string;
};