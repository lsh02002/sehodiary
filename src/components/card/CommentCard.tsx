import React from "react";
import styled from "styled-components";
import { CommentResponseType } from "../../types/type";

const CommentCard = ({comment}: {comment: CommentResponseType}) => {  

  return (
    <PageContainer>
      <div>{comment?.content} {comment?.nickname}</div>
    </PageContainer>
  );
};

export default CommentCard;

const PageContainer = styled.div`
  padding: 0 10px;
`;
