import React from "react";
import DiaryCard1 from "./DiaryCard1";
import { useLogin } from "../../context/LoginContext";
import styled from "styled-components";

const CommentCard = () => {
  const { diary } = useLogin();

  return (
    <PageContainer>
      <DiaryCard1 diary={diary} />
      <div>comment 창입니다</div>
    </PageContainer>
  );
};

export default CommentCard;

const PageContainer = styled.div`
  padding: 0 10px;
`;
