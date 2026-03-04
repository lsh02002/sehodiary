import React, { useEffect } from "react";
import { useLogin } from "../../context/LoginContext";
import styled from "styled-components";
import DiaryCard1 from "../../components/card/DiaryCard1";
import CommentCreateCard from "../../components/card/CommentCreateCard";
import { getCommentsByDiaryApi } from "../../api/sehodiary-api";
import { CommentResponseType } from "../../types/type";
import CommentCard from "../../components/card/CommentCard";

const CommentPage = () => {
  const { diary } = useLogin();
  const { commentList, setCommentList } = useLogin();

  useEffect(() => {
    getCommentsByDiaryApi(diary?.id ?? -1)
      .then((res) => {
        console.log(res);
        setCommentList(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [diary?.id, setCommentList]);

  return (
    <PageContainer>
      <DiaryCard1 diary={diary} />
      <Wrapper>
        <CommentCreateCard diaryId={diary?.id ?? -1} />
        {commentList && commentList.length > 0 ? (
          commentList.map((comment: CommentResponseType) => (
            <CommentCard key={comment?.commentId} comment={comment} />
          ))
        ) : (
          <div>해당 댓글이 없습니다!</div>
        )}
      </Wrapper>
    </PageContainer>
  );
};

export default CommentPage;

const PageContainer = styled.div`
  padding: 0 10px;
`;

const Wrapper = styled.div`
  overflow-y: auto;
  height: calc(100vh - 460px);
  border-top: 1px solid #e5e7eb;
`;
