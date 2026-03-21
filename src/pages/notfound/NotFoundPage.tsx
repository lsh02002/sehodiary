import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Wrapper>
      <Card>
        <Code>404</Code>

        <Title>페이지를 찾을 수 없습니다</Title>

        <Description>
          요청하신 페이지가 존재하지 않거나
          <br />
          이동 또는 삭제되었을 수 있습니다.
        </Description>

        <ButtonGroup>
          <SecondaryButton onClick={() => navigate(-1)}>
            이전 페이지
          </SecondaryButton>

          <PrimaryButton onClick={() => navigate("/")}>
            홈으로 가기
          </PrimaryButton>
        </ButtonGroup>
      </Card>
    </Wrapper>
  );
};

export default NotFoundPage;

/* styled-components */

const Wrapper = styled.div`
  width: 100%;  
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px;
  box-sizing: border-box;
`;

const Card = styled.div`
  width: 100%;
  max-width: 480px;
  background: #ffffff;  
  padding: 48px 32px;
  text-align: center;
  box-sizing: border-box;
`;

const Code = styled.h1`
  font-size: 64px;
  font-weight: 800;
  margin-bottom: 12px;
  color: #111827;
`;

const Title = styled.h2`
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 12px;
  color: #111827;
`;

const Description = styled.p`
  font-size: 14px;
  line-height: 1.6;
  color: #6b7280;
  margin-bottom: 28px;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
`;

const BaseButton = styled.button`
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
`;

const PrimaryButton = styled(BaseButton)`
  background: #3b82f6;
  color: white;
  border: none;

  &:hover {
    background: #2563eb;
  }

  &:active {
    transform: scale(0.98);
  }
`;

const SecondaryButton = styled(BaseButton)`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  color: #111827;

  &:hover {
    border-color: #3b82f6;
    color: #3b82f6;
  }

  &:active {
    transform: scale(0.98);
  }
`;