import React from "react";
import styled from "styled-components";
import { CommentResponseType } from "../../types/type";
import { TwoDiv } from "../form/TwoDiv";
import { IoPersonOutline } from "react-icons/io5";

const CommentCard0 = ({ comment }: { comment: CommentResponseType }) => {
  const createdAt = `${new Date(comment?.createdAt).getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}-${String(new Date().getDate()).padStart(2, "0")}`;

  return (
    <PageContainer>
      <Wrapper>
        <IconAndContent>
          <IoPersonOutline style={{ marginRight: "5px" }} />
          {comment?.content}
        </IconAndContent>
        <TwoDiv>
          <Nickname>작성자: {comment?.nickname}</Nickname>
          <CreatedAt>{createdAt}</CreatedAt>
        </TwoDiv>
      </Wrapper>
    </PageContainer>
  );
};

export default CommentCard0;

const PageContainer = styled.div`
  border: 1px solid #e5e7eb;
  padding: 10px;
  border-radius: 10px;
  margin-bottom: 20px;
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  alignitems: center;
  flex-direction: column;
`;

const IconAndContent = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const Nickname = styled.div`
  font-style: italic;
  color: gray;
`;

const CreatedAt = styled.div`
  font-style: italic;
  color: gray;
`;
