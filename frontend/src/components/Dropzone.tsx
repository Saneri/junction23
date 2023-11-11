import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import "./Dropzone.css";

type DropzoneProps = {
  handleFileSubmit: (file: File) => void;
};

const Dropzone = (props: DropzoneProps) => {
  const { handleFileSubmit } = props;
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      handleFileSubmit(acceptedFiles[0]);
    },
    [handleFileSubmit]
  );
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
