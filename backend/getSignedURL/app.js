const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { randomUUID } = require("node:crypto");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const client = new S3Client({ region: "eu-west-1" });

const URL_EXPIRATION_SECONDS = 300;

exports.handler = async (event) => {
  return await getUploadURL(event);
};

const getUploadURL = async (event) => {
  const randomID = randomUUID();
  const Key = `${randomID}.mp4`;

  const params = {
    Bucket: process.env.UploadBucket,
    Key,
    Expires: URL_EXPIRATION_SECONDS,
    ContentType: "video/mp4",
  };

  const command = new GetObjectCommand(params);
  try {
    const uploadURL = await getSignedUrl(client, command, {
      expiresIn: URL_EXPIRATION_SECONDS,
    });
    return JSON.stringify({
      uploadURL,
      Key,
    });
  } catch (error) {
    console.error("Error generating signed URL: ", error);
    throw error;
  }
};
