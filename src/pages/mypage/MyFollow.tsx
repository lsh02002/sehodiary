import React, { useEffect, useState } from 'react';
import { UserInfoResponseType } from '../../types/type';
import {
  createFollowApi,
  getDiscoverListByUserApi,
  getFollowerListByUserApi,
  getFollowingListByUserApi,
  showToast,
} from '../../api/sehodiary-api';
import SelectInput from '../../components/bootstrap-form/SelectInput';
import ConfirmButton from '../../components/bootstrap-form/ConfirmButton';
import FollowCard from '../../components/bootstrap-card/FollowCard';

const MyFollow = () => {
  const [targetUserId, setTargetUserId] = useState<number>(-1);
  const [userList, setUserList] = useState<UserInfoResponseType[]>([]);
  const [followingList, setFollowingList] = useState<UserInfoResponseType[]>([]);
  const [followerList, setFollowerList] = useState<UserInfoResponseType[]>([]);
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    Promise.all([
      getDiscoverListByUserApi(),
      getFollowingListByUserApi(),
      getFollowerListByUserApi(),
    ])
      .then(([discoverRes, followingRes, followerRes]) => {
        setUserList(discoverRes.data);
        setFollowingList(followingRes.data);
        setFollowerList(followerRes.data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [refresh]);

  const handleFollowSubmit = async () => {
    createFollowApi(targetUserId)
      .then(() => {
        showToast('팔로우에 성공했습니다.', 'success');
        setRefresh(prev => !prev);
      })
      .catch(() => {});
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-4">
        <p className="text-muted">불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="pb-4">

      {/* 유저 선택 */}
      <div className="mb-3">
        <SelectInput
          disabled={userList.length < 1}
          name="userlist"
          title="유저리스트"
          value={String(targetUserId)}
          setValue={(v: string) => setTargetUserId(Number(v))}
          options={userList.map((user: UserInfoResponseType) => ({
            label: user.nickname,
            value: String(user.userId),
          }))}
        />
      </div>

      {/* 팔로우 버튼 */}
      <div className="mb-4">
        <ConfirmButton
          disabled={userList.length < 1}
          title="팔로우 하기"
          onClick={handleFollowSubmit}
        />
      </div>

      {/* 팔로잉 */}
      <h4 className="fw-bold mb-3">팔로잉 ({followingList.length})</h4>
      {followingList.length > 0 ? (
        followingList.map((user: UserInfoResponseType) => (
          <FollowCard
            key={String(user.userId)}
            user={user}
            isFollowing={true}
          />
        ))
      ) : (
        <div className="bg-light rounded text-center py-4 mb-3">
          <p className="text-muted mb-0">팔로잉이 없습니다!</p>
        </div>
      )}

      {/* 팔로워 */}
      <h4 className="fw-bold mt-3 mb-3">팔로워 ({followerList.length})</h4>
      {followerList.length > 0 ? (
        followerList.map((user: UserInfoResponseType) => (
          <FollowCard
            key={String(user.userId)}
            user={user}
            isFollowing={false}
          />
        ))
      ) : (
        <div className="bg-light rounded text-center py-4">
          <p className="text-muted mb-0">팔로워가 없습니다!</p>
        </div>
      )}
    </div>
  );
};

export default MyFollow;