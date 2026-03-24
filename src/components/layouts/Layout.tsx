import React, { useEffect, useRef } from "react";
import { Menu } from "lucide-react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useLogin } from "../../context/LoginContext";
import CommentPage from "../../pages/comment/CommentPage";
import { BackwardButton } from "../bootstrap-form/BackwardButton";
import { useScroll } from "../../context/ScrollContext";
import AddDiaryButton from "../bootstrap-form/AddDiaryButton";
import { UserLogoutApi } from "../../api/sehodiary-api";

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
  paddingBottom: "100px",
};

export default function Layout({ appName = "앱", children }: Props) {
  const navigator = useNavigate();
  const location = useLocation();
  const { isLogin, setIsLogin, open, setOpen } = useLogin();
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab");
  const navigate = useNavigate();

  const { setMainPageScroll, setMyDiaryScroll } = useScroll();

  const scrollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isMainPage = location.pathname === "/";
  const isMyDiaryPage = tab === "mydiary";

  useEffect(() => {
    if (!isMainPage && !isMyDiaryPage) return;

    const handleWindowScroll = () => {
      if (scrollTimer.current) {
        clearTimeout(scrollTimer.current);
      }

      scrollTimer.current = setTimeout(() => {
        if (isMyDiaryPage) {
          setMyDiaryScroll({
            x: window.scrollX,
            y: window.scrollY,
          });
          return;
        }

        if (isMainPage) {
          setMainPageScroll({
            x: window.scrollX,
            y: window.scrollY,
          });
        }
      }, 150);
    };

    window.addEventListener("scroll", handleWindowScroll);

    return () => {
      window.removeEventListener("scroll", handleWindowScroll);

      if (scrollTimer.current) {
        clearTimeout(scrollTimer.current);
      }
    };
  }, [isMainPage, isMyDiaryPage, setMainPageScroll, setMyDiaryScroll]);

  return (
    <div className="bg-white text-dark min-vh-100" data-overlay-open={open}>
      <a
        href="#main"
        style={skipLinkStyle}
        onFocus={(e) => {
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
        }}
        onBlur={(e) => {
          Object.assign(e.currentTarget.style, skipLinkStyle);
        }}
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
        onClick={() => setOpen(true)}
      >
        <Menu size={20} />
      </button>

      <div
        role="presentation"
        className="position-fixed top-0 start-0 w-100 h-100"
        style={overlayStyle(open)}
        onClick={() => setOpen(false)}
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
            onClick={() => setOpen(false)}
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
                onClick={() => {
                  if (window.confirm("로그아웃 하시겠습니까?") === false) {
                    return;
                  }

                  UserLogoutApi()
                    .then((res) => {
                      console.log(res);
                    })
                    .catch(() => {});

                  localStorage.removeItem("userId");
                  localStorage.removeItem("nickname");
                  localStorage.removeItem("accessToken");
                  localStorage.removeItem("refreshToken");

                  setIsLogin(false);
                  navigate("/login");
                }}
              >
                <div>{localStorage.getItem("nickname")}</div>
                <div>로그아웃</div>
              </span>
            ) : (
              <div className="d-flex gap-3">
                <span
                  className="small"
                  role="button"
                  onClick={() => navigate("/login")}
                >
                  로그인
                </span>
                <span
                  className="small"
                  role="button"
                  onClick={() => navigate("/register")}
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
        <BackwardButton />
        {children}
      </main>

      <LockBodyScroll when={open} />
      <AddDiaryButton title="+" onClick={() => navigator("/create")} />
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
