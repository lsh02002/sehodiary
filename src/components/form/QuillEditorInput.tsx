import React from "react";
import styled from "styled-components";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const QuillEditorInput = ({
  disabled,
  name,
  title,
  data,
  setData,
  rows = 6,
}: {
  disabled?: boolean;
  name: string;
  title: string;
  data: string;
  setData: (v: string) => void;
  rows?: number;
}) => {
  return (
    <Container $rows={rows}>
      <label htmlFor={name}>{title}</label>
      <EditorWrapper $rows={rows} $disabled={disabled}>
        <ReactQuill
          theme="snow"
          value={data}
          onChange={setData}
          readOnly={disabled}
          placeholder={`${title}을(를) 입력하세요`}
          modules={{
            toolbar: disabled
              ? false
              : [
                //   [{ header: [1, 2, 3, false] }], 나중에 필요하면 주석제거!
                  ["bold", "italic", "underline", "strike"],
                  [{ list: "ordered" }, { list: "bullet" }],
                  ["blockquote", "link"],
                  ["clean"],
                ],
          }}
        />
      </EditorWrapper>
    </Container>
  );
};

export default QuillEditorInput;

const Container = styled.div<{ $rows: number }>`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
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

  &:hover,
  &:focus {
    cursor: text;
  }

  @media (max-width: 640px) {
    label {
      font-size: 0.85rem;
    }
  }
`;

const EditorWrapper = styled.div<{ $rows: number; $disabled?: boolean }>`
  width: 100%;
  min-width: 0;

  .ql-toolbar {
    border: 1px solid #e5e7eb;
    border-bottom: none;
    border-radius: 12px 12px 0 0;
    background: ${({ $disabled }) => ($disabled ? "#f9fafb" : "#ffffff")};

    display: flex;
    flex-wrap: wrap;
    row-gap: 8px;
    column-gap: 4px;
    padding: 8px 10px;
    white-space: normal;
  }

  .ql-toolbar .ql-formats {
    display: inline-flex;
    align-items: center;
    flex-wrap: nowrap;
    margin-right: 8px;
    margin-bottom: 0;
  }

  .ql-container {
    border: 1px solid #e5e7eb;
    border-radius: ${({ $disabled }) => ($disabled ? "12px" : "0 0 12px 12px")};
    background: ${({ $disabled }) => ($disabled ? "#f9fafb" : "#ffffff")};
    color: #111827;
    line-height: 1.5;
    transition:
      border-color 0.2s ease,
      box-shadow 0.2s ease,
      background-color 0.2s ease;
    font-size: 0.95rem;
  }

  .ql-editor {
    min-height: ${({ $rows }) => `${Math.max($rows, 4) * 24 + 24}px`};
    padding: 12px 14px;
    word-break: break-word;
    overflow-wrap: anywhere;
  }

  .ql-editor.ql-blank::before {
    color: #9ca3af;
    font-style: normal;
  }

  .ql-container:focus-within,
  .ql-toolbar:focus-within {
    border-color: #3b82f6;
  }

  .ql-container:focus-within {
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.15);
  }

  .ql-disabled .ql-editor {
    color: #9ca3af;
    cursor: not-allowed;
  }

  @media (max-width: 640px) {
    .ql-toolbar {
      padding: 6px 8px;
      row-gap: 6px;
    }

    .ql-toolbar button,
    .ql-toolbar .ql-picker {
      flex-shrink: 0;
    }

    .ql-editor {
      font-size: 16px;
      min-height: ${({ $rows }) => `${Math.max($rows, 4) * 24 + 32}px`};
    }
  }
`;
