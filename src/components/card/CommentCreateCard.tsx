import React, { useState } from "react";
import styled from "styled-components";
import TextInput from "../form/TextInput";
import TextAreaInput from "../form/TextAreaInput";
import { TwoDiv } from "../form/TwoDiv";
import ConfirmButton from "../form/ConfirmButton";
import { CommentRequestType } from "../../types/type";
import { createCommentApi } from "../../api/sehodiary-api";

const CommentCreateCard = ({ diaryId }: { diaryId: number }) => {
  const [nickname, setNickname] = useState(
    localStorage.getItem("nickname") ?? "",
  );
  const [content, setContent] = useState("");

  const handleCreateComment = () => {
    const data: CommentRequestType = {
      diaryId,
      content,
    };

    createCommentApi(data)
    .then(res=>{
        console.log(res);
    })
    .catch(err=>{
        console.error(err);
    })
  };

  return (
    <Container>
      <Wrapper>
        <TwoDiv style={{ alignItems: "start" }}>
          <TextAreaInput
            name="content"
            title="댓글 내용"
            data={content}
            setData={setContent}
            rows={5}
          />
          <div>
            <TextInput
              disabled
              name="nickname"
              title="댓글 작성자"
              data={nickname}
              setData={setNickname}
            />
            <ConfirmButton title="댓글 입력" onClick={handleCreateComment} />
          </div>
        </TwoDiv>
      </Wrapper>
    </Container>
  );
};

export default CommentCreateCard;

const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Wrapper = styled.div`
  width: 100%;
  //   max-width: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  //   padding: 20px;
  box-sizing: border-box;
`;
