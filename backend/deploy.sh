readonly PROJECT_NAME=junction23-backend

sam build
# hacky way to handle secrets
cp analyze/.env .aws-sam/build/AnalyzerFunction
sam deploy \
    --region eu-west-1 \
    --stack-name ${PROJECT_NAME} \
    --profile santeri-dev \
    --capabilities CAPABILITY_IAM \
    --no-confirm-changeset \
    --s3-bucket ${PROJECT_NAME}-sam