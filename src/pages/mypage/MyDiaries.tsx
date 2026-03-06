import React, { useEffect, useState } from "react";
import { useLogin } from "../../context/LoginContext";
import { getDiariesByUserApi } from "../../api/sehodiary-api";
import { DiaryResponseType } from "../../types/type";
import DiaryCard0 from "../../components/card/DiaryCard0";

const MyDiaries = () => {
  const { isLogin } = useLogin();
  const [diaryList, setDiaryList] = useState([]);

  useEffect(() => {
    if (isLogin) {
      getDiariesByUserApi()
        .then((res) => {
          console.log(res);
          setDiaryList(res.data);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [isLogin]);

  return (
    <>
    <h4 style={{marginBottom: "20px"}}>내가쓴일기</h4>
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
