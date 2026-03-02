// DateInput.tsx
import { Dispatch, SetStateAction } from "react";
import DatePicker from "react-datepicker";
import styled, { createGlobalStyle } from "styled-components";

// 기본 CSS
import "react-datepicker/dist/react-datepicker.css";

// 한국어 로케일
import { registerLocale } from "react-datepicker";
import { ko } from "date-fns/locale/ko";
registerLocale("ko", ko);

interface DateInputProps {
  disabled?: boolean;
  title: string;
  selected: Date | undefined;
  setSelected: Dispatch<SetStateAction<Date | undefined>>;
}

const DateInput = ({ disabled, title, selected, setSelected }: DateInputProps) => {
  return (
    <Container>
      <DatepickerGlobalFix />

      <label>{title}</label>
      <DatePicker
        disabled={disabled}
        className="datePicker"
        dateFormat="yyyy-MM-dd"
        selected={selected ?? null}
        onChange={(date: Date | null) => setSelected(date ?? undefined)}
        placeholderText="날짜를 선택하세요"
        locale="ko"
        fixedHeight
        shouldCloseOnSelect
        /* ✅ 부모 overflow를 넘어 body 위에서 뜨게 */
        withPortal
        portalId="app-datepicker-portal"
        /* ✅ 타입 에러 없는 범위에서 배치만 지정 */
        popperProps={{
          placement: "bottom-start",
          strategy: "fixed", // 부모의 overflow/transform 영향 최소화
        }}
      />
    </Container>
  );
};

export default DateInput;

/* ===== 스타일 ===== */

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: stretch;
  margin: 10px 0;
  height: 100%;

  label {
    width: 100%;
    display: block;
    margin-bottom: 8px;
    color: #111827;
    font-weight: 600;
    font-size: 0.9rem;
  }

  .datePicker {
    width: 100%;
    padding: 0.7rem;
    box-sizing: border-box;
    border: 1px solid lightgray;
    border-radius: 12px;
    font-size: 0.95rem;
    transition: border 0.2s ease-in-out;
    background-color: transparent;

    &:hover,
    &:focus {
      border: 1px solid #4680ff;
    }

    &::placeholder {
      color: gray;
      font-style: italic;
    }
  }
`;

/* 팝업이 다른 요소에 가려지지 않게 + 기본 룩 보정 */
const DatepickerGlobalFix = createGlobalStyle`
  .react-datepicker-popper { z-index: 9999; }

  .react-datepicker {    
    font-size: 14px;
    border: 1px solid #e6e6e6;
    box-shadow: 0 4px 12px rgba(0,0,0,0.06);
    border-radius: 8px;
    background: #fff;    
  }
  .react-datepicker__header {
    background: #fff;
    border-bottom: 1px solid #eee;
  }
  .react-datepicker__day--selected,
  .react-datepicker__day--keyboard-selected {
    background: #4680ff;
    color: #fff;
  }
  .react-datepicker__day:hover {
    background: #eef4ff;
  }
`;
