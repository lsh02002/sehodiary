import { useEffect, useState } from "react";
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
        setEmotions(
          res?.data?.map((emotion: EmotionResponseType) => ({
            value: emotion.name,
            label: emotion.name,
            emoji: emotion.emoji,
          }))
        );
      })
      .catch(() => {});
  }, []);

  return (
    <div className="w-100 mb-3">
      <label htmlFor={name} className="form-label fw-semibold">
        {title}
      </label>

      <div className="d-flex flex-wrap gap-2 mt-2">
        {emotions.map((emotion) => {
          const isActive = data === emotion.emoji || data === emotion.value;
          return (
            <button
              key={emotion.emoji}
              id={name}
              type="button"
              disabled={disabled}
              onClick={() => setData(emotion.emoji)}
              className={`btn ${isActive ? "btn-success" : "btn-outline-secondary"}`}
            >
              {emotion.emoji} {emotion.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default EmotionSelectInput;
