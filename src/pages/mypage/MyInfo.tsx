import React, { useEffect, useState } from "react";
import {
  getUserInfoApi,
  showToast,
  UserSetProfileImagesApi,
} from "../../api/sehodiary-api";
import TextInput from "../../components/bootstrap-form/TextInput";
import ConfirmButton from "../../components/bootstrap-form/ConfirmButton";
import { TwoDiv } from "../../components/bootstrap-form/TwoDiv";
import ImageInput from "../../components/bootstrap-form/ImageInput";

const MyInfo = () => {
  const [id, setId] = useState(-1);
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);

  useEffect(() => {
    getUserInfoApi()
      .then((res) => {
        setId(res?.data.id);
        setEmail(res?.data.email);
        setNickname(res?.data.nickname);
        setImageUrls(res?.data.profileImages);
      })
      .catch(() => {});
  }, []);

  const handleSetProfiles = () => {
    const formDataToSend = new FormData();

    (images ?? []).forEach((file) => {
      formDataToSend.append("files", file);
    });

    UserSetProfileImagesApi(formDataToSend)
      .then((res) => {
        showToast("프로필 사진 수정이 되었습니다.", "success");
      })
      .catch(() => {});
  };

  return (
    <>
      <TextInput
        disabled
        name="id"
        title="회원 아이디"
        data={String(id)}
        setData={(v) => setId(Number(v))}
      />
      <TextInput
        disabled
        name="email"
        title="이메일 주소"
        data={email}
        setData={setEmail}
      />
      <TextInput
        disabled
        name="nickname"
        title="닉네임"
        data={nickname}
        setData={setNickname}
      />
      <ImageInput
        name="images"
        title="이미지들"
        data={images}
        setData={setImages}
        previewUrls={imageUrls}
        setPreviewUrls={setImageUrls}
      />
      <div className="text-danger mt-3">
        프로필 사진 이외는 가입할때 정해짐!!!
      </div>
      <TwoDiv>
        <div style={{ width: "450px" }} />
        <ConfirmButton title="프로필설정" onClick={handleSetProfiles} />
      </TwoDiv>
    </>
  );
};

export default MyInfo;
