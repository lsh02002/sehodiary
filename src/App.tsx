import React, { useEffect } from "react";
import LoginPage from "./pages/user/LoginPage";
import { Route, Routes, useLocation } from "react-router-dom";
import SignupPage from "./pages/user/SignupPage";
import { useLogin } from "./context/LoginContext";
import Layout from "./components/layouts/Layout";
import BottomNav from "./components/layouts/BottomNav";
import DiaryCreatePage from "./pages/diary/DiaryCreatePage";
import DiaryEditPage from "./pages/diary/DiaryEditPage";
import DiaryListPage from "./pages/diary/DiaryListPage";
import MyPage from "./pages/mypage/MyPage";
import NotFoundPage from "./pages/notfound/NotFoundPage";
import { BootstrapToastContainer } from "./components/layouts/Toast";

function App() {
  const location = useLocation();
  const { setIsLogin, open, setOpen } = useLogin();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }
  }, [setIsLogin]);

  useEffect(() => {
    // 라우트가 바뀔 때마다 모달 닫기
    if (open) {
      setOpen(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<DiaryListPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<SignupPage />} />
        <Route path="/list/:userId" element={<DiaryListPage />} />
        <Route path="/create" element={<DiaryCreatePage />} />
        <Route path="/edit/:diaryId" element={<DiaryEditPage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      <BootstrapToastContainer />
      <BottomNav />
    </Layout>
  );
}

export default App;
