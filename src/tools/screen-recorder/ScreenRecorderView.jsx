import React from 'react'

export default function ScreenRecorderView({ isSupported, recording, videoUrl, error, startRecording, stopRecording }) {
  return (
    <div className="screen-recorder-view">
      <header className="hero">
        <h1 className="hero-title">Screen Recorder</h1>
        <p className="hero-tagline">Record your screen instantly — stays in your browser, private and free.</p>
      </header>

      {!isSupported && (
        <div className="alert alert-warning">Your browser does not support screen capture. Try Chrome, Edge, or Firefox on desktop.</div>
      )}

      <div className="actions">
        {!recording ? (
          <button className="btn btn-primary" onClick={startRecording} disabled={!isSupported}>Start Recording</button>
        ) : (
          <button className="btn btn-danger" onClick={stopRecording}>Stop Recording</button>
        )}
        {recording && <span className="recording-indicator">● Recording...</span>}
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {videoUrl && (
        <div className="preview">
          <h3>Preview</h3>
          <video src={videoUrl} controls className="preview-video" />
          <div className="preview-actions">
            <a href={videoUrl} download="screen-recording.webm" className="link">Download Recording</a>
          </div>
        </div>
      )}

      <section className="details shared-collapse">
        <h4>How it works</h4>
        <ol>
          <li>Click "Start Recording" and pick the screen or window to share.</li>
          <li>Click "Stop Recording" to finish. A preview and download link will appear.</li>
          <li>The recording is kept in your browser until you download it.</li>
        </ol>
      </section>
    </div>
  )
}
