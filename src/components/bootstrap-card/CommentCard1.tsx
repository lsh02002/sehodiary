import React, { useState } from "react";
import { CommentRequestType, CommentResponseType } from "../../types/type";
import { TwoDiv } from "../bootstrap-form/TwoDiv";
import { IoPersonOutline } from "react-icons/io5";
import DOMPurify from "dompurify";
import { putCommentByIdApi, showToast } from "../../api/sehodiary-api";
import QuillEditorInput from "../bootstrap-form/QuillEditorInput";

const CommentCard1 = ({
  comment,
  handleRemoveSave,
}: {
  comment: CommentResponseType;
  handleRemoveSave: (c: number) => void;
}) => {
  const isEditing = comment?.nickname === localStorage.getItem("nickname");
  const [content, setContent] = useState(comment?.content ?? "");

  const date = new Date(comment?.createdAt);
  const createdAt = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

  const handleEditSave = async () => {
    const data: CommentRequestType = {
      diaryId: comment?.diaryId,
      content,
    };

    putCommentByIdApi(comment?.commentId, data)
      .then((res) => {
        showToast("댓글 수정이 되었습니다.", "success");
      })
      .catch(() => {});
  };

  return (
    <div className="card border-0 shadow-sm mb-3">
      <div className="card-body p-3">
        <div className="d-flex flex-column justify-content-center">
          <div className="d-flex justify-content-start align-items-start gap-2 mb-2">
            {comment?.profileImage ? (
              <img
                width="28"
                height="28"
                src={comment.profileImage}
                alt="프로필"
                className="rounded-circle"
              />
            ) : (
              <IoPersonOutline
                style={{ marginRight: "5px", marginTop: "4px" }}
              />
            )}
            <div className="w-100">
              {isEditing ? (
                <div className="w-100">
                  <QuillEditorInput
                    name="content"
                    title="내용"
                    data={content}
                    setData={setContent}
                    rows={1}
                  />
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={handleEditSave}
                    >
                      수정
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleRemoveSave(comment?.commentId)}
                    >
                      삭제
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(comment?.content ?? ""),
                  }}
                />
              )}
            </div>
          </div>

          <div className="text-secondary">글 아이디: {comment?.diaryId}</div>
          <TwoDiv>
            <div className="fst-italic text-secondary">
              작성자: {comment?.nickname}
            </div>
            <div className="d-flex align-items-center gap-2">
              <div className="fst-italic text-secondary">{createdAt}</div>
            </div>
          </TwoDiv>
        </div>
      </div>
    </div>
  );
};

export default CommentCard1;
