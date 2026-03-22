import { Dispatch, SetStateAction } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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
    <div className="w-100 mb-3">
      <style>{dateInputStyles}</style>

      <label className="form-label fw-semibold">{title}</label>
      <DatePicker
        disabled={disabled}
        className="form-control"
        dateFormat="yyyy-MM-dd"
        selected={selected ?? null}
        onChange={(date: Date | null) => setSelected(date ?? undefined)}
        placeholderText="날짜를 선택하세요"
        locale="ko"
        fixedHeight
        shouldCloseOnSelect
        withPortal
        portalId="app-datepicker-portal"
        popperProps={{
          placement: "bottom-start",
          strategy: "fixed",
        }}
      />
    </div>
  );
};

export default DateInput;

const dateInputStyles = `
.react-datepicker-popper {
  z-index: 9999;
}

.react-datepicker {
  font-size: 14px;
  border: 1px solid var(--bs-border-color, #dee2e6);
  border-radius: 0.375rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
  background: #fff;
}

.react-datepicker__header {
  background: var(--bs-light, #f8f9fa);
  border-bottom: 1px solid var(--bs-border-color, #dee2e6);
}

.react-datepicker__day--selected,
.react-datepicker__day--keyboard-selected {
  background: var(--bs-primary, #0d6efd);
  color: #fff;
}

.react-datepicker__day:hover {
  background: rgba(13, 110, 253, 0.1);
}
`;