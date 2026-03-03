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

const DiaryCard1 = ({ diary }: { diary: DiaryResponseType | undefined }) => {
  const createdAt = `${new Date(diary?.createdAt ?? "").getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}-${String(new Date().getDate()).padStart(2, "0")}`;

  return (
    <CardContainer>
      <CardWrapper>
        <InfoBoxField>
          <TwoDiv>
            <IdField>#{diary?.id}</IdField>
            <NameField>{diary?.title}</NameField>
          </TwoDiv>
          <ContentField>내용: {diary?.content}</ContentField>
          <TwoDiv>
            <SlugField>작성자: {diary?.nickname}</SlugField>
            <div
              style={{ fontStyle: "italic", color: "gray", fontSize: "0.9rem" }}
            >
              {createdAt}
            </div>
          </TwoDiv>
        </InfoBoxField>
      </CardWrapper>
    </CardContainer>
  );
};

export default DiaryCard1;
