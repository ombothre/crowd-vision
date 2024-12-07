export default function ResultsSection({ links }: { links: { video: string; csv: string } }) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-gray-800">Analysis Results</h2>
      {/* Video Section */}
      <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
        
        {links && links.video ? (
          <video controls className="w-full h-full rounded-lg">
            <source src={links.video} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <p className="text-gray-500">Processed video will appear here</p>
        )}
      </div>

      {/* Buttons Section */}
      {links && links.video && links.csv && (
        <div className="flex justify-center space-x-4">
          <a
            href={links.csv}
            download
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Download CSV
          </a>
          <a
            href={links.video}
            download
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
          >
            Download Processed Video
          </a>
        </div>
      )}
    </div>
  )
}
