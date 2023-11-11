import { getPresignedUrl, uploadToS3 } from "./services/uploads";

export const uploadFileToS3 = async (file: File): Promise<boolean> => {
  const format = getFileExtension(file.name);
  if (!format) {
    console.error("could not read file format");
    return false;
  }

  const presignedUrl = await getPresignedUrl(format);
  if (!presignedUrl) {
    console.error("got not fetch presigner url");
    return false;
  }
  uploadToS3(presignedUrl.uploadUrl, file);
  return true;
};

const getFileExtension = (filename: string): string => {
  const parts = filename.split(".");
  if (parts.length === 1) return ""; // File has no extension
  return parts[parts.length - 1];
};
