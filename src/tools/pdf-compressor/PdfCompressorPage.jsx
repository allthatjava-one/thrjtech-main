
import { usePdfCompressor } from './hooks/usePdfCompressor';
import { PdfCompressorView } from './PdfCompressorView';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import './PdfCompressor.css';

export default function PdfCompressorPage() {
  const props = usePdfCompressor();
  return (
    <div className="pdf-compressor-page">
      <Navbar />
      <main className="main">
        <div className="container">
          <div className="card">
            <PdfCompressorView {...props} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
