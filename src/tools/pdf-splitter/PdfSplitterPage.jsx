import { usePdfSplitter } from './hooks/usePdfSplitter'
import { PdfSplitterView } from './PdfSplitterView'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import './PdfSplitter.css'

export default function PdfSplitterPage() {
  const props = usePdfSplitter()
  return (
    <div className="pdf-splitter-page">
      <Navbar />
      <main className="main">
        <div className="container">
          <div className="card">
            <PdfSplitterView {...props} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
