import React, { useEffect, useState } from "react";
import styled from "styled-components";
import TextInput from "../../components/form/TextInput";
import TextAreaInput from "../../components/form/TextAreaInput";
import ConfirmButton from "../../components/form/ConfirmButton";
import { TwoDiv } from "../../components/form/TwoDiv";
import {
  deleteLikeApi,
  editDiaryApi,
  getLikingNicknameByDiaryApi,
  getOneDiaryApi,
  insertLikeApi,
  isLikedApi,
} from "../../api/sehodiary-api";
import SelectInput, { Option } from "../../components/form/SelectInput";
import { DiaryRequestType, DiaryResponseType, ImageResponseType } from "../../types/type";
import { useParams } from "react-router-dom";
import { FaRegCommentDots } from "react-icons/fa6";
import { useLogin } from "../../context/LoginContext";
import { AiOutlineLike } from "react-icons/ai";
import { AiFillLike } from "react-icons/ai";
import { toast } from "react-toastify";
import CheckboxInput from "../../components/form/CheckboxInput";
import ImageInput from "../../components/form/ImageInput";

const DiaryEditPage = () => {
  const { diaryId } = useParams();
  const [nickname, setNickname] = useState("");
  const [title, setTitle] = useState("");
  const [weather, setWeather] = useState("");
  const [visibility, setVisibility] = useState("");
  const [content, setContent] = useState("");
  const [commentsCount, setCommentsCount] = useState(-1);
  const [likesCount, setLikesCount] = useState(-1);
  const [isLiked, setIsLiked] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [imageResponses, setImageResponses] = useState<ImageResponseType[]>([])
  const [createdAt, setCreatedAt] = useState("");

  const [isImagesShown, setIsImagesShown] = useState(true);
  const { isLogin, diary, setDiary, setDiaryList, setOpen } = useLogin();
  const [isMouseOverOnce, setIsMouseOverOnce] = useState(false);
  const [nicknameList, setNicknameList] = useState([]);

  const visibilityOptions: Option[] = [
    { label: "PUBLIC", value: "PUBLIC" },
    { label: "PRIVATE", value: "PRIVATE" },
    { label: "FRIENDS", value: "FRIENDS" },
  ];

  useEffect(() => {
    getOneDiaryApi(Number(diaryId))
      .then((res) => {
        console.log(res);

        setNickname(res.data.nickname);
        setTitle(res.data.title);
        setWeather(res.data.weather);
        setVisibility(res.data.visibility);
        setContent(res.data.content);
        setCommentsCount(res.data.commentsCount);
        setLikesCount(res.data.likesCount);
        setImageResponses(res.data.imageResponses);
        setImageUrls(res.data.images.map((image: ImageResponseType) => image.fileUrl));
        setCreatedAt(res.data.createdAt);

        setDiary(res.data);
      })
      .catch((err) => {
        console.error(err);
      });

    if (isLogin) {
      isLikedApi(Number(diaryId) ?? -1)
        .then((res) => {
          console.log(res);
          setIsLiked(res.data);
        })
        .catch((err) => {
          console.error(err);
        });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [diaryId, isLogin]);

  useEffect(() => {
    if (isMouseOverOnce) {
      getLikingNicknameByDiaryApi(Number(diaryId) ?? -1)
        .then((res) => {
          console.log("마우스 호버", res);
          setNicknameList(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [diaryId, isMouseOverOnce, likesCount]);

  const handleEditDiary = () => {
    const data: DiaryRequestType = {
      title,
      weather,
      visibility,
      content,
    };

    const formDataToSend = new FormData();
    formDataToSend.append(
      "request",
      new Blob([JSON.stringify(data)], { type: "application/json" }),
    );

    (images ?? []).forEach((file) => {      
      formDataToSend.append("files", file);
    });

    editDiaryApi(Number(diaryId), formDataToSend)
      .then((res) => {
        console.log(res);
        toast.success("글 수정이 되었습니다.");
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleLikeClick = () => {
    if (isLogin) {
      if (isLiked) {
        deleteLikeApi(Number(diaryId) ?? -1)
          .then((res) => {
            console.log(res);
            setIsLiked(res.data);
            setLikesCount(likesCount - 1);

            setDiaryList((prev) => {
              if (prev === undefined) {
                return;
              }
              return prev.map((diary: DiaryResponseType) =>
                diary.id === Number(diaryId)
                  ? { ...diary, likesCount: likesCount - 1 }
                  : diary,
              );
            });
          })
          .catch((err) => {
            console.error(err);
          });
      } else {
        insertLikeApi(Number(diaryId) ?? -1)
          .then((res) => {
            console.log(res);
            setIsLiked(res.data);
            setLikesCount(likesCount + 1);

            setDiaryList((prev) => {
              if (prev === undefined) {
                return;
              }
              return prev.map((diary: DiaryResponseType) =>
                diary.id === Number(diaryId)
                  ? { ...diary, likesCount: likesCount + 1 }
                  : diary,
              );
            });
          })
          .catch((err) => {
            console.error(err);
          });
      }
    }
  };

  const handleOpenComment = (e: React.MouseEvent<SVGSVGElement>) => {
    e.stopPropagation();

    const cCount =
      diary && diary?.commentsCount > commentsCount
        ? diary?.commentsCount
        : commentsCount;

    const data = {
      id: Number(diaryId),
      nickname,
      title,
      content,
      visibility,
      weather,
      commentsCount: cCount,
      likesCount,
      isLiked,
      imageResponses: imageResponses,
      createdAt,
    };
    setDiary(data);

    setOpen(true);
  };

  return (
    <PageContainer>
      <TextInput name="title" title="제목" data={title} setData={setTitle} />
      <TextInput
        disabled
        name="nickname"
        title="작성자"
        data={nickname}
        setData={setNickname}
      />
      <TwoDiv>
        <TextInput
          name="weather"
          title="날씨"
          data={weather}
          setData={setWeather}
        />
        <SelectInput
          name="visibility"
          title="공개여부"
          value={visibility}
          setValue={setVisibility}
          options={visibilityOptions}
        />
      </TwoDiv>
      <TextAreaInput
        name="content"
        title="내용"
        data={content}
        setData={setContent}
        rows={10}
      />
      <div style={{ display: "flex", alignItems: "center" }}>
        <FaRegCommentDots onClick={handleOpenComment} />
        <div
          style={{ fontStyle: "italic", color: "gray", marginRight: "10px" }}
        >
          ({diary?.commentsCount})
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
      </div>
      <CheckboxInput
        name="isimageshown"
        title="이미지입력창"
        checked={isImagesShown}
        setChecked={setIsImagesShown}
      />
      {isImagesShown && (
        <>
          <ImageInput
            name="images"
            title="이미지들"
            data={images ?? []}
            setData={setImages}
            previewUrls={imageUrls}
            setPreviewUrls={setImageUrls}
          />
        </>
      )}
      <ConfirmButton title="일기 수정" onClick={handleEditDiary} />
    </PageContainer>
  );
};

export default DiaryEditPage;

const PageContainer = styled.div`
  padding: 0 20px;
`;

const NicknameListBox = styled.div`
  border: 1px solid black;
  position: absolute;
  background-color: white;
  padding: 10px;
  left: -15px;
  top: 25px;
`;
