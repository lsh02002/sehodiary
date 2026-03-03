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
  //   const navigator = useNavigate();
  //   const { setOpen, setDiary } = useLogin();

  //   const handleEditComment = (e: React.MouseEvent<SVGSVGElement>) => {
  //     e.stopPropagation();
  //     setDiary(diary);
  //     setOpen(true);
  //   };

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
          </TwoDiv>
        </InfoBoxField>
      </CardWrapper>
    </CardContainer>
  );
};

export default DiaryCard1;
