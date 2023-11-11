const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { randomUUID } = require("node:crypto");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const client = new S3Client({ region: "eu-west-1" });

const URL_EXPIRATION_SECONDS = 300;

// expects file format as a query paramter. example: example.com/uploads?format=mp4
exports.handler = async (event) => {
  if (
    !event?.queryStringParameters?.format ||
    event.queryStringParameters.format.length > 4
  ) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "query parameter invalid: format" }),
    };
  }
  const format = event.queryStringParameters.format;
  return await getUploadURL(format);
};

const getUploadURL = async (format) => {
  const randomID = randomUUID();
  const key = `${randomID}.${format}`;

  const params = {
    Bucket: process.env.UploadBucket,
    Key: key,
    Expires: URL_EXPIRATION_SECONDS,
    ContentType: "video/mp4",
  };

  const command = new GetObjectCommand(params);
  try {
    const uploadUrl = await getSignedUrl(client, command, {
      expiresIn: URL_EXPIRATION_SECONDS,
    });
    return JSON.stringify({
      uploadUrl,
      key,
    });
  } catch (error) {
    console.error("Error generating signed URL: ", error);
    throw error;
  }
};
