import { useState } from 'react'
import JsonFormatter from './JsonFormatter'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import AboutUsModal from '../../components/AboutUsModal'

export default function JsonFormatterPage() {
  const [aboutOpen, setAboutOpen] = useState(false)

  const handleOpenAbout = () => setAboutOpen(true)
  const handleCloseAbout = () => setAboutOpen(false)

  return (
    <>
      <Navbar onAboutClick={handleOpenAbout} />
      <AboutUsModal
        open={aboutOpen}
        onClose={handleCloseAbout}
      />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <JsonFormatter />
      </main>
      <Footer />
    </>
  )
}
