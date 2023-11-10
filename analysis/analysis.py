from pydub import AudioSegment
import io
import os
from dotenv import load_dotenv

load_dotenv()

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

