import React, { useCallback, useEffect, useRef } from "react";
import { Menu } from "lucide-react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useLogin } from "../../context/LoginContext";
import CommentPage from "../../pages/comment/CommentPage";
import { useScroll } from "../../context/ScrollContext";
import AddDiaryButton from "../bootstrap-form/AddDiaryButton";
import { UserLogoutApi } from "../../api/sehodiary-api";
import ScrollToTopButton from "../bootstrap-form/ScrollToTopButton";
import { matchPath } from "react-router-dom";

interface Props {
  appName?: string;
  children: React.ReactNode;
}

const skipLinkStyle: React.CSSProperties = {
  position: "absolute",
  left: "-9999px",
  top: "-9999px",
};

const burgerButtonStyle: React.CSSProperties = {
  width: "40px",
  height: "40px",
  borderRadius: "16px",
  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.08)",
  zIndex: 50,
};

const overlayStyle = (open: boolean): React.CSSProperties => ({
  zIndex: 40,
  background: "rgba(0, 0, 0, 0.32)",
  opacity: open ? 1 : 0,
  pointerEvents: open ? "auto" : "none",
  transition: "opacity 160ms ease",
});

const sidebarStyle = (open: boolean): React.CSSProperties => ({
  top: "200px",
  zIndex: 45,
  background: "white",
  boxShadow: "2px 0 16px rgba(0, 0, 0, 0.08)",
  transform: open ? "translateY(0)" : "translateY(100%)",
  transition: "transform 220ms ease",
  borderRadius: "20px 20px 0 0",
});

const mainStyle: React.CSSProperties = {
  maxWidth: "640px",
  paddingTop: "50px",
  paddingBottom: "100px",
};

