import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import "./Dropzone.css";

const Dropzone = () => {
  const onDrop = useCallback((acceptedFile: File[]) => {
    console.log(`submit ${acceptedFile[0].name} for analyzing`);
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
