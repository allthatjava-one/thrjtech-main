import { useImageConverter } from './hooks/useImageConverter';
import { ImageConverterView } from './ImageConverterView';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import '../image-tools-shared.css';
import './ImageConverter.css';

export default function ImageConverterPage() {
  const props = useImageConverter();
  return (
    <div className="ic-page">
      <Navbar />
      <main className="main">
        <div className="container">
          <div className="card">
            <ImageConverterView {...props} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
