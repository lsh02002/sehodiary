import React, { useEffect } from "react";
import { useLogin } from "../../context/LoginContext";
import DiaryCard1 from "../../components/bootstrap-card/DiaryCard1";
import CommentCreateCard from "../../components/bootstrap-card/CommentCreateCard";
import { getCommentsByDiaryApi } from "../../api/sehodiary-api";
import { CommentResponseType } from "../../types/type";
import CommentCard0 from "../../components/bootstrap-card/CommentCard0";

const CommentPage = () => {
  const { diary } = useLogin();
  const { commentList, setCommentList } = useLogin();

  useEffect(() => {
    if (diary?.id) {
      getCommentsByDiaryApi(diary?.id ?? -1)
        .then((res) => {
          setCommentList(res.data);
        })
        .catch(() => {});
    }
  }, [diary?.id, setCommentList]);

  return (
    <div className="px-2">
      <DiaryCard1 diary={diary} />

      <div
        className="overflow-auto border-top"
        style={{
          marginBottom: "100px",
          height: "calc(100vh - 560px)",
        }}
      >
        <CommentCreateCard diaryId={diary?.id ?? -1} />

        {commentList && commentList.length > 0 ? (
          commentList.map((comment: CommentResponseType) => (
            <CommentCard0 key={comment?.commentId} comment={comment} />
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
