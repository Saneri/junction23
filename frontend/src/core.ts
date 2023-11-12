import { PresignedUrlPayload, StartAnalysisPayload } from "./services/types";
import { getPresignedUrl, startAnalysis, uploadToS3 } from "./services/uploads";

export const uploadFileToS3 = async (
  file: File
): Promise<PresignedUrlPayload | null> => {
  const format = getFileExtension(file.name);
  if (!format) {
    console.error("could not read file format");
    return null;
  }

  const presignedUrl = await getPresignedUrl(format);
  if (!presignedUrl) {
    console.error("got not fetch presigner url");
    return null;
  }
  await uploadToS3(presignedUrl.uploadUrl, file);
  return presignedUrl;
};

const getFileExtension = (filename: string): string => {
  const parts = filename.split(".");
  if (parts.length === 1) return ""; // File has no extension
  return parts[parts.length - 1];
};

export const analyze = async (
  filename: string
): Promise<StartAnalysisPayload | null> => {
  return startAnalysis(getVideoUri(filename));
};

const getVideoUri = (filename: string) => {
  return `http://junction23-storage.s3-website-eu-west-1.amazonaws.com/${filename}`;
};
