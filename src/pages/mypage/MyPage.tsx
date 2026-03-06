import { useLogin } from "../../context/LoginContext";
import styled from "styled-components";
import { useNavigate, useSearchParams } from "react-router-dom";
import MyDiaries from "./MyDiaries";
import MyComments from "./MyComments";
import MyActivityLogs from "./MyActivityLogs";
import MyInfo from "./MyInfo";

const MyPage = () => {
  const navigator = useNavigate();
  const [currentTab] = useSearchParams();
  const { isLogin } = useLogin();

  return (
    <Wrapper>
      {isLogin && (
        <Title>
          <TabH3
            role="tab"
            aria-selected={currentTab.get("tab") === "info"}
            $active={currentTab.get("tab") === "info"}
            tabIndex={0}
            onClick={() => {
              navigator(`?tab=info`);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") navigator(`?tab=info`);
            }}
          >
            회원 정보
          </TabH3>
          <TabH3
            role="tab"
            aria-selected={currentTab.get("tab") === "mydiary"}
            $active={currentTab.get("tab") === "mydiary"}
            tabIndex={0}
            onClick={() => {
              navigator(`?tab=mydiary`);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") navigator(`?tab=mydiary`);
            }}
          >
            내가쓴일기
          </TabH3>
          <TabH3
            role="tab"
            aria-selected={currentTab.get("tab") === "activitylog"}
            $active={currentTab.get("tab") === "activitylog"}
            tabIndex={0}
            onClick={() => {
              navigator(`?tab=activitylog`);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ")
                navigator(`?tab=activitylog`);
            }}
          >
            활동 로그 내역
          </TabH3>
        </Title>
      )}
      <Section>
        {currentTab.get("tab") === "info" && <MyInfo />}
        {currentTab.get("tab") === "mydiary" && (
          <>
            <MyDiaries />
            <MyComments />
          </>
        )}
        {currentTab.get("tab") === "activitylog" && <MyActivityLogs />}
      </Section>
    </Wrapper>
  );
};

export default MyPage;

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
  position: fixed;
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
  margin-top: 70px;
  width: 100%;
  box-sizing: border-box;
`;
