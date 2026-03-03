import React from "react";
import { DiaryResponseType } from "../../types/type";
import {
  CardContainer,
  CardWrapper,
  ContentField,
  IdField,
  InfoBoxField,
  NameField,
  SlugField,
} from "./field/Field";
import { TwoDiv } from "../form/TwoDiv";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../../context/LoginContext";
import { FaRegCommentDots } from "react-icons/fa";

const DiaryCard0 = ({ diary }: { diary: DiaryResponseType | undefined }) => {
  const navigator = useNavigate();
  const { setOpen, setDiary } = useLogin();
  const createdAt = `${new Date(diary?.createdAt ?? "").getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}-${String(new Date().getDate()).padStart(2, "0")}`;

  const handleEditComment = (e: React.MouseEvent<SVGSVGElement>) => {
    e.stopPropagation();
    setDiary(diary);
    setOpen(true);
  };

  return (
    <CardContainer>
      <CardWrapper>
        <InfoBoxField>
          <TwoDiv onClick={() => navigator(`/edit/${diary?.id}`)}>
            <IdField>#{diary?.id}</IdField>
            <NameField>{diary?.title}</NameField>
          </TwoDiv>
          <ContentField onClick={() => navigator(`/edit/${diary?.id}`)}>
            내용: {diary?.content}
          </ContentField>
          <TwoDiv>
            <SlugField>작성자: {diary?.nickname}</SlugField>
            <div style={{ display: "flex", alignItems: "center" }}>
              <FaRegCommentDots onClick={handleEditComment} />
              <div style={{ fontStyle: "italic", color: "gray", marginRight: "10px" }}>
                ({diary?.commentsCount})
              </div>
              <div style={{ fontStyle: "italic", color: "gray" }}>
                {createdAt}
              </div>
            </div>
          </TwoDiv>
        </InfoBoxField>
      </CardWrapper>
    </CardContainer>
  );
};

export default DiaryCard0;
