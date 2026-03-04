import {
  useState,
  createContext,
  ReactNode,
  Dispatch,
  SetStateAction,
  useContext,
} from "react";
import { CommentResponseType, DiaryResponseType } from "../types/type";

type LoginContextValue = {
  isLogin: boolean;
  setIsLogin: Dispatch<SetStateAction<boolean>>;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  diaryList?: DiaryResponseType[];
  setDiaryList: Dispatch<SetStateAction<DiaryResponseType[] | undefined>>;
  diary?: DiaryResponseType;
  setDiary: Dispatch<SetStateAction<DiaryResponseType | undefined>>;
  commentList?: CommentResponseType[];
  setCommentList: Dispatch<SetStateAction<CommentResponseType[] | undefined>>;
};

export const LoginContext = createContext<LoginContextValue | undefined>(
  undefined,
);

export const LoginProvider = ({ children }: { children: ReactNode }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [open, setOpen] = useState(false);
  const [diaryList, setDiaryList] = useState<DiaryResponseType[]>();
  const [diary, setDiary] = useState<DiaryResponseType>();
  const [commentList, setCommentList] = useState<CommentResponseType[]>();

  const value: LoginContextValue = {
    isLogin,
    setIsLogin,
    open,
    setOpen,
    diaryList,
    setDiaryList,
    diary,
    setDiary,
    commentList,
    setCommentList,
  };

  return (
    <LoginContext.Provider value={value}>{children}</LoginContext.Provider>
  );
};

export function useLogin() {
  const ctx = useContext(LoginContext);

  if (!ctx) throw new Error("useLogin must be used within <LoginProvider>");
  return ctx;
}
