import styled from "styled-components";

export const CardContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  margin-bottom: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  background: #ffffff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
  box-sizing: border-box;
  transition: box-shadow 0.2s ease, transform 0.2s ease, border-color 0.2s ease;
  &:hover {
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
    border-color: #d1d5db;
  }
`;

export const CardWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const IdField = styled.div`
  color: #4680ff;
  font-weight: 600;
  margin-bottom: 4px;
  transition: color 0.15s ease;

  ${CardContainer}:hover & {
    color: #2e63d4;
  }
`;

export const IconAndNameField = ({
  icon,
  name,
}: {
  icon: React.ReactNode;
  name: string;
}) => {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      {icon}
      <NameField>{name}</NameField>
    </div>
  );
};

export const NameField = styled.div`
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 4px;
  color: black;
`;

export const SlugField = styled.div`
  color: gray;
  font-size: 0.9rem;
  font-style: italic;
`;

export const EditButtonField = styled.span`
  color: #4680ff;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    text-decoration: underline;
    opacity: 0.85;
  }

  &:active {
    opacity: 0.6;
  }
`;

export const ButtonsField = styled.div`
  width: 100px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
`;

export const InfoBoxField = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-direction: column;
`;
