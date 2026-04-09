import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import '../image-tools-shared.css';
import './ImageCrop.css';
import { useImageCrop } from './hooks/useImageCrop';
import { ImageCropView } from './ImageCropView';

export default function ImageCropPage() {
  const props = useImageCrop();
  return (
    <div className="image-crop-page">
      <Navbar />
      <main className="main">
        <div className="container">
          <div className="card">
            <ImageCropView {...props} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
