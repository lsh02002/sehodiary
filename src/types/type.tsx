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
  commentsCount: number;
  likesCount: number;
  isLiked: boolean;
  createdAt: string;
};

export type CommentRequestType = {
  diaryId: number;
  content: string;
};

export type CommentResponseType = {
  diaryId: number;
  commentId: number;
  nickname: string;
  profileImage: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};
