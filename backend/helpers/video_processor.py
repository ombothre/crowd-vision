from flask import request
from ultralytics import YOLO
import cv2, cvzone
import math, os
from vcs.consts import COCO, ANN_FOLDER

def process_video(file_path: str) -> dict:
    frame_interval = request.json.get('frame_interval', 0.2)

    cap = cv2.VideoCapture(file_path)
    cap.set(3, 720)
    cap.set(4, 640)

    frame_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    frame_height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fps = int(cap.get(cv2.CAP_PROP_FPS))

    output_path = os.path.join(ANN_FOLDER, 'annotated.mp4')
    out = cv2.VideoWriter(output_path, cv2.VideoWriter_fourcc(*'mpv4'), fps, (frame_width, frame_height))
    model = YOLO('Yolo/yolov8n.pt')

    data = {}

    interval_frames = int(frame_interval * fps)
    current_frame = 0

    while True:
        success, img = cap.read()
        if not success:
            break

        results = model(img, stream=True, verbose=False)
        persons_in_frame = 0

        for r in results:
            boxes = r.boxes
            for box in boxes:
                x1, y1, x2, y2 = box.xyxy[0].int().tolist()
                w, h = x2 - x1, y2 - y1
                bbox = x1, y1, w, h
                cvzone.cornerRect(img, bbox)
                conf = math.ceil(box.conf[0] * 100)
                cls = box.cls[0].int()
                if conf > 50 and cls == 0:
                    cvzone.putTextRect(img, f'{COCO[cls]} - {conf}%', (max(0, x1), max(0, y1)), scale=1, thickness=2)
                    persons_in_frame += 1

        out.write(img)

        if current_frame % interval_frames == 0:
            timestamp_seconds = round(current_frame / fps)
            timestamp = str(int(timestamp_seconds // 3600)).zfill(2) + ':' + str(int((timestamp_seconds % 3600) // 60)).zfill(2) + ':' + str(int(timestamp_seconds % 60)).zfill(2)
            data[timestamp] = persons_in_frame

        current_frame += 1

    cap.release()
    out.release()

    return data