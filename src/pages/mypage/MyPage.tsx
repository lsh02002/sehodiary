import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useLogin } from "../../context/LoginContext";
import { useScroll } from "../../context/ScrollContext";

import MyDiaries from "./MyDiaries";
import MyComments from "./MyComments";
import MyActivityLogs from "./MyActivityLogs";
import MyInfo from "./MyInfo";
import MyFollow from "./MyFollow";

type MyPageTab = "follow" | "info" | "mydiary" | "activitylog";

const DEFAULT_TAB: MyPageTab = "follow";

const TAB_ITEMS: { key: MyPageTab; label: string }[] = [
  { key: "follow", label: "팔로우" },
  { key: "info", label: "회원 정보" },
  { key: "mydiary", label: "내가쓴일기" },
  { key: "activitylog", label: "활동 로그 내역" },
];

const MyPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isLogin } = useLogin();
  const { mypageTab, setMypageTab } = useScroll();

  const rawTab = searchParams.get("tab");
  const validTabs = TAB_ITEMS.map((item) => item.key);

  const tab: MyPageTab = validTabs.includes(rawTab as MyPageTab)
    ? (rawTab as MyPageTab)
    : DEFAULT_TAB;

  useEffect(() => {
    if (!rawTab || !validTabs.includes(rawTab as MyPageTab)) {
      setSearchParams({ tab: DEFAULT_TAB }, { replace: true });
    }
  }, [rawTab, setSearchParams, validTabs]);

  useEffect(() => {
    if (mypageTab !== tab) {
      setMypageTab(tab);
    }
  }, [mypageTab, tab, setMypageTab]);

  const handleTabChange = (nextTab: MyPageTab) => {
    setSearchParams({ tab: nextTab });
  };

  const renderTabContent = () => {
    switch (tab) {
      case "follow":
        return <MyFollow />;
      case "info":
        return <MyInfo />;
      case "mydiary":
        return (
          <>
            <MyDiaries />
            <MyComments />
          </>
        );
      case "activitylog":
        return <MyActivityLogs />;
      default:
        return null;
    }
  };

  if (!isLogin) {
    return <div>마이페이지는 로그인 후 이용할 수 있습니다.</div>;
  }

  return (
    <div
      className="w-100 d-flex justify-content-center align-items-center"
      style={{ marginBottom: "100px" }}
    >
      <div className="w-100 d-flex flex-column justify-content-center align-items-center">
        <div
          role="tablist"
          aria-label="마이페이지 탭"
          className="w-100 d-flex justify-content-between align-items-center p-3 bg-white position-fixed"
          style={{
            top: "50px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 10,
            width: "100%",
            maxWidth: 640,
          }}
        >
          {TAB_ITEMS.map((item) => {
            const isActive = tab === item.key;

            return (
              <h3
                key={item.key}
                role="tab"
                aria-selected={isActive}
                tabIndex={0}
                onClick={() => handleTabChange(item.key)}
                className={`position-relative m-0 px-1 py-2 fw-bold fs-6 ${
                  isActive ? "text-dark" : "text-secondary"
                }`}
                style={{ cursor: "pointer", userSelect: "none" }}
              >
                {item.label}
                <span
                  className="position-absolute start-0 rounded"
                  style={{
                    bottom: "-1px",
                    height: "3px",
                    width: isActive ? "100%" : "0",
                    background: "#3b82f6",
                    transition: "width 0.2s ease",
                  }}
                />
              </h3>
            );
          })}
        </div>

        <div className="w-100 p-3" style={{ margin: "10px 0" }}>
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default MyPage;
