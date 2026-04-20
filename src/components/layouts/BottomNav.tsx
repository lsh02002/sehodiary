import Home from "../../assets/home.svg";
import MyPage from "../../assets/dashboard.svg";
import { NavLink } from "react-router-dom";
import { useLogin } from "../../recoil/RecoilLogin";

const navLinkBaseClass =
  "d-flex flex-column align-items-center justify-content-center flex-fill text-decoration-none small text-secondary";

const getNavLinkClass = ({ isActive }: { isActive: boolean }) =>
  `${navLinkBaseClass} ${isActive ? "text-primary fw-semibold" : ""}`;

const iconStyle: React.CSSProperties = {
  width: "2rem",
  height: "2rem",
  marginBottom: "4px",
};

const BottomNav = () => {
  const { isLogin, open, setOpen } = useLogin();

  const handleNavClick = () => {
    if (open) {
      setOpen(false);
    }
  };

  return (
    <nav
      className="position-fixed bottom-0 start-0 end-0 border-top bg-white"
      style={{ zIndex: 200, height: "70px" }}
    >
      <div
        className="container-fluid h-100 d-flex align-items-center justify-content-evenly px-0"
        style={{ fontSize: "0.8rem" }}
      >
        <NavLink to="/" className={getNavLinkClass} onClick={handleNavClick}>
          <div>
            <img src={Home} alt="홈" style={iconStyle} />
          </div>
          <div>홈</div>
        </NavLink>

        {isLogin && (
          <NavLink
            to="/mypage?tab=follow"
            className={getNavLinkClass}
            onClick={handleNavClick}
          >
            <div>
              <img src={MyPage} alt="마이페이지" style={iconStyle} />
            </div>
            <div>마이페이지</div>
          </NavLink>
        )}
      </div>
    </nav>
  );
};

export default BottomNav;
