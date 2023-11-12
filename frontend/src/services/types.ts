export type PresignedUrlPayload = {
  uploadUrl: string;
  key: string;
};

export type StartAnalysisPayload = {
  message: string;
  id: string;
};
