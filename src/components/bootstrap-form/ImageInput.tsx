import { useEffect, useState } from "react";

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
    setPreviewUrls([]);
  };

  return (
    <div className="w-100 mb-3">
      <label htmlFor={name} className="form-label fw-semibold">
        {title}
      </label>

      <input
        type="file"
        id={name}
        name={name}
        accept="image/*"
        multiple
        disabled={disabled}
        onChange={handleChange}
        className="form-control"
      />

      <div className="d-flex flex-wrap justify-content-center gap-2 mt-3">
        {previewUrls.map((url, i) => (
          <img
            key={`old-${i}`}
            src={url}
            alt={`old-${i}`}
            className="rounded border"
            style={{ width: 120, height: 120, objectFit: "cover" }}
          />
        ))}

        {filePreviewUrls.map((url, i) => (
          <img
            key={`new-${i}`}
            src={url}
            alt={`new-${i}`}
            className="rounded border"
            style={{ width: 120, height: 120, objectFit: "cover" }}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageInput;
