import { useState } from 'react'
import './App.css'

function App() {
  const [file, setFile] = useState(null)
  const [status, setStatus] = useState('')
  const [isUploading, setIsUploading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!file) {
      setStatus('Please select a CSV file to upload.')
      return
    }

    const formData = new FormData()
    formData.append('file', file)

    try {
      setIsUploading(true)
      setStatus('Uploading...')

      const response = await fetch('http://localhost:4000/upload', {
        method: 'POST',
        body: formData,
      })

      const payload = await response.json().catch(() => ({}))

      if (!response.ok) {
        setStatus(payload.error || 'Upload failed. Please try again.')
        return
      }

      setStatus(`Success! ${payload.inserted || 0} rows saved to the database.`)
      setFile(null)
      event.target.reset()
    } catch (error) {
      setStatus('Network error. Ensure the backend is running and try again.')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <main className="app">
      <section className="panel">
        <h1>Inventory CSV Upload</h1>
        <p>Upload a CSV with columns: name, price, quantity.</p>
        <form onSubmit={handleSubmit} className="form">
          <input
            type="file"
            accept=".csv"
            onChange={(event) => setFile(event.target.files[0])}
          />
          <button type="submit" disabled={isUploading}>
            {isUploading ? 'Uploading...' : 'Upload CSV'}
          </button>
        </form>
        {status && <p className="status">{status}</p>}
      </section>
    </main>
  )
}

export default App
