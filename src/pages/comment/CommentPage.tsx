import React, { useEffect } from "react";
import { useLogin } from "../../recoil/RecoilLogin";
import DiaryCard1 from "../../components/bootstrap-card/DiaryCardTwo";
import CommentCreateCard from "../../components/bootstrap-card/CommentCreateCard";
import {
  getCommentsByDiaryApi,
  putCommentByIdApi,
  showToast,
} from "../../api/sehodiary-api";
import { CommentRequestType, CommentResponseType } from "../../types/type";
import CommentCardOne from "../../components/bootstrap-card/CommentCardOne";

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
        className="overflow-auto"
        style={{
          paddingBottom: "100px",
          height: "calc(100vh - 250px)",
        }}
      >
        <DiaryCard1 diary={diary} />
        <CommentCreateCard diaryId={diary?.id ?? -1} />

        {commentList && commentList.length > 0 ? (
          commentList.map((comment: CommentResponseType) => (
            <CommentCardOne
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
