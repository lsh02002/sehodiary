import React, { useEffect, useState } from "react";
import {
  getDiariesByPublicApi,
} from "../../api/sehodiary-api";
import { DiaryResponseType } from "../../types/type";
import styled from "styled-components";
import DiaryCard0 from "../../components/card/DiaryCard0";

const DiaryListPage = () => {
  const [ diaryList, setDiaryList ] = useState([]);  

  useEffect(() => {
    getDiariesByPublicApi()
      .then((res) => {
        console.log(res);
        setDiaryList(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [setDiaryList]);

  return (
    <PageContainer>
      {diaryList && diaryList?.length > 0 ? (
        diaryList?.map((diary: DiaryResponseType) => (
          <DiaryCard0 key={diary?.id} diary0={diary} />
        ))
      ) : (
        <div>해당 글이 없습니다!</div>
      )}            
    </PageContainer>
  );
};

export default DiaryListPage;

const PageContainer = styled.div`
  margin-top: 20px;
  padding: 0 20px;
  margin-bottom: 100px;
`;
