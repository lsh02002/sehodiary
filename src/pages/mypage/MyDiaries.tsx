import React, { useEffect, useLayoutEffect, useState } from "react";
import { getDiariesByUserApi } from "../../api/sehodiary-api";
import { DiaryResponseType } from "../../types/type";
import DiaryCard0 from "../../components/bootstrap-card/DiaryCard0";
import { useLogin } from "../../context/LoginContext";
import { useScroll } from "../../context/ScrollContext";

const MyDiaries = () => {
  const { diary } = useLogin();
  const { scrolls } = useScroll();
  const [diaryList, setDiaryList] = useState<DiaryResponseType[]>([]);

  const [now, setNow] = useState(Date.now());

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

  useLayoutEffect(() => {
    const raf = requestAnimationFrame(() => {
      window.scrollTo({
        left: scrolls.myDiary.x,
        top: scrolls.myDiary.y,
        behavior: "auto",
      });
    });

    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [diaryList.length]);

  return (
    <>
      <h4 style={{ marginBottom: "20px" }}>내가쓴일기({diaryList?.length})</h4>
      {diaryList && diaryList?.length > 0 ? (
        diaryList?.map((diary0: DiaryResponseType) => (
          <DiaryCard0 key={diary0?.id} diary0={diary0} now={now} />
        ))
      ) : (
        <div>해당 글이 없습니다!</div>
      )}
    </>
  );
};

export default MyDiaries;
