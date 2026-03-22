import React from "react";
import { CommentResponseType } from "../../types/type";
import { TwoDiv } from "../bootstrap-form/TwoDiv";
import { IoPersonOutline } from "react-icons/io5";
import DOMPurify from "dompurify";

const CommentCard1 = ({ comment }: { comment: CommentResponseType }) => {
  const createdAt = `${new Date(comment?.createdAt).getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}-${String(new Date().getDate()).padStart(2, "0")}`;

  return (
    <div className="card border-0 shadow-sm mb-3">
      <div className="card-body p-3">
        <div className="d-flex flex-column justify-content-center">
          <div className="d-flex justify-content-start align-items-center gap-2 mb-2">
            <div className="text-primary me-1">#{comment?.commentId}</div>
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(comment?.content ?? ""),
              }}
            />
          </div>
          <div className="fst-italic text-secondary ps-1 mb-2">
            글아이디: {comment?.diaryId}
          </div>
          <TwoDiv>
            <div className="fst-italic text-secondary d-flex align-items-center gap-2">
              {comment?.profileImage ? (
                <img
                  width="40px"
                  height="40px"
                  src={comment?.profileImage}
                  alt="그림"
                  className="rounded-circle"
                />
              ) : (
                <IoPersonOutline style={{ marginRight: "5px" }} />
              )}
              작성자: {comment?.nickname}
            </div>
            <div className="fst-italic text-secondary">{createdAt}</div>
          </TwoDiv>
        </div>
      </div>
    </div>
  );
};

export default CommentCard1;
