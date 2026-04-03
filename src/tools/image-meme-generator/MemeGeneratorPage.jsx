import React from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import MemeGeneratorView from "./MemeGeneratorView";
import "./MemeGenerator.css";

export default function MemeGeneratorPage() {
  return (
    <div className="meme-generator-page">
      <Navbar />
      <main className="main">
        <div className="container">
          <div className="card">
            <MemeGeneratorView />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
