import axios from "axios";
import { PresignedUrlPayload } from "./types";

const instance = axios.create({
  baseURL: "https://4syu65utv4.execute-api.eu-west-1.amazonaws.com",
});

export const getPresignedUrl = async (
  format: string
): Promise<PresignedUrlPayload | null> => {
  try {
    const res = await instance.get("/uploads", {
      params: { format },
    });
    return res.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};
