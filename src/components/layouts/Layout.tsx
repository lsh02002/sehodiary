import React, { useEffect, useRef } from "react";
import styled, { css } from "styled-components";
import { Menu } from "lucide-react";
import {  
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { useLogin } from "../../context/LoginContext";
import CommentPage from "../../pages/comment/CommentPage";
import { BackwardButton } from "../form/BackwardButton";
import { useScroll } from "../../context/ScrollContext";
import AddDiaryButton from "../form/AddDiaryButton";
import { UserLogoutApi } from "../../api/sehodiary-api";

// 사용 예시
// <HamburgerLayoutSC
//   appName="My App"
//   navItems={[
//     { label: "홈", icon: Home, href: "/" },
//     { label: "대시보드", icon: LayoutDashboard, href: "/dashboard" },
//     { label: "설정", icon: Settings, href: "/settings" },
//     { label: "도움말", icon: HelpCircle, href: "/help" },
//   ]}
// >
//   <YourPage />
// </HamburgerLayoutSC>

export type NavItem = {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
};

interface Props {
  appName?: string;
  navItems?: NavItem[];
  children: React.ReactNode;
}

export default function Layout({
  appName = "앱",
  navItems = [],
  children,
}: Props) {
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
    <Container data-overlay-open={open}>
      <SkipLink href="#main">본문으로 건너뛰기</SkipLink>

      <BurgerButton
        aria-label="메뉴 열기"
        aria-expanded={open}
        aria-controls="side-nav"
        onClick={() => setOpen(true)}
      >
        <Menu className="icon" />
      </BurgerButton>

      <Overlay
        role="presentation"
        $open={open}
        onClick={() => setOpen(false)}
        aria-hidden={!open}
      />

      <Sidebar id="side-nav" $open={open} aria-hidden={!open}>
        <SidebarHeader>
          <MenuTitle>{"댓글 창"}</MenuTitle>
          <CloseX onClick={() => setOpen(false)} aria-label="메뉴 닫기">
            ×
          </CloseX>
        </SidebarHeader>

        <Nav role="navigation" aria-label="주 메뉴">
          <CommentPage />
        </Nav>
      </Sidebar>

      <TopBar>
        <TopBarInner>
          <strong>{appName}</strong>
        </TopBarInner>
        {isLogin ? (
          <span            
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
          <span onClick={() => navigate("/login")}>로그인</span>
        )}
      </TopBar>

      <Main id="main">
        <BackwardButton />
        {children}
      </Main>

      <LockBodyScroll when={open} />
      <AddDiaryButton title="+" onClick={() => navigator("/create")} />
    </Container>
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

// ================= styled-components =================
const Container = styled.div`
  /* background: #fafafa; */
  background: white;
  color: #111827;
`;

const SkipLink = styled.a`
  position: absolute;
  left: -9999px;
  top: -9999px;
  &:focus {
    position: fixed;
    left: 12px;
    top: 12px;
    z-index: 60;
    padding: 8px 12px;
    border-radius: 12px;
    background: rgba(0, 0, 0, 0.9);
    color: white;
  }
`;

const BurgerButton = styled.button`
  position: fixed;
  top: 12px;
  left: 12px;
  z-index: 50;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  width: 40px;
  border: 0;
  border-radius: 16px;
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  .icon {
    width: 20px;
    height: 20px;
  }
  &:hover {
    background: #f4f4f5;
  }
  &:focus-visible {
    outline: 2px solid #111827;
    outline-offset: 2px;
  }
`;

const Overlay = styled.div<{ $open: boolean }>`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.32);
  opacity: 0;
  pointer-events: none;
  transition: opacity 160ms ease;
  z-index: 40;
  ${({ $open }) =>
    $open &&
    css`
      opacity: 1;
      pointer-events: auto;
    `}
`;

const Sidebar = styled.aside<{ $open: boolean }>`
  position: fixed;
  top: 200px;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  background: white;
  box-shadow: 2px 0 16px rgba(0, 0, 0, 0.08);
  transform: translateY(100%);
  transition: transform 220ms ease;
  z-index: 45;
  border-radius: 20px 20px 0 0;
  ${({ $open }) =>
    $open &&
    css`
      transform: translateX(0);
    `}
`;

const SidebarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
  padding: 0 16px;
  border-bottom: 1px solid #e5e7eb;
`;

const MenuTitle = styled.h2`
  margin: 0;
  font-size: 16px;
  font-weight: 700;
`;

const CloseX = styled.button`
  border: 0;
  background: transparent;
  font-size: 28px;
  line-height: 1;
  padding: 0 4px;
  color: #6b7280;
  cursor: pointer;
  &:hover {
    color: #111827;
  }
  &:focus-visible {
    outline: 2px solid #111827;
    outline-offset: 2px;
  }
`;

const Nav = styled.nav`
  padding: 8px;
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
`;

const TopBar = styled.header`
  position: sticky;
  top: 0;
  z-index: 30;
  height: 56px;
  backdrop-filter: blur(6px);
  background: rgba(255, 255, 255, 0.85);
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  margin: 0 16px;
  span {
    font-size: 0.8rem;
  }
`;

const TopBarInner = styled.div`
  max-width: 1024px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 56px; /* 햄버거 버튼 영역 피해서 중앙 정렬 */
  strong {
    font-size: 14px;
    color: #374151;
  }
`;

const Main = styled.main`
  max-width: 640px;
  margin: 0 auto;
  padding-bottom: 100px;
  overflow: auto;
  @media (min-width: 640px) {
    padding: 24px;
  }
`;
