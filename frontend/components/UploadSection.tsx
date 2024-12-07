'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload } from 'lucide-react'
import axios from 'axios';

export default function UploadSection({ setFileUploaded, backUrl }: { setFileUploaded: (stat: boolean) => void, backUrl: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);  // State to track the uploading process
  const [isUploaded, setIsUploaded] = useState(false);  // State to track if file is successfully uploaded

  const isFileUploaded = file !== null && !isUploading && !isUploaded;

  // Handle file drop or file selection
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles[0]) {
      setFile(acceptedFiles[0]);
      setIsUploaded(false);  // Reset the upload status when a new file is selected
    }
  }, []);

  // Function to upload the file to the backend
  const uploadVid = async () => {
    if (!file) {
      alert('Please select file');
      return;
    }

    setIsUploading(true);  // Start the uploading process
    await sendFileToBackend(file);
  }

  // Function to send the file to the backend
  const sendFileToBackend = async (fileToUpload: File) => {
    const form = new FormData();
    form.append('file', fileToUpload);
    
    try {
      const response = await axios.post(
        backUrl + 'upload',
        form,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log(response.data);

      if (response.status === 200) {
        setFileUploaded(true);  // Mark the file as uploaded
        setIsUploaded(true);  // Set the uploaded state to true
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file');
    } finally {
      setIsUploading(false);  // Stop the uploading process
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/mp4': ['.mp4'],
      'video/avi': ['.avi'],
    },
    multiple: false,
  });

  return (
    <div>
      {!isUploaded && (  // Only show input section if file is not uploaded
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition ${
            isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">
            {file
              ? `File selected: ${file.name}`
              : 'Drag and drop your video here, or click to select'}
          </p>
          <p className="text-xs text-gray-500 mt-1">Upload videos in MP4 or AVI format</p>
        </div>
      )}

      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        onClick={uploadVid}  // Trigger the uploadVid function when the button is clicked
        disabled={!isFileUploaded || isUploading}  // Disable if no file is uploaded or uploading
      >
        {isUploading ? 'Uploading...' : isUploaded ? 'File Uploaded' : 'Upload Crowd Video'}
      </button>
    </div>
  )
}
