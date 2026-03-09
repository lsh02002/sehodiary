import React from "react";
import { ActivityLogResponseType } from "../../types/type";
import {
  CardContainer,
  CardWrapper,
  ContentField,
  InfoBoxField,
  SlugField,
} from "./field/Field";

const ActivityLogCard = ({ log }: { log: ActivityLogResponseType }) => {
  return (
    <CardContainer>
      <CardWrapper>
        <InfoBoxField>
          <ContentField>{log?.message}</ContentField>
          <SlugField style={{width: "100%"}}>{log?.createdAt}</SlugField>
        </InfoBoxField>
      </CardWrapper>
    </CardContainer>
  );
};

export default ActivityLogCard;
