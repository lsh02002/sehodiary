import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ReactDOM from "react-dom";

type Option = { label: string; value: string; disabled?: boolean };

type SelectArrayProps = {
  name: string;
  title: string;
  values: string[];
  setValues: (v: string[]) => void;
  options: Option[];
  placeholder?: string;
  maxMenuHeight?: number;
};

const SelectArrayInput = ({
  name,
  title,
  values,
  setValues,
  options,
  placeholder,
  maxMenuHeight = 220,
}: SelectArrayProps) => {
  const [open, setOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);

  const wrapRef = useRef<HTMLDivElement | null>(null);
  const boxRef = useRef<HTMLButtonElement | null>(null);

  const [menuPos, setMenuPos] = useState<{
    left: number;
    top: number;
    width: number;
    placedAbove: boolean;
    maxH: number;
  } | null>(null);

  const mapByValue = useMemo(
    () => new Map(options.map((o) => [o.value, o])),
    [options]
  );

  const toggleValue = (v: string) => {
    if (mapByValue.get(v)?.disabled) return;
    setValues(values.includes(v) ? values.filter((x) => x !== v) : [...values, v]);
  };

  const computeMenuPosition = useCallback(() => {
    if (!boxRef.current) return;
    const rect = boxRef.current.getBoundingClientRect();
    const viewportH = window.innerHeight;
    const spaceBelow = viewportH - rect.bottom;
    const spaceAbove = rect.top;

    const desiredH = Math.min(maxMenuHeight, Math.max(spaceBelow - 8, 160));
    const shouldFlip = desiredH < 160 && spaceAbove > spaceBelow;
    const heightIfAbove = Math.min(maxMenuHeight, Math.max(spaceAbove - 8, 160));
    const finalMaxH = shouldFlip ? heightIfAbove : Math.max(desiredH, 160);

    setMenuPos({
      left: Math.round(rect.left),
      top: Math.round(shouldFlip ? rect.top - 8 : rect.bottom + 8),
      width: Math.round(rect.width),
      placedAbove: shouldFlip,
      maxH: finalMaxH,
    });
  }, [maxMenuHeight]);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!wrapRef.current) return;
      const tgt = e.target as Node;
      if (!wrapRef.current.contains(tgt)) {
        setOpen(false);
        setFocusedIndex(-1);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  useEffect(() => {
    if (!open) return;
    computeMenuPosition();
    const onResize = () => computeMenuPosition();
    const onScroll = () => computeMenuPosition();
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, true);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll, true);
    };
  }, [open, maxMenuHeight, computeMenuPosition]);

  const handleBoxKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen((o) => !o);
      if (!open) {
        setFocusedIndex(0);
        requestAnimationFrame(computeMenuPosition);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!open) {
        setOpen(true);
        setFocusedIndex(0);
        requestAnimationFrame(computeMenuPosition);
      } else {
        setFocusedIndex((i) => Math.min(i + 1, options.length - 1));
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (open) setFocusedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Escape") {
      setOpen(false);
      setFocusedIndex(-1);
    }
  };

  const handleItemKeyDown = (e: React.KeyboardEvent, idx: number, v: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleValue(v);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedIndex((i) => Math.min(i + 1, options.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Escape") {
      setOpen(false);
      setFocusedIndex(-1);
      boxRef.current?.focus();
    } else if (e.key === "Tab") {
      setOpen(false);
      setFocusedIndex(-1);
    }
  };

  const isPlaceholder = values.length === 0;
  const selectedChips = values.map((v) => mapByValue.get(v)?.label || v).filter(Boolean);

  return (
    <div ref={wrapRef} className="w-100 mb-3 position-relative">
      <label htmlFor={name} className="form-label fw-semibold">
        {title}
      </label>

      <button
        id={name}
        ref={boxRef}
        type="button"
        className={`form-control text-start d-flex align-items-center justify-content-between gap-2 ${
          isPlaceholder ? "text-secondary" : ""
        }`}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => {
          setOpen((o) => !o);
          if (!open) {
            setFocusedIndex(0);
            requestAnimationFrame(computeMenuPosition);
          }
        }}
        onKeyDown={handleBoxKeyDown}
      >
        {isPlaceholder ? (
          <span>{placeholder || `${title}을(를) 선택하세요`}</span>
        ) : (
          <div className="d-flex gap-2 flex-wrap">
            {selectedChips.map((label, i) => (
              <span key={`${label}-${i}`} className="badge text-bg-light border text-dark">
                {label}
              </span>
            ))}
          </div>
        )}
        <span aria-hidden>▾</span>
      </button>

      {open &&
        menuPos &&
        ReactDOM.createPortal(
          <div
            className="position-fixed top-0 start-0 w-100 h-100"
            style={{ zIndex: 1050 }}
            onMouseDown={() => {
              setOpen(false);
              setFocusedIndex(-1);
            }}
          >
            <ul
              role="listbox"
              aria-multiselectable="true"
              className="dropdown-menu d-block p-2 shadow"
              style={{
                position: "fixed",
                left: `${menuPos.left}px`,
                top: `${menuPos.top}px`,
                width: `${menuPos.width}px`,
                maxHeight: `${menuPos.maxH}px`,
                overflow: "auto",
                zIndex: 1055,
                margin: 0,
                listStyle: "none",
              }}
              onMouseDown={(e) => e.stopPropagation()}
            >
              {options.length === 0 && (
                <li className="dropdown-item-text">해당 {title}이 없습니다.</li>
              )}

              {options.map((opt, idx) => {
                const checked = values.includes(opt.value);
                const disabled = !!opt.disabled;
                return (
                  <li
                    key={opt.value}
                    role="option"
                    aria-selected={checked}
                    tabIndex={0}
                    className={`dropdown-item d-flex align-items-center gap-2 ${
                      idx === focusedIndex ? "active" : ""
                    } ${disabled ? "disabled" : ""}`}
                    onClick={() => toggleValue(opt.value)}
                    onKeyDown={(e) => handleItemKeyDown(e, idx, opt.value)}
                    onMouseEnter={() => setFocusedIndex(idx)}
                    style={{ cursor: disabled ? "not-allowed" : "pointer" }}
                  >
                    <input
                      type="checkbox"
                      tabIndex={-1}
                      className="form-check-input mt-0"
                      checked={checked}
                      readOnly
                      disabled={disabled}
                    />
                    <span>{opt.label}</span>
                  </li>
                );
              })}
            </ul>
          </div>,
          document.body
        )}
    </div>
  );
};

export default SelectArrayInput;