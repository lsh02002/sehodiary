import React, { useEffect, useState } from "react";
import { getDiariesByUserApi } from "../../api/sehodiary-api";
import { DiaryResponseType } from "../../types/type";
import DiaryCard0 from "../../components/card/DiaryCard0";
import { useLogin } from "../../context/LoginContext";

const MyDiaries = () => {
  const { diary } = useLogin();
  const [diaryList, setDiaryList] = useState<DiaryResponseType[]>([]);

  useEffect(() => {
    getDiariesByUserApi()
      .then((res) => {
        console.log(res);
        setDiaryList(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  useEffect(() => {
    setDiaryList((prev) => {
      if (!prev) return prev;
      return prev.map((i) => (i.id === diary?.id ? diary : i));
    });
  }, [diary]);

  return (
    <>
      <h4 style={{ marginBottom: "20px" }}>
        내가쓴일기({diaryList?.length})
      </h4>
      {diaryList && diaryList?.length > 0 ? (
        diaryList?.map((diary: DiaryResponseType) => (
          <DiaryCard0 key={diary?.id} diary0={diary} />
        ))
      ) : (
        <div>해당 글이 없습니다!</div>
      )}
    </>
  );
};

export default MyDiaries;
