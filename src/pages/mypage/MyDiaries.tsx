import React, { useEffect, useLayoutEffect, useState } from "react";
import { getDiariesByUserApi } from "../../api/sehodiary-api";
import { DiaryResponseType } from "../../types/type";
import DiaryCard0 from "../../components/card/DiaryCard0";
import { useLogin } from "../../context/LoginContext";
import { useSearchParams } from "react-router-dom";
import { useScroll } from "../../context/ScrollContext";

const MyDiaries = () => {
  const { diary } = useLogin();
  const { myDiaryScroll } = useScroll();
  const [diaryList, setDiaryList] = useState<DiaryResponseType[]>([]);
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab");

  const isMyDiaryPage = tab === "mydiary";

  useEffect(() => {
    let mounted = true;

    getDiariesByUserApi()
      .then((res) => {
        if (!mounted) return;
        console.log(res);
        setDiaryList(res.data);
      })
      .catch((err) => {
        console.error(err);
      })

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
    if (isMyDiaryPage) {
      setTimeout(() => {
        window.scrollTo(myDiaryScroll.x, myDiaryScroll.y);
      }, 10);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMyDiaryPage]);

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
