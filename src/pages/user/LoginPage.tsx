import React, { useState } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { UserLoginApi } from "../../api/sehodiary-api";
import TextInput from "../../components/form/TextInput";
import PasswordInput from "../../components/form/PasswordInput";
import ConfirmButton from "../../components/form/ConfirmButton";
import { SlLogin } from "react-icons/sl";
import { useLogin } from "../../context/LoginContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const { setIsLogin } = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const OnLoginSubmit = () => {
    UserLoginApi(email, password)
      .then((res) => {
        console.log("login ", res);
        localStorage.setItem("userId", res.data.data.userId);
        localStorage.setItem("nickname", res.data.data.nickname);        
        localStorage.setItem("accessToken", res.headers.accesstoken);
        localStorage.setItem("refreshToken", res.headers.refreshtoken);

        setIsLogin(true);
        navigate("/");
      })
      .catch(() => {});
  };

  return (
    <Container>
      <Wrapper>
        <Title>
          <h3>
            <SlLogin /> 로그인
          </h3>
          <Link
            style={{ color: "#4680ff", textDecoration: "none" }}
            to="/register"
          >
            계정이 없으세요?
          </Link>
        </Title>
        <TextInput
          name="email"
          title="이메일 주소"
          data={email}
          setData={setEmail}
        />
        <PasswordInput
          name="password"
          title="비밀 번호"
          data={password}
          setData={setPassword}
        />
        <ConfirmButton title="로그인" onClick={OnLoginSubmit} />
      </Wrapper>
    </Container>
  );
};

export default LoginPage;

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
    font-size: 0.7rem;
  }
`;
