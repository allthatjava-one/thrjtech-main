import React, { useState } from 'react'

export default function ScreenRecorderView({ isSupported, recording, videoUrl, error, startRecording, stopRecording, recordSound, setRecordSound }) {
  const [openPanel, setOpenPanel] = useState('')

  const togglePanel = (panel) => {
    setOpenPanel((prev) => (prev === panel ? '' : panel))
  }

  return (
    <>
      {/* Hero */}
      <div className="hero-section">
        <h1 className="hero-title">Screen Recorder</h1>
        <p className="hero-tagline">
          Record your screen instantly — stays in your browser, private and free.
        </p>

        <div className="details-controls">
          <button
            className={`tab-btn ${openPanel === 'details' ? 'active' : ''}`}
            onClick={() => togglePanel('details')}
            aria-expanded={openPanel === 'details'}
            type="button"
          >
            Details
          </button>
          <button
            className={`tab-btn ${openPanel === 'howitworks' ? 'active' : ''}`}
            onClick={() => togglePanel('howitworks')}
            aria-expanded={openPanel === 'howitworks'}
            type="button"
          >
            How it works
          </button>
        </div>

        <div className={`shared-collapse${!openPanel ? ' panel-hidden' : ''}`}>
          <div className={openPanel !== 'details' ? 'tool-details-open panel-hidden' : 'tool-details-open'}>
            <h3>What is Screen Recording?</h3>
            <p>Screen recording captures everything displayed on your screen — your desktop, a specific window, or a browser tab — as a video file.</p>

            <h3>How it works</h3>
            <p>This tool uses the browser's built-in Screen Capture API. No software to install, no data sent to a server.</p>

            <h3>Privacy</h3>
            <p>The recording is processed entirely in your browser. Nothing is uploaded. The video file stays on your device.</p>

            <h3>When to use</h3>
            <ul>
              <li>Creating tutorials or walkthroughs</li>
              <li>Reporting bugs with a visual example</li>
              <li>Capturing a presentation or demo</li>
              <li>Recording gameplay or app usage</li>
            </ul>

            <h3>FAQ</h3>
            <ul>
              <li><strong>Which browsers are supported?</strong> Chrome, Edge, and Firefox on desktop.</li>
              <li><strong>What format is the recording?</strong> WebM (supported by all modern browsers).</li>
              <li><strong>Is there a time limit?</strong> No — record as long as you need.</li>
              <li><strong>Can I record audio?</strong> System audio capture depends on your browser and OS.</li>
            </ul>
          </div>

          <div className={openPanel !== 'howitworks' ? 'tool-howitworks-open panel-hidden' : 'tool-howitworks-open'}>
            <ol style={{ margin: 0, paddingLeft: '1rem' }}>
              <li style={{ marginBottom: '0.75rem' }}>
                <p>Click <strong>Start Recording</strong> and pick the screen, window, or tab to share.</p>
              </li>
              <li style={{ marginBottom: '0.75rem' }}>
                <p>Your browser will prompt you to select what to capture. Choose and confirm.</p>
              </li>
              <li style={{ marginBottom: '0.75rem' }}>
                <p>Click <strong>Stop Recording</strong> when you are done.</p>
              </li>
              <li>
                <p>A preview will appear below. Use the <strong>Download</strong> button to save your recording.</p>
              </li>
            </ol>
          </div>
        </div>

        <div className="hero-badges">
          <span className="hero-badge">⚡ Instant</span>
          <span className="hero-badge">🔒 Browser-only</span>
          <span className="hero-badge">🕵️ Private</span>
        </div>
      </div>

      {/* Browser support warning */}
      {!isSupported && (
        <div className="alert-box alert-warning">
          Your browser does not support screen capture. Try Chrome, Edge, or Firefox on desktop.
        </div>
      )}

      {/* Tip: avoid capturing the browser notification bar */}
      {isSupported && !recording && !videoUrl && (
        <div className="alert-box alert-tip">
          <strong>Tip:</strong> In the sharing dialog, choose <em>Window</em> or <em>Tab</em> instead of <em>Entire Screen</em> to avoid capturing the browser's recording notification bar.
        </div>
      )}

      {/* Action area */}
      <div className="action-area">
        {!recording && (
          <label className="sound-toggle">
            <input
              type="checkbox"
              checked={recordSound}
              onChange={(e) => setRecordSound(e.target.checked)}
            />
            Record sound (microphone)
          </label>
        )}
        {!recording ? (
          <button
            className="btn btn-primary action-btn"
            onClick={startRecording}
            disabled={!isSupported}
          >
            ● Start Recording
          </button>
        ) : (
          <button
            className="btn btn-danger action-btn"
            onClick={stopRecording}
          >
            ■ Stop Recording
          </button>
        )}
        {recording && <span className="recording-indicator">● Recording in progress…</span>}
      </div>

      {/* Error */}
      {error && (
        <div className="alert-box alert-error">{error}</div>
      )}

      {/* Preview */}
      {videoUrl && (
        <div className="preview-section">
          <h3 className="preview-title">Preview</h3>
          <video src={videoUrl} controls className="preview-video" />
          <a
            href={videoUrl}
            download="screen-recording.webm"
            className="btn btn-primary download-btn"
          >
            ⬇ Download Recording
          </a>
        </div>
      )}

      {/* Note */}
      <div className="note">
        <span className="note-icon">⚠️</span>
        The recording is kept temporarily in your browser. Refreshing or closing the page will erase it. Download before navigating away.
      </div>
    </>
  )
}
