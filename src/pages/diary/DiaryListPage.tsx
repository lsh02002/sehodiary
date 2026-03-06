import React, { useEffect, useState } from "react";
import {
  getDiariesByPublicApi,
  getLogMessagesByUserApi,
} from "../../api/sehodiary-api";
import { ActivityLogResponseType, DiaryResponseType } from "../../types/type";
import styled from "styled-components";
import DiaryCard0 from "../../components/card/DiaryCard0";
import { useLogin } from "../../context/LoginContext";

const DiaryListPage = () => {
  const { diaryList, setDiaryList } = useLogin();
  const [logMessages, setLogMessages] = useState([]);

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

  useEffect(() => {
    getLogMessagesByUserApi()
      .then((res) => {
        console.log(res);
        setLogMessages(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <PageContainer>
      {diaryList && diaryList?.length > 0 ? (
        diaryList?.map((diary: DiaryResponseType) => (
          <DiaryCard0 key={diary?.id} diary0={diary} />
        ))
      ) : (
        <div>해당 글이 없습니다!</div>
      )}
      <div>임시로 테스트용으로 여기에 만듬!!!</div>
      <h3>사용자별 활동 로그 내역</h3>
      {logMessages && logMessages?.length > 0 ? (
        logMessages?.map((log: ActivityLogResponseType) => (
          <div
            style={{
              margin: "10px 0",
              padding: "15px",
              borderRadius: "15px",
              border: "1px solid gray",
            }}
          >
            <div>{log?.message}</div>
            <div>{log?.createdAt}</div>
          </div>
        ))
      ) : (
        <div>해당 메시지가 없습니다!</div>
      )}
    </PageContainer>
  );
};

export default DiaryListPage;

const PageContainer = styled.div`
  margin-top: 20px;
  padding: 0 20px;
`;
