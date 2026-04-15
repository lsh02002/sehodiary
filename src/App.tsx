import React, { lazy, Suspense, useEffect, useRef } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { useLogin } from "./context/LoginContext";
import Layout from "./components/layouts/Layout";
import BottomNav from "./components/layouts/BottomNav";
import { BootstrapToastContainer } from "./components/layouts/Toast";
import { urlBase64ToUint8Array } from "./pages/serviceworker/ServiceWorker";
import { api } from "./api/sehodiary-api";
import axios from "axios";
import { DEBUG } from "./api/DEBUG";

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
    async function initPush() {
      try {
        if (!("serviceWorker" in navigator)) {
          if (DEBUG) {
            console.log("serviceWorker 미지원");
          }
          return;
        }

        if (!("PushManager" in window)) {
          if (DEBUG) {
            console.log("PushManager 미지원");
          }
          return;
        }

        await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
        });
        if (DEBUG) {
          console.log("SW 등록 성공");
        }

        // 2. ⭐ 여기서 기다림 (핵심)
        const reg = await navigator.serviceWorker.ready;
        if (DEBUG) {
          console.log("SW ready:", reg);
        }

        const permission = await Notification.requestPermission();
        if (DEBUG) {
          console.log("알림 권한:", permission);
        }

        if (permission !== "granted") {
          if (DEBUG) {
            console.log("알림 권한 거부됨");
          }
          return;
        }

        // public key 가져오기
        const keyRes = await api.get("/api/push/public-key");
        const keyData = keyRes.data;
        if (DEBUG) {
          console.log("public key:", keyData);
        }

        const applicationServerKey = urlBase64ToUint8Array(keyData.publicKey);

        let subscription = await reg.pushManager.getSubscription();

        if (!subscription) {
          subscription = await reg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey,
          });
        }

        if (DEBUG) {
          console.log("subscription:", subscription.toJSON());
        }

        // 구독 서버 저장
        const res = await api.post("/api/push/subscribe", {
          userId: 1,
          ...subscription.toJSON(),
        });

        if (DEBUG) {
          console.log("subscribe API status:", res.status);
          console.log("구독 저장 성공:", res.data);
        }
      } catch (e) {
        if (axios.isAxiosError(e)) {
          console.error("구독 저장 실패:", e.response?.data);
        } else if (e instanceof Error) {
          console.error("push init error:", e.message);
        } else {
          console.error("알 수 없는 에러:", e);
        }
      }
    }

    initPush();
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
