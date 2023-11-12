const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");

const RESULT_BUCKET = "junction23-storage-results";

const s3Client = new S3Client({ region: "eu-west-1" });

exports.handler = async (event) => {
  const id = event?.queryStringParameters?.id;
  if (!id) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "query parameter missing: id" }),
    };
  }

  const params = {
    Bucket: RESULT_BUCKET,
    Key: id,
  };

  const getCommand = new GetObjectCommand(params);

  try {
    const test = await s3Client.send(getCommand);
    console.error(test);

    return {
      statusCode: 200,
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 404,
      error,
    };
  }
};
