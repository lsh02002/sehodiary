import React, {
  useCallback,
  useEffect,
  useLayoutEffect,  
  useRef,  
  useState,
} from "react";
import { api } from "../../api/sehodiary-api";
import { DiaryResponseType } from "../../types/type";
import DiaryCard0 from "../../components/bootstrap-card/DiaryCard0";
import { useLogin } from "../../context/LoginContext";
import { useScroll } from "../../context/ScrollContext";
import { useParams } from "react-router-dom";
import UserProfileCard from "../../components/bootstrap-card/UserProfileCard";
import InfiniteScroll from "react-infinite-scroll-component";

const DiaryListPage = () => {
  const { userId } = useParams();
  const { isLogin, diary } = useLogin();
  const { mainPageScroll } = useScroll();
  const [diaryList, setDiaryList] = useState<DiaryResponseType[]>([]);
  const [hasNewDiary, setHasNewDiary] = useState(false);

  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [now, setNow] = useState(Date.now());

  const restoredRef = useRef(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 60000); // 1분

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
  function handleMessage(event: MessageEvent) {
    console.log("[PAGE] raw message:", event.data);

    const message = event.data ?? {};

    let payload = message;

    if (message?.type === "PUSH_MESSAGE" || message?.type === "PUSH_DATA") {
      payload = message.payload ?? {};
    }

    console.log("[PAGE] normalized payload:", payload);

    const pushedUserId = payload?.userId;
    
    if (userId != null) {
      if (pushedUserId == null || String(pushedUserId) === "null") {
        setHasNewDiary(true);
        return;
      }

      if (String(userId) === String(pushedUserId)) {
        setHasNewDiary(true);
      }

      return;
    }

    // 공개 목록이면 그냥 표시
    setHasNewDiary(true);
  }

  navigator.serviceWorker?.addEventListener("message", handleMessage);

  return () => {
    navigator.serviceWorker?.removeEventListener("message", handleMessage);
  };
}, [userId]);

  const loadData = useCallback(
    (targetPage = page) => {
      if (loading) return;
      if (targetPage !== 0 && !hasMore) return;

      setLoading(true);

      const url =
        isLogin && userId != null
          ? `/diary/${userId}/user?page=${targetPage}&limit=10`
          : `/diary/public?page=${targetPage}&limit=10`;

      api
        .get(url)
        .then((res) => {
          const content = res.data?.content ?? [];

          if (targetPage === 0) {
            setDiaryList(content);
          } else {
            setDiaryList((prev) => [...prev, ...content]);
          }

          setHasMore(content.length > 0);
          setPage(targetPage + 1);
        })
        .catch(() => {})
        .finally(() => {
          setLoading(false);
        });
    },
    [hasMore, isLogin, loading, page, userId],
  );

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setDiaryList((prev) => {
      if (!prev) return prev;
      return prev.map((i) => (i.id === diary?.id ? diary : i));
    });
  }, [diary]);

  useLayoutEffect(() => {
  if (!diaryList?.length || restoredRef.current) return;
  restoredRef.current = true;

  const raf = requestAnimationFrame(() => {
    window.scrollTo(0, mainPageScroll.y);
  });

  return () => cancelAnimationFrame(raf);
}, [diaryList?.length, mainPageScroll.y]);

  return (
    <div className="mt-3 px-3 mb-5" style={{ marginBottom: "100px" }}>
      {userId && <UserProfileCard userId={Number(userId)} />}
      {hasNewDiary && (
        <div
          style={{
            position: "fixed",
            top: "110px", // 헤더/탭 아래로 조정 (필요하면 값 조절)
            left: "50%",
            transform: "translateX(-50%)",
            width: "100%",
            maxWidth: "640px",
            zIndex: 50,

            background: "#fff3cd",
            padding: "12px 16px",
            border: "1px solid #ffe69c",
            marginBottom: "16px",
            cursor: "pointer",
          }}
          onClick={() => {
            setHasNewDiary(false);
            setHasMore(true);
            loadData(0);
          }}
        >
          새로운 글이 올라와 있습니다. 새로고침하거나 이 메세지 클릭해주세요.
        </div>
      )}
      <div style={{ height: hasNewDiary ? "120px" : 0 }} />
      <InfiniteScroll
        dataLength={diaryList.length}
        next={loadData}
        hasMore={hasMore}
        loader={<p>불러오는 중...</p>}
        endMessage={<p>마지막 데이터입니다.</p>}
      >
        {diaryList && diaryList?.length > 0 ? (
          diaryList?.map((diary: DiaryResponseType) => (
            <DiaryCard0 key={diary?.id} diary0={diary} now={now} />
          ))
        ) : (
          <div>해당 글이 없습니다!</div>
        )}
      </InfiniteScroll>
    </div>
  );
};

export default DiaryListPage;
