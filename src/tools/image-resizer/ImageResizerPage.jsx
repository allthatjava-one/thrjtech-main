import { useImageResizer } from './hooks/useImageResizer.jsx';
import { ImageResizerView } from './ImageResizerView';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import '../image-tools-shared.css';
import './ImageResizer.css';

export default function ImageResizerPage() {
  const props = useImageResizer();
  return (
    <div className="image-resizer-page">
      <Navbar />
      <main className="main">
        <div className="container">
          <div className="card">
            <ImageResizerView {...props} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
