import React, { useState } from "react";
import TextInput from "../../components/bootstrap-form/TextInput";
import ConfirmButton from "../../components/bootstrap-form/ConfirmButton";
import { TwoDiv } from "../../components/bootstrap-form/TwoDiv";
import { createDiaryApi, showToast } from "../../api/sehodiary-api";
import SelectInput, {
  Option,
} from "../../components/bootstrap-form/SelectInput";
import { DiaryRequestType } from "../../types/type";
import ImageInput from "../../components/bootstrap-form/ImageInput";
import CheckboxInput from "../../components/bootstrap-form/CheckboxInput";
import EmotionSelectInput from "../../components/bootstrap-form/EmotionSelectInput";
import QuillEditorInput from "../../components/bootstrap-form/QuillEditorInput";
import { useNavigate } from "react-router-dom";

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const visibilityOptions: Option[] = [
    { label: "PUBLIC", value: "PUBLIC" },
    { label: "PRIVATE", value: "PRIVATE" },
    { label: "FRIENDS", value: "FRIENDS" },
  ];

  const handleCreateDiary = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

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

    await createDiaryApi(formDataToSend)
      .then((res) => {
        showToast("글 생성이 되었습니다.", "success");

        navigate(`/edit/${res.data.id}`, { replace: true });
      })
      .catch(() => {})
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <div className="px-3 mb-5" style={{ marginBottom: "100px" }}>
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
      <QuillEditorInput
        name="content"
        title="내용"
        data={content}
        setData={setContent}
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
        <ImageInput
          name="images"
          title="이미지들"
          data={images ?? []}
          setData={setImages}
          previewUrls={imageUrls}
          setPreviewUrls={setImageUrls}
        />
      )}

      <ConfirmButton
        title="일기 생성"
        onClick={handleCreateDiary}
        disabled={isSubmitting}
      />
    </div>
  );
};

export default DiaryCreatePage;
