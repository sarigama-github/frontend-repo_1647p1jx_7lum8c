import { useState } from 'react'

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function App() {
  const [url, setUrl] = useState('')
  const [count, setCount] = useState(3)
  const [strategy, setStrategy] = useState('sequential')
  const [loading, setLoading] = useState(false)
  const [clips, setClips] = useState([])
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setClips([])
    if (!url) {
      setError('Please paste a YouTube link')
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`${BACKEND}/api/clip`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, count, strategy })
      })
      if (!res.ok) {
        const t = await res.text()
        throw new Error(t || 'Failed to create clips')
      }
      const data = await res.json()
      setClips(data)
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-sky-50 to-emerald-50">
      <div className="max-w-3xl mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">YouTube → 1-min Clips</h1>
          <p className="text-gray-600">Paste a video link and get multiple 60s clips.</p>
        </div>

        <form onSubmit={submit} className="bg-white shadow-lg rounded-xl p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">YouTube URL</label>
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              type="url"
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">How many clips</label>
              <input
                type="number"
                min={1}
                max={20}
                value={count}
                onChange={(e) => setCount(parseInt(e.target.value || '1'))}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Strategy</label>
              <select
                value={strategy}
                onChange={(e) => setStrategy(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="sequential">Sequential</option>
                <option value="random">Random</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold py-2 rounded-md"
              >
                {loading ? 'Processing…' : 'Create Clips'}
              </button>
            </div>
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">{error}</div>
          )}
        </form>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {clips.map((c) => (
            <div key={c.url} className="bg-white rounded-lg shadow p-4">
              <p className="text-sm text-gray-600 mb-2">Clip {c.index} • start {c.start}s • {Math.round(c.duration)}s</p>
              <video controls className="w-full rounded" src={`${BACKEND}${c.url}`}/>
              <a href={`${BACKEND}${c.url}`} download className="mt-2 inline-block text-indigo-600 hover:underline">Download</a>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <a href="/test" className="text-sm text-gray-500 hover:text-gray-700">Check backend status</a>
        </div>
      </div>
    </div>
  )
}

export default App
