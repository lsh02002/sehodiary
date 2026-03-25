import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

interface DateInputProps {
  disabled?: boolean;
  title: string;
  selected: Date | undefined;
  setSelected: Dispatch<SetStateAction<Date | undefined>>;
}

const formatDate = (date?: Date) => {
  if (!date) return "";
  return date.toISOString().slice(0, 10);
};

const parseDate = (value: string): Date | undefined => {
  if (!value) return undefined;
  const parsed = new Date(value);
  return isNaN(parsed.getTime()) ? undefined : parsed;
};

const DateInput = ({ disabled, title, selected, setSelected }: DateInputProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(formatDate(selected));

  useEffect(() => {
    setInputValue(formatDate(selected));
  }, [selected]);

  return (
    <div className="date-input-wrap w-100 mb-3 position-relative">
      <style>{dateInputStyles}</style>

      <label className="form-label fw-semibold date-input-label">{title}</label>

      <div className="d-flex gap-2">
        <input
          type="text"
          className="form-control date-input-field"
          placeholder="yyyy-MM-dd"
          value={inputValue}
          disabled={disabled}
          onChange={(e) => {
            const value = e.target.value;
            setInputValue(value);

            const parsed = parseDate(value);
            if (parsed) {
              setSelected(parsed);
            }
          }}
        />

        <button
          type="button"
          className="btn date-input-button"
          onClick={() => setIsOpen(true)}
          disabled={disabled}
        >
          📅
        </button>
      </div>

      {isOpen && (
        <>
          <div className="calendar-backdrop" onClick={() => setIsOpen(false)} />
          <div className="calendar-modal">
            <Calendar
              onChange={(value) => {
                if (value instanceof Date) {
                  setSelected(value);
                  setInputValue(formatDate(value));
                  setIsOpen(false);
                }
              }}
              value={selected}
              locale="ko-KR"
              className="pretty-calendar"
              prev2Label={null}
              next2Label={null}
              formatDay={(_, date) => String(date.getDate())}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default DateInput;

const dateInputStyles = `
.date-input-label {
  margin-bottom: 8px;
  color: #111827;
  font-size: 14px;
}

.date-input-field {
  height: 44px;
  border-radius: 12px;
  border: 1px solid #d1d5db;
  box-shadow: none;
  transition: all 0.2s ease;
}

.date-input-field:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.12);
}

.date-input-button {
  min-width: 44px;
  height: 44px;
  border-radius: 12px;
  border: 1px solid #d1d5db;
  background: #ffffff;
  transition: all 0.2s ease;
}

.date-input-button:hover:not(:disabled) {
  background: #f9fafb;
  border-color: #c7d2fe;
}

.calendar-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  backdrop-filter: blur(3px);
  z-index: 9998;
  animation: fadeIn 0.18s ease;
}

.calendar-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: 9999;
  transform: translate(-50%, -50%);
  width: min(92vw, 380px);
  background: #ffffff;
  border-radius: 24px;
  padding: 18px;
  box-shadow:
    0 20px 60px rgba(15, 23, 42, 0.18),
    0 8px 24px rgba(15, 23, 42, 0.1);
  animation: popIn 0.2s ease;
}

/* react-calendar 커스텀 */
.pretty-calendar {
  width: 100%;
  border: none !important;
  background: transparent !important;
  font-family: inherit;
}

.pretty-calendar .react-calendar__navigation {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  height: 44px;
}

.pretty-calendar .react-calendar__navigation button {
  min-width: 40px;
  height: 40px;
  border: none;
  background: transparent;
  border-radius: 12px;
  color: #111827;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.2s ease;
}

.pretty-calendar .react-calendar__navigation button:hover {
  background: #f3f4f6;
}

.pretty-calendar .react-calendar__navigation button:disabled {
  background: transparent;
  color: #9ca3af;
}

.pretty-calendar .react-calendar__navigation__label {
  font-size: 16px;
  font-weight: 700;
  color: #111827;
}

.pretty-calendar .react-calendar__month-view__weekdays {
  margin-bottom: 8px;
  text-align: center;
}

.pretty-calendar .react-calendar__month-view__weekdays__weekday {
  padding: 8px 0;
  font-size: 12px;
  font-weight: 700;
  color: #6b7280;
  text-transform: uppercase;
}

.pretty-calendar .react-calendar__month-view__weekdays__weekday abbr {
  text-decoration: none;
}

.pretty-calendar .react-calendar__tile {
  position: relative;
  height: 44px;
  border: none;
  background: transparent;
  border-radius: 14px;
  font-size: 14px;
  font-weight: 500;
  color: #111827;
  transition: all 0.18s ease;
}

.pretty-calendar .react-calendar__tile:hover {
  background: #eef2ff;
  color: #4338ca;
}

.pretty-calendar .react-calendar__tile:disabled {
  background: transparent;
  color: #d1d5db;
}

.pretty-calendar .react-calendar__month-view__days__day--neighboringMonth {
  color: #cbd5e1;
}

.pretty-calendar .react-calendar__tile--now {
  background: #ede9fe !important;
  color: #6d28d9 !important;
  font-weight: 700;
}

.pretty-calendar .react-calendar__tile--active {
  background: linear-gradient(135deg, #6366f1, #8b5cf6) !important;
  color: white !important;
  font-weight: 700;
  box-shadow: 0 8px 20px rgba(99, 102, 241, 0.28);
}

.pretty-calendar .react-calendar__tile--hasActive {
  background: transparent;
}

.pretty-calendar .react-calendar__month-view__days {
  gap: 4px 0;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes popIn {
  from {
    opacity: 0;
    transform: translate(-50%, -46%) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}
`;