from flask import request 
from ultralytics import YOLO
import cv2, cvzone
import math, os
from vcs.consts import COCO,ANN_FOLDER
from vcs.vars import state

def process_video(file_path: str) -> dict:
    frame_interval = request.json.get('frame_interval', 0.2)

    cap = cv2.VideoCapture(file_path)   # Video
    cap.set(3, 720)  # 3 width
    cap.set(4, 640)  # 4 height

    frame_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    frame_height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fps = int(cap.get(cv2.CAP_PROP_FPS))

    output_path = os.path.join(ANN_FOLDER, 'annotated.mp4')
    out = cv2.VideoWriter(output_path, cv2.VideoWriter_fourcc(*'mpv4'), fps, (frame_width, frame_height))
    model = YOLO('Yolo/yolov8n.pt')

    data = {}

    while True:
        success, img = cap.read()
        if not success:
            break
        results = model(img, stream=True, verbose=False)
        persons = 0
        for r in results:
            boxes = r.boxes
            for box in boxes:
                x1, y1, x2, y2 = box.xyxy[0].int().tolist()
                w, h = x2 - x1, y2 - y1
                bbox = x1, y1, w, h
                # cv2.rectangle(img, (x1, y1), (x2, y2), (255, 0, 255), 3)
                cvzone.cornerRect(img, bbox)
                conf = math.ceil(box.conf[0] * 100)  # confidence
                cls = box.cls[0].int()
                if conf > 50 and COCO[cls] == "person":
                    cvzone.putTextRect(img, f'{COCO[cls]} - {conf}%', (max(0, x1), max(0, y1)), scale=1, thickness=2)
                    if state['frame_count'] % frame_interval == 0:
                        persons += 1
        out.write(img)
        data[state['frame_count'] / fps] = persons
        state['frame_count'] += 1
    cap.release()
    out.release()

    return data