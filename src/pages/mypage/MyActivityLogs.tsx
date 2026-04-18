import React, { useEffect, useLayoutEffect, useState } from "react";
import { ActivityLogResponseType } from "../../types/type";
import { getLogMessagesByUserApi } from "../../api/sehodiary-api";
import ActivityLogCard from "../../components/bootstrap-card/ActivityLogCard";
import { useScroll } from "../../context/ScrollContext";

const MyActivityLogs = () => {
  const [logMessages, setLogMessages] = useState([]);
  const { scrolls } = useScroll();

  useEffect(() => {
    getLogMessagesByUserApi()
      .then((res) => {
        setLogMessages(res.data);
      })
      .catch(() => {});
  }, []);

  useLayoutEffect(() => {
    if (!logMessages || logMessages.length === 0) return;

    const raf = requestAnimationFrame(() => {
      window.scrollTo({
        left: scrolls.myActivityLog.x,
        top: scrolls.myActivityLog.y,
        behavior: "auto",
      });
    });

    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logMessages]);

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
