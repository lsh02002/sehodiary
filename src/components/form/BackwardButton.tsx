import { useNavigate } from "react-router-dom";

export function BackwardButton() {
  const navigate = useNavigate();

  return (
    <span
      role="button"
      onClick={() => navigate(-1)}
      style={{ cursor: "pointer", fontSize: "32px", padding: "16px" }}
      aria-label="뒤로가기"
    >
      ←
    </span>
  );
}
