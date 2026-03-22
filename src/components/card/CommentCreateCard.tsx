import React, { useState } from "react";
import TextInput from "../form/TextInput";
import { TwoDiv } from "../form/TwoDiv";
import ConfirmButton from "../form/ConfirmButton";
import { CommentRequestType } from "../../types/type";
import { createCommentApi } from "../../api/sehodiary-api";
import { useLogin } from "../../context/LoginContext";
import QuillEditorInput from "../form/QuillEditorInput";

const CommentCreateCard = ({ diaryId }: { diaryId: number }) => {
  const { setDiary, setCommentList } = useLogin();
  const [nickname, setNickname] = useState(
    localStorage.getItem("nickname") ?? "",
  );
  const [content, setContent] = useState("");

  const handleCreateComment = () => {
    const data: CommentRequestType = {
      diaryId,
      content,
    };

    createCommentApi(data)
      .then((res) => {
        setCommentList((prev) => {
          if (prev === undefined) {
            return;
          }
          return [...prev, res.data];
        });

        setDiary((prev) => {
          if (prev === undefined) {
            return;
          }
          return {
            ...prev,
            commentsCount: prev.commentsCount + 1,
          };
        });

        setContent("");
      })
      .catch(() => {});
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
                  setData={setNickname}
                />
                <ConfirmButton title="댓글 입력" onClick={handleCreateComment} />
              </div>
            </TwoDiv>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentCreateCard;
