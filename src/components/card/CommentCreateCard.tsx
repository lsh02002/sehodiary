import React, { useState } from "react";
import styled from "styled-components";
import TextInput from "../form/TextInput";
import { TwoDiv } from "../form/TwoDiv";
import ConfirmButton from "../form/ConfirmButton";
import { CommentRequestType } from "../../types/type";
import { createCommentApi } from "../../api/sehodiary-api";
import { useLogin } from "../../context/LoginContext";
import QuillEditorInput from "../form/QuillEditorInput";

const CommentCreateCard = ({ diaryId }: { diaryId: number }) => {
  const { setDiary, setCommentList } = useLogin();
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
      .then((res) => {
        console.log(res);

        setCommentList((prev) => {
          if (prev === undefined) {
            return;
          }
          return [...prev, res.data];
        });

        setDiary((prev) => {
          if (prev === undefined) {
            return;
          }
          return {
            ...prev,
            commentsCount: prev.commentsCount + 1,
          };
        });

        setContent("");
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <Container>
      <Wrapper>
        <TwoDiv style={{ alignItems: "start" }}>
          <QuillEditorInput
            name="content"
            title="댓글 내용"
            data={content}
            setData={setContent}
            rows={2}
          />
          <DivBox>
            <TextInput
              disabled
              name="nickname"
              title="댓글 작성자"
              data={nickname}
              setData={setNickname}
            />
            <ConfirmButton title="댓글 입력" onClick={handleCreateComment} />
          </DivBox>
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

const DivBox = styled.div``;
