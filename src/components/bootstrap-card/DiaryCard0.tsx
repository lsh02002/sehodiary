import React, { useEffect, useState } from "react";
import { DiaryResponseType } from "../../types/type";
import { TwoDiv } from "../bootstrap-form/TwoDiv";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../../context/LoginContext";
import { FaRegCommentDots } from "react-icons/fa";
import { AiOutlineLike } from "react-icons/ai";
import { AiFillLike } from "react-icons/ai";
import {
  deleteLikeApi,
  getLikingNicknameByDiaryApi,
  insertLikeApi,
} from "../../api/sehodiary-api";
import ImageCard from "./ImageCard";
import { IoPersonOutline } from "react-icons/io5";
import DOMPurify from "dompurify";

const DiaryCard0 = ({
  diary0,
  now,
}: {
  diary0: DiaryResponseType | undefined;
  now: number;
}) => {
  const navigator = useNavigate();
  const { isLogin, setOpen, setDiary } = useLogin();
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(-1);
  const [isMouseOverOnce, setIsMouseOverOnce] = useState(false);
  const [nicknameList, setNicknameList] = useState<string[]>([]);
  const date = `${new Date(diary0?.date ?? "").getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}-${String(new Date().getDate()).padStart(2, "0")}`;

  const updatedAt = diary0?.updatedAt;
  const createdAt = diary0?.createdAt;
  const updatedTime = updatedAt ? new Date(updatedAt).getTime() : 0;
  const isRecentlyUpdated =
    updatedTime > now - 60 * 60 * 1000 && createdAt !== updatedAt;

  useEffect(() => {
    setLikesCount(diary0?.likesCount ?? -1);
    setIsLiked(diary0?.isLiked ?? false);
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
      if (!diary0) return diary0;
      return {
        ...diary0,
        isLiked,
        likesCount,
      };
    });

    setOpen(true);
  };

  return (
    <div className="card border-0 shadow-sm mb-3">
      <div className="card-body p-3">
        <div className="w-100 d-flex flex-column gap-3">
          <TwoDiv
            onClick={() => navigator(`/edit/${diary0?.id}`)}
            style={{ cursor: "pointer" }}
          >
            <div className="text-primary fw-semibold flex-shrink-0">
              #{diary0?.id}
              {isRecentlyUpdated && (
                <span className="badge text-bg-warning ms-3">
                  수정됨(1시간내)
                </span>
              )}
            </div>
            <div className="fw-semibold text-body text-end flex-grow-1">
              {diary0?.title}
            </div>
          </TwoDiv>
          <div
            className="text-body"
            onClick={() => navigator(`/edit/${diary0?.id}`)}
            style={{ cursor: "pointer" }}
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(diary0?.content ?? ""),
            }}
          />
          <div className="d-flex flex-column gap-2">
            {diary0?.imageResponses?.map((image) => (
              <ImageCard
                key={image?.id}
                imageUrl={image?.fileUrl}
                diary={diary0}
              />
            ))}
          </div>
          <div className="d-flex justify-content-between align-items-center w-100 flex-wrap gap-2 mt-2">
            <div className="d-flex align-items-center gap-2">
              {diary0?.profileImage ? (
                <img
                  width="40px"
                  height="40px"
                  src={diary0?.profileImage}
                  alt="그림"
                  className="rounded-circle"
                />
              ) : (
                <IoPersonOutline
                  style={{ width: "40px", height: "40px", marginRight: "5px" }}
                />
              )}
              <div className="fst-italic text-secondary small">
                작성자: {diary0?.nickname}
              </div>
            </div>
            <div className="d-flex justify-content-end align-items-center flex-wrap gap-2 ms-auto position-relative">
              <div>{diary0?.emoji}</div>
              <FaRegCommentDots
                onClick={handleEditComment}
                style={{ cursor: "pointer" }}
              />
              <div className="fst-italic text-secondary me-2">
                ({diary0?.commentsCount})
              </div>
              <div
                onMouseOver={() => setIsMouseOverOnce(true)}
                onMouseLeave={() => setIsMouseOverOnce(false)}
                onClick={handleLikeClick}
                style={{ cursor: "pointer" }}
              >
                {isLiked ? <AiFillLike /> : <AiOutlineLike />}
              </div>
              <div className="fst-italic text-secondary me-2 position-relative">
                {likesCount}
                {isMouseOverOnce && nicknameList.length > 0 && (
                  <div
                    className="position-absolute bg-white border rounded shadow-sm p-2"
                    style={{ left: -15, top: 25, zIndex: 10, minWidth: 120 }}
                    onMouseOver={() => setIsMouseOverOnce(true)}
                    onMouseLeave={() => setIsMouseOverOnce(false)}
                  >
                    {nicknameList?.map((list) => (
                      <div key={list}>{list}</div>
                    ))}
                  </div>
                )}
              </div>
              <div className="fst-italic text-secondary small">{date}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(DiaryCard0);
