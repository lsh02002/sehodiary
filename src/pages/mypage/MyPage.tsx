import { useLogin } from "../../context/LoginContext";
import styled from "styled-components";
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

  const tab = searchParams.get("tab") || "info";

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
    <Container>
      <Wrapper>
        {isLogin && (
          <>
            <Title role="tablist" aria-label="마이페이지 탭">
              <TabH3
                role="tab"
                aria-selected={tab === "info"}
                $active={tab === "info"}
                tabIndex={0}
                onClick={() => handleTabChange("info")}
              >
                회원 정보
              </TabH3>

              <TabH3
                role="tab"
                aria-selected={tab === "mydiary"}
                $active={tab === "mydiary"}
                tabIndex={0}
                onClick={() => handleTabChange("mydiary")}
              >
                내가쓴일기
              </TabH3>

              <TabH3
                role="tab"
                aria-selected={tab === "activitylog"}
                $active={tab === "activitylog"}
                tabIndex={0}
                onClick={() => handleTabChange("activitylog")}
              >
                활동 로그 내역
              </TabH3>
            </Title>

            <Section>
              {tab === "info" && <MyInfo />}
              {tab === "mydiary" && (
                <>
                  <MyDiaries />
                  <MyComments />
                </>
              )}
              {tab === "activitylog" && <MyActivityLogs />}
            </Section>
          </>
        )}
      </Wrapper>
    </Container>
  );
};

export default MyPage;
const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const Title = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  box-sizing: border-box;
  top: 50px;
  left: 0;
  background-color: white;
  z-index: 10;

  h3 {
    font-weight: 500;
  }

  a {
    font-size: 0.7rem;
  }
`;

const TabH3 = styled.h3<{ $active?: boolean }>`
  position: relative;
  margin: 0;
  padding: 10px 4px;
  font-weight: 700;
  font-size: 1rem;
  color: ${({ $active }) => ($active ? "#111827" : "#6b7280")};
  cursor: pointer;
  user-select: none;

  &::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: -1px;
    height: 3px;
    width: ${({ $active }) => ($active ? "100%" : "0")};
    background: #3b82f6;
    border-radius: 2px;
    transition: width 0.2s ease;
  }

  &:hover {
    color: #111827;
  }
`;

const Section = styled.div`
  margin: 10px 0;
  padding: 20px;
  // margin-top: 70px;
  width: 100%;
  box-sizing: border-box;
`;
