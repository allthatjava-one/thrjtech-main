import React from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import MemeGeneratorView from "./MemeGeneratorView";
import { useLocation } from 'react-router-dom';
import '../image-tools-shared.css';
import "./MemeGenerator.css";

export default function MemeGeneratorPage() {
  const location = useLocation();
  const stateImage = location.state && location.state.mainImage;
  return (
    <div className="meme-generator-page">
      <Navbar />
      <main className="main">
        <div className="container">
          <div className="card">
            <MemeGeneratorView initialFile={stateImage} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
