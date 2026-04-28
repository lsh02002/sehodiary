import { create } from "zustand";

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

type ScrollStore = {
  scrolls: ScrollState;
  setScrolls: (updater: (prev: ScrollState) => ScrollState) => void;
  setScroll: (key: ScrollKey, value: Partial<ScrollPosition>) => void;
};

export const useScrollStore = create<ScrollStore>((set) => ({
  scrolls: initialScrolls,

  setScrolls: (updater) =>
    set((state) => ({
      scrolls: updater(state.scrolls),
    })),

  setScroll: (key, value) =>
    set((state) => ({
      scrolls: {
        ...state.scrolls,
        [key]: {
          ...state.scrolls[key],
          ...value,
        },
      },
    })),
}));
