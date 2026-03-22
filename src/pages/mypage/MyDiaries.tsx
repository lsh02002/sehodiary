import React, { useEffect, useLayoutEffect, useState } from "react";
import { getDiariesByUserApi } from "../../api/sehodiary-api";
import { DiaryResponseType } from "../../types/type";
import DiaryCard0 from "../../components/bootstrap-card/DiaryCard0";
import { useLogin } from "../../context/LoginContext";
import { useScroll } from "../../context/ScrollContext";

const MyDiaries = () => {
  const { diary } = useLogin();
  const { myDiaryScroll } = useScroll();
  const [diaryList, setDiaryList] = useState<DiaryResponseType[]>([]);

  useEffect(() => {
    let mounted = true;

    getDiariesByUserApi()
      .then((res) => {
        if (!mounted) return;
        setDiaryList(res.data);
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
        left: myDiaryScroll.x,
        top: myDiaryScroll.y,
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
          <DiaryCard0 key={diary0?.id} diary0={diary0} />
        ))
      ) : (
        <div>해당 글이 없습니다!</div>
      )}
    </>
  );
};

export default MyDiaries;
