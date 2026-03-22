import styled from "styled-components";

const AddDiaryButton = ({
  disabled,
  title,
  onClick,
}: {
  disabled?: boolean;
  title: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}) => {
  return (
    <Button type="button" disabled={disabled} onClick={onClick}>
      {title}
    </Button>
  );
};

export default AddDiaryButton;

const Button = styled.button`
  position: fixed;
  width: 50px;
  height: 50px;
  border-radius: 25px;
  border: none;
  background-color: lightblue;
  font-size: 25px;
  right: 10px;
  bottom: 80px;
  z-index: 200;
`;
