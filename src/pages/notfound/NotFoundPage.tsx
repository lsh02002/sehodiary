import React from "react";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="d-flex justify-content-center align-items-center w-100 p-4">
      <div
        className="bg-white text-center p-5"
        style={{ maxWidth: "480px", width: "100%" }}
      >
        <h1 className="fw-bold mb-3" style={{ fontSize: "64px" }}>
          404
        </h1>

        <h2 className="fw-bold mb-3" style={{ fontSize: "22px" }}>
          페이지를 찾을 수 없습니다
        </h2>

        <p className="text-secondary mb-4" style={{ fontSize: "14px", lineHeight: "1.6" }}>
          요청하신 페이지가 존재하지 않거나
          <br />
          이동 또는 삭제되었을 수 있습니다.
        </p>

        <div className="d-flex justify-content-center gap-2 flex-wrap">
          <button
            className="btn btn-outline-secondary px-3 py-2 fw-semibold"
            onClick={() => navigate(-1)}
          >
            이전 페이지
          </button>

          <button
            className="btn btn-primary px-3 py-2 fw-semibold"
            onClick={() => navigate("/")}
          >
            홈으로 가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;