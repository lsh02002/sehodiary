import React from "react";
import { DiaryResponseType } from "../../types/type";
import { TwoDiv } from "../bootstrap-form/TwoDiv";
import DOMPurify from "dompurify";

const DiaryCard1 = ({ diary }: { diary: DiaryResponseType | undefined }) => {
  const createdAt = `${new Date(diary?.createdAt ?? "").getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}-${String(new Date().getDate()).padStart(2, "0")}`;

  return (
    <div className="card border-0 shadow-sm mb-3">
      <div className="card-body p-3">
        <div className="w-100 d-flex flex-column gap-3">
          <TwoDiv>
            <div className="text-primary fw-semibold flex-shrink-0">
              #{diary?.id}
            </div>
            <div className="fw-semibold text-body text-end flex-grow-1">
              {diary?.title}
            </div>
          </TwoDiv>
          <div
            className="text-body"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(diary?.content ?? ""),
            }}
          />
          <TwoDiv>
            <div className="fst-italic text-secondary small">
              작성자: {diary?.nickname}
            </div>
            <div className="fst-italic text-secondary small">{createdAt}</div>
          </TwoDiv>
        </div>
      </div>
    </div>
  );
};

export default DiaryCard1;
