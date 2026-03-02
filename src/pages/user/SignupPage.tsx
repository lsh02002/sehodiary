import React, { useState } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { UserSignupApi } from "../../api/sehodiary-api";
import TextInput from "../../components/form/TextInput";
import PasswordInput from "../../components/form/PasswordInput";
import ConfirmButton from "../../components/form/ConfirmButton";
import { FaRegistered } from "react-icons/fa6";
import { UserSignupType } from "../../types/type";

const SignupPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  // const [profileImage, setProfileImage] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const OnSignupSubmit = () => {
    const userInfo: UserSignupType = {
      email,
      nickname,
      profileImage: "",
      password,
      passwordConfirm,      
    };

    UserSignupApi(userInfo)
      .then((res) => {
        console.log(res);
        navigate("/login");
      })
      .catch((err) => {});
  };

  return (
    <Container>
      <Wrapper>
        <Title>
          <h3>
            <FaRegistered /> 회원가입
          </h3>
          <Link
            style={{ color: "#4680ff", textDecoration: "none" }}
            to="/login"
          >
            이미 계정이 있으세요?
          </Link>
        </Title>
        <TextInput
          name="email"
          title="이메일 주소"
          data={email}
          setData={setEmail}
        />
        <TextInput name="nickname" title="닉네임" data={nickname} setData={setNickname} />
        <PasswordInput
          name="password"
          title="비밀번호"
          data={password}
          setData={setPassword}
        />
        <PasswordInput
          name="passwordConfirm"
          title="비밀번호 확인"
          data={passwordConfirm}
          setData={setPasswordConfirm}
        />
        <ConfirmButton title="회원 가입" onClick={OnSignupSubmit} />
      </Wrapper>
    </Container>
  );
};

export default SignupPage;

const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Wrapper = styled.div`
  width: 100%;
  max-width: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 20px;
  box-sizing: border-box;
`;

const Title = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;

  h3 {
    font-weight: 500;
  }

  a {
    font-size: 0.8rem;
  }
`;
