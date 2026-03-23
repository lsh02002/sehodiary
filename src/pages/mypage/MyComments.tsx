import React, { useEffect, useState } from "react";
import {
  deleteCommentByIdApi,
  getCommentsByUserApi,
  showToast,
} from "../../api/sehodiary-api";
import { CommentResponseType } from "../../types/type";
import CommentCard1 from "../../components/bootstrap-card/CommentCard1";
import { useLogin } from "../../context/LoginContext";

const MyComments = () => {
  const { diary, setDiary, setCommentList } = useLogin();
  const [myCommentList, setMyCommentList] = useState([]);

  useEffect(() => {
    getCommentsByUserApi()
      .then((res) => {
        setMyCommentList(res.data);
      })
      .catch(() => {});
  }, [diary]);

  const handleRemoveSave = async (commentId: number) => {
    if (!window.confirm("해당 댓글을 삭제하시겠습니까?")) {
      return;
    }

    deleteCommentByIdApi(commentId)
      .then(() => {
        setCommentList((prev) =>
          prev?.filter(
            (comment: CommentResponseType) => comment?.commentId !== commentId,
          ),
        );

        setMyCommentList((prev) =>
          prev.filter(
            (comment: CommentResponseType) => comment?.commentId !== commentId,
          ),
        );

        // 댓글 개수 감소
        setDiary((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            commentsCount: Math.max(0, prev.commentsCount - 1),
          };
        });

        showToast("댓글 삭제가 되었습니다.", "success");
      })
      .catch(() => {});
  };

  return (
    <>
      <h4 style={{ marginBottom: "20px" }}>
        내가쓴댓글({myCommentList?.length})
      </h4>
      {myCommentList && myCommentList?.length > 0 ? (
        myCommentList?.map((comment: CommentResponseType) => (
          <CommentCard1
            key={comment?.commentId}
            comment={comment}
            handleRemoveSave={handleRemoveSave}
          />
        ))
      ) : (
        <div>해당 댓글이 없습니다!</div>
      )}
    </>
  );
};

export default MyComments;