export default function Layout({ appName = "앱", children }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { isLogin, setIsLogin, open, setOpen } = useLogin();
  const { setScrolls } = useScroll();

  const tab = searchParams.get("tab");
  const scrollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isMainPage = location.pathname === "/";
  const isMainFollowPage = matchPath("/:userId", location.pathname);
  const isMyDiaryPage = tab === "mydiary";
  const isMyCommentPage = tab === "mycomment";
  const isMyActivityLogPage = tab === "activitylog";

  const handleOpenMenu = useCallback(() => {
    setOpen(true);
  }, [setOpen]);

  const handleCloseMenu = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const handleGoLogin = useCallback(() => {
    navigate("/login");
  }, [navigate]);

  const handleGoRegister = useCallback(() => {
    navigate("/register");
  }, [navigate]);

  const handleGoCreate = useCallback(() => {
    navigate("/create");
  }, [navigate]);

  const handleLogout = useCallback(() => {
    if (window.confirm("로그아웃 하시겠습니까?") === false) {
      return;
    }

    UserLogoutApi()
      .then(() => {})
      .catch(() => {})
      .finally(() => {
        localStorage.removeItem("userId");
        localStorage.removeItem("nickname");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        setIsLogin(false);
        navigate("/login");
      });
  }, [navigate, setIsLogin]);

  const handleSkipLinkFocus = useCallback(
    (e: React.FocusEvent<HTMLAnchorElement>) => {
      Object.assign(e.currentTarget.style, {
        position: "fixed",
        left: "12px",
        top: "12px",
        zIndex: "60",
        padding: "8px 12px",
        borderRadius: "12px",
        background: "rgba(0, 0, 0, 0.9)",
        color: "white",
      });
    },
    [],
  );

  const handleSkipLinkBlur = useCallback(
    (e: React.FocusEvent<HTMLAnchorElement>) => {
      Object.assign(e.currentTarget.style, skipLinkStyle);
    },
    [],
  );

  const handleWindowScroll = useCallback(() => {
    if (scrollTimer.current) {
      clearTimeout(scrollTimer.current);
    }

    scrollTimer.current = setTimeout(() => {
      if (isMyDiaryPage) {
        setScrolls((prev) => ({
          ...prev,
          myDiary: { x: window.scrollX, y: window.scrollY },
        }));
        return;
      }

      if (isMyCommentPage) {
        setScrolls((prev) => ({
          ...prev,
          myComment: { x: window.scrollX, y: window.scrollY },
        }));
        return;
      }

      if (isMyActivityLogPage) {
        setScrolls((prev) => ({
          ...prev,
          myActivityLog: { x: window.scrollX, y: window.scrollY },
        }));
        return;
      }

      if (isMainPage) {
        setScrolls((prev) => ({
          ...prev,
          mainPage: { x: window.scrollX, y: window.scrollY },
        }));
        return;
      }

      if (isMainFollowPage) {
        setScrolls((prev) => ({
          ...prev,
          mainFollowPage: { x: window.scrollX, y: window.scrollY },
        }));
        return;
      }
    }, 150);
  }, [
    isMainFollowPage,
    isMainPage,
    isMyActivityLogPage,
    isMyCommentPage,
    isMyDiaryPage,
    setScrolls,
  ]);

  useEffect(() => {
    if (
      !isMainPage &&
      !isMainFollowPage &&
      !isMyDiaryPage &&
      !isMyCommentPage &&
      !isMyActivityLogPage
    )
      return;

    window.addEventListener("scroll", handleWindowScroll);

    return () => {
      window.removeEventListener("scroll", handleWindowScroll);

      if (scrollTimer.current) {
        clearTimeout(scrollTimer.current);
      }
    };
  }, [
    handleWindowScroll,
    isMainFollowPage,
    isMainPage,
    isMyActivityLogPage,
    isMyCommentPage,
    isMyDiaryPage,
  ]);

  return (
    <div className="bg-white text-dark min-vh-100" data-overlay-open={open}>
      <a
        href="#main"
        style={skipLinkStyle}
        onFocus={handleSkipLinkFocus}
        onBlur={handleSkipLinkBlur}
      >
        본문으로 건너뛰기
      </a>

      <button
        type="button"
        className="btn btn-light position-fixed top-0 start-0 m-3 d-inline-flex align-items-center justify-content-center"
        style={burgerButtonStyle}
        aria-label="메뉴 열기"
        aria-expanded={open}
        aria-controls="side-nav"
        onClick={handleOpenMenu}
      >
        <Menu size={20} />
      </button>

      <div
        role="presentation"
        className="position-fixed top-0 start-0 w-100 h-100"
        style={overlayStyle(open)}
        onClick={handleCloseMenu}
        aria-hidden={!open}
      />

      <aside
        id="side-nav"
        className="position-fixed start-0 end-0 bottom-0 w-100"
        style={sidebarStyle(open)}
        aria-hidden={!open}
      >
        <div
          className="d-flex align-items-center justify-content-between border-bottom px-3"
          style={{ height: "56px" }}
        >
          <h2 className="h6 mb-0 fw-bold">댓글 창</h2>
          <button
            type="button"
            className="btn btn-link text-secondary text-decoration-none p-0 fs-3 lh-1"
            onClick={handleCloseMenu}
            aria-label="메뉴 닫기"
          >
            ×
          </button>
        </div>

        <nav role="navigation" aria-label="주 메뉴" className="p-2">
          <CommentPage />
        </nav>
      </aside>

      <header
        className="sticky-top border-bottom bg-white bg-opacity-75"
        style={{ backdropFilter: "blur(6px)", zIndex: 30 }}
      >
        <div className="container-fluid px-3">
          <div
            className="d-flex align-items-center justify-content-between mx-auto"
            style={{
              minHeight: "56px",
              maxWidth: "1024px",
              paddingLeft: "56px",
            }}
          >
            <strong className="small text-secondary-emphasis">{appName}</strong>
            {isLogin ? (
              <span
                className="small text-end"
                role="button"
                onClick={handleLogout}
              >
                <div>{localStorage.getItem("nickname")}</div>
                <div>로그아웃</div>
              </span>
            ) : (
              <div className="d-flex gap-3">
                <span className="small" role="button" onClick={handleGoLogin}>
                  로그인
                </span>
                <span
                  className="small"
                  role="button"
                  onClick={handleGoRegister}
                >
                  회원가입
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      <main
        id="main"
        className="container-fluid px-1 px-sm-4 mx-auto"
        style={mainStyle}
      >
        {children}
      </main>

      <LockBodyScroll when={open} />
      <ScrollToTopButton />
      <AddDiaryButton title="+" onClick={handleGoCreate} />
    </div>
  );
}

function LockBodyScroll({ when }: { when: boolean }) {
  React.useEffect(() => {
    if (!when) return;

    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = original;
    };
  }, [when]);

  return null;
}
