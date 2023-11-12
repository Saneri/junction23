const { LambdaClient, InvokeCommand } = require("@aws-sdk/client-lambda");
const { randomUUID } = require("node:crypto");

const lambdaClient = new LambdaClient({ region: "eu-west-1" });

exports.handler = async (event) => {
  const url = event?.queryStringParameters?.url;
  if (!url) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "query parameter missing: url" }),
    };
  }

  const targetFunctionName = "junction23-backend-AnalyzerFunction";
  const result_id = randomUUID();

  const params = {
    FunctionName: targetFunctionName,
    InvocationType: "Event", // For asynchronous execution
    Payload: Buffer.from(JSON.stringify({ url: url, id: result_id })),
  };

  try {
    const command = new InvokeCommand(params);
    await lambdaClient.send(command);

    return {
      statusCode: 202,
      body: JSON.stringify({
        message: "Invocation started",
        id: result_id,
      }),
    };
  } catch (error) {
    console.error("Error invoking Lambda function:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error invoking function" }),
    };
  }
};
