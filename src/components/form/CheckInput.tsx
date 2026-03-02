import React from "react";
import styled from "styled-components";

const CheckboxInput = ({
  disabled,
  name,
  title,
  checked,
  setChecked,
}: {
  disabled?: boolean;
  name: string;
  title: string;
  checked: boolean;
  setChecked: (v: boolean) => void;
}) => {
  return (
    <Container>
      <label htmlFor={name}>{title}</label>
      <CheckboxWrapper>
        <input
          type="checkbox"
          id={name}
          name={name}
          checked={checked}
          disabled={disabled}
          onChange={(e) => setChecked(e.target.checked)}
        />
      </CheckboxWrapper>
    </Container>
  );
};

export default CheckboxInput;

const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-direction: column;
  margin: 10px 0;

  label {
    width: 100%;
    display: block;
    margin-bottom: 8px;
    color: #111827;
    font-weight: 600;
    font-size: 0.9rem;
  }

  @media (max-width: 640px) {
    label {
      font-size: 0.85rem;
    }
  }
`;

const CheckboxWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;

  input[type="checkbox"] {
    appearance: none;
    width: 22px;
    height: 22px;
    border: 2px solid #e5e7eb;
    border-radius: 6px;
    background: #ffffff;
    cursor: pointer;
    transition: border-color 0.2s ease, background-color 0.2s ease,
      box-shadow 0.2s ease;

    display: flex;
    justify-content: center;
    align-items: center;

    &:checked {
      background-color: #3b82f6;
      border-color: #3b82f6;
    }

    &:checked::after {
      content: "✓";
      color: white;
      font-size: 16px;
      font-weight: bold;
    }

    &:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.15);
    }

    &:disabled {
      background: #f9fafb;
      border-color: #d1d5db;
      cursor: not-allowed;
    }
  }
`;
