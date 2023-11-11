import cv2
import numpy as np
import argparse
import os
import logging


def parse_arguments():
    parser = argparse.ArgumentParser(description='Slide change detection in a video.')
    parser.add_argument('video_path', type=str, help='Path to the input video file')
    parser.add_argument('--threshold', type=float, default=30.0, help='Threshold for slide change detection')
    parser.add_argument('--min-slide-duration', type=float, default=1.0, help='Minimum time duration between slide changes')
    parser.add_argument('--output-folder', type=str, default='output_frames', help='Folder to save the output frames')
    return parser.parse_args()


def save_frame_and_timestamp(timestamp, frame, output_folder='output_frames'):
    # Create the output folder if it doesn't exist
    os.makedirs(output_folder, exist_ok=True)

    # Save the frame as a colored PNG image
    frame_filename = os.path.join(output_folder, f"frame_{timestamp:.2f}.png")
    cv2.imwrite(frame_filename, frame)

    # Save the timestamp
    timestamp_filename = os.path.join(output_folder, "timestamps.txt")
    with open(timestamp_filename, 'a') as f:
        f.write(f"{timestamp:.2f}\n")


def delete_files_in_folder(folder):
    for filename in os.listdir(folder):
        file_path = os.path.join(folder, filename)
        os.remove(file_path)


def detect_frames_with_changes(video_path, threshold=30.0, min_slide_duration=1.0):
    cap = cv2.VideoCapture(video_path)

    if not cap.isOpened():
        print("Error opening video file.")
        return

    ret, prev_frame = cap.read()
    if not ret:
        print("Error reading the first frame.")
        return

    frame_count = 0
    fps = cap.get(cv2.CAP_PROP_FPS)

    save_frame_and_timestamp(0.0, prev_frame)

    frames = []
    timestamps = []

    # Compare current gray scale frame with the previous saved gray scale frame
    # to detect slide changes. If a slide change is detected, save the previous
    # frame (colored) and timestamp. If the time difference between the current
    # and previous slide change is less than the minimum slide duration, discard
    # the current slide change.

    """
    We need to keep track 
    * what was the previous saved frame in grey scale and its time stamp
    * what was the previous frame in color and its time stamp (for saving if detection occurs)
    """
    #  .
    # 
    prev_frame_gray = cv2.cvtColor(prev_frame, cv2.COLOR_BGR2GRAY) 
    
    prev_saved_timestamp = 0.0
    prev_saved_frame_gray = prev_frame_gray
    prev_timestamp = 0.0
    frames.append(prev_frame)
    timestamps.append(prev_saved_timestamp)

    try:
        while True:
            ret, curr_frame = cap.read()
            if not ret:
                break

            curr_frame_gray = cv2.cvtColor(curr_frame, cv2.COLOR_BGR2GRAY)
            frame_diff = cv2.absdiff(curr_frame_gray, prev_saved_frame_gray)
            diff_score = np.mean(frame_diff)

            timestamp = frame_count / fps
            if diff_score > threshold:
                logging.info(f"Slide change detected at {timestamp:.2f} seconds.")
                
                time_diff = timestamp - prev_saved_timestamp
                if time_diff > min_slide_duration:
                    log_message = f"Accept slide change, time from previous change {time_diff:.2f} seconds."
                    logging.info(log_message)
                    prev_saved_timestamp = timestamp
            
                    # Save the frame and timestamp just before the change
                    # save_frame_and_timestamp(timestamp, prev_frame)
                    frames.append(prev_frame)
                    timestamps.append(prev_timestamp)

            prev_frame = curr_frame
            prev_timestamp = timestamp
            frame_count += 1

    finally:
        frames.append(prev_frame)
        timestamps.append(prev_timestamp)
        cap.release()
    return frames, timestamps

if __name__ == "__main__":
    args = parse_arguments()
    video_file_path = args.video_path
    threshold_value = args.threshold
    min_duration = args.min_slide_duration
    output_folder = args.output_folder

    logging.basicConfig(level=logging.INFO)

    frames, timestamps = detect_frames_with_changes(
        video_file_path, 
        threshold=threshold_value, 
        min_slide_duration=min_duration)
    
     # Delete the files in the output folder if it exists
    if os.path.exists(output_folder):
        delete_files_in_folder(output_folder)
    else:
        os.makedirs(output_folder)

    for frame, timestamp in zip(frames, timestamps):
        save_frame_and_timestamp(timestamp, frame, output_folder=output_folder)