import os
os.environ["PATH"] += os.pathsep + '/opt/ffmpeg/bin'

import json
from pydub import AudioSegment
import requests
import io
# import os
# import requests
from requests_toolbelt.multipart.encoder import MultipartEncoder
# import numpy as np
import boto3
import openai
from dotenv import load_dotenv

load_dotenv()

RESULTS_BUCKET = "junction23-storage-results"
API_TOKEN = os.getenv('API_TOKEN')


# temp_transcript = "Hi, my name is Patrick and I'm from the team Finish Fast and we did the challenge from CGI and the city of Turku. Now our task was to prevent social isolation and loneliness. And what we've been doing this weekend is learn about in what kind of situations people feel lonely or they feel like they're not part of a group. And what we learned is that very often loneliness is accompanied by unemployment or otherwise a disconnect from your most important social communities. And very often these kinds of people in Finland might be immigrants when they don't have these social networks that you might have back at home. And what we've noticed is that the biggest obstacle for forming these connections and becoming part of these communities is the Finnish language. So our solution is actually very simple. We just need to teach the Finnish language faster than anyone else. And that is what we're going to do. We have a free month language learning boot camp what we're going to organize. And you might think that, well, are there already some language courses in Finland? And of course, there's many of them, but they fail to teach Finnish on a working proficiency quickly enough so that it would be useful. So how our program works is that we take 20 students. We help them over a period of three months. And after that, we help them land a job. And if they get the job, then we're going to take a small percentage off their salary. And then we're going to use that to fund the upcoming courses. Now, over time, we wish to become the number one place for teaching Finnish by using our platform to also learn better how we can teach Finnish. So learning how people learn. And we can do this by examining the methods we use as well as the materials we provide. And what we really love about this idea is that we can already start working on it today. And we've already built a wait list. We're talking with teachers and companies. And we could start a pilot already in the next weeks. If you have any questions, feel free to shoot them our way and go check out our website at finishfast.com. Thank you very much."

def gpt4_vision(frames, transcript):
    s = "Your role is a pitch coach. Here are your instructions:"
    s += "\n- I present you a transcript and screenshots of a video presentation for a project submission for the hackathon Junction 2023."
    s += "\n- Give feedback on the presentation's visual look."
    s += "\n- Give feedback on the presentations narrative and arguments."
    s += "\n- Give out-of-the-box ideas to improve the pitch."
    s += "\n- Point out spelling mistakes and give a grade from 1-10 based on how likely the challenge would be to win a hackathon."
    s += f"\n\nTRANSCRIPT:\n{transcript}"

    PROMPT = [
        {
            "role": "user",
            "content": [
                s,
          #       *map(lambda x: {"image": x, "resize": 768}, frames[0::len(frames)//20]),
            ],
        },
    ]

    params = {
        "model": "gpt-4-vision-preview",
        "messages": PROMPT,
        "api_key": API_TOKEN,
        "headers": {"Openai-Version": "2020-11-07"},
        "max_tokens": 4096,
    }

    result = openai.ChatCompletion.create(**params)
    return result.choices[0].message.content



def transcribe_audio(audio_file):
    print(API_TOKEN)
    url = 'https://api.openai.com/v1/audio/transcriptions'
    headers = {
        'Authorization': f'Bearer {API_TOKEN}',
    }

    audio_file.seek(0)

    print('start multipart encoder')
    data = MultipartEncoder(
        fields={
            'file': ('audio.mp3', audio_file.read(), 'audio/mpeg'),
            'model': 'whisper-1',
        }
    )

    print('multipart encoder ready')
    # Updating the content-type in headers
    headers['Content-Type'] = data.content_type

    response = requests.post(url, headers=headers, data=data)

    print('request response success')
    print("respo",response)
    return response.json().get('text', '')
    

# def extract_audio_from_mp4(mp4_file_url, output_audio_path):
        
#     # Load video from url
#     video = requests.get(mp4_file_url)
#     idx = np.random.randint(10000)
#     video_file = 'video_temp' + str(idx) + '.mp4'
#     # Save to video_temp.mp4
#     with open(video_file, 'wb') as f:
#         f.write(video.content)

#     # Load the mp4 file
#     video = AudioSegment.from_file(video_file, "mp4")

#     # Export the audio
#     video.export(output_audio_path, format="mp3")

def upload_to_S3(text, id):
    encoded_string = text.encode("utf-8")
    print(encoded_string)

    bucket_name = RESULTS_BUCKET
    
    s3_path = id + ".txt"

    s3 = boto3.resource("s3")
    print("s3 created")
    s3.Bucket(bucket_name).put_object(Key=s3_path, Body=encoded_string)
    print("Putted to bucket")

def lambda_handler(event, context=None):
    payload = event
    print(event)

    video_url = payload.get("url")
    video_id = payload.get("id")
   
    res = requests.get(video_url)
    print("video_url received")
    video_buffer = io.BytesIO(res.content)
    print("video buffer initiated")
    video = AudioSegment.from_file(video_buffer, "mp4")
    audio_buffer = io.BytesIO()
    print("video loaded")
    video.export(audio_buffer, format="mp3")
    print("Succee in extracting audio")
    transcript = transcribe_audio(audio_buffer)
    print('transcript success, len:',len(transcript))
    feedback = gpt4_vision([],transcript)
    print('feedback success, len:', len(feedback))
    upload_to_S3(feedback, video_id)
    print('upload success')
    return {
        "statusCode": 200,
        "body": json.dumps({
            "message": "hello junction",
        }),
    }
