import axios from "axios";
import { PresignedUrlPayload, StartAnalysisPayload } from "./types";

const apiGatewayInstance = axios.create({
  baseURL: "https://4syu65utv4.execute-api.eu-west-1.amazonaws.com",
});

export const getPresignedUrl = async (
  format: string
): Promise<PresignedUrlPayload | null> => {
  try {
    const res = await apiGatewayInstance.get("/uploads", {
      params: { format },
    });
    return res.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const startAnalysis = async (
  url: string
): Promise<StartAnalysisPayload | null> => {
  try {
    const res = await apiGatewayInstance.get("/analyze", {
      params: { url },
    });
    return res.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getResult = async (id: string): Promise<string | null> => {
  try {
    const res = await apiGatewayInstance.get("/result", {
      params: { id },
    });
    console.log("result: ", res.data);
    return res.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const uploadToS3 = async (
  presignedUrl: string,
  file: File
): Promise<boolean> => {
  try {
    const res = await axios.put(presignedUrl, file, {
      headers: {
        "Content-Type": file.type,
      },
    });
    if (res.status !== 200) {
      return false;
    }
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};
