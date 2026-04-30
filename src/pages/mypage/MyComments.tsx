import React, { useCallback, useEffect, useRef } from "react";
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
import { useSearchParams } from "react-router-dom";

const MyComments = () => {
  const [searchParams] = useSearchParams();
  const { diary, setDiary, setCommentList } = useLoginStore();
  const { myCommentList, setMyCommentList } = useLoginStore();
  const { scrolls, setScroll } = useScrollStore();

  const scrollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const rawTab = searchParams.get("tab");

  useEffect(() => {
    getCommentsByUserApi()
      .then((res) => {
        setMyCommentList(res.data);
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (rawTab !== "mycomment") return;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.scrollTo(0, scrolls.myComment.y ?? 0);
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myCommentList?.length]);

  const handleWindowScroll = useCallback(() => {
    if (scrollTimer.current) {
      clearTimeout(scrollTimer.current);
    }

    scrollTimer.current = setTimeout(() => {
      setScroll("myComment", { x: window.scrollX, y: window.scrollY, page: 0 });
      console.log("posY" + window.scrollY);
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
          <CommentCardTwo
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
