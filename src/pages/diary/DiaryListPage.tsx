import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import { api } from "../../api/sehodiary-api";
import { DiaryResponseType } from "../../types/type";
import DiaryCardOne from "../../components/bootstrap-card/DiaryCardOne";
import { useLogin } from "../../recoil/RecoilLogin";
import { useScroll } from "../../recoil/RecoilScroll";
import { useParams } from "react-router-dom";
import UserProfileCard from "../../components/bootstrap-card/UserProfileCard";
import InfiniteScroll from "react-infinite-scroll-component";
import { DEBUG } from "../../api/DEBUG";

const DiaryListPage = () => {
  const queryClient = useQueryClient();

  const { userId } = useParams();
  const { isLogin, diary } = useLogin();
  const { scrolls, setScrolls } = useScroll();

  const [diaryList, setDiaryList] = useState<DiaryResponseType[]>([]);
  const [hasNewDiary, setHasNewDiary] = useState(false);

  const [page, setPage] = useState(0); // next page index
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [now, setNow] = useState(Date.now());

  const isFollowPage = isLogin && userId != null;
  const savedScroll = isFollowPage ? scrolls.mainFollowPage : scrolls.mainPage;

  const scrollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (DEBUG) {
        console.log("[PAGE] raw message:", event.data);
      }

      const message = event.data ?? {};
      let payload = message;

      if (message?.type === "PUSH_MESSAGE" || message?.type === "PUSH_DATA") {
        payload = message.payload ?? {};
      }

      if (DEBUG) {
        console.log("[PAGE] normalized payload:", payload);
      }

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

      setHasNewDiary(true);
    }

    navigator.serviceWorker?.addEventListener("message", handleMessage);

    return () => {
      navigator.serviceWorker?.removeEventListener("message", handleMessage);
    };
  }, [userId]);

  const mergeUniqueById = (
    prev: DiaryResponseType[],
    next: DiaryResponseType[],
  ) => {
    const seen = new Set(prev.map((v) => v.id));
    return [...prev, ...next.filter((v) => !seen.has(v.id))];
  };

  const getUrl = useCallback(
    (targetPage: number) => {
      return isFollowPage
        ? `/diary/${userId}/user?page=${targetPage}&limit=10`
        : `/diary/public?page=${targetPage}&limit=10`;
    },
    [isFollowPage, userId],
  );

  const diaryQueryBaseKey = useCallback(() => {
    return ["diary-list", isFollowPage ? `follow-${userId}` : "public"];
  }, [isFollowPage, userId]);

  const fetchPage = useCallback(
    async (targetPage: number, force = false) => {
      const queryKey = [...diaryQueryBaseKey(), targetPage];

      const queryFn = async () => {
        const res = await api.get(getUrl(targetPage));
        return res.data?.content ?? [];
      };

      if (force) {
        queryClient.removeQueries({ queryKey, exact: true });

        return queryClient.fetchQuery({
          queryKey,
          queryFn,
          staleTime: 1000 * 60 * 5,
          gcTime: 1000 * 60 * 30,
        });
      }

      return queryClient.ensureQueryData({
        queryKey,
        queryFn,
        revalidateIfStale: false,
      });
    },
    [diaryQueryBaseKey, getUrl, queryClient],
  );

  const loadData = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    try {
      const content = await fetchPage(page);

      setDiaryList((prev) => {
        const merged = mergeUniqueById(prev, content);
        setHasMore(content.length > 0);
        setPage((p) => p + 1);
        return merged;
      });
    } catch (e) {
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasMore, loading, fetchPage]);

  // 최초 진입 시: 저장된 page까지 먼저 복구
  useLayoutEffect(() => {
    let cancelled = false;

    const restoreDataAndScroll = async () => {
      try {
        const targetPageCount = Math.max(savedScroll.page ?? 0, 0);

        let merged: DiaryResponseType[] = [];
        let lastHasMore = true;

        for (let i = 0; i < targetPageCount; i += 1) {
          const content = await fetchPage(i);

          if (cancelled) return;

          merged = i === 0 ? content : mergeUniqueById(merged, content);

          if (content.length === 0) {
            lastHasMore = false;
            break;
          }
        }

        setDiaryList(() => {
          const nextPage = merged.length === 0 ? 0 : targetPageCount;

          setPage(nextPage);
          setHasMore(lastHasMore);

          return merged;
        });

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            if (cancelled) return;
            window.scrollTo(0, savedScroll.y ?? 0);
          });
        });
      } catch (e) {
        if (cancelled) return;
      }
    };

    restoreDataAndScroll();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 스크롤 저장
  const handleScroll = useCallback(() => {
    const nextY = window.scrollY;
    const nextX = window.scrollX;

    if (scrollTimer.current) {
      clearTimeout(scrollTimer.current);
    }

    scrollTimer.current = setTimeout(() => {
      setScrolls((prev) =>
        isFollowPage
          ? {
              ...prev,
              mainFollowPage: {
                x: nextX,
                y: nextY,
                page,
              },
            }
          : {
              ...prev,
              mainPage: {
                x: nextX,
                y: nextY,
                page,
              },
            },
      );
    }, 150);
  }, [isFollowPage, page, setScrolls]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleScroll]);

  useEffect(() => {
    setDiaryList((prev) => {
      if (!prev) return prev;
      return prev.map((i) => (i.id === diary?.id ? diary : i));
    });
  }, [diary]);

  return (
    <div className="mt-3 px-3 mb-5" style={{ marginBottom: "100px" }}>
      <div className="ms-3 me-3 p-1 bg-secondary-subtle">
        rss주소: https://sehodiary.vercel.app/rss.xml
      </div>
      {userId && <UserProfileCard userId={Number(userId)} />}

      {hasNewDiary && (
        <div
          style={{
            position: "fixed",
            top: "110px",
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
          onClick={async () => {
            setHasNewDiary(false);
            setHasMore(true);
            setPage(0);

            queryClient.removeQueries({
              queryKey: diaryQueryBaseKey(),
              exact: false,
            });

            const content = await fetchPage(0, true);
            setDiaryList(content);
            setPage(1);
            setHasMore(content.length > 0);

            window.scrollTo(0, 0);
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
        loader={<></>}
        endMessage={<p>마지막 데이터입니다.</p>}
      >
        {diaryList.map((diary: DiaryResponseType) => (
          <DiaryCardOne key={diary.id} diary0={diary} now={now} />
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default DiaryListPage;
