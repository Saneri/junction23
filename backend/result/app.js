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
    Key: `${id}.txt`,
  };

  const getCommand = new GetObjectCommand(params);

  try {
    const data = await s3Client.send(getCommand);

    if (!data.Body) {
      return {
        statusCode: 404,
        error,
      };
    }

    const stream = data.Body;
    const chunks = [];

    for await (const chunk of stream) {
      chunks.push(chunk);
    }

    const fileContent = Buffer.concat(chunks).toString("utf-8");

    return JSON.stringify({
      text: fileContent,
    });
  } catch (error) {
    console.error(error);
    return {
      statusCode: 404,
      error,
    };
  }
};
