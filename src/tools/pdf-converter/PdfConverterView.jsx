import { Link, useNavigate } from 'react-router-dom'
import { formatSize } from '../pdf-compressor/utils/formatSize'
import { useState } from 'react'
import CustomSelect from './CustomSelect'

export function PdfConverterView({
  file,
  status,
  progress,
  originalSize,
  downloadUrl,
  downloadName,
  errorMsg,
  isDragging,
  fileInputRef,
  handleDrop,
  handleDragOver,
  handleDragLeave,
  handleFileInput,
  handleConvert,
  convertType,
  setConvertType,
  handleReset,
}) {
  const [openPanel, setOpenPanel] = useState('')
  const navigate = useNavigate()

  const togglePanel = (panel) => {
    setOpenPanel((prev) => (prev === panel ? '' : panel))
  }

  return (
    <>
      {status !== 'done' && (
        <>
          <div className="hero-section">
            <h1 className="hero-title">PDF Converter</h1>
            <p className="hero-tagline">Quickly convert PDF pages into high-quality JPG 
              or PNG images. Choose the output format, preview the converted result, 
              and download images for sharing, thumbnails, or embedding 
              — no account required. <Link to="/blogs/pdf-converter-guide">Learn how to convert PDF →</Link>
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#fffbe6', border: '1px solid #ffe58f', borderRadius: 8, padding: '10px 16px', marginBottom: 12 }}>
              <span style={{ fontSize: 18 }}>🖼️</span>
              <span style={{ flex: 1, fontSize: 14, color: '#7c6000' }}>Do you want to convert image type instead?</span>
              <Link
                to="/image-converter"
                style={{ whiteSpace: 'nowrap', background: '#faad14', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 14px', fontSize: 13, fontWeight: 600, textDecoration: 'none', cursor: 'pointer' }}
              >Try Image Converter</Link>
            </div>

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
                    <h3>What is PDF conversion</h3>
                    <p>
                      PDF conversion transforms pages or entire PDF documents into raster image formats (for example, JPG or PNG) or other target
                      representations. This is useful when you need fixed visual snapshots of pages for thumbnails, image embedding, or compatibility with
                      systems that do not render PDFs natively. In this application the conversion is performed server-side: your PDF is uploaded to a
                      short-lived conversion service which returns the generated images for immediate download.
                    </p>

                    <h3>When to convert</h3>
                    <p>
                      Convert PDFs when you require static images for use in documents, websites, or social media, or when recipients may not have a PDF
                      viewer. Converting is also helpful for creating thumbnails, generating previews for galleries, or extracting visual assets for
                      presentations and slide decks.
                    </p>

                    <h3>How conversion behaves</h3>
                    <p>
                      The conversion process rasterizes PDF pages at a chosen resolution and image format. Vector artwork and text are flattened into
                      pixels, so the output is a pixel-perfect representation of the page at the selected size. This ensures consistent display across
                      platforms but means that searchable text and selectable vectors are lost in the converted image.
                    </p>

                    <h3>Quality and performance</h3>
                    <ul>
                      <li>Resolution: Higher DPI produces sharper images at the cost of larger file sizes and longer processing times.</li>
                      <li>Format: PNG preserves lossless quality and alpha; JPG produces smaller files with configurable quality tradeoffs.</li>
                      <li>Processing time: Conversion speed depends on file size and backend load; expect seconds to a minute for typical documents.</li>
                    </ul>

                    <h4>Benefits of conversion</h4>
                    <ul>
                      <li>Produce standard image files for easy viewing and sharing.</li>
                      <li>Create thumbnails or previews for websites and apps.</li>
                      <li>Improve compatibility when recipients don't have a PDF viewer.</li>
                    </ul>

                    <h3>Privacy & retention</h3>
                    <p>
                      Uploaded files are stored temporarily on a conversion backend and removed according to the service's retention policy. If you are
                      handling sensitive content, prefer local conversion tools that do not transmit data off your device.
                    </p>

                    <h3>Practical tips</h3>
                    <ul>
                      <li>Use PNG for images that require lossless fidelity or transparency.</li>
                      <li>Use JPG for photographic pages when smaller file size is more important than absolute fidelity.</li>
                      <li>For multi-page documents, consider converting only the pages you need to minimize processing and download size.</li>
                    </ul>

                    <h4>Useful when</h4>
                    <ul>
                      <li>You need a quick visual snapshot of a document page.</li>
                      <li>Embedding a page as an image in presentations or blog posts.</li>
                      <li>Extracting images for design or archival purposes.</li>
                    </ul>

                    <h4>FAQ</h4>
                      <ul>
                        <li><strong>Q:</strong>Is my file private? <strong>A:</strong>Files are uploaded to a short-lived backend and stored temporarily. They are removed automatically after a short retention period.</li>

                        <li><strong>Q:</strong>What formats are supported? <strong>A:</strong>This tool supports converting PDFs to JPG and PNG formats.</li>

                        <li><strong>Q:</strong>How long does conversion take? <strong>A:</strong>Conversion typically completes within a few seconds to a minute depending on file size and backend load.</li>

                        <li><strong>Q:</strong>What about very large PDFs? <strong>A:</strong>Very large files may take longer to process. For best results, split extremely large documents before converting.</li>

                        <li><strong>Q:</strong>What other conversions are supported other than JPG and PNG? <strong>A:</strong>This tool currently supports converting PDFs to JPG and PNG formats only. Soon we will provide Searchable PDF and other formats such as Word and Text as well.</li>
                      </ul>
                  </div>

                <div className={openPanel !== 'howitworks' ? 'tool-howitworks-open panel-hidden' : 'tool-howitworks-open'}>
                    <ol style={{ margin: 0, paddingLeft: '1rem' }}>
                      <li style={{ marginBottom: '0.75rem' }}>
                        <img src="/screenshots/converter/PDF-converter001.png" alt="Upload PDF" className="how-img" />
                        <p>Drag & drop your PDF or click <em>Browse File</em> to choose one — quick and simple.</p>
                      </li>

                      <li style={{ marginBottom: '0.75rem' }}>
                        <img src="/screenshots/converter/PDF-converter002.png" alt="Choose format" className="how-img" />
                        <p>Select the output format (JPG or PNG) using the <strong>Convert to</strong> selector.</p>
                      </li>

                      <li style={{ marginBottom: '0.75rem' }}>
                        <img src="/screenshots/converter/PDF-converter003.png" alt="Start conversion" className="how-img" />
                        <p>Tap <em>Convert</em>. A progress bar shows upload and conversion status so you always know what's happening.</p>
                      </li>

                      <li style={{ marginBottom: '0.75rem' }}>
                        <img src="/screenshots/converter/PDF-converter004.png" alt="Preview and download" className="how-img" />
                        <p>When ready, the converted image appears with a <em>Download</em> button — click to save it to your device.</p>
                      </li>
                    </ol>
                  </div>
            </div>

            <div className="hero-badges">
              <span className="hero-badge">⚡ Instant</span>
              <span className="hero-badge">🔒 Secure</span>
              <span className="hero-badge">🗑️ Auto-deleted</span>
            </div>
          </div>

          <div
            className={`drop-zone${isDragging ? ' dragging' : ''}${file ? ' has-file' : ''}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            {!file ? (
              <label className="drop-content" htmlFor="file-input">
                <input
                  ref={fileInputRef}
                  id="file-input"
                  type="file"
                  accept="application/pdf"
                  className="file-input"
                  onChange={handleFileInput}
                />
                <div className="drop-icon">📂</div>
                <p className="drop-text">Drag &amp; drop your PDF here</p>
                <p className="drop-sub">or</p>
                <span className="btn btn-outline">Browse File</span>
              </label>
            ) : (
              <div className="file-info">
                <div className="file-icon">📄</div>
                <div className="file-details">
                  <span className="file-name">{file.name}</span>
                  <span className="file-size">{formatSize(originalSize)}</span>
                </div>
                <button
                  className="remove-btn"
                  onClick={handleReset}
                  title="Remove file"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          <div className="convert-controls">
            <label className="convert-label">Convert to</label>
            <div className="convert-select-wrap">
              <CustomSelect
                value={convertType}
                onChange={setConvertType}
                options={[{ value: 'jpg', label: 'JPG' }, { value: 'png', label: 'PNG' }]}
              />
            </div>
          </div>

          {errorMsg && <p className="error-msg">{errorMsg}</p>}

          {file && status === 'idle' && (
            <button className="btn btn-primary compress-btn" onClick={handleConvert}>
              Convert to {convertType.toUpperCase()}
            </button>
          )}

              {(status === 'uploading' || status === 'converting') && (
            <div className="progress-section">
              <div className="progress-label">
                {status === 'uploading' ? 'Uploading…' : 'Converting PDF…'}
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}
        </>
      )}

      {status === 'done' && (
        <div className="result-section">
          <div className="result-icon">✅</div>
          <h2 className="result-title">Conversion Complete!</h2>

          <div className="size-comparison">
            <div className="size-row">
              <span className="size-col-label">Original</span>
              <span className="size-col-label">Size</span>
            </div>
            <div className="size-row size-row--data">
              <span className="size-col-value">{file.name}</span>
              <span className="size-col-value">{formatSize(originalSize)}</span>
            </div>
          </div>

          <a
            className="btn btn-primary"
            href={downloadUrl}
            download={downloadName}
            target="_blank"
            rel="noopener noreferrer"
          >
            Download Converted File
          </a>

          <button className="btn btn-ghost" onClick={handleReset}>
            Convert Another File
          </button>
        </div>
      )}

      <div className="note">
        <span className="note-icon">⚠️</span>
        Note: The converted file will be stored temporarily for a short time. Please download it within the available window.
      </div>

      {/* Converter guide */}
      <section className="converter-guide" style={{ marginTop: 28 }}>
        <div style={{ maxWidth: 880, margin: '0 auto', padding: 18, background: 'linear-gradient(180deg,#fffdf7,#ffffff)', borderRadius: 10, border: '1px solid #f0e8cc', color: '#111' }}>
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: '0 0 60px', fontSize: 34, lineHeight: 1 }}>🔄</div>
            <div style={{ flex: 1 }}>
              <h2 style={{ margin: 0, fontSize: 22 }}>How to Convert PDF Files Without Breaking Layout (Smart &amp; Simple Guide)</h2>

              <p style={{ marginTop: 8 }}>PDFs are great for sharing — but not always for editing. You've probably experienced this: you need to edit a PDF but it's locked, want to extract text but can't, or need a Word or Excel version but formatting breaks.</p>
              <p style={{ marginTop: 6, fontWeight: 700 }}>👉 In this guide, you'll learn how to convert PDFs safely, preserve formatting, and choose the right format for your needs.</p>

              <br />
              <h3 style={{ marginTop: 12 }}>📄 What Is a PDF Converter?</h3>
              <p>A PDF converter is a tool that allows you to:</p>
              <ul style={{ marginLeft: 0, paddingLeft: 0, listStyle: 'none' }}>
                <li style={{color: '#AAA'}}>🔁 Convert PDF → Word, Excel, PowerPoint</li>
                <li >🖼 Convert PDF → images (JPG, PNG)</li>
                <li style={{color: '#AAA'}}>📥 Convert files → PDF (Word, images, etc.)</li>
              </ul>
              <p style={{ marginTop: 6 }}>Modern tools support both directions and multiple formats, making them highly flexible. Think of it as a bridge between formats.</p>
              
              <br />
              <h3 style={{ marginTop: 10 }}>🤔 Why Convert PDFs?</h3>
              <ul style={{ marginLeft: 0, paddingLeft: 0, listStyle: 'none' }}>
                <li><strong>✏️ Edit Content Easily</strong> — convert to Word or Excel to modify text, update data, and reuse content.</li>
                <li><strong>📊 Extract Data</strong> — convert PDF → Excel to save time and avoid manual typing.</li>
                <li><strong>🖼 Use Content in Other Formats</strong> — convert to image to share visuals or embed in presentations.</li>
                <li><strong>📤 Improve Compatibility</strong> — some systems require specific file types; conversion solves this instantly.</li>
              </ul>
              
              <br />
              <h3 style={{ marginTop: 10 }}>⚙️ How PDF Conversion Works</h3>
              <p>When you convert a PDF, the system reads the file structure, identifies text, images, and layout, then rebuilds content in the new format. Good tools try to preserve layout and keep fonts and spacing intact.</p>
              
              <br />
              <h3 style={{ marginTop: 10 }}>🧠 Why Formatting Sometimes Breaks</h3>
              <p>PDFs are built for display, not structure. Text may not be stored logically and layout may be "visual only" — so converters sometimes have to guess structure. This is why results vary.</p>
              
              <br />
              <h3 style={{ marginTop: 10 }}>✅ Best Practices for Accurate Conversion</h3>
              <ul style={{ marginLeft: 0, paddingLeft: 0, listStyle: 'none' }}>
                <li>🔹 <strong>Use clean source files</strong> — clear text, standard fonts, simple layout.</li>
                <li>🔹 <strong>Choose the right output format</strong> — Word for editing, Excel for tables, JPG for sharing visuals.</li>
                <li>🔹 <strong>Check after conversion</strong> — always review alignment, fonts, and tables.</li>
                <li>🔹 <strong>Avoid re-converting files</strong> — each step can introduce errors; always convert from the original PDF.</li>
                <li>🔹 <strong>Use a reliable tool</strong> — a good converter should preserve formatting and support multiple formats.</li>
              </ul>
              
              <br />
              <h3 style={{ marginTop: 10 }}>🚀 Step-by-Step: Convert a PDF</h3>
              <ol style={{ marginLeft: 16 }}>
                <li>📤 Upload your PDF</li>
                <li>🎯 Select output format (JPG, PNG, etc.)</li>
                <li>⚙️ Start conversion</li>
                <li>📥 Download the new file</li>
              </ol>
              <p style={{ marginTop: 6 }}>Most tools complete this in seconds.</p>
              
              <br />
              <h3 style={{ marginTop: 10 }}>🧩 Common Conversion Scenarios</h3>
              <ul style={{ marginLeft: 0, paddingLeft: 0, listStyle: 'none' }}>
                <li>📄 <strong>PDF → Word</strong> — edit documents, update text</li>
                <li>📊 <strong>PDF → Excel</strong> — extract tables, work with data</li>
                <li>🖼 <strong>PDF → Image</strong> — share pages visually, use in presentations</li>
                <li>📥 <strong>Word/Image → PDF</strong> — create shareable documents, preserve formatting</li>
              </ul>
              
              <br />
              <h3 style={{ marginTop: 10 }}>⚠️ Common Mistakes to Avoid</h3>
              <ul style={{ marginLeft: 0, paddingLeft: 0, listStyle: 'none' }}>
                <li>❌ Converting scanned PDFs without OCR</li>
                <li>❌ Expecting perfect formatting every time</li>
                <li>❌ Using low-quality source files</li>
                <li>❌ Not reviewing final output</li>
                <li>❌ Converting multiple times unnecessarily</li>
              </ul>
              
              <br />
              <h3 style={{ marginTop: 10 }}>🔍 PDF Converter vs PDF Editor</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 8 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #f0e8cc' }}>
                    <th style={{ textAlign: 'left', padding: 6 }}>Feature</th>
                    <th style={{ textAlign: 'left', padding: 6 }}>Converter</th>
                    <th style={{ textAlign: 'left', padding: 6 }}>Editor</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td style={{ padding: 6, borderBottom: '1px solid #faf5e4' }}>Purpose</td><td style={{ padding: 6, borderBottom: '1px solid #faf5e4' }}>Change format</td><td style={{ padding: 6, borderBottom: '1px solid #faf5e4' }}>Modify content</td></tr>
                  <tr><td style={{ padding: 6, borderBottom: '1px solid #faf5e4' }}>Ease of use</td><td style={{ padding: 6, borderBottom: '1px solid #faf5e4' }}>Easy</td><td style={{ padding: 6, borderBottom: '1px solid #faf5e4' }}>Moderate</td></tr>
                  <tr><td style={{ padding: 6 }}>Best for</td><td style={{ padding: 6 }}>Flexibility</td><td style={{ padding: 6 }}>Detailed editing</td></tr>
                </tbody>
              </table>
              
              <br />
              <h3 style={{ marginTop: 10 }}>💡 Pro Tips</h3>
              <ul style={{ marginLeft: 0, paddingLeft: 0, listStyle: 'none' }}>
                <li>📌 Convert a small test file first</li>
                <li>📌 Use consistent fonts in original</li>
                <li>📌 Avoid complex layouts when possible</li>
                <li>📌 Keep a backup of the original file</li>
              </ul>
              
              <br />
              <h3 style={{ marginTop: 10 }}>❓ FAQ</h3>
              <p><strong>Does PDF conversion always keep formatting?</strong> Not always — but good tools preserve most layout and structure.</p>
              <p><strong>Can I convert scanned PDFs?</strong> Yes, but you may need OCR (text recognition) for accurate results.</p>
              <p><strong>What's the best format to convert to?</strong> Editing → Word, data → Excel, sharing → PDF/Image.</p>
              <p><strong>Is online conversion safe?</strong> Most tools process files securely and temporarily.</p>
              
              <br />
              <p style={{ marginTop: 12 }}><strong>🧾 Conclusion</strong><br/>
              PDF conversion isn't just about changing formats — it's about unlocking your content. With the right approach, you can edit documents easily, extract useful data, and share content in any format.</p>

              <p style={{ marginTop: 12 }}>
                <a
                  className="btn btn-primary"
                  href="/pdf-converter"
                  onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); navigate('/pdf-converter') }}
                >👉 Try it here: PDF Converter Tool</a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
