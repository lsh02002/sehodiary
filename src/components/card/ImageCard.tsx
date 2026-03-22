import React, { useState } from "react";
import styled, { css } from "styled-components";
import ImageSliderPage from "../../pages/imageslider/ImageSliderPage";
import { DiaryResponseType } from "../../types/type";

const ImageCard = ({
  diary,
  imageUrl,
}: {
  diary: DiaryResponseType;
  imageUrl: string;
}) => {
  const [imageOpen, setImageOpen] = useState(false);

  return (
    <>
      <Container>
        <img
          style={{ objectFit: "fill", cursor: "pointer" }}
          width="100%"
          height="100%"
          src={imageUrl}
          alt="그림"
          onClick={() => setImageOpen(true)}
        />
      </Container>

      {imageOpen && (
        <>
          <Overlay
            role="presentation"
            $imageOpen={imageOpen}
            onClick={() => setImageOpen(false)}
            aria-hidden={!imageOpen}
          />
          <Sidebar
            id="side-nav"
            $imageOpen={imageOpen}
            aria-hidden={!imageOpen}
          >
            <SidebarHeader>
              <MenuTitle>이미지 슬라이더(사진 여러장 등록시)</MenuTitle>
              <CloseX
                onClick={() => setImageOpen(false)}
                aria-label="슬라이더 닫기"
              >
                ×
              </CloseX>
            </SidebarHeader>
            <Nav role="navigation" aria-label="주 메뉴">
              <ImageSliderPage diary={diary} />
            </Nav>
          </Sidebar>
        </>
      )}
    </>
  );
};

export default ImageCard;

const Container = styled.div`
  display: flex;
  justify-content: center;
  box-sizing: border-box;
  padding: 10px 0;
`;

const Overlay = styled.div<{ $imageOpen: boolean }>`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 200;

  opacity: 0;
  pointer-events: none;
  transition: opacity 220ms ease;

  ${({ $imageOpen }) =>
    $imageOpen &&
    css`
      opacity: 1;
      pointer-events: auto;
    `}
`;

const Sidebar = styled.aside<{ $imageOpen: boolean }>`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  box-sizing: border-box;
  background: white;
  box-shadow: 2px 0 16px rgba(0, 0, 0, 0.08);
  border-radius: 20px;
  z-index: 300;

  width: min(780px, calc(100vw - 32px));
  height: min(640px, calc(100vh - 200px));
  overflow: hidden;

  opacity: 0;
  pointer-events: none;

  ${({ $imageOpen }) =>
    $imageOpen &&
    css`
      opacity: 1;
      pointer-events: auto;
      transform: translate(-50%, -50%) scale(1);
    `}
`;

const SidebarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
  padding: 0 16px;
  border-bottom: 1px solid #e5e7eb;
`;

const MenuTitle = styled.h2`
  margin: 0;
  font-size: 16px;
  font-weight: 700;
`;

const CloseX = styled.button`
  border: 0;
  background: transparent;
  font-size: 28px;
  line-height: 1;
  padding: 0 4px;
  color: #6b7280;
  cursor: pointer;

  &:hover {
    color: #111827;
  }

  &:focus-visible {
    outline: 2px solid #111827;
    outline-offset: 2px;
  }
`;

const Nav = styled.nav`
  height: calc(100% - 56px);
  padding: 8px;
  box-sizing: border-box;
  overflow-y: auto;
  overflow-x: hidden;
`;
