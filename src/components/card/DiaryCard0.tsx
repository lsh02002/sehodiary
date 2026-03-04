import React, { useEffect, useState } from "react";
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
import { AiOutlineLike } from "react-icons/ai";
import { AiFillLike } from "react-icons/ai";
import {
  deleteLikeApi,
  insertLikeApi,
  isLikedApi,
} from "../../api/sehodiary-api";

const DiaryCard0 = ({ diary0 }: { diary0: DiaryResponseType | undefined }) => {
  const navigator = useNavigate();
  const { isLogin, setOpen, setDiary } = useLogin();
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(-1);
  const createdAt = `${new Date(diary0?.createdAt ?? "").getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}-${String(new Date().getDate()).padStart(2, "0")}`;

  useEffect(() => {
    setLikesCount(diary0?.likesCount ?? -1);

    if (isLogin) {
      isLikedApi(diary0?.id ?? -1)
        .then((res) => {
          console.log(res);
          setIsLiked(res.data);
        })
        .catch((err) => {
          console.error(err);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [diary0?.id]);

  const handleLikeClick = () => {
    if (isLogin) {
      if (isLiked) {
        deleteLikeApi(diary0?.id ?? -1)
          .then((res) => {
            console.log(res);
            setIsLiked(res.data);
            setLikesCount(likesCount - 1);
          })
          .catch((err) => {
            console.error(err);
          });
      } else {
        insertLikeApi(diary0?.id ?? -1)
          .then((res) => {
            console.log(res);
            setIsLiked(res.data);
            setLikesCount(likesCount + 1);
          })
          .catch((err) => {
            console.error(err);
          });
      }
    }
  };

  const handleEditComment = (e: React.MouseEvent<SVGSVGElement>) => {
    e.stopPropagation();

    setDiary(() => {
      if (!diary0) return diary0; // diary0가 undefined일 가능성이 있으면
      return {
        ...diary0,
        isLiked,
        likesCount,
      };
    });

    setOpen(true);
  };

  return (
    <CardContainer>
      <CardWrapper>
        <InfoBoxField>
          <TwoDiv onClick={() => navigator(`/edit/${diary0?.id}`)}>
            <IdField>#{diary0?.id}</IdField>
            <NameField>{diary0?.title}</NameField>
          </TwoDiv>
          <ContentField onClick={() => navigator(`/edit/${diary0?.id}`)}>
            내용: {diary0?.content}
          </ContentField>
          <TwoDiv>
            <SlugField>작성자: {diary0?.nickname}</SlugField>
            <div style={{ display: "flex", alignItems: "center" }}>
              <FaRegCommentDots onClick={handleEditComment} />
              <div
                style={{
                  fontStyle: "italic",
                  color: "gray",
                  marginRight: "10px",
                }}
              >
                ({diary0?.commentsCount})
              </div>
              <div onClick={handleLikeClick}>
                {isLiked ? <AiFillLike /> : <AiOutlineLike />}
              </div>
              <div
                style={{
                  fontStyle: "italic",
                  color: "gray",
                  marginRight: "10px",
                }}
              >
                {likesCount}
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
