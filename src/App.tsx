import React, { useEffect } from "react";
import LoginPage from "./pages/user/LoginPage";
import { Route, Routes } from "react-router-dom";
import SignupPage from "./pages/user/SignupPage";
import { useLogin } from "./context/LoginContext";
import { StyledToastContainer } from "./components/layouts/Toast";
import Layout from "./components/layouts/Layout";
import BottomNav from "./components/layouts/BottomNav";
import DiaryCreatePage from "./pages/diary/DiaryCreatePage";
import DiaryEditPage from "./pages/diary/DiaryEditPage";
import DiaryListPage from "./pages/diary/DiaryListPage";
import MyPage from "./pages/mypage/MyPage";

function App() {
  const { setIsLogin } = useLogin();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }
  }, [setIsLogin]);

  return (
    <Layout>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<SignupPage />} />
        <Route path="/" element={<DiaryListPage />} />
        <Route path="/create" element={<DiaryCreatePage />} />
        <Route path="/edit/:diaryId" element={<DiaryEditPage />} />
        <Route path="/mypage" element={<MyPage />} />
      </Routes>

      <StyledToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar={true}
        closeOnClick={true}
        pauseOnHover={false}
        limit={1}
      />

      <BottomNav />
    </Layout>
  );
}

export default App;
