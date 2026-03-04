import React, { useEffect, useState } from "react";
import styled from "styled-components";
import TextInput from "../../components/form/TextInput";
import TextAreaInput from "../../components/form/TextAreaInput";
import ConfirmButton from "../../components/form/ConfirmButton";
import { TwoDiv } from "../../components/form/TwoDiv";
import { editDiaryApi, getOneDiaryApi } from "../../api/sehodiary-api";
import SelectInput, { Option } from "../../components/form/SelectInput";
import { DiaryRequestType } from "../../types/type";
import { useParams } from "react-router-dom";
import { FaRegCommentDots } from "react-icons/fa6";
import { useLogin } from "../../context/LoginContext";

const DiaryEditPage = () => {
  const { diaryId } = useParams();
  const [nickname, setNickname] = useState("");
  const [title, setTitle] = useState("");
  const [weather, setWeather] = useState("");
  const [visibility, setVisibility] = useState("");
  const [content, setContent] = useState("");
  const [commentsCount, setCommentsCount] = useState(-1);
  const [createdAt, setCreatedAt] = useState("");
  const { diary, setDiary, setOpen } = useLogin();

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
        setCreatedAt(res.data.setCreatedAt);

        setDiary(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [diaryId]);

  const handleEditDiary = () => {
    const data: DiaryRequestType = {
      title,
      weather,
      visibility,
      content,
    };

    editDiaryApi(Number(diaryId), data)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleEditComment = (e: React.MouseEvent<SVGSVGElement>) => {
    e.stopPropagation();
    
    const cCount = diary && diary?.commentsCount > commentsCount ? diary?.commentsCount : commentsCount;

    const data = {
      id: Number(diaryId),
      nickname,
      title,
      content,
      visibility,
      weather,
      commentsCount: cCount,
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
        <FaRegCommentDots onClick={handleEditComment} />
        <div
          style={{ fontStyle: "italic", color: "gray", marginRight: "10px" }}
        >
          ({diary?.commentsCount})
        </div>
      </div>
      <ConfirmButton title="일기 수정" onClick={handleEditDiary} />
    </PageContainer>
  );
};

export default DiaryEditPage;

const PageContainer = styled.div`
  padding: 0 20px;
`;
