import { create } from "zustand";
import { CommentResponseType, DiaryResponseType } from "../types/type";

type LoginState = {
  isLogin: boolean;
  open: boolean;
  mypageTab: string;
  diary?: DiaryResponseType;
  commentList?: CommentResponseType[];
  myCommentList?: CommentResponseType[];
};

type LoginStore = LoginState & {
  setIsLogin: (value: boolean | ((prev: boolean) => boolean)) => void;
  setOpen: (value: boolean | ((prev: boolean) => boolean)) => void;
  setMypageTab: (value: string | ((prev: string) => string)) => void;
  setDiary: (
    value:
      | DiaryResponseType
      | undefined
      | ((prev: DiaryResponseType | undefined) => DiaryResponseType | undefined),
  ) => void;
  setCommentList: (
    value:
      | CommentResponseType[]
      | undefined
      | ((
          prev: CommentResponseType[] | undefined,
        ) => CommentResponseType[] | undefined),
  ) => void;
  setMyCommentList: (
    value:
      | CommentResponseType[]
      | undefined
      | ((
          prev: CommentResponseType[] | undefined,
        ) => CommentResponseType[] | undefined),
  ) => void;
};

export const useLoginStore = create<LoginStore>((set) => ({
  isLogin: false,
  open: false,
  mypageTab: "follow",
  diary: undefined,
  commentList: undefined,
  myCommentList: undefined,

  setIsLogin: (value) =>
    set((state) => ({
      isLogin: typeof value === "function" ? value(state.isLogin) : value,
    })),

  setOpen: (value) =>
    set((state) => ({
      open: typeof value === "function" ? value(state.open) : value,
    })),

  setMypageTab: (value) =>
    set((state) => ({
      mypageTab:
        typeof value === "function" ? value(state.mypageTab) : value,
    })),

  setDiary: (value) =>
    set((state) => ({
      diary: typeof value === "function" ? value(state.diary) : value,
    })),

  setCommentList: (value) =>
    set((state) => ({
      commentList:
        typeof value === "function" ? value(state.commentList) : value,
    })),

  setMyCommentList: (value) =>
    set((state) => ({
      myCommentList:
        typeof value === "function" ? value(state.myCommentList) : value,
    })),
}));