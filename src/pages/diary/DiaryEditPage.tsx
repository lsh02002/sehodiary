import React, { useEffect, useState } from "react";
import TextInput from "../../components/bootstrap-form/TextInput";
import ConfirmButton from "../../components/bootstrap-form/ConfirmButton";
import { TwoDiv } from "../../components/bootstrap-form/TwoDiv";
import {
  deleteLikeApi,
  editDiaryApi,
  getLikingNicknameByDiaryApi,
  getOneDiaryApi,
  insertLikeApi,  
  showToast,
} from "../../api/sehodiary-api";
import SelectInput, {
  Option,
} from "../../components/bootstrap-form/SelectInput";
import { DiaryRequestType, ImageResponseType } from "../../types/type";
import { useParams } from "react-router-dom";
import { FaRegCommentDots } from "react-icons/fa6";
import { useLogin } from "../../context/LoginContext";
import { AiOutlineLike } from "react-icons/ai";
import { AiFillLike } from "react-icons/ai";
import CheckboxInput from "../../components/bootstrap-form/CheckboxInput";
import ImageInput from "../../components/bootstrap-form/ImageInput";
import EmotionSelectInput from "../../components/bootstrap-form/EmotionSelectInput";
import QuillEditorInput from "../../components/bootstrap-form/QuillEditorInput";
import DateInput from "../../components/bootstrap-form/DateInput";

const DiaryEditPage = () => {
  const { diaryId } = useParams();
  const [id, setId] = useState(-1);
  const [nickname, setNickname] = useState("");
  const [title, setTitle] = useState("");
  const [weather, setWeather] = useState("");
  const [visibility, setVisibility] = useState("");
  const [content, setContent] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [commentsCount, setCommentsCount] = useState(-1);
  const [likesCount, setLikesCount] = useState(-1);
  const [isLiked, setIsLiked] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [imageResponses, setImageResponses] = useState<ImageResponseType[]>([]);
  const [profileImage, setProfileImage] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [emoji, setEmoji] = useState<string>();

  const [isImagesShown, setIsImagesShown] = useState(true);
  const { isLogin, diary, setDiary, setOpen } = useLogin();
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
        setId(res.data.id);
        setNickname(res.data.nickname);
        setTitle(res.data.title);
        setWeather(res.data.weather);
        setVisibility(res.data.visibility);
        setContent(res.data.content);
        setCommentsCount(res.data.commentsCount);
        setIsLiked(res.data.isLiked);
        setLikesCount(res.data.likesCount);
        setImageResponses(res.data.imageResponses);
        setProfileImage(res.data.profileImage);
        setImageUrls(
          res.data.imageResponses.map(
            (image: ImageResponseType) => image.fileUrl,
          ),
        );
        setEmoji(res.data.emoji);
        setCreatedAt(res.data.createdAt);

        setDiary(res.data);
      })
      .catch(() => {});

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [diaryId, isLogin]);

  useEffect(() => {
    if (isMouseOverOnce) {
      getLikingNicknameByDiaryApi(Number(diaryId) ?? -1)
        .then((res) => {
          setNicknameList(res.data);
        })
        .catch(() => {});
    }
  }, [diaryId, isMouseOverOnce, likesCount]);

  const handleEditDiary = () => {
    const data: DiaryRequestType = {
      title,
      weather,
      visibility,
      content,
      date: date?.toLocaleDateString("sv-SE") ?? "",
      emoji: emoji ?? "",
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
        showToast("글 수정이 되었습니다.", "success");
      })
      .catch(() => {});
  };

  const handleLikeClick = () => {
    if (isLogin) {
      if (isLiked) {
        deleteLikeApi(Number(diaryId) ?? -1)
          .then((res) => {
            setIsLiked(res.data);
            setLikesCount(likesCount - 1);
          })
          .catch(() => {});
      } else {
        insertLikeApi(Number(diaryId) ?? -1)
          .then((res) => {
            setIsLiked(res.data);
            setLikesCount(likesCount + 1);
          })
          .catch(() => {});
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
      date: date?.toLocaleDateString("sv-SE") ?? "",
      visibility,
      weather,
      commentsCount: cCount,
      likesCount,
      isLiked,
      imageResponses: imageResponses,
      profileImage,
      emoji: emoji ?? "",
      createdAt,
    };
    setDiary(data);

    setOpen(true);
  };

  return (
    <div className="px-3 mb-5" style={{ marginBottom: "100px" }}>
      <TwoDiv>
        <TextInput
          disabled
          name="id"
          title="아이디"
          data={String(id)}
          setData={(v) => setId(Number(v))}
        />
        <TextInput name="title" title="제목" data={title} setData={setTitle} />
      </TwoDiv>
      <TwoDiv>
        <TextInput
          disabled
          name="nickname"
          title="작성자"
          data={nickname}
          setData={setNickname}
        />
        <DateInput title="날짜" selected={date} setSelected={setDate} />
      </TwoDiv>
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
      <QuillEditorInput
        name="content"
        title="내용"
        data={content}
        setData={setContent}
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
            <div
              className="position-absolute bg-white border"
              style={{
                padding: "10px",
                left: "-15px",
                top: "25px",
              }}
              onMouseOver={() => setIsMouseOverOnce(true)}
              onMouseLeave={() => setIsMouseOverOnce(false)}
            >
              {nicknameList?.map((list) => (
                <div>{list}</div>
              ))}
            </div>
          )}
        </div>
      </div>
      <EmotionSelectInput
        name="emotion"
        title="이모션"
        data={emoji ?? ""}
        setData={setEmoji}
      />
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
    </div>
  );
};

export default DiaryEditPage;
