import React, { useEffect, useLayoutEffect } from "react";
import {
  deleteCommentByIdApi,
  getCommentsByUserApi,
  putCommentByIdApi,
  showToast,
} from "../../api/sehodiary-api";
import { CommentRequestType, CommentResponseType } from "../../types/type";
import CommentCard1 from "../../components/bootstrap-card/CommentCard1";
import { useLogin } from "../../recoil/RecoilLogin";
import { useScroll } from "../../recoil/RecoilScroll";

const MyComments = () => {
  const { diary, setDiary, setCommentList } = useLogin();
  const { myCommentList, setMyCommentList } = useLogin();
  const { scrolls } = useScroll();

  useEffect(() => {
    getCommentsByUserApi()
      .then((res) => {
        setMyCommentList(res.data);
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useLayoutEffect(() => {
    const raf = requestAnimationFrame(() => {
      window.scrollTo({
        left: scrolls.myComment.x,
        top: scrolls.myComment.y,
        behavior: "auto",
      });
    });

    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEditSave = async (commentId: number, content: string) => {
    const data: CommentRequestType = {
      diaryId: diary?.id ?? -1,
      content,
    };

    putCommentByIdApi(commentId, data)
      .then((res) => {
        setCommentList((prev) =>
          prev?.map((comment: CommentResponseType) =>
            comment.commentId === commentId ? { ...comment, content } : comment,
          ),
        );

        setMyCommentList((prev) =>
          prev?.map((comment: CommentResponseType) =>
            comment.commentId === commentId ? { ...comment, content } : comment,
          ),
        );

        showToast("댓글 수정이 되었습니다.", "success");
      })
      .catch(() => {});
  };

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

        setMyCommentList((prev) => {
          if (!prev) return;
          return prev?.filter(
            (comment: CommentResponseType) => comment?.commentId !== commentId,
          );
        });

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
            handleEditSave={handleEditSave}
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
