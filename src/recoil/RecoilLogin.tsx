import { useCallback, useMemo } from "react";
import { atom, useRecoilState } from "recoil";
import { CommentResponseType, DiaryResponseType } from "../types/type";

type LoginState = {
  isLogin: boolean;
  open: boolean;
  mypageTab: string;
  diary?: DiaryResponseType;
  commentList?: CommentResponseType[];
  myCommentList?: CommentResponseType[];
};

const loginStateAtom = atom<LoginState>({
  key: "loginStateAtom",
  default: {
    isLogin: false,
    open: false,
    mypageTab: "follow",
    diary: undefined,
    commentList: undefined,
    myCommentList: undefined,
  },
});

export function useLogin() {
  const [loginState, setLoginState] = useRecoilState(loginStateAtom);

  const setIsLogin = useCallback(
    (value: boolean | ((prev: boolean) => boolean)) => {
      setLoginState((prev) => ({
        ...prev,
        isLogin: typeof value === "function" ? value(prev.isLogin) : value,
      }));
    },
    [setLoginState],
  );

  const setOpen = useCallback(
    (value: boolean | ((prev: boolean) => boolean)) => {
      setLoginState((prev) => ({
        ...prev,
        open: typeof value === "function" ? value(prev.open) : value,
      }));
    },
    [setLoginState],
  );

  const setMypageTab = useCallback(
    (value: string | ((prev: string) => string)) => {
      setLoginState((prev) => ({
        ...prev,
        mypageTab:
          typeof value === "function" ? value(prev.mypageTab) : value,
      }));
    },
    [setLoginState],
  );

  const setDiary = useCallback(
    (
      value:
        | DiaryResponseType
        | undefined
        | ((prev: DiaryResponseType | undefined) => DiaryResponseType | undefined),
    ) => {
      setLoginState((prev) => ({
        ...prev,
        diary: typeof value === "function" ? value(prev.diary) : value,
      }));
    },
    [setLoginState],
  );

  const setCommentList = useCallback(
    (
      value:
        | CommentResponseType[]
        | undefined
        | ((
            prev: CommentResponseType[] | undefined,
          ) => CommentResponseType[] | undefined),
    ) => {
      setLoginState((prev) => ({
        ...prev,
        commentList:
          typeof value === "function" ? value(prev.commentList) : value,
      }));
    },
    [setLoginState],
  );

  const setMyCommentList = useCallback(
    (
      value:
        | CommentResponseType[]
        | undefined
        | ((
            prev: CommentResponseType[] | undefined,
          ) => CommentResponseType[] | undefined),
    ) => {
      setLoginState((prev) => ({
        ...prev,
        myCommentList:
          typeof value === "function" ? value(prev.myCommentList) : value,
      }));
    },
    [setLoginState],
  );

  return useMemo(
    () => ({
      isLogin: loginState.isLogin,
      setIsLogin,
      open: loginState.open,
      setOpen,
      mypageTab: loginState.mypageTab,
      setMypageTab,
      diary: loginState.diary,
      setDiary,
      commentList: loginState.commentList,
      setCommentList,
      myCommentList: loginState.myCommentList,
      setMyCommentList,
    }),
    [
      loginState,
      setIsLogin,
      setOpen,
      setMypageTab,
      setDiary,
      setCommentList,
      setMyCommentList,
    ],
  );
}