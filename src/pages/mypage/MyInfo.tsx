import React, { useEffect, useState } from "react";
import { getUserInfoApi } from "../../api/sehodiary-api";
import TextInput from "../../components/form/TextInput";
import ConfirmButton from "../../components/form/ConfirmButton";
import { TwoDiv } from "../../components/form/TwoDiv";
import styled from "styled-components";

const MyInfo = () => {
  const [id, setId] = useState(-1);
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [profileImage, setProfileImage] = useState("");

  useEffect(() => {
    getUserInfoApi()
      .then((res) => {
        console.log(res);

        setId(res?.data.id);
        setEmail(res?.data.email);
        setNickname(res?.data.nickname);
        setProfileImage(res?.data.profileImage);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

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
      <TextInput
        name="profileimage"
        title="프로필"
        data={profileImage}
        setData={setProfileImage}
      />
      <Message>프로필 사진 이외는 가입할때 정해짐!!!</Message>
      <TwoDiv>
        <div style={{ width: "450px" }} />
        <ConfirmButton title="프로필설정" onClick={() => {}} />
      </TwoDiv>
    </>
  );
};

export default MyInfo;

const Message = styled.div`
  color: red;
  margin-top: 15px;
`;
