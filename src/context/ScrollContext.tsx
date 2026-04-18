import {
  useState,
  createContext,
  ReactNode,
  Dispatch,
  SetStateAction,
  useContext,
} from "react";

type ScrollPosition = {
  x: number;
  y: number;
};

type ScrollKey =
  | "mainPage"
  | "mainFollowPage"
  | "myDiary"
  | "myComment"
  | "myActivityLog";

type ScrollState = Record<ScrollKey, ScrollPosition>;

type ScrollContextValue = {
  scrolls: ScrollState;
  setScrolls: Dispatch<SetStateAction<ScrollState>>;
};

const initialPosition: ScrollPosition = { x: 0, y: 0 };

const initialScrolls: ScrollState = {
  mainPage: initialPosition,
  mainFollowPage: initialPosition,
  myDiary: initialPosition,
  myComment: initialPosition,
  myActivityLog: initialPosition,
};

export const ScrollContext = createContext<ScrollContextValue | undefined>(
  undefined
);

export const ScrollProvider = ({ children }: { children: ReactNode }) => {
  const [scrolls, setScrolls] = useState<ScrollState>(initialScrolls);

  return (
    <ScrollContext.Provider value={{ scrolls, setScrolls }}>
      {children}
    </ScrollContext.Provider>
  );
};

export function useScroll() {
  const ctx = useContext(ScrollContext);
  if (!ctx) throw new Error("useScroll must be used within <ScrollProvider>");
  return ctx;
}