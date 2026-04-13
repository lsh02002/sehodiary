import React, { useEffect } from "react";
import { useLogin } from "../../context/LoginContext";
import DiaryCard1 from "../../components/bootstrap-card/DiaryCard1";
import CommentCreateCard from "../../components/bootstrap-card/CommentCreateCard";
import {
  getCommentsByDiaryApi,
  putCommentByIdApi,
  showToast,
} from "../../api/sehodiary-api";
import { CommentRequestType, CommentResponseType } from "../../types/type";
import CommentCard0 from "../../components/bootstrap-card/CommentCard0";

const CommentPage = () => {
  const { diary } = useLogin();
  const { commentList, setCommentList } = useLogin();
  const { setMyCommentList } = useLogin();

  useEffect(() => {
    if (diary?.id) {
      getCommentsByDiaryApi(diary?.id ?? -1)
        .then((res) => {
          setCommentList(res.data);
        })
        .catch(() => {});
    }
  }, [diary?.id, setCommentList]);

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

  return (
    <div className="px-2">
      <div
        className="overflow-auto border-top"
        style={{
          paddingBottom: "130px",
          height: "calc(100vh - 150px)",
        }}
      >
        <DiaryCard1 diary={diary} />
        <CommentCreateCard diaryId={diary?.id ?? -1} />

        {commentList && commentList.length > 0 ? (
          commentList.map((comment: CommentResponseType) => (
            <CommentCard0
              key={comment?.commentId}
              comment={comment}
              handleEditSave={handleEditSave}
            />
          ))
        ) : (
          <div className="text-center py-3 text-secondary">
            해당 댓글이 없습니다!
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentPage;
