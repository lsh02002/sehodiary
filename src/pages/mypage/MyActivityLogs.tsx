import React, { useCallback, useEffect, useRef, useState } from "react";
import { ActivityLogResponseType } from "../../types/type";
import { getLogMessagesByUserApi } from "../../api/sehodiary-api";
import ActivityLogCard from "../../components/bootstrap-card/ActivityLogCard";
import { useScrollStore } from "../../zustand/ZustandScroll";

const MyActivityLogs = () => {
  const [logMessages, setLogMessages] = useState([]);
  const { scrolls, setScroll } = useScrollStore();

  const scrollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    getLogMessagesByUserApi()
      .then((res) => {
        setLogMessages(res.data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (logMessages?.length === 0) return;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.scrollTo(0, scrolls.myActivityLog.y ?? 0);
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logMessages?.length]);

  const handleWindowScroll = useCallback(() => {
    if (scrollTimer.current) {
      clearTimeout(scrollTimer.current);
    }

    scrollTimer.current = setTimeout(() => {
      setScroll("myActivityLog", {
        x: window.scrollX,
        y: window.scrollY,
        page: 0,
      });
    }, 150);
  }, [setScroll]);

  useEffect(() => {
    window.addEventListener("scroll", handleWindowScroll);

    return () => {
      window.removeEventListener("scroll", handleWindowScroll);

      if (scrollTimer.current) {
        clearTimeout(scrollTimer.current);
      }
    };
  }, [handleWindowScroll]);

  return (
    <>
      <div>내 활동 내역({logMessages?.length})</div>
      {logMessages &&
        (logMessages?.length > 0 ? (
          logMessages?.map((log: ActivityLogResponseType) => (
            <ActivityLogCard key={log?.id} log={log} />
          ))
        ) : (
          <div>해당 메시지가 없습니다!</div>
        ))}
    </>
  );
};

export default MyActivityLogs;
