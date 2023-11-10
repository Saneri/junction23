import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import "./Dropzone.css";

const Dropzone = () => {
  const onDrop = useCallback((acceptedFiles: unknown) => {
    console.log(acceptedFiles);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <p className="upload-zone">
        {isDragActive
          ? "Drop the files here..."
          : "Drag 'n' drop some files here, or click to select files"}
      </p>
    </div>
  );
};

export default Dropzone;
