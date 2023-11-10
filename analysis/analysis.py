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


"""
import cv2
import numpy as np

def main(video_path, threshold=30.0):
    # Open the video
    cap = cv2.VideoCapture(video_path)

    if not cap.isOpened():
        print("Error opening video file.")
        return

    # Read the first frame
    ret, prev_frame = cap.read()
    if not ret:
        print("Error reading the first frame.")
        return

    prev_frame_gray = cv2.cvtColor(prev_frame, cv2.COLOR_BGR2GRAY)
    frame_count = 0
    fps = cap.get(cv2.CAP_PROP_FPS)

    try:
        while True:
            # Read next frame
            ret, curr_frame = cap.read()
            if not ret:
                break

            curr_frame_gray = cv2.cvtColor(curr_frame, cv2.COLOR_BGR2GRAY)

            # Calculate the difference
            frame_diff = cv2.absdiff(curr_frame_gray, prev_frame_gray)
            diff_score = np.mean(frame_diff)

            # Check if the difference is above the threshold
            if diff_score > threshold:
                timestamp = frame_count / fps
                print(f"Slide change detected at {timestamp:.2f} seconds.")

            # Prepare for next frame
            prev_frame_gray = curr_frame_gray
            frame_count += 1

    finally:
        # Release the video capture object
        cap.release()

if __name__ == "__main__":
    video_file_path = 'path_to_your_video.mp4'  # Replace with your video file path
    main(video_file_path)

"""