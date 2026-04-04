import React, { useEffect, useRef, useState } from "react";
import ImageSliderPage from "../../pages/imageslider/ImageSliderPage";
import { DiaryResponseType } from "../../types/type";
import { useLocation } from "react-router-dom";

const ImageCard = ({
  diary,
  imageUrl,
}: {
  diary: DiaryResponseType;
  imageUrl: string;
}) => {
  const location = useLocation();
  const [imageOpen, setImageOpen] = useState(false);
  const modalHistoryPushedRef = useRef(false);

  useEffect(() => {
    setImageOpen(false);
    modalHistoryPushedRef.current = false;
  }, [location]);

  useEffect(() => {
    if (!imageOpen) return;
    if (diary?.imageResponses?.length <= 1) return;
    if (modalHistoryPushedRef.current) return;

    window.history.pushState({ imageModal: true }, "");
    modalHistoryPushedRef.current = true;

    const handlePopState = () => {
      if (modalHistoryPushedRef.current) {
        modalHistoryPushedRef.current = false;
        setImageOpen(false);
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [imageOpen, diary?.imageResponses?.length]);

  const handleOpenImage = () => {
    if (diary?.imageResponses?.length > 1) {
      setImageOpen(true);
    }
  };

  const handleCloseImage = () => {
    if (modalHistoryPushedRef.current) {
      modalHistoryPushedRef.current = false;
      window.history.back();
      return;
    }

    setImageOpen(false);
  };

  return (
    <>
      <div className="d-flex justify-content-center box-sizing-border-box py-2">
        <img
          style={{ objectFit: "fill", cursor: "pointer" }}
          width="100%"
          height="100%"
          src={imageUrl}
          alt="그림"
          onClick={handleOpenImage}
          className="rounded"
        />
      </div>

      {diary?.imageResponses?.length < 2 && (
        <div className="alert alert-warning image-view-min-required small">
          이미지 뷰는 이미지가 2개 이상이어야 합니다.
        </div>
      )}

      {imageOpen && diary?.imageResponses?.length > 1 && (
        <>
          <div
            role="presentation"
            onClick={handleCloseImage}
            aria-hidden={!imageOpen}
            className="position-fixed top-0 start-0 w-100 h-100"
            style={{ background: "rgba(0, 0, 0, 0.4)", zIndex: 1040 }}
          />
          <aside
            id="side-nav"
            aria-hidden={!imageOpen}
            className="position-fixed top-50 start-50 translate-middle bg-white rounded-4 shadow overflow-hidden"
            style={{
              zIndex: 1050,
              width: "min(780px, calc(100vw - 32px))",
              height: "min(640px, calc(100vh - 200px))",
            }}
          >
            <div
              className="d-flex align-items-center justify-content-between px-3 border-bottom"
              style={{ height: 56 }}
            >
              <h2 className="m-0 fs-6 fw-bold">
                이미지 슬라이더(사진 여러장 등록시)
              </h2>
              <button
                onClick={handleCloseImage}
                aria-label="슬라이더 닫기"
                className="btn btn-link text-secondary text-decoration-none p-0"
                style={{ fontSize: 28, lineHeight: 1 }}
              >
                ×
              </button>
            </div>
            <nav
              role="navigation"
              aria-label="주 메뉴"
              className="overflow-auto"
              style={{ height: "calc(100% - 56px)", padding: 8 }}
            >
              <ImageSliderPage diary={diary} />
            </nav>
          </aside>
        </>
      )}
    </>
  );
};

export default React.memo(ImageCard);