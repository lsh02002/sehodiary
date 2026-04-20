import { atom, useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

type ScrollPosition = {
  x: number;
  y: number;
  page?: number;
};

type ScrollKey =
  | "mainPage"
  | "mainFollowPage"
  | "myDiary"
  | "myComment"
  | "myActivityLog";

type ScrollState = Record<ScrollKey, ScrollPosition>;

const initialScrolls: ScrollState = {
  mainPage: { x: 0, y: 0, page: 0 },
  mainFollowPage: { x: 0, y: 0, page: 0 },
  myDiary: { x: 0, y: 0, page: 0 },
  myComment: { x: 0, y: 0, page: 0 },
  myActivityLog: { x: 0, y: 0, page: 0 },
};

export const scrollStateAtom = atom<ScrollState>({
  key: "scrollStateAtom",
  default: initialScrolls,
});

export function useScroll() {
  const [scrolls, setScrolls] = useRecoilState(scrollStateAtom);
  return { scrolls, setScrolls };
}

export function useScrollValue() {
  return useRecoilValue(scrollStateAtom);
}

export function useSetScroll() {
  return useSetRecoilState(scrollStateAtom);
}