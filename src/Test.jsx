import { useState, useEffect } from 'react'

function Test() {
  const [backendStatus, setBackendStatus] = useState('checking...')
  const [backendUrl, setBackendUrl] = useState('')

  useEffect(() => {
    checkBackendConnection()
  }, [])

  const checkBackendConnection = async () => {
    try {
      const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
      setBackendUrl(baseUrl)

      const response = await fetch(`${baseUrl}/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })

      if (response.ok) {
        const data = await response.json()
        setBackendStatus(`✅ Connected - status: ${data.status || 'ok'}`)
      } else {
        setBackendStatus(`❌ Failed - ${response.status} ${response.statusText}`)
      }
    } catch (error) {
      setBackendStatus(`❌ Error - ${error.message}`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-8">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Backend Health Check
        </h1>

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Backend URL:</h3>
            <p className="text-sm text-gray-600 break-all bg-gray-100 p-2 rounded">
              {backendUrl || 'Detecting...'}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Backend Status:</h3>
            <p className="text-sm font-mono bg-gray-100 p-2 rounded">
              {backendStatus}
            </p>
          </div>

          <button
            onClick={checkBackendConnection}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition-colors"
          >
            Test Again
          </button>

          <a
            href="/"
            className="block w-full bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded text-center transition-colors"
          >
            Back to Home
          </a>
        </div>
      </div>
    </div>
  )
}

export default Test
