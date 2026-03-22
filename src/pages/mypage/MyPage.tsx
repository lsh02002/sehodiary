import { useLogin } from "../../context/LoginContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import MyDiaries from "./MyDiaries";
import MyComments from "./MyComments";
import MyActivityLogs from "./MyActivityLogs";
import MyInfo from "./MyInfo";
import { useScroll } from "../../context/ScrollContext";
import { useEffect } from "react";

const MyPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isLogin } = useLogin();
  const { mypageTab, setMypageTab } = useScroll();

  const tab = searchParams.get("tab");

  useEffect(() => {
    if (tab !== mypageTab) {
      navigate(`?tab=${mypageTab}`, { replace: true });
    }
  }, [mypageTab, tab, navigate]);

  const handleTabChange = (nextTab: "info" | "mydiary" | "activitylog") => {
    setMypageTab(nextTab);
    navigate(`?tab=${nextTab}`);
  };

  return (
    <>
      {isLogin ? (
        <div
          className="w-100 d-flex justify-content-center align-items-center"
          style={{ marginBottom: "100px" }}
        >
          <div className="w-100 d-flex flex-column justify-content-center align-items-center">
            <div
              role="tablist"
              aria-label="마이페이지 탭"
              className="w-100 d-flex justify-content-between align-items-center p-3 bg-white"
              style={{
                top: "50px",
                left: 0,
                zIndex: 10,
              }}
            >
              <h3
                role="tab"
                aria-selected={tab === "info"}
                tabIndex={0}
                onClick={() => handleTabChange("info")}
                className={`position-relative m-0 px-1 py-2 fw-bold fs-6 ${
                  tab === "info" ? "text-dark" : "text-secondary"
                }`}
                style={{ cursor: "pointer", userSelect: "none" }}
              >
                회원 정보
                <span
                  className="position-absolute start-0 rounded"
                  style={{
                    bottom: "-1px",
                    height: "3px",
                    width: tab === "info" ? "100%" : "0",
                    background: "#3b82f6",
                    transition: "width 0.2s ease",
                  }}
                />
              </h3>

              <h3
                role="tab"
                aria-selected={tab === "mydiary"}
                tabIndex={0}
                onClick={() => handleTabChange("mydiary")}
                className={`position-relative m-0 px-1 py-2 fw-bold fs-6 ${
                  tab === "mydiary" ? "text-dark" : "text-secondary"
                }`}
                style={{ cursor: "pointer", userSelect: "none" }}
              >
                내가쓴일기
                <span
                  className="position-absolute start-0 rounded"
                  style={{
                    bottom: "-1px",
                    height: "3px",
                    width: tab === "mydiary" ? "100%" : "0",
                    background: "#3b82f6",
                    transition: "width 0.2s ease",
                  }}
                />
              </h3>

              <h3
                role="tab"
                aria-selected={tab === "activitylog"}
                tabIndex={0}
                onClick={() => handleTabChange("activitylog")}
                className={`position-relative m-0 px-1 py-2 fw-bold fs-6 ${
                  tab === "activitylog" ? "text-dark" : "text-secondary"
                }`}
                style={{ cursor: "pointer", userSelect: "none" }}
              >
                활동 로그 내역
                <span
                  className="position-absolute start-0 rounded"
                  style={{
                    bottom: "-1px",
                    height: "3px",
                    width: tab === "activitylog" ? "100%" : "0",
                    background: "#3b82f6",
                    transition: "width 0.2s ease",
                  }}
                />
              </h3>
            </div>

            <div className="w-100 p-3" style={{ margin: "10px 0" }}>
              {tab === "info" && <MyInfo />}
              {tab === "mydiary" && (
                <>
                  <MyDiaries />
                  <MyComments />
                </>
              )}
              {tab === "activitylog" && <MyActivityLogs />}
            </div>
          </div>
        </div>
      ) : (
        <div>마이페이지는 로그인 후 이용할 수 있습니다.</div>
      )}
    </>
  );
};

export default MyPage;