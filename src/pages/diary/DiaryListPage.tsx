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
  const observerRef = useRef(null);

  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 60000); // 1분

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      const message = event.data;

      if (message?.type === "PUSH_MESSAGE") {
        const payload = message.payload;

        if (isLogin && userId != null) {
          if (userId === String(payload?.userId ?? null)) {
            setHasNewDiary(true);
          }
        } else {
          setHasNewDiary(true);
        }
      }
    }

    navigator.serviceWorker?.addEventListener("message", handleMessage);

    return () => {
      navigator.serviceWorker?.removeEventListener("message", handleMessage);
    };
  }, [isLogin, userId]);

  const loadData = useCallback(() => {
    if (isLogin && userId != null) {
      if (loading || !hasMore) return;

      setLoading(true);
      api
        .get(`/diary/${userId}/user?page=${page}&limit=10`)
        .then((res) => {
          setDiaryList((prev) => [...prev, ...(res.data?.content ?? [])]);
          setHasMore(res.data?.content.length > 0);
          setPage((prev) => prev + 1);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      if (loading || !hasMore) return;

      setLoading(true);
      api
        .get(`/diary/public?page=${page}&limit=10`)
        .then((res) => {
          setDiaryList((prev) => [...prev, ...(res.data?.content ?? [])]);
          setHasMore(res.data?.content.length > 0);
          setPage((prev) => prev + 1);
        })
        .catch(() => {})
        .finally(() => {
          setLoading(false);
        });
    }
  }, [hasMore, isLogin, loading, page, userId]);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && !loading && hasMore) {
          loadData();
        }
      },
      {
        threshold: 0.1,
      },
    );

    const current = observerRef.current;
    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, [loading, hasMore, loadData]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;

      if (scrollTop + windowHeight >= fullHeight - 200) {
        loadData();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, loading, hasMore]);

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
            setPage(0);
            setHasNewDiary(false);
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
