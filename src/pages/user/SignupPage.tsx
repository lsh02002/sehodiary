import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { showToast, UserSignupApi } from "../../api/sehodiary-api";
import TextInput from "../../components/bootstrap-form/TextInput";
import PasswordInput from "../../components/bootstrap-form/PasswordInput";
import ConfirmButton from "../../components/bootstrap-form/ConfirmButton";
import { FaRegistered } from "react-icons/fa6";
import { UserSignupType } from "../../types/type";
import CheckboxInput from "../../components/bootstrap-form/CheckboxInput";

const SignupPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  // const [profileImage, setProfileImage] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

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
        showToast("회원가입에 성공했습니다.", "success");
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
          <PasswordInput
            name="password"
            title="비밀번호"
            isPasswordVisible={isPasswordVisible}
            data={password}
            setData={setPassword}
          />
        </div>

        <div className="w-100 mb-3">
          <PasswordInput
            name="passwordConfirm"
            title="비밀번호 확인"
            isPasswordVisible={isPasswordVisible}
            data={passwordConfirm}
            setData={setPasswordConfirm}
          />
        </div>

        <div className="w-100 mb-3">
          <CheckboxInput
            name="istext"
            title="암호보기"
            checked={isPasswordVisible}
            setChecked={setIsPasswordVisible}
          />
        </div>

        <div className="w-100">
          <ConfirmButton title="회원 가입" onClick={OnSignupSubmit} />
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
