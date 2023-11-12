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
      if (acceptedFiles[0]) {
        handleFileSubmit(acceptedFiles[0]);
      }
    },
    [handleFileSubmit]
  );
  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      accept: { "video/mp4": [".mp4"] },
    });

  return (
    <>
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        <p className="upload-zone">
          {isDragActive
            ? "Drop the files here..."
            : "Drag 'n' drop .mp4 file here, or click to select a file"}
        </p>
      </div>
      {!!fileRejections.length && (
        <div>invalid file type given: {fileRejections[0].file.name}</div>
      )}
    </>
  );
};

export default Dropzone;
