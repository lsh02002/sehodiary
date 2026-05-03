import React, { useCallback, useEffect, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteCommentByIdApi,
  getCommentsByUserApi,
  putCommentByIdApi,
  showToast,
} from "../../api/sehodiary-api";
import { CommentRequestType, CommentResponseType } from "../../types/type";
import CommentCardTwo from "../../components/bootstrap-card/CommentCardTwo";
import { useLoginStore } from "../../zustand/ZustandLogin";
import { useScrollStore } from "../../zustand/ZustandScroll";

const MyComments = () => {
  const queryClient = useQueryClient();

  const { diary, setDiary } = useLoginStore();
  const { scrolls, setScroll } = useScrollStore();

  const scrollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data: myCommentList = [] } = useQuery<CommentResponseType[]>({
    queryKey: ["myComments"],
    queryFn: async () => {
      const res = await getCommentsByUserApi();
      return res.data;
    },
  });

  useEffect(() => {
    if (myCommentList.length === 0) return;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.scrollTo(0, scrolls.myComment.y ?? 0);
      });
    });
  }, [myCommentList.length, scrolls.myComment.y]);

  const handleWindowScroll = useCallback(() => {
    if (scrollTimer.current) {
      clearTimeout(scrollTimer.current);
    }

    scrollTimer.current = setTimeout(() => {
      setScroll("myComment", {
        x: window.scrollX,
        y: window.scrollY,
        page: 0,
      });
    }, 150);
  }, [setScroll]);

  useEffect(() => {
    window.addEventListener("scroll", handleWindowScroll);

    return () => {
      window.removeEventListener("scroll", handleWindowScroll);

      if (scrollTimer.current) {
        clearTimeout(scrollTimer.current);
        scrollTimer.current = null;
      }
    };
  }, [handleWindowScroll]);

  const editCommentMutation = useMutation({
    mutationFn: async ({
      commentId,
      content,
    }: {
      commentId: number;
      content: string;
    }) => {
      const data: CommentRequestType = {
        diaryId: diary?.id ?? -1,
        content,
      };

      return putCommentByIdApi(commentId, data);
    },

    onSuccess: (_, variables) => {
      const { commentId, content } = variables;

      queryClient.setQueryData<CommentResponseType[]>(
        ["myComments"],
        (prev) =>
          prev?.map((comment) =>
            comment.commentId === commentId
              ? { ...comment, content }
              : comment,
          ) ?? [],
      );

      if (diary?.id) {
        queryClient.setQueryData<CommentResponseType[]>(
          ["comments", diary.id],
          (prev) =>
            prev?.map((comment) =>
              comment.commentId === commentId
                ? { ...comment, content }
                : comment,
            ) ?? [],
        );
      }

      showToast("댓글 수정이 되었습니다.", "success");
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId: number) => {
      await deleteCommentByIdApi(commentId);
      return commentId;
    },

    onSuccess: (commentId) => {
      queryClient.setQueryData<CommentResponseType[]>(
        ["myComments"],
        (prev) => prev?.filter((comment) => comment.commentId !== commentId) ?? [],
      );

      if (diary?.id) {
        queryClient.setQueryData<CommentResponseType[]>(
          ["comments", diary.id],
          (prev) =>
            prev?.filter((comment) => comment.commentId !== commentId) ?? [],
        );
      }

      setDiary((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          commentsCount: Math.max(0, prev.commentsCount - 1),
        };
      });

      showToast("댓글 삭제가 되었습니다.", "success");
    },
  });

  const handleEditSave = async (commentId: number, content: string) => {
    editCommentMutation.mutate({ commentId, content });
  };

  const handleRemoveSave = async (commentId: number) => {
    if (!window.confirm("해당 댓글을 삭제하시겠습니까?")) return;

    deleteCommentMutation.mutate(commentId);
  };

  return (
    <>
      <h4 style={{ marginBottom: "20px" }}>
        내가쓴댓글({myCommentList.length})
      </h4>

      {myCommentList.length > 0 ? (
        myCommentList.map((comment) => (
          <CommentCardTwo
            key={comment.commentId}
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