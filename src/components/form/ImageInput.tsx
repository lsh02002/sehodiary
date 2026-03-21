import { useEffect, useState } from "react";
import styled from "styled-components";

const ImageInput = ({
  disabled,
  name,
  title,
  data,
  setData,
  previewUrls,
  setPreviewUrls,
}: {
  disabled?: boolean;
  name: string;
  title: string;
  data: File[];
  setData: (files: File[]) => void;
  previewUrls: string[];
  setPreviewUrls: React.Dispatch<React.SetStateAction<string[]>>;
}) => {
  const [filePreviewUrls, setFilePreviewUrls] = useState<string[]>([]);

  useEffect(() => {
    const urls = data.map((file) => URL.createObjectURL(file));
    setFilePreviewUrls(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [data]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const selected = Array.from(files).slice(0, 4);
    setData(selected);
    setPreviewUrls([]); // 새 파일 선택 시 기존 이미지 숨김
  };

  return (
    <Container>
      <label htmlFor={name}>{title}</label>

      <input
        type="file"
        id={name}
        name={name}
        accept="image/*"
        multiple
        disabled={disabled}
        onChange={handleChange}
      />

      <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
        {previewUrls.map((url, i) => (
          <img
            key={`old-${i}`}
            src={url}
            alt={`old-${i}`}
            style={{
              width: 120,
              height: 120,
              objectFit: "cover",
              borderRadius: 8,
            }}
          />
        ))}

        {filePreviewUrls.map((url, i) => (
          <img
            key={`new-${i}`}
            src={url}
            alt={`new-${i}`}
            style={{
              width: 120,
              height: 120,
              objectFit: "cover",
              borderRadius: 8,
            }}
          />
        ))}
      </div>
    </Container>
  );
};

export default ImageInput;

const Container = styled.div`
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

  input {
    width: 100%;
    padding: 12px 14px;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    background: #ffffff;
    box-sizing: border-box;
    color: #111827;
    line-height: 1.5;
    transition:
      border-color 0.2s ease,
      box-shadow 0.2s ease,
      background-color 0.2s ease;
    &:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.15);
    }
    &::placeholder {
      color: #9ca3af;
    }
    &:disabled {
      background: #f9fafb;
      color: #9ca3af;
      cursor: not-allowed;
    }
  }

  &:hover,
  &:focus {
    /* border-bottom: 1px solid #4680ff; */
    cursor: text;
  }

  &::placeholder {
    color: gray;
    font-style: italic;
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
