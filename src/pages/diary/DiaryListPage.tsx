import React, { useEffect, useState } from "react";
import { getDiariesByUserApi } from "../../api/sehodiary-api";
import { DiaryResponseType } from "../../types/type";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const DiaryListPage = () => {
  const navigator = useNavigate();
  const [diaryList, setDiaryList] = useState([]);

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

  return (
    <PageContainer>
      {diaryList.map((diary: DiaryResponseType) => (
        <div
          style={{            
            height: "50px",
            border: "1px solid red",
            margin: "10px",
            padding: "10px",            
          }}
          key={diary?.id}
          onClick={() => navigator(`/edit/${diary?.id}`)}
        >
          {diary?.id} {diary?.title} {diary?.content}
        </div>
      ))}
    </PageContainer>
  );
};

export default DiaryListPage;

const PageContainer = styled.div`
  padding: 0 20px;  
`;
