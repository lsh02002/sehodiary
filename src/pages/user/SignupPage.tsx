import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserSignupApi } from "../../api/sehodiary-api";
import TextInput from "../../components/bootstrap-form/TextInput";
import ConfirmButton from "../../components/bootstrap-form/ConfirmButton";
import { FaRegistered } from "react-icons/fa6";
import { UserSignupType } from "../../types/type";
import PasswordVisibleInput from "../../components/bootstrap-form/PasswordVisibleInput";
import { toast } from "react-toastify";

const SignupPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  // const [profileImage, setProfileImage] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const OnSignupSubmit = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("nickname");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    const userInfo: UserSignupType = {
      email,
      nickname,
      profileImage: "",
      password,
      passwordConfirm,
    };

    UserSignupApi(userInfo)
      .then((res) => {
        toast.success("회원가입에 성공했습니다.");
        navigate("/login");
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
            <FaRegistered /> 회원가입
          </h3>

          <Link
            to="/login"
            className="text-decoration-none"
            style={{ color: "#4680ff" }}
          >
            이미 계정이 있으세요?
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
          <TextInput
            name="nickname"
            title="닉네임"
            data={nickname}
            setData={setNickname}
          />
        </div>

        <div className="w-100 mb-3">
          <PasswordVisibleInput
            name="password"
            title="비밀번호"
            data={password}
            setData={setPassword}
          />
        </div>

        <div className="w-100 mb-3">
          <PasswordVisibleInput
            name="passwordConfirm"
            title="비밀번호 확인"
            data={passwordConfirm}
            setData={setPasswordConfirm}
          />
        </div>

        <div className="w-100">
          <ConfirmButton disabled title="회원 가입" onClick={OnSignupSubmit} />
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
