from IPython.display import display, Image, Audio
import json
from pydub import AudioSegment
import io
import os
import requests
from requests_toolbelt.multipart.encoder import MultipartEncoder

API_TOKEN = os.getenv('API_TOKEN')

temp_transcript = "Hi, my name is Patrick and I'm from the team Finish Fast and we did the challenge from CGI and the city of Turku. Now our task was to prevent social isolation and loneliness. And what we've been doing this weekend is learn about in what kind of situations people feel lonely or they feel like they're not part of a group. And what we learned is that very often loneliness is accompanied by unemployment or otherwise a disconnect from your most important social communities. And very often these kinds of people in Finland might be immigrants when they don't have these social networks that you might have back at home. And what we've noticed is that the biggest obstacle for forming these connections and becoming part of these communities is the Finnish language. So our solution is actually very simple. We just need to teach the Finnish language faster than anyone else. And that is what we're going to do. We have a free month language learning boot camp what we're going to organize. And you might think that, well, are there already some language courses in Finland? And of course, there's many of them, but they fail to teach Finnish on a working proficiency quickly enough so that it would be useful. So how our program works is that we take 20 students. We help them over a period of three months. And after that, we help them land a job. And if they get the job, then we're going to take a small percentage off their salary. And then we're going to use that to fund the upcoming courses. Now, over time, we wish to become the number one place for teaching Finnish by using our platform to also learn better how we can teach Finnish. So learning how people learn. And we can do this by examining the methods we use as well as the materials we provide. And what we really love about this idea is that we can already start working on it today. And we've already built a wait list. We're talking with teachers and companies. And we could start a pilot already in the next weeks. If you have any questions, feel free to shoot them our way and go check out our website at finishfast.com. Thank you very much."

def transcribe_audio(audio_file):
    url = 'https://api.openai.com/v1/audio/transcriptions'
    headers = {
        'Authorization': f'Bearer {API_TOKEN}',
    }

    audio_file.seek(0)
    data = MultipartEncoder(
        fields={
            'file': ('audio.mp3', audio_file.read(), 'audio/mpeg'),
            'model': 'whisper-1',
        }
    )
    # Updating the content-type in headers
    headers['Content-Type'] = data.content_type

    response = requests.post(url, headers=headers, data=data)
    return response.json().get('text', '')
    

def extract_audio_from_mp4(mp4_file_path, output_audio_path):
        # Load the mp4 file
        video = AudioSegment.from_file(mp4_file_path, "mp4")

        # Export the audio
        video.export(output_audio_path, format="mp3")

def lambda_handler(event, context):

    video_path = event['queryStringParameters']['url']
    file = io.BytesIO()
    extract_audio_from_mp4(video_path, file)
    transcript = transcribe_audio(file)
    # feedback = gpt4_vision(video_to_frames(video_path),transcript)


    return {
        "statusCode": 200,
        "body": json.dumps({
            "message": transcript,
        }),
    }
