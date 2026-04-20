import React, { useEffect, useState } from "react";
import { UserInfoResponseType } from "../../types/type";
import { useLogin } from "../../recoil/RecoilLogin";
import { getOtherUserInfoApi } from "../../api/sehodiary-api";

function UserProfileCard({ userId }: { userId: number }) {
  const [user, setUser] = useState<UserInfoResponseType>();
  const { isLogin } = useLogin();

  useEffect(() => {
    if (!isLogin || !userId) return;

    getOtherUserInfoApi(userId)
      .then((res) => {
        setUser(res.data);
      })
      .catch(() => {});
  }, [isLogin, userId]);

  return (
    <div className="card mb-4 border-0 shadow-sm rounded-4 p-3">
      <div className="d-flex align-items-center gap-3">
        {/* 프로필 이미지 */}
        <img
          src={user?.profileImage || "https://via.placeholder.com/72"}
          alt="profile"
          className="rounded-circle"
          style={{
            width: 72,
            height: 72,
            objectFit: "cover",
            backgroundColor: "#f3f4f6",
          }}
        />

        {/* 컨텐츠 */}
        <div className="flex-grow-1">
          <div className="fw-bold fs-5 mb-2">{user?.nickname}</div>

          <div
            className="text-muted mb-2"
            style={{ fontSize: "14px", lineHeight: "1.5" }}
          >
            {user?.introduction || "소개글이 없습니다."}
          </div>

          <div className="d-flex gap-3" style={{ fontSize: "13px" }}>
            <div className="text-dark">팔로워 {user?.followerCounter ?? 0}</div>
            <div className="text-dark">
              팔로잉 {user?.followingCounter ?? 0}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(UserProfileCard);
