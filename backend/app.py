from flask import Flask, send_from_directory, request, jsonify, url_for, render_template
from flask_cors import CORS
import os
from waitress import serve
from logger import setup_logger
from helpers.video_processor import process_video
from helpers.files import make_csv

app = Flask(__name__)
CORS(app, origins=["*"])

logger = setup_logger()

ALLOWED_EXT: set = {'mp4', 'avi', 'mov', 'mkv'}
UPLOAD_FOLDER = 'public/'
ANN_FOLDER = 'public/annotated/'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(ANN_FOLDER, exist_ok=True)

state = {
    'latest_file': None,
    'frame_count': 0
}

def is_allowed(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXT

@app.route('/', methods=['GET'])
def docs():
    return render_template('index.html')

# Route to upload video
@app.route('/upload', methods=['POST', 'GET'])
def upload_vid():
    if 'file' not in request.files:  # file key in request body
        logger.error('No file uploaded')
        return jsonify({'Error': 'No file uploaded'}), 400

    file = request.files['file']

    if file and is_allowed(file.filename):
        file_path = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(file_path)
        state['latest_file'] = file.filename
        logger.info(f"File uploaded successfully: {file.filename}")
        return jsonify({'message': 'File uploaded successfully'}), 200
    else:
        logger.error(f"Invalid file uploaded: {file.filename}")
        return jsonify({'Error': 'Invalid File'}), 400

# Route for OBJECT DETECTION  
@app.route('/process', methods=['POST'])
def process_vid():
    file_path = os.path.join(UPLOAD_FOLDER, state['latest_file'])

    if not state['latest_file']:
        logger.error('No video uploaded to process')
        return jsonify({'Error': 'No video uploaded to process'}), 400
    
    try:
        data = process_video(file_path)
        csv_path = os.path.join('public', "data.csv")
        make_csv(data, csv_path)

        # Generating links
        video_url = url_for('download', filename='annotated.mp4', _external=True)
        csv_url = url_for('download', filename='data.csv', _external=True)

        logger.info(f"Successfully processed video: {state['latest_file']}")

        return jsonify({
            'message': 'Successfully processed video',
            'video_path': video_url,
            'csv_path': csv_url
        }), 200

    except Exception as e:
        logger.error(f"Error processing video: {str(e)}")
        return jsonify({"Error": str(e)}), 500

@app.route('/download/<filename>', methods=['GET'])
def download(filename):
    try:
        ext = filename.split('.')[1].lower()

        if ext in ALLOWED_EXT:
            folder = ANN_FOLDER
        elif ext == 'csv':
            folder = UPLOAD_FOLDER
        else:
            logger.error(f"File format not supported for download: {filename}")
            return jsonify({'Error': 'Not supported'}), 400

        logger.info(f"Downloading file: {filename}")
        return send_from_directory(folder, filename, as_attachment=True)
    
    except Exception as e:
        logger.error(f"Error downloading file: {str(e)}")
        return jsonify({"Error": str(e)}), 500

# if __name__ == '__main__':
#     # app.run(debug=True)
#     serve(app, host='0.0.0.0', port=5000)
