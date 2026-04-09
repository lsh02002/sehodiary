import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import {
  getDiariesByPublicApi,
  getDiariesTargetFollowingUserIdByUser,
} from "../../api/sehodiary-api";
import { DiaryResponseType } from "../../types/type";
import DiaryCard0 from "../../components/bootstrap-card/DiaryCard0";
import { useLogin } from "../../context/LoginContext";
import { useScroll } from "../../context/ScrollContext";
import { useParams } from "react-router-dom";
import UserProfileCard from "../../components/bootstrap-card/UserProfileCard";
import { BASE_URL } from "../../api/BASE_URL";

const DiaryListPage = () => {
  const { userId } = useParams();
  const { isLogin, diary } = useLogin();
  const { mainPageScroll } = useScroll();
  const [diaryList, setDiaryList] = useState<DiaryResponseType[]>([]);
  const [hasNewDiary, setHasNewDiary] = useState(false);

  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 60000); // 1분

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const eventSource = new EventSource(`${BASE_URL}/sse/posts`);

    eventSource.addEventListener("connect", (event) => {
      console.log("SSE connected:", event.data);
    });

    eventSource.addEventListener("new-post", (event) => {
      const data = JSON.parse(event.data ?? "");

      console.log("새 글 알림:", event.data);
      if (isLogin && userId != null) {
        if (userId === String(data?.userId)) setHasNewDiary(true);
      } else {
        setHasNewDiary(true);
      }
    });

    eventSource.onerror = (error) => {
      console.error("SSE error:", error);
    };

    return () => {
      eventSource.close();
    };
  }, [isLogin, userId]);

  const loadData = useCallback(() => {
    if (isLogin && userId != null) {
      getDiariesTargetFollowingUserIdByUser(Number(userId) ?? -1).then(
        (res) => {
          setDiaryList(res.data ?? []);
        },
      );
    } else {
      getDiariesByPublicApi()
        .then((res) => {
          setDiaryList(res.data);
        })
        .catch(() => {});
    }
  }, [isLogin, userId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    setDiaryList((prev) => {
      if (!prev) return prev;
      return prev.map((i) => (i.id === diary?.id ? diary : i));
    });
  }, [diary]);

  useLayoutEffect(() => {
    const raf = requestAnimationFrame(() => {
      window.scrollTo({
        left: mainPageScroll.x,
        top: mainPageScroll.y,
        behavior: "auto",
      });
    });

    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [diaryList?.length]);

  return (
    <div className="mt-3 px-3 mb-5" style={{ marginBottom: "100px" }}>
      {userId && <UserProfileCard userId={Number(userId)} />}
      {hasNewDiary && (
        <div
          style={{
            background: "#fff3cd",
            padding: "12px 16px",
            border: "1px solid #ffe69c",
            marginBottom: "16px",
            cursor: "pointer",
          }}
          onClick={() => {
            loadData();
            setHasNewDiary(false);
          }}
        >
          새로운 글이 올라와 있습니다. 새로고침하거나 이 메세지 클릭해주세요.
        </div>
      )}
      {diaryList && diaryList?.length > 0 ? (
        diaryList?.map((diary: DiaryResponseType) => (
          <DiaryCard0 key={diary?.id} diary0={diary} now={now} />
        ))
      ) : (
        <div>해당 글이 없습니다!</div>
      )}
    </div>
  );
};

export default DiaryListPage;
