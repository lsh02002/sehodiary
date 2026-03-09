import React, { useState } from "react";
import styled from "styled-components";
import TextInput from "../../components/form/TextInput";
import TextAreaInput from "../../components/form/TextAreaInput";
import ConfirmButton from "../../components/form/ConfirmButton";
import { TwoDiv } from "../../components/form/TwoDiv";
import { createDiaryApi, showToast } from "../../api/sehodiary-api";
import SelectInput, { Option } from "../../components/form/SelectInput";
import { DiaryRequestType } from "../../types/type";
import ImageInput from "../../components/form/ImageInput";
import CheckboxInput from "../../components/form/CheckboxInput";
import EmotionSelectInput from "../../components/form/EmotionSelectInput";

const DiaryCreatePage = () => {
  const [title, setTitle] = useState("");
  const [nickname, setNickname] = useState(
    localStorage.getItem("nickname") ?? "",
  );
  const [weather, setWeather] = useState("");
  const [visibility, setVisibility] = useState("PRIVATE");
  const [content, setContent] = useState("");
  const [isImagesShown, setIsImagesShown] = useState(true);
  const [images, setImages] = useState<File[] | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [emoji, setEmoji] = useState<string>();

  const visibilityOptions: Option[] = [
    { label: "PUBLIC", value: "PUBLIC" },
    { label: "PRIVATE", value: "PRIVATE" },
    { label: "FRIENDS", value: "FRIENDS" },
  ];

  const handleCreateDiary = () => {
    const data: DiaryRequestType = {
      title,
      weather,
      visibility,
      content,
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

    createDiaryApi(formDataToSend)
      .then((res) => {
        console.log(res);
        showToast("글 생성이 되었습니다.", "success");
      })
      .catch((err) => {
        console.error(err);
      });
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
      <ConfirmButton title="일기 생성" onClick={handleCreateDiary} />
    </PageContainer>
  );
};

export default DiaryCreatePage;

const PageContainer = styled.div`
  padding: 0 20px;
`;
