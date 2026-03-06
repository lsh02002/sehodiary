import React, { useEffect, useState } from "react";
import { ActivityLogResponseType } from "../../types/type";
import { getLogMessagesByUserApi } from "../../api/sehodiary-api";
import { useLogin } from "../../context/LoginContext";
import ActivityLogCard from "../../components/card/ActivityLogCard";

const MyActivityLogs = () => {
  const { isLogin } = useLogin();
  const [logMessages, setLogMessages] = useState([]);

  useEffect(() => {
    if (isLogin) {
      getLogMessagesByUserApi()
        .then((res) => {
          console.log(res);
          setLogMessages(res.data);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [isLogin]);

  return (
    <>
      <div>내 활동 내역</div>
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
