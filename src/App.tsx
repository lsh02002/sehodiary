import React, { lazy, Suspense, useEffect, useRef } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { useLogin } from "./context/LoginContext";
import Layout from "./components/layouts/Layout";
import BottomNav from "./components/layouts/BottomNav";
import { BootstrapToastContainer } from "./components/layouts/Toast";

const DiaryListPage = lazy(() => import("../src/pages/diary/DiaryListPage"));
const LoginPage = lazy(() => import("../src/pages/user/LoginPage"));
const SignupPage = lazy(() => import("../src/pages/user/SignupPage"));
const DiaryCreatePage = lazy(
  () => import("../src/pages/diary/DiaryCreatePage"),
);
const DiaryEditPage = lazy(() => import("../src/pages/diary/DiaryEditPage"));
const MyPage = lazy(() => import("../src/pages/mypage/MyPage"));
const NotFoundPage = lazy(() => import("../src/pages/notfound/NotFoundPage"));

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

  const modalHistoryPushedRef = useRef(false);

  // 🔹 라우트 변경 시 모달 닫기
  useEffect(() => {
    setOpen(false);
    modalHistoryPushedRef.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  // 🔹 모달 열릴 때 뒤로가기 대응
  useEffect(() => {
    if (!open) return;
    if (modalHistoryPushedRef.current) return;

    window.history.pushState({ modal: true }, "");
    modalHistoryPushedRef.current = true;

    const handlePopState = () => {
      if (modalHistoryPushedRef.current) {
        modalHistoryPushedRef.current = false;
        setOpen(false);
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(() => console.log('SW 등록 성공'))
        .catch(console.error);
    }
  }, []);

  return (
    <Layout>
      <Suspense fallback={<div>로딩중...</div>}>
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
      </Suspense>
      <BootstrapToastContainer />
      <BottomNav />
    </Layout>
  );
}

export default App;
