import { getPresignedUrl } from "./services/uploads";

export const uploadFileToS3 = async (file: File): Promise<boolean> => {
  const format = getFileExtension(file.name);
  if (!format) {
    return false;
  }

  const presignedUrl = await getPresignedUrl(format);
  console.log(presignedUrl);
  return true;
};

const getFileExtension = (filename: string): string => {
  const parts = filename.split(".");
  if (parts.length === 1) return ""; // File has no extension
  return parts[parts.length - 1];
};
