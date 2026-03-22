
import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useWatermarker } from './hooks/useWatermarker.jsx'
import { WatermarkerView } from './WatermarkerView'

import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import './Watermarker.css';

export default function WatermarkerPage() {
  const location = useLocation();
  const stateImage = location.state && location.state.mainImage;
  const props = useWatermarker(stateImage);
  return (
    <div className="watermarker-page">
      <Navbar />
      <main className="main">
        <div className="container">
          <div className="card">
            <WatermarkerView {...props} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}