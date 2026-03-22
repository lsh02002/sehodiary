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
    <button
      type="button"
      className="btn btn-info rounded-circle position-fixed d-flex align-items-center justify-content-center p-0"
      disabled={disabled}
      onClick={onClick}
      style={{
        width: "50px",
        height: "50px",
        right: "10px",
        bottom: "80px",
        zIndex: 200,
      }}
    >
      {title}
    </button>
  );
};

export default AddDiaryButton;
