import axios from "axios";
import { PresignedUrlPayload } from "./types";

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

export const uploadToS3 = async (presignedUrl: string, file: File) => {
  try {
    const res = await axios.put(presignedUrl, file, {
      headers: {
        "Content-Type": file.type,
      },
    });
    console.log("s3 res: ", res.data);
  } catch (error) {
    console.error(error);
    return null;
  }
};
