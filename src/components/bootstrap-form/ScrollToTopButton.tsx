const ScrollToTopButton = ({
  disabled,
  title = "↑",
}: {
  disabled?: boolean;
  title?: string;
}) => {
  const handleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // 부드럽게 올라감
    });
  };

  return (
    <button
      type="button"
      className="btn btn-secondary rounded-circle position-fixed d-flex align-items-center justify-content-center p-0"
      disabled={disabled}
      onClick={handleClick}
      style={{
        width: "50px",
        height: "50px",
        right: "10px",
        bottom: "140px", // 🔥 기존 80px → 140px (위로 올림)
        zIndex: 200,
      }}
    >
      {title}
    </button>
  );
};

export default ScrollToTopButton;