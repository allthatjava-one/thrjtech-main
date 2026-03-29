import { usePdfConverter } from './hooks/usePdfConverter'
import { PdfConverterView } from './PdfConverterView'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import './PdfConverter.css'

export default function PdfConverterPage() {
  const props = usePdfConverter()
  return (
    <div className="pdf-converter-page">
      <Navbar />
      <main className="main">
        <div className="container">
          <div className="card">
            <PdfConverterView {...props} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
