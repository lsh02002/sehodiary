import React, { useState, useEffect, useRef, useCallback } from "react";
import styled from "styled-components";

type Option = { id: string; name: string };

export type CompleteArrayInputPropsType = {
  name?: string;
  title?: string;
  values: string[];
  setValues: React.Dispatch<React.SetStateAction<string[]>>;
  fetchOptions: (query: string) => Promise<Option[]>;
  createOption?: (name: string) => Promise<Option>;
  deleteOption?: (id: string) => Promise<void>;
  hydrateSelected?: (ids: string[]) => Promise<Option[]>;
  placeholder?: string;
  debounceMs?: number;
  maxMenuHeight?: number;
  noOptionsText?: string;
  loadingText?: string;
  onError?: (err: unknown) => void;
};

export const CompleteArrayInput: React.FC<CompleteArrayInputPropsType> = ({
  name,
  title,
  values,
  setValues,
  fetchOptions,
  createOption,
  deleteOption,
  hydrateSelected,
  placeholder = "추가...",
  debounceMs = 250,
  maxMenuHeight = 240,
  noOptionsText = "검색 결과가 없어요",
  loadingText = "불러오는 중…",
  onError,
}) => {
  const [input, setInput] = useState("");
  const [options, setOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  // const [menuOpen, setMenuOpen] = useState(false);
  const [selectedMap, setSelectedMap] = useState<Map<string, Option>>(
    () => new Map()
  );
  const debounceRef = useRef<number | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setLoading(true);
    debounceRef.current = window.setTimeout(async () => {
      try {
        const list = await fetchOptions(input.trim());
        setOptions(list);
        setFocusedIndex(list.length ? 0 : -1);
      } catch (err) {
        onError?.(err);
      } finally {
        setLoading(false);
      }
    }, debounceMs);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [input, fetchOptions, debounceMs, onError]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (hydrateSelected) {
          const hydrated = await hydrateSelected(values);
          if (cancelled) return;
          const m = new Map<string, Option>();
          hydrated.forEach((o) => m.set(o.id, o));
          setSelectedMap(m);
        }
      } catch (err) {
        onError?.(err);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [values, hydrateSelected, onError]);

  const toggleId = useCallback(
    (id: string) => {
      setValues((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
      );
    },
    [setValues]
  );

  const addId = useCallback(
    (id: string) => {
      setValues((prev) => (prev.includes(id) ? prev : [...prev, id]));
    },
    [setValues]
  );

  const removeId = useCallback(
    (id: string) => {
      setValues((prev) => prev.filter((x) => x !== id));
    },
    [setValues]
  );

  const handleCreate = useCallback(async () => {
    if (!createOption) return;
    const name = input.trim();
    if (!name) return;
    try {
      setLoading(true);
      const created = await createOption(name);
      setOptions((prev) =>
        prev.some((o) => o.id === created.id) ? prev : [created, ...prev]
      );
      addId(created.id);
      setSelectedMap((prev) => {
        const m = new Map(prev);
        m.set(created.id, created);
        return m;
      });
      setInput("");
    } catch (err) {
      onError?.(err);
    } finally {
      setLoading(false);
    }
  }, [createOption, input, addId, onError]);

  // const handleDelete = useCallback(
  //   async (id: string) => {
  //     if (!deleteOption) return;
  //     try {
  //       setLoading(true);
  //       await deleteOption(id);
  //       setOptions((prev) => prev.filter((o) => o.id !== id));
  //       removeId(id);
  //       setSelectedMap((prev) => {
  //         const m = new Map(prev);
  //         m.delete(id);
  //         return m;
  //       });
  //     } catch (err) {
  //       onError?.(err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   },
  //   [deleteOption, removeId, onError]
  // );

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!options.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedIndex((i) => (i + 1) % options.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIndex((i) => (i - 1 + options.length) % options.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (focusedIndex >= 0 && focusedIndex < options.length) {
        toggleId(options[focusedIndex].id);
      } else if (createOption && input.trim()) {
        void handleCreate();
      }
    }
  };

  return (
    <Container
    // onBlur={() => setMenuOpen(false)}
    >
      {title && <Label>{title}</Label>}

      {values.length > 0 && (
        <SelectedList>
          {values.map((id) => {
            const label = selectedMap.get(id)?.name ?? id;
            return (
              <SelectedItem key={id}>
                {label}
                <RemoveButton onClick={() => removeId(id)}>✕</RemoveButton>
              </SelectedItem>
            );
          })}
        </SelectedList>
      )}

      <Input
        name={name}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={onKeyDown}
        // onFocus={()=>setMenuOpen(true)}
        placeholder={placeholder}
      />

      <Menu $maxHeight={maxMenuHeight}>
        {/* {loading && <InfoText>{loadingText}</InfoText>}
        {!loading && options.length === 0 && (
          <InfoText>{noOptionsText}</InfoText>
        )}
        {!loading &&
          menuOpen &&
          options.map((opt, idx) => {
            const active = idx === focusedIndex;
            const selected = values.includes(opt.id);
            return (
              <OptionRow key={opt.id} $active={active}>
                <OptionButton
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleId(opt.id);
                  }}
                >
                  <CheckBox>{selected ? "✓" : ""}</CheckBox>
                  {opt.name}
                </OptionButton>
                {deleteOption && (
                  <DeleteBtn onClick={() => handleDelete(opt.id)}>
                    삭제
                  </DeleteBtn>
                )}
              </OptionRow>
            );
          })} */}
        {!loading && createOption && input.trim() && (
          <CreateBtn onClick={() => handleCreate()}>
            “{input.trim()}” 추가
          </CreateBtn>
        )}
      </Menu>
    </Container>
  );
};

/* ---------------------- styled-components ---------------------- */

const Container = styled.div`
  width: 100%;
  font-family: system-ui, sans-serif;
  position: relative;
  margin: 10px 0;
  margin-bottom: 20px;

  &:hover {
    background-color: #f7f9fc;
  }
`;

const Label = styled.label`
  width: 100%;
  display: block;
  font-size: 0.95rem;
  font-weight: 500;
  color: black;
  margin-bottom: 4px;
`;

const SelectedList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 8px;
`;

const SelectedItem = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background-color: #f3f3f3;
  border-radius: 16px;
  padding: 4px 8px;
  font-size: 0.95rem;
`;

const RemoveButton = styled.button`
  border: none;
  background: transparent;
  color: #777;
  cursor: pointer;
  font-size: 0.95rem;
  &:hover {
    color: #000;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 8px 10px;
  border: none;
  border-bottom: 1px solid #ccc;
  outline: none;
  font-size: 0.95rem;
  box-sizing: border-box;
  background-color: transparent;
  &:hover,
  &:focus {
    border-bottom: 1px solid #007bff;
  }
`;

const Menu = styled.div<{ $maxHeight: number }>`
  border-radius: 6px;
  overflow-y: auto;
  max-height: ${(p) => p.$maxHeight}px;
  position: absolute;
  left: 0;
  right: 0;
  top: 100px;
`;

// const InfoText = styled.div`
//   padding: 8px 10px;
//   font-size: 0.85rem;
//   color: #666;
// `;

// const OptionRow = styled.div<{ $active: boolean }>`
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   padding: 6px 10px;
//   background-color: ${(p) => (p.$active ? "#f0f8ff" : "white")};
//   &:hover {
//     background-color: #f0f8ff;
//   }
// `;

// const OptionButton = styled.button`
//   flex: 1;
//   text-align: left;
//   background: none;
//   border: none;
//   padding: 0;
//   font-size: 0.9rem;
//   cursor: pointer;
// `;

// const CheckBox = styled.span`
//   display: inline-block;
//   width: 18px;
// `;

// const DeleteBtn = styled.button`
//   border: none;
//   background: none;
//   color: #d33;
//   font-size: 0.8rem;
//   cursor: pointer;
//   padding: 2px 6px;
//   border-radius: 4px;
//   &:hover {
//     background-color: #ffecec;
//   }
// `;

const CreateBtn = styled.button`
  width: 100%;
  padding: 8px 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 0 0 6px 6px;
  font-size: 0.95rem;
  cursor: pointer;
  &:hover {
    background-color: #0064d6;
  }
`;
