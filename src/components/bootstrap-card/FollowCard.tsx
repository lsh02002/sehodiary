import React from 'react';
import { UserInfoResponseType } from '../../types/type';
import { useNavigate } from 'react-router-dom';

type Props = {
  user: UserInfoResponseType;
  onPressFollow?: () => void;
  isFollowing?: boolean;
};

const FollowCard = ({ user, onPressFollow, isFollowing }: Props) => {
  const navigate = useNavigate();

  const handleMoveDiary = () => {
    navigate(`/${user?.userId}`);
  };

  return (
    <div className="card mb-3 shadow-sm border-0 rounded-4">
      <div className="card-body">
        <div className="d-flex align-items-center gap-3">
          {user?.profileImage ? (
            <img
              src={user.profileImage}
              alt={user?.nickname ?? 'profile'}
              className="rounded-circle object-fit-cover"
              style={{
                width: '44px',
                height: '44px',
                backgroundColor: '#e5e7eb',
              }}
            />
          ) : (
            <div
              className="rounded-circle bg-light d-flex align-items-center justify-content-center text-secondary"
              style={{ width: '44px', height: '44px', fontSize: '20px' }}
            >
              👤
            </div>
          )}

          <div className="flex-grow-1">
            <div className="fw-semibold text-dark">
              {user?.nickname ?? ''}
            </div>
          </div>

          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            onClick={handleMoveDiary}
          >
            다이어리 보기
          </button>

          {onPressFollow && (
            <button
              type="button"
              className={`btn btn-sm ${
                isFollowing ? 'btn-secondary' : 'btn-primary'
              }`}
              onClick={onPressFollow}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(FollowCard);