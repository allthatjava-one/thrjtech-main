
import { usePdfMerger } from './hooks/usePdfMerger';
import { PdfMergerView } from './PdfMergerView';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import './PdfMerger.css';

export default function PdfMergerPage() {
  const props = usePdfMerger();
  return (
    <div className="pdf-merger-page">
      <Navbar />
      <main className="main">
        <div className="container">
          <div className="card">
            <PdfMergerView {...props} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
