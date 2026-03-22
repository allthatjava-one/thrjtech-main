import { useState } from 'react'
import { useWatermarker } from './hooks/useWatermarker.jsx'
import { WatermarkerView } from './WatermarkerView'

import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import './Watermarker.css';

export default function WatermarkerPage() {

  const props = useWatermarker();

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