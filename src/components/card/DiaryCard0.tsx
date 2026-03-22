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
  getLikingNicknameByDiaryApi,
  insertLikeApi,
  isLikedApi,
} from "../../api/sehodiary-api";
import styled from "styled-components";
import ImageCard from "./ImageCard";
import { IoPersonOutline } from "react-icons/io5";
import DOMPurify from "dompurify";

const DiaryCard0 = ({ diary0 }: { diary0: DiaryResponseType | undefined }) => {
  const navigator = useNavigate();
  const { isLogin, setOpen, setDiary } = useLogin();
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(-1);
  const [isMouseOverOnce, setIsMouseOverOnce] = useState(false);
  const [nicknameList, setNicknameList] = useState([]);
  const createdAt = `${new Date(diary0?.createdAt ?? "").getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}-${String(new Date().getDate()).padStart(2, "0")}`;

  useEffect(() => {
    setLikesCount(diary0?.likesCount ?? -1);

    if (isLogin) {
      isLikedApi(diary0?.id ?? -1)
        .then((res) => {
          setIsLiked(res.data);
        })
        .catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [diary0?.id]);

  useEffect(() => {
    if (isMouseOverOnce) {
      getLikingNicknameByDiaryApi(diary0?.id ?? -1)
        .then((res) => {
          setNicknameList(res.data);
        })
        .catch(() => {});
    }
  }, [diary0?.id, isMouseOverOnce, likesCount]);

  const handleLikeClick = () => {
    if (isLogin) {
      if (isLiked) {
        deleteLikeApi(diary0?.id ?? -1)
          .then((res) => {
            setIsLiked(res.data);
            setLikesCount(likesCount - 1);
          })
          .catch(() => {});
      } else {
        insertLikeApi(diary0?.id ?? -1)
          .then((res) => {
            setIsLiked(res.data);
            setLikesCount(likesCount + 1);
          })
          .catch(() => {});
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
          <ContentField
            onClick={() => navigator(`/edit/${diary0?.id}`)}
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(diary0?.content ?? ""),
            }}
          />
          <ContentField>
            {diary0?.imageResponses?.map((image) => (
              <ImageCard
                key={image?.id}
                imageUrl={image?.fileUrl}
                diary={diary0}
              />
            ))}
          </ContentField>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            {diary0?.profileImage ? (
              <img
                width="40px"
                height="40px"
                src={diary0?.profileImage}
                alt="그림"
              />
            ) : (
              <IoPersonOutline
                style={{ width: "40px", height: "40px", marginRight: "5px" }}
              />
            )}
            <SlugField>작성자: {diary0?.nickname}</SlugField>
            <div
              style={{
                display: "flex",
                justifyContent: "end",
                alignItems: "center",
                width: "120%",
              }}
            >
              <EmojiField>{diary0?.emoji}</EmojiField>
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
              <div
                onMouseOver={() => setIsMouseOverOnce(true)}
                onMouseLeave={() => setIsMouseOverOnce(false)}
                onClick={handleLikeClick}
              >
                {isLiked ? <AiFillLike /> : <AiOutlineLike />}
              </div>
              <div
                style={{
                  fontStyle: "italic",
                  color: "gray",
                  marginRight: "10px",
                  position: "relative",
                }}
              >
                {likesCount}
                {isMouseOverOnce && nicknameList.length > 0 && (
                  <NicknameListBox
                    onMouseOver={() => setIsMouseOverOnce(true)}
                    onMouseLeave={() => setIsMouseOverOnce(false)}
                  >
                    {nicknameList?.map((list) => (
                      <div>{list}</div>
                    ))}
                  </NicknameListBox>
                )}
              </div>
              <div style={{ fontStyle: "italic", color: "gray" }}>
                {createdAt}
              </div>
            </div>
          </div>
        </InfoBoxField>
      </CardWrapper>
    </CardContainer>
  );
};

export default DiaryCard0;

const NicknameListBox = styled.div`
  border: 1px solid black;
  position: absolute;
  background-color: white;
  padding: 10px;
  left: -15px;
  top: 25px;
`;

const EmojiField = styled.div``;
