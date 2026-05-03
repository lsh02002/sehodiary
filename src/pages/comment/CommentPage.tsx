import React from "react";
import DiaryCard1 from "../../components/bootstrap-card/DiaryCardTwo";
import CommentCreateCard from "../../components/bootstrap-card/CommentCreateCard";
import {
  getCommentsByDiaryApi,
  putCommentByIdApi,
  showToast,
} from "../../api/sehodiary-api";
import { CommentRequestType, CommentResponseType } from "../../types/type";
import CommentCardOne from "../../components/bootstrap-card/CommentCardOne";
import { useLoginStore } from "../../zustand/ZustandLogin";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const CommentPage = () => {
  const queryClient = useQueryClient();

  const { diary } = useLoginStore();
  const { setMyCommentList } = useLoginStore();

  const diaryId = diary?.id ?? -1;

  const { data: commentList = [] } = useQuery<CommentResponseType[]>({
    queryKey: ["comments", diaryId],
    queryFn: async () => {
      const res = await getCommentsByDiaryApi(diaryId);
      return res.data;
    },
    enabled: !!diary?.id,
  });

  const editCommentMutation = useMutation({
    mutationFn: async ({
      commentId,
      content,
    }: {
      commentId: number;
      content: string;
    }) => {
      const data: CommentRequestType = {
        diaryId,
        content,
      };

      return putCommentByIdApi(commentId, data);
    },

    onSuccess: (_, variables) => {
      const { commentId, content } = variables;

      queryClient.setQueryData<CommentResponseType[]>(
        ["comments", diaryId],
        (prev) =>
          prev?.map((comment) =>
            comment.commentId === commentId
              ? { ...comment, content }
              : comment,
          ) ?? [],
      );

      setMyCommentList((prev) =>
        prev?.map((comment: CommentResponseType) =>
          comment.commentId === commentId
            ? { ...comment, content }
            : comment,
        ),
      );

      showToast("댓글 수정이 되었습니다.", "success");
    },
  });

  const handleEditSave = async (commentId: number, content: string) => {
    editCommentMutation.mutate({ commentId, content });
  };

  return (
    <div className="px-2">
      <div
        className="overflow-auto"
        style={{
          paddingBottom: "200px",
          height: "calc(100vh - 250px)",
        }}
      >
        <DiaryCard1 diary={diary} />
        <CommentCreateCard diaryId={diaryId} />

        {commentList.length > 0 ? (
          commentList.map((comment) => (
            <CommentCardOne
              key={comment.commentId}
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
