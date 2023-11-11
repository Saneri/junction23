const { LambdaClient, InvokeCommand } = require("@aws-sdk/client-lambda");

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

  const params = {
    FunctionName: targetFunctionName,
    InvocationType: "Event", // For asynchronous execution
    Payload: Buffer.from(JSON.stringify({ url: url, id: "?" })),
  };

  try {
    const command = new InvokeCommand(params);
    const response = await lambdaClient.send(command);

    // generate id somewhere here

    return {
      statusCode: 202,
      body: JSON.stringify({
        message: "Invocation started",
        id: "?",
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
