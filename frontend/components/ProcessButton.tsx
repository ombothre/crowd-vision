'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import axios from 'axios'

export default function ProcessButton({ fileUploaded, backUrl, setLinks, threshold }: 
  {fileUploaded: boolean, backUrl: string, setLinks: (links:{video: string, csv: string}) => void, threshold: number}) {

  const [isProcessing, setIsProcessing] = useState(false)

  const handleProcess = async () => {
    if (!fileUploaded){
      alert("Upload a file first");
      return;
    }
    setIsProcessing(true);

    const body = {
      frame_interval: threshold
    }
    
    // call to /process backend route
    try{
      const response = await axios.post(backUrl+'process', body);
      console.log(response.data);
      setLinks({
        video: response.data.video_path,
        csv: response.data.csv_path
      })
    }catch(error){
      console.error(error);
    }finally{
      setIsProcessing(false);
    }
  }

  return (
    <div className="text-center">
      <button
        onClick={handleProcess}
        disabled={isProcessing}
        className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isProcessing ? (
          <>
            <Loader2 className="inline-block animate-spin mr-2" />
            Analyzing video...
          </>
        ) : (
          'Analyze Video'
        )}
      </button>
      {isProcessing && (
        <p className="mt-2 text-sm text-gray-600">Analyzing crowd density, please wait...</p>
      )}
    </div>
  )
}

