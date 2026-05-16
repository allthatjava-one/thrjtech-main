import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function ScreenRecorderView({ isSupported, recording, videoUrl, error, startRecording, stopRecording, recordSound, setRecordSound }) {
  const { t } = useTranslation('screenRecorder')
  const [openPanel, setOpenPanel] = useState('')

  const togglePanel = (panel) => {
    setOpenPanel((prev) => (prev === panel ? '' : panel))
  }

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      {/* Hero */}
      <div className="hero-section">
        <h1 className="hero-title">{t('hero.title')}</h1>
        <p className="hero-tagline">{t('hero.tagline')}</p>

        <div className="details-row" data-open={openPanel}>
        <div className="details-controls">
          <button
            className={`tab-btn ${openPanel === 'details' ? 'active' : ''}`}
            onClick={() => togglePanel('details')}
            aria-expanded={openPanel === 'details'}
            type="button"
          >
            {t('tabs.details')}
          </button>
          <button
            className={`tab-btn ${openPanel === 'howitworks' ? 'active' : ''}`}
            onClick={() => togglePanel('howitworks')}
            aria-expanded={openPanel === 'howitworks'}
            type="button"
          >
            {t('tabs.howItWorks')}
          </button>
        </div>

        <div className={`shared-collapse${!openPanel ? ' panel-hidden' : ''}`}>
          <div className={openPanel !== 'details' ? 'details-content panel-hidden' : 'details-content'}>
            <h3>{t('details.whatIs.heading')}</h3>
            <p>{t('details.whatIs.body')}</p>

            <h3>{t('details.howItWorks.heading')}</h3>
            <p>{t('details.howItWorks.body')}</p>

            <h3>{t('details.privacy.heading')}</h3>
            <p>{t('details.privacy.body')}</p>

            <h3>{t('details.whenToUse.heading')}</h3>
            <ul>
              <li>{t('details.whenToUse.item1')}</li>
              <li>{t('details.whenToUse.item2')}</li>
              <li>{t('details.whenToUse.item3')}</li>
              <li>{t('details.whenToUse.item4')}</li>
            </ul>

            <h3>{t('details.faq.heading')}</h3>
            <ul>
              <li><strong>{t('details.faq.q1')}</strong> {t('details.faq.a1')}</li>
              <li><strong>{t('details.faq.q2')}</strong> {t('details.faq.a2')}</li>
              <li><strong>{t('details.faq.q3')}</strong> {t('details.faq.a3')}</li>
              <li><strong>{t('details.faq.q4')}</strong> {t('details.faq.a4')}</li>
            </ul>
          </div>

          <div className={openPanel !== 'howitworks' ? 'howitworks-content panel-hidden' : 'howitworks-content'}>
            <ol style={{ margin: 0, paddingLeft: '1rem' }}>
              <li style={{ marginBottom: '0.75rem' }}><p>{t('howItWorks.step1')}</p></li>
              <li style={{ marginBottom: '0.75rem' }}><p>{t('howItWorks.step2')}</p></li>
              <li style={{ marginBottom: '0.75rem' }}><p>{t('howItWorks.step3')}</p></li>
              <li><p>{t('howItWorks.step4')}</p></li>
            </ol>
          </div>
        </div>
        </div>

        <div className="hero-badges">
          <span className="hero-badge">{t('badges.instant')}</span>
          <span className="hero-badge">{t('badges.browserOnly')}</span>
          <span className="hero-badge">{t('badges.private')}</span>
        </div>
      </div>

      {/* Browser support warning */}
      {!isSupported && (
        <div className="alert-box alert-warning">
          {t('alerts.browserUnsupported')}
        </div>
      )}

      {/* Tip: avoid capturing the browser notification bar */}
      {isSupported && !recording && !videoUrl && (
        <div className="alert-box alert-tip">
          <strong>{t('alerts.tipLabel')}</strong>{' '}{t('alerts.tip')}
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
            {t('actions.recordSound')}
          </label>
        )}
        {!recording ? (
          <button
            className="btn btn-primary action-btn"
            onClick={startRecording}
            disabled={!isSupported}
          >
            {t('actions.start')}
          </button>
        ) : (
          <button
            className="btn btn-danger action-btn"
            onClick={stopRecording}
          >
            {t('actions.stop')}
          </button>
        )}
        {recording && <span className="recording-indicator">{t('actions.recordingInProgress')}</span>}
      </div>

      {/* Error */}
      {error && (
        <div className="alert-box alert-error">{error}</div>
      )}

      {/* Preview */}
      {videoUrl && (
        <div className="preview-section">
          <h3 className="preview-title">{t('preview.title')}</h3>
          <video src={videoUrl} controls className="preview-video" />
          <a
            href={videoUrl}
            download="screen-recording.webm"
            className="btn btn-primary download-btn"
          >
            {t('actions.download')}
          </a>
        </div>
      )}

      {/* Note */}
      <div className="note">
        <span className="note-icon">⚠️</span>
        {t('note')}
      </div>

      {/* SEO guide section */}
      <section className="sr-guide">
        <h2>{t('guide.howToVideoTitle')}</h2>
        <div style={{ position: 'relative', width: '90%', paddingBottom: '56.25%', height: 0, overflow: 'hidden', margin: '0 auto' }}>
          <iframe src="https://www.youtube.com/embed/oEdJuGS0uE8?si=rURKHSN9EAPy8WJf"
            title="Quick Screen recording" frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}></iframe>
        </div>

        <h2>{t('guide.mainTitle')}</h2>
        <p>{t('guide.intro1')}</p>
        <p>{t('guide.intro2')}</p>
        <p>{t('guide.intro3')}</p>

        <hr />

        <h2>{t('guide.whyUse.heading')}</h2>
        <p>{t('guide.whyUse.body')}</p>
        <h3>{t('guide.keyBenefits.heading')}</h3>
        <ul>
          <li>{t('guide.keyBenefits.item1')}</li>
          <li>{t('guide.keyBenefits.item2')}</li>
          <li>{t('guide.keyBenefits.item3')}</li>
          <li>{t('guide.keyBenefits.item4')}</li>
          <li>{t('guide.keyBenefits.item5')}</li>
          <li>{t('guide.keyBenefits.item6')}</li>
          <li>{t('guide.keyBenefits.item7')}</li>
        </ul>
        <p>{t('guide.keyBenefits.note')}</p>

        <hr />

        <h2>{t('guide.features.heading')}</h2>

        <h3>{t('guide.features.fullScreen.heading')}</h3>
        <p>{t('guide.features.fullScreen.body')}</p>
        <ul>
          <li>{t('guide.features.fullScreen.item1')}</li>
          <li>{t('guide.features.fullScreen.item2')}</li>
          <li>{t('guide.features.fullScreen.item3')}</li>
          <li>{t('guide.features.fullScreen.item4')}</li>
          <li>{t('guide.features.fullScreen.item5')}</li>
        </ul>

        <h3>{t('guide.features.mic.heading')}</h3>
        <p>{t('guide.features.mic.body')}</p>
        <ul>
          <li>{t('guide.features.mic.item1')}</li>
          <li>{t('guide.features.mic.item2')}</li>
          <li>{t('guide.features.mic.item3')}</li>
          <li>{t('guide.features.mic.item4')}</li>
        </ul>

        <h3>{t('guide.features.webcam.heading')}</h3>
        <p>{t('guide.features.webcam.body')}</p>
        <ul>
          <li>{t('guide.features.webcam.item1')}</li>
          <li>{t('guide.features.webcam.item2')}</li>
          <li>{t('guide.features.webcam.item3')}</li>
          <li>{t('guide.features.webcam.item4')}</li>
        </ul>

        <h3>{t('guide.features.privacy.heading')}</h3>
        <p>{t('guide.features.privacy.body')}</p>

        <h3>{t('guide.features.noInstall.heading')}</h3>
        <p>{t('guide.features.noInstall.body')}</p>

        <hr />

        <h2>{t('guide.comparison.heading')}</h2>
        <div className="sr-table-wrap">
          <table className="sr-table">
            <thead>
              <tr>
                <th>{t('guide.comparison.col1')}</th>
                <th>{t('guide.comparison.col2')}</th>
                <th>{t('guide.comparison.col3')}</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>{t('guide.comparison.row1feature')}</td><td>{t('guide.comparison.row1browser')}</td><td>{t('guide.comparison.row1desktop')}</td></tr>
              <tr><td>{t('guide.comparison.row2feature')}</td><td>{t('guide.comparison.row2browser')}</td><td>{t('guide.comparison.row2desktop')}</td></tr>
              <tr><td>{t('guide.comparison.row3feature')}</td><td>{t('guide.comparison.row3browser')}</td><td>{t('guide.comparison.row3desktop')}</td></tr>
              <tr><td>{t('guide.comparison.row4feature')}</td><td>{t('guide.comparison.row4browser')}</td><td>{t('guide.comparison.row4desktop')}</td></tr>
              <tr><td>{t('guide.comparison.row5feature')}</td><td>{t('guide.comparison.row5browser')}</td><td>{t('guide.comparison.row5desktop')}</td></tr>
              <tr><td>{t('guide.comparison.row6feature')}</td><td>{t('guide.comparison.row6browser')}</td><td>{t('guide.comparison.row6desktop')}</td></tr>
              <tr><td>{t('guide.comparison.row7feature')}</td><td>{t('guide.comparison.row7browser')}</td><td>{t('guide.comparison.row7desktop')}</td></tr>
            </tbody>
          </table>
        </div>

        <hr />

        <h2>{t('guide.modes.heading')}</h2>
        <div className="sr-table-wrap">
          <table className="sr-table">
            <thead>
              <tr>
                <th>{t('guide.modes.col1')}</th>
                <th>{t('guide.modes.col2')}</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>{t('guide.modes.row1mode')}</td><td>{t('guide.modes.row1use')}</td></tr>
              <tr><td>{t('guide.modes.row2mode')}</td><td>{t('guide.modes.row2use')}</td></tr>
              <tr><td>{t('guide.modes.row3mode')}</td><td>{t('guide.modes.row3use')}</td></tr>
              <tr><td>{t('guide.modes.row4mode')}</td><td>{t('guide.modes.row4use')}</td></tr>
              <tr><td>{t('guide.modes.row5mode')}</td><td>{t('guide.modes.row5use')}</td></tr>
            </tbody>
          </table>
        </div>

        <hr />

        <h2>{t('guide.useCases.heading')}</h2>

        <h3>{t('guide.useCases.devs.heading')}</h3>
        <p>{t('guide.useCases.devs.body')}</p>
        <ul>
          <li>{t('guide.useCases.devs.item1')}</li>
          <li>{t('guide.useCases.devs.item2')}</li>
          <li>{t('guide.useCases.devs.item3')}</li>
          <li>{t('guide.useCases.devs.item4')}</li>
        </ul>

        <h3>{t('guide.useCases.teachers.heading')}</h3>
        <p>{t('guide.useCases.teachers.body')}</p>
        <ul>
          <li>{t('guide.useCases.teachers.item1')}</li>
          <li>{t('guide.useCases.teachers.item2')}</li>
          <li>{t('guide.useCases.teachers.item3')}</li>
          <li>{t('guide.useCases.teachers.item4')}</li>
        </ul>

        <h3>{t('guide.useCases.teams.heading')}</h3>
        <p>{t('guide.useCases.teams.body')}</p>
        <ul>
          <li>{t('guide.useCases.teams.item1')}</li>
          <li>{t('guide.useCases.teams.item2')}</li>
          <li>{t('guide.useCases.teams.item3')}</li>
          <li>{t('guide.useCases.teams.item4')}</li>
        </ul>

        <h3>{t('guide.useCases.gamers.heading')}</h3>
        <p>{t('guide.useCases.gamers.body')}</p>
        <ul>
          <li>{t('guide.useCases.gamers.item1')}</li>
          <li>{t('guide.useCases.gamers.item2')}</li>
          <li>{t('guide.useCases.gamers.item3')}</li>
          <li>{t('guide.useCases.gamers.item4')}</li>
        </ul>

        <hr />

        <h2>{t('guide.howTo.heading')}</h2>
        <ol>
          <li>{t('guide.howTo.step1')}</li>
          <li>{t('guide.howTo.step2')}</li>
          <li>{t('guide.howTo.step3')}</li>
          <li>{t('guide.howTo.step4')}</li>
          <li>{t('guide.howTo.step5')}</li>
          <li>{t('guide.howTo.step6')}</li>
          <li>{t('guide.howTo.step7')}</li>
          <li>{t('guide.howTo.step8')}</li>
        </ol>

        <hr />

        <h2>{t('guide.growing.heading')}</h2>
        <p>{t('guide.growing.body')}</p>

        <hr />

        <h2>{t('guide.faq.heading')}</h2>

        <h3>{t('guide.faq.q1')}</h3>
        <p>{t('guide.faq.a1')}</p>

        <h3>{t('guide.faq.q2')}</h3>
        <p>{t('guide.faq.a2')}</p>

        <h3>{t('guide.faq.q3')}</h3>
        <p>{t('guide.faq.a3')}</p>

        <h3>{t('guide.faq.q4')}</h3>
        <p>{t('guide.faq.a4')}</p>

        <hr />

        <h2>{t('guide.final.heading')}</h2>
        <p>{t('guide.final.body1')}</p>
        <p>
          <button type="button" className="btn btn-primary" onClick={handleScrollToTop}>
            {t('guide.final.body2')}
          </button>
        </p>
      </section>
    </>
  )
}
