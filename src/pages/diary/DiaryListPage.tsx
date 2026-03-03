import React, { useEffect, useState } from "react";
import { getAllDiariesApi } from "../../api/sehodiary-api";
import { DiaryResponseType } from "../../types/type";
import styled from "styled-components";
import DiaryCard0 from "../../components/card/DiaryCard0";

const DiaryListPage = () => {
  const [diaryList, setDiaryList] = useState([]);

  useEffect(() => {
    getAllDiariesApi()
      .then((res) => {
        console.log(res);
        setDiaryList(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <PageContainer>
      {diaryList.map((diary: DiaryResponseType) => (
        <DiaryCard0 key={diary?.id} diary={diary} />
      ))}
    </PageContainer>
  );
};

export default DiaryListPage;

const PageContainer = styled.div`
  margin-top: 20px;
  padding: 0 20px;
`;
