'use client'

import Header from '../components/Header'
import UploadSection from '../components/UploadSection'
import ThresholdInput from '../components/ThresholdInput'
import ProcessButton from '../components/ProcessButton'
import ResultsSection from '../components/ResultsSection'
import Footer from '../components/Footer'
import { useState } from 'react'

export default function Home() {

  const [fileUploaded, setFileUploaded] = useState(false);
  const backUrl = 'http://127.0.0.1:5000/'; 
  const [links, setLinks] = useState({'video': '', 'csv': ''});
  const [threshold, setThreshold] = useState(0.2);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <UploadSection setFileUploaded={setFileUploaded} backUrl={backUrl}/>
          <ThresholdInput setThreshold={setThreshold}/>
          <ProcessButton fileUploaded={fileUploaded} backUrl={backUrl} setLinks={setLinks} threshold={threshold}/>
          <ResultsSection links={links}/>
        </div>
      </main>
      <Footer />
    </div>
  )
}

