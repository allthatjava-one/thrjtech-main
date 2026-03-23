import React, { useState, useEffect } from "react";
import ImageCollageView from "./ImageCollageView";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import "./ImageCollage.css";

export default function ImageCollagePage() {
  const [columns, setColumns] = useState(2);
  const [rows, setRows] = useState(2);
  const [width, setWidth] = useState(400);
  const [height, setHeight] = useState(400);
  const [images, setImages] = useState([]);
  const [collageUrl, setCollageUrl] = useState(null);
  // Auto-reduce columns/rows if image count decreases
  useEffect(() => {
    if (images.length === 0) return;
    // Prefer a square or nearly-square grid
    const n = images.length;
    let bestCols = Math.ceil(Math.sqrt(n));
    let bestRows = Math.ceil(n / bestCols);
    // If this is not the most square, try the next lower cols
    if ((bestCols - 1) > 0) {
      let altCols = bestCols - 1;
      let altRows = Math.ceil(n / altCols);
      if (Math.abs(altCols - altRows) < Math.abs(bestCols - bestRows)) {
        bestCols = altCols;
        bestRows = altRows;
      }
    }
    if (bestCols !== columns) setColumns(bestCols);
    if (bestRows !== rows) setRows(bestRows);
  }, [images]);

  return (
    <div className="image-collage-page">
      <Navbar />
      <main className="main">
        <div className="container">
          <div className="card">
            <ImageCollageView
              columns={columns}
              setColumns={setColumns}
              rows={rows}
              setRows={setRows}
              width={width}
              setWidth={setWidth}
              height={height}
              setHeight={setHeight}
              images={images}
              setImages={setImages}
              collageUrl={collageUrl}
              setCollageUrl={setCollageUrl}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
