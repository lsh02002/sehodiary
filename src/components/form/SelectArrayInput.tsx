import React, { useEffect, useMemo, useRef, useState } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";

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
    // 플립 여부
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

  // 포털용 위치 계산
  const computeMenuPosition = () => {
    if (!boxRef.current) return;
    const rect = boxRef.current.getBoundingClientRect();
    const viewportH = window.innerHeight;
    const spaceBelow = viewportH - rect.bottom;
    const spaceAbove = rect.top;

    const desiredH = Math.min(maxMenuHeight, Math.max(spaceBelow - 8, 160)); // 기본 160px 확보
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
  };

  // 외부 클릭 닫기
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!wrapRef.current) return;
      const tgt = e.target as Node;
      // 포털 메뉴 영역은 body에 붙기 때문에, 버튼 래퍼만 확인하고 열려 있으면 닫기
      if (!wrapRef.current.contains(tgt)) {
        setOpen(false);
        setFocusedIndex(-1);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  // 열릴 때/윈도우 변화 시 위치 갱신
  useEffect(() => {
    if (!open) return;
    computeMenuPosition();
    const onResize = () => computeMenuPosition();
    const onScroll = () => computeMenuPosition();
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, true); // 스크롤 컨테이너에서도 반응
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll, true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, maxMenuHeight]);

  // 키보드 핸들링
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

  const handleItemKeyDown = (
    e: React.KeyboardEvent,
    idx: number,
    v: string
  ) => {
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
  const selectedChips = values
    .map((v) => mapByValue.get(v)?.label || v)
    .filter(Boolean);

  return (
    <Container ref={wrapRef}>
      <label htmlFor={name}>{title}</label>

      <SelectBox
        id={name}
        ref={boxRef}
        type="button"
        $isPlaceholder={isPlaceholder}
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
          <span className="placeholder">
            {placeholder || `${title}을(를) 선택하세요`}
          </span>
        ) : (
          <ChipRow>
            {selectedChips.map((label, i) => (
              <Chip key={`${label}-${i}`}>{label}</Chip>
            ))}
          </ChipRow>
        )}
        <Caret aria-hidden>▾</Caret>
      </SelectBox>

      {/* 포털로 메뉴 렌더링 */}
      {open &&
        menuPos &&
        ReactDOM.createPortal(
          <PortalBackdrop
            // 드롭다운 외부 클릭 닫기(모바일에서 특히 유용)
            onMouseDown={(e) => {
              // 메뉴 영역 이외 클릭 시 닫기
              setOpen(false);
              setFocusedIndex(-1);
            }}
          >
            <PortalMenu
              role="listbox"
              aria-multiselectable="true"
              $left={menuPos.left}
              $top={menuPos.top}
              $width={menuPos.width}
              $maxH={menuPos.maxH}
              onMouseDown={(e) => e.stopPropagation()} // 메뉴 내부 클릭은 유지
            >
              {options.length === 0 && <MenuItem>해당 {title}이 없습니다.</MenuItem>}

              {options.map((opt, idx) => {
                const checked = values.includes(opt.value);
                const disabled = !!opt.disabled;
                return (
                  <MenuItem
                    key={opt.value}
                    role="option"
                    aria-selected={checked}
                    tabIndex={0}
                    $focused={idx === focusedIndex}
                    $disabled={disabled}
                    onClick={() => toggleValue(opt.value)}
                    onKeyDown={(e) => handleItemKeyDown(e, idx, opt.value)}
                    onMouseEnter={() => setFocusedIndex(idx)}
                  >
                    <input
                      type="checkbox"
                      tabIndex={-1}
                      checked={checked}
                      readOnly
                      disabled={disabled}
                    />
                    <span>{opt.label}</span>
                  </MenuItem>
                );
              })}
            </PortalMenu>
          </PortalBackdrop>,
          document.body
        )}
    </Container>
  );
};

export default SelectArrayInput;

/* ====== 스타일 ====== */

const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  margin: 10px 0;
  position: relative;

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

const SelectBox = styled.button<{ $isPlaceholder: boolean }>`
  width: 100%;
  padding: 0.7rem;
  box-sizing: border-box;
  border: none;
  border-bottom: 1px solid lightgray;
  font-size: 0.95rem;
  outline: none;
  background: white;
  text-align: left;
  position: relative;
  background-color: transparent;

  &:hover {
    border-bottom: 1px solid #4680ff;
    cursor: pointer;
  }

  &:focus {
    border-bottom: 1px solid #4680ff;
  }

  .placeholder {
    color: gray;
    font-style: italic;
  }
`;

const Caret = styled.span`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-52%);
  pointer-events: none;
`;

const ChipRow = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
`;

const Chip = styled.span`
  padding: 2px 6px;
  border-radius: 12px;
  background: #f2f4f7;
  border: 1px solid #e5e7eb;
  font-size: 0.95rem;
`;

/** 포털 전체를 감싸는 백드롭(클릭 아웃 감지용, 투명) */
const PortalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9998; /* 메뉴 바로 아래 레이어 */
`;

/** 실제 드롭다운 메뉴(포털) */
const PortalMenu = styled.ul<{
  $left: number;
  $top: number;
  $width: number;
  $maxH: number;
}>`
  position: fixed;
  left: ${({ $left }) => `${$left}px`};
  top: ${({ $top }) => `${$top}px`};
  width: ${({ $width }) => `${$width}px`};
  margin: 0;
  padding: 6px 0;
  box-sizing: border-box;
  border-radius: 6px;
  border: 1px solid lightgray;
  background: white;
  max-height: ${({ $maxH }) => `${$maxH}px`};
  overflow: auto;  
  list-style: none;
  z-index: 9999; /* 최상단 */
  box-shadow: 0 6px 24px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.08);
`;

const MenuItem = styled.li<{
  $focused?: boolean;
  $disabled?: boolean;
}>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  font-size: 0.95rem;
  cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "pointer")};
  color: ${({ $disabled }) => ($disabled ? "gray" : "inherit")};
  background: ${({ $focused }) => ($focused ? "#f5f9ff" : "transparent")};
  width: 100%;

  &:hover {
    background: ${({ $disabled }) => ($disabled ? "transparent" : "#f5f9ff")};
  }

  input[type="checkbox"] {
    pointer-events: none;
  }
`;
