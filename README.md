# Crowd Vision

This project enables video processing with object detection using YOLOv8, providing annotated video outputs and detailed data as a CSV file. The app features a frontend built with Next.js and a backend powered by Flask. Users can upload videos, process them, and download the results.

## Steps to Run the Application

### 1. **Setup Frontend**
```bash
cd frontend
npm install
npm run dev
```

### 2. **Setup Backend**
```bash
cd backend
pip install -r requirements.txt
waitress-serve --host localhost --port 8080 app:app
```

## API Endpoints

1. **`GET /`**  
   View API documentation.

2. **`POST /upload`**  
   Upload a video file.  
   - **Request Parameter**: `file` (multipart/form-data)

3. **`POST /process`**  
   Process the uploaded video and detect objects.  
   - **Request Parameter**: `frame_interval` (float, optional, default = 0.2)

4. **`GET /download/<filename>`**  
   Download the annotated video or CSV file.

### Project Highlights

- **Tech Stack**:  
  - **Frontend**: Next.js, Tailwind CSS  
  - **Backend**: Flask, YOLOv8, Waitress  
  - **File Management**: Supports various video formats and generates annotated outputs.