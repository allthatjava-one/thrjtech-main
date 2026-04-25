import { useImageRotator } from './hooks/useImageRotator';
import { ImageRotatorView } from './ImageRotatorView';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import '../image-tools-shared.css';
import './ImageRotator.css';

export default function ImageRotatorPage() {
  const props = useImageRotator();
  return (
    <div className="image-rotator-page">
      <Navbar />
      <main className="main">
        <div className="container">
          <div className="card">
            <ImageRotatorView {...props} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
