import React, { useState } from "react";
import styled from "styled-components";
import TextInput from "../../components/form/TextInput";
import TextAreaInput from "../../components/form/TextAreaInput";
import ConfirmButton from "../../components/form/ConfirmButton";
import { TwoDiv } from "../../components/form/TwoDiv";
import { createDiaryApi } from "../../api/sehodiary-api";
import SelectInput, { Option } from "../../components/form/SelectInput";
import { DiaryRequestType } from "../../types/type";

const DiaryCreatePage = () => {
  const [title, setTitle] = useState("");
  const [nickname, setNickname] = useState(localStorage.getItem("nickname") ?? "");
  const [weather, setWeather] = useState("");
  const [visibility, setVisibility] = useState("PRIVATE");
  const [content, setContent] = useState("");

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
    };

    createDiaryApi(data)
    .then(res=>{
      console.log(res);
    })
    .catch(err=>{
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
      <ConfirmButton title="일기 생성" onClick={handleCreateDiary} />
    </PageContainer>
  );
};

export default DiaryCreatePage;

const PageContainer = styled.div`
  padding: 0 20px;
`;
