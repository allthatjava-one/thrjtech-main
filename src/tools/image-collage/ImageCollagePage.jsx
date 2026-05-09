import React, { useState } from "react";
import ImageCollageView from "./ImageCollageView";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { TEMPLATES } from "./templates";
import '../tools-shared.css';
import "./ImageCollage.css";

export default function ImageCollagePage() {
  const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[0]);
  const [images, setImages] = useState([]);
  const [cellWidth, setCellWidth] = useState(400);
  const [cellHeight, setCellHeight] = useState(400);

  const handleTemplateChange = (tpl) => {
    setSelectedTemplate(tpl);
  };

  return (
    <div className="image-collage-page">
      <Navbar />
      <main className="main">
        <div className="container">
          <div className="card">
            <ImageCollageView
              selectedTemplate={selectedTemplate}
              onTemplateChange={handleTemplateChange}
              images={images}
              setImages={setImages}
              cellWidth={cellWidth}
              setCellWidth={setCellWidth}
              cellHeight={cellHeight}
              setCellHeight={setCellHeight}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

