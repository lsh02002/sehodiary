import React, { useCallback, useEffect, useRef, useState } from "react";
import { getDiariesByUserApi } from "../../api/sehodiary-api";
import { DiaryResponseType } from "../../types/type";
import DiaryCardOne from "../../components/bootstrap-card/DiaryCardOne";
import { useLoginStore } from "../../zustand/ZustandLogin";
import { useScrollStore } from "../../zustand/ZustandScroll";

const MyDiaries = () => {
  const { diary } = useLoginStore();
  const { scrolls, setScroll } = useScrollStore();
  const [diaryList, setDiaryList] = useState<DiaryResponseType[]>([]);

  const [now, setNow] = useState(Date.now());

  const scrollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 60000); // 1분

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let mounted = true;

    getDiariesByUserApi()
      .then((res) => {
        if (!mounted) return;
        setDiaryList(res.data?.content);
      })
      .catch(() => {});

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    setDiaryList((prev) => {
      if (!prev) return prev;
      return prev.map((i) => (i.id === diary?.id ? diary : i));
    });
  }, [diary]);

  useEffect(() => {
    if (diaryList?.length === 0) return;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.scrollTo(0, scrolls.myDiary.y ?? 0);
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [diaryList?.length]);

  const handleWindowScroll = useCallback(() => {
    if (scrollTimer.current) {
      clearTimeout(scrollTimer.current);
    }

    scrollTimer.current = setTimeout(() => {
      setScroll("myDiary", { x: window.scrollX, y: window.scrollY, page: 0 });
    }, 150);
  }, [setScroll]);

  useEffect(() => {
    window.addEventListener("scroll", handleWindowScroll);

    return () => {
      window.removeEventListener("scroll", handleWindowScroll);

      if (scrollTimer.current) {
        clearTimeout(scrollTimer.current);
        scrollTimer.current = null;
      }
    };
  }, [handleWindowScroll]);

  return (
    <>
      <h4 style={{ marginBottom: "20px" }}>내가쓴일기({diaryList?.length})</h4>
      {diaryList && diaryList?.length > 0 ? (
        diaryList?.map((diary0: DiaryResponseType) => (
          <DiaryCardOne key={diary0?.id} diary0={diary0} now={now} />
        ))
      ) : (
        <div>해당 글이 없습니다!</div>
      )}
    </>
  );
};

export default MyDiaries;
