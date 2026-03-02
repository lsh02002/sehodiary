import React from "react";
import styled from "styled-components";

const ConfirmButton = ({
  disabled,
  title,
  onClick,
}: {
  disabled?: boolean;
  title: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}) => {
  return <Button disabled={disabled} onClick={onClick}>{title}</Button>;
};

export default ConfirmButton;

const Button = styled.button`
  width: 100%;
  padding: 12px 14px;
  margin-top: 24px;
  border: 1px solid transparent;
  border-radius: 12px;
  color: #ffffff;
  background-color: #3b82f6;
  font-size: 1rem;
  font-weight: 600;
  box-shadow: 0 2px 6px rgba(59, 130, 246, 0.4);
  transition: background-color 0.2s ease, box-shadow 0.2s ease,
    transform 0.02s ease;
  &:hover {
    background-color: #2563eb;
    box-shadow: 0 4px 10px rgba(37, 99, 235, 0.35);
  }
  &:active {
    transform: translateY(1px);
  }
  &:disabled {
    background-color: #93c5fd;
    cursor: not-allowed;
    box-shadow: none;
  }
`;
