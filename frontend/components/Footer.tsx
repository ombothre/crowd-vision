import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-100 py-4">
      <div className="container mx-auto px-4 text-center text-sm text-gray-600">
        <p>© 2024 CrowdVision Inc.</p>
        <div className="mt-2 space-x-4">
          <Link href="/terms" className="hover:text-gray-900 transition">
            Terms of Service
          </Link>
          <Link href="/support" className="hover:text-gray-900 transition">
            Contact Support
          </Link>
        </div>
      </div>
    </footer>
  )
}

