import React from "react";
import styled from "styled-components";

export type Option = {
  label: string;
  value: string;
  disabled?: boolean;
};

const SelectInput = ({
  disabled,
  name,
  title,
  value,
  setValue,
  options,
  placeholder,
}: {
  disabled?: boolean;
  name: string;
  title: string;
  value: string;
  setValue: (v: string) => void;
  options: Option[];
  placeholder?: string;
}) => {
  const isPlaceholder = value === "";

  return (
    <Container>
      <label htmlFor={name}>{title}</label>
      <SelectEl
        disabled={disabled}
        name={name}
        id={name}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        $isPlaceholder={isPlaceholder}
      >
        {placeholder && (
          <option
            style={{ color: "darkgray", fontStyle: "italic" }}
            value=""
            disabled
          >
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} disabled={opt.disabled}>
            {opt.label}
          </option>
        ))}
      </SelectEl>
    </Container>
  );
};

export default SelectInput;

const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  margin: 10px 0;
  height: auto;
  box-sizing: border-box;

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
    input,
    select,
    textarea {
      font-size: 16px;
      padding: 12px;
      min-height: 44px;
    }
  }
`;

const SelectEl = styled.select<{ $isPlaceholder: boolean }>`
  width: 100%;
  padding: 0.7rem;
  font-size: 0.95rem;
  background: white;
  border-radius: 12px;
  background-color: transparent;
  border: 1px solid lightgray;
  box-sizing: border-box;

  /* placeholder 상태일 때만 스타일 적용 */
  color: ${({ $isPlaceholder }) => ($isPlaceholder ? "darkgray" : "inherit")};
  font-style: ${({ $isPlaceholder }) => ($isPlaceholder ? "italic" : "normal")};

  &:hover {
    border: 1px solid #4680ff;
    cursor: pointer;
  }
  &:focus {
    border: 1px solid #4680ff;
  }

  option {
    color: black;
    font-style: normal;
  }
`;
