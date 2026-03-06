import React, { useEffect, useState } from "react";
import { getLogMessagesByUserApi } from "../../api/sehodiary-api";
import { ActivityLogResponseType } from "../../types/type";
import { useLogin } from "../../context/LoginContext";
import styled from "styled-components";
import { useNavigate, useSearchParams } from "react-router-dom";

const MyPage = () => {
  const navigator = useNavigate();
  const [currentTab] = useSearchParams();
  const { isLogin } = useLogin();
  const [logMessages, setLogMessages] = useState([]);

  useEffect(() => {
    if (currentTab.get("tab") === "activitylog") {
      getLogMessagesByUserApi()
        .then((res) => {
          console.log(res);
          setLogMessages(res.data);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [currentTab]);

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
              currentTab.set("tab", "info");
              navigator(`?${currentTab.toString()}`);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ")
                currentTab.set("tab", "info");
              navigator(`?${currentTab.toString()}`);
            }}
          >
            회원 정보
          </TabH3>
          <TabH3
            role="tab"
            aria-selected={currentTab.get("tab") === "activitylog"}
            $active={currentTab.get("tab") === "activitylog"}
            tabIndex={0}
            onClick={() => {
              currentTab.set("tab", "activitylog");
              navigator(`?${currentTab.toString()}`);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ")
                currentTab.set("tab", "activitylog");
              navigator(`?${currentTab.toString()}`);
            }}
          >
            활동 로그 내역
          </TabH3>
        </Title>
      )}
      {currentTab.get("tab") === "info" && (
        <div
          style={{
            margin: "10px 0",
            padding: "15px",
            marginTop: "70px",
          }}
        >
          회원 정보란입니다.
        </div>
      )}
      {currentTab.get("tab") === "activitylog" && (
        <div
          style={{
            margin: "10px 0",
            padding: "15px",
            marginTop: "70px",
          }}
        >
          <div>활동 내역</div>
          {logMessages &&
            (logMessages?.length > 0 ? (
              logMessages?.map((log: ActivityLogResponseType) => (
                <div
                  key={log?.id}
                  style={{
                    margin: "10px 0",
                    padding: "15px",
                    borderRadius: "15px",
                    border: "1px solid gray",
                  }}
                >
                  <div>{log?.message}</div>
                  <div>{log?.createdAt}</div>
                </div>
              ))
            ) : (
              <div>해당 메시지가 없습니다!</div>
            ))}
        </div>
      )}
    </Wrapper>
  );
};

export default MyPage;

export const Wrapper = styled.div`
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
