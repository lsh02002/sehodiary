import React, { useEffect, useLayoutEffect, useState } from "react";
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

const DiaryListPage = () => {
  const { userId } = useParams();
  const { isLogin, diary } = useLogin();
  const { mainPageScroll } = useScroll();
  const [diaryList, setDiaryList] = useState<DiaryResponseType[]>([]);

  useEffect(() => {
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
      {diaryList && diaryList?.length > 0 ? (
        diaryList?.map((diary: DiaryResponseType) => (
          <DiaryCard0 key={diary?.id} diary0={diary} />
        ))
      ) : (
        <div>해당 글이 없습니다!</div>
      )}
    </div>
  );
};

export default DiaryListPage;
