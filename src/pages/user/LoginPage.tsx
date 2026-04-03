import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { showToast, UserLoginApi } from "../../api/sehodiary-api";
import TextInput from "../../components/bootstrap-form/TextInput";
import PasswordInput from "../../components/bootstrap-form/PasswordInput";
import ConfirmButton from "../../components/bootstrap-form/ConfirmButton";
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
        localStorage.setItem("userId", res.data.data.userId);
        localStorage.setItem("nickname", res.data.data.nickname);
        localStorage.setItem("accessToken", res.headers.accesstoken);
        localStorage.setItem("refreshToken", res.headers.refreshtoken);

        setIsLogin(true);
        showToast("로그인 했습니다.", "success")
        navigate("/");
      })
      .catch(() => {});
  };

  return (
    <div className="d-flex justify-content-center align-items-center w-100">
      <div
        className="d-flex flex-column align-items-center w-100 p-3"
        style={{ maxWidth: "400px" }}
      >
        <div className="d-flex justify-content-between align-items-center w-100 mb-3">
          <h3 className="fw-medium mb-0">
            <SlLogin /> 로그인
          </h3>

          <Link
            to="/register"
            className="text-decoration-none"
            style={{ color: "#4680ff" }}
          >
            계정이 없으세요?
          </Link>
        </div>

        <div className="w-100 mb-3">
          <TextInput
            name="email"
            title="이메일 주소"
            data={email}
            setData={setEmail}
          />
        </div>

        <div className="w-100 mb-3">
          <PasswordInput
            name="password"
            title="비밀 번호"
            data={password}
            setData={setPassword}
          />
        </div>

        <div className="w-100">
          <ConfirmButton title="로그인" onClick={OnLoginSubmit} />
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
