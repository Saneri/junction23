import json
from pydub import AudioSegment
import io
import os
import sys
print(sys.executable)


from dotenv import load_dotenv

load_dotenv()


def lambda_handler(event, context):    
    
    API_TOKEN = os.getenv('API_TOKEN')

    print(API_TOKEN)

    def extract_audio_from_mp4(mp4_file_path, output_audio_path):
        # Load the mp4 file
        video = AudioSegment.from_file(mp4_file_path, "mp4")

        # Export the audio
        video.export(output_audio_path, format="mp3")

    # Example usage

    file = io.BytesIO()

    extract_audio_from_mp4("video1.mp4", file)


    """Sample pure Lambda function

    Parameters
    ----------
    event: dict, required
        API Gateway Lambda Proxy Input Format

        Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format

    context: object, required
        Lambda Context runtime methods and attributes

        Context doc: https://docs.aws.amazon.com/lambda/latest/dg/python-context-object.html

    Returns
    ------
    API Gateway Lambda Proxy Output Format: dict

        Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
    """

    return {
        "statusCode": 200,
        "body": json.dumps({
            "message": "hello world",
        }),
    }
