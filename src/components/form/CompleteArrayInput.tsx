import React, { useState, useEffect, useRef, useCallback } from "react";

type Option = { id: string; name: string };

export type CompleteArrayInputPropsType = {
  name?: string;
  title?: string;
  values: string[];
  setValues: React.Dispatch<React.SetStateAction<string[]>>;
  fetchOptions: (query: string) => Promise<Option[]>;
  createOption?: (name: string) => Promise<Option>;
  hydrateSelected?: (ids: string[]) => Promise<Option[]>;
  placeholder?: string;
  debounceMs?: number;
  maxMenuHeight?: number;
  onError?: (err: unknown) => void;
};

export const CompleteArrayInput: React.FC<CompleteArrayInputPropsType> = ({
  name,
  title,
  values,
  setValues,
  fetchOptions,
  createOption,
  hydrateSelected,
  placeholder = "추가...",
  debounceMs = 250,
  maxMenuHeight = 240,
  onError,
}) => {
  const [input, setInput] = useState("");
  const [options, setOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
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
    const nextName = input.trim();
    if (!nextName) return;
    try {
      setLoading(true);
      const created = await createOption(nextName);
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
    <div className="w-100 mb-3 position-relative">
      {title && <label className="form-label fw-semibold">{title}</label>}

      {values.length > 0 && (
        <div className="d-flex flex-wrap gap-2 mb-2">
          {values.map((id) => {
            const label = selectedMap.get(id)?.name ?? id;
            return (
              <span key={id} className="badge text-bg-secondary d-inline-flex align-items-center gap-1 px-3 py-2">
                {label}
                <button
                  type="button"
                  className="btn-close btn-close-white ms-1"
                  aria-label="삭제"
                  onClick={() => removeId(id)}
                  style={{ fontSize: "0.55rem" }}
                />
              </span>
            );
          })}
        </div>
      )}

      <input
        name={name}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        className="form-control"
      />

      <div className="mt-2" style={{ maxHeight: `${maxMenuHeight}px`, overflowY: "auto" }}>
        {!loading && createOption && input.trim() && (
          <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => handleCreate()}>
            “{input.trim()}” 추가
          </button>
        )}
      </div>
    </div>
  );
};
