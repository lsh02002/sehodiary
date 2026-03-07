import { useEffect, useState } from "react";
import styled from "styled-components";
import { getEmotionsApi } from "../../api/sehodiary-api";
import { EmotionResponseType } from "../../types/type";

type EmotionType = {
  value: string;
  label: string;
  emoji: string;
};

const EmotionSelectInput = ({
  disabled,
  name,
  title,
  data,
  setData,
}: {
  disabled?: boolean;
  name: string;
  title: string;
  data: string;
  setData: (v: string) => void;
}) => {
  const [emotions, setEmotions] = useState<EmotionType[]>([]);

  useEffect(() => {
    getEmotionsApi()
      .then((res) => {
        console.log(res);

        setEmotions(
          res?.data?.map((emotion: EmotionResponseType) => ({
            value: emotion.name,
            label: emotion.name,
            emoji: emotion.emoji,
          })),
        );
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);
  return (
    <Container>
      <label>{title}</label>

      <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
        {emotions.map((emotion) => (
          <button
            key={emotion.value}
            type="button"
            disabled={disabled}
            onClick={() => setData(emotion.value)}
            style={{
              padding: "8px 12px",
              borderRadius: "8px",
              border:
                data === emotion.value ? "2px solid #4CAF50" : "1px solid #ccc",
              background: data === emotion.value ? "#E8F5E9" : "white",
              cursor: "pointer",
            }}
          >
            {emotion.emoji} {emotion.label}
          </button>
        ))}
      </div>
    </Container>
  );
};

export default EmotionSelectInput;

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
