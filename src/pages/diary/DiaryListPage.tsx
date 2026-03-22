import React, { useEffect, useLayoutEffect, useState } from "react";
import { getDiariesByPublicApi } from "../../api/sehodiary-api";
import { DiaryResponseType } from "../../types/type";
import DiaryCard0 from "../../components/card/DiaryCard0";
import { useLogin } from "../../context/LoginContext";
import { useScroll } from "../../context/ScrollContext";

const DiaryListPage = () => {
  const { diary } = useLogin();
  const { mainPageScroll } = useScroll();
  const [diaryList, setDiaryList] = useState<DiaryResponseType[]>([]);

  useEffect(() => {
    let mounted = true;

    getDiariesByPublicApi()
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
        left: mainPageScroll.x,
        top: mainPageScroll.y,
        behavior: "auto",
      });
    });

    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [diaryList?.length]);

  return (
    <div className="mt-3 px-3 mb-5" style={{ marginBottom: "100px" }}>
      {diaryList && diaryList?.length > 0 ? (
        diaryList?.map((diary: DiaryResponseType) => (
          <DiaryCard0 key={diary?.id} diary0={diary} />
        ))
      ) : (
        <div>해당 글이 없습니다!</div>
      )}
    </div>
  );
};

export default DiaryListPage;
