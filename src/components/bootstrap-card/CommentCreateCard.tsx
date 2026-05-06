import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import TextInput from "../bootstrap-form/TextInput";
import { TwoDiv } from "../bootstrap-form/TwoDiv";
import ConfirmButton from "../bootstrap-form/ConfirmButton";
import { CommentRequestType, CommentResponseType } from "../../types/type";
import { createCommentApi } from "../../api/sehodiary-api";
import QuillEditorInput from "../bootstrap-form/QuillEditorInput";
import { useLoginStore } from "../../zustand/ZustandLogin";
import { toast } from "react-toastify";

const CommentCreateCard = ({ diaryId }: { diaryId: number }) => {
  const queryClient = useQueryClient();

  const { setDiary } = useLoginStore();

  const nickname = localStorage.getItem("nickname") ?? "";
  const [content, setContent] = useState("");

  const createCommentMutation = useMutation({
    mutationFn: async (data: CommentRequestType) => {
      const res = await createCommentApi(data);
      return res.data;
    },

    onSuccess: (newComment: CommentResponseType) => {
      queryClient.setQueryData<CommentResponseType[]>(
        ["comments", diaryId],
        (prev = []) => [...prev, newComment],
      );

      queryClient.setQueryData<CommentResponseType[]>(
        ["myComments"],
        (prev = []) => [...prev, newComment],
      );

      setDiary((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          commentsCount: prev.commentsCount + 1,
        };
      });

      setContent("");
      toast.success("댓글 등록이 되었습니다.");
    },
  });

  const handleCreateComment = () => {
    createCommentMutation.mutate({
      diaryId,
      content,
    });
  };

  return (
    <div className="w-100 d-flex justify-content-center align-items-center">
      <div className="w-100 d-flex justify-content-center align-items-center flex-column box-sizing-border-box">
        <div className="card border-0 shadow-sm w-100">
          <div className="card-body p-3">
            <TwoDiv style={{ alignItems: "start" }}>
              <QuillEditorInput
                name="content"
                title="댓글 내용"
                data={content}
                setData={setContent}
                rows={2}
              />

              <div>
                <TextInput
                  disabled
                  name="nickname"
                  title="댓글 작성자"
                  data={nickname}
                  setData={() => {}}
                />

                <ConfirmButton
                  title="댓글 입력"
                  onClick={handleCreateComment}
                  disabled={createCommentMutation.isPending}
                />
              </div>
            </TwoDiv>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(CommentCreateCard);

