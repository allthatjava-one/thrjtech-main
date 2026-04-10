INSERT INTO blogs (slug, title, description, thumbnail, content) VALUES
(
  'pdf-compressor-guide',
  'Shrink PDFs quickly',
  'A short guide for using the PDF Compressor on THRJ.',
  'https://thrjtech.com/screenshots/compressor/pdf-compressor-01.png',
  '# PDF Compressor — Reduce PDF file size quickly

A short guide to using the **PDF Compressor** tool on THRJ. Learn the simple workflow, tips for best results, and privacy details. [Open the PDF Compressor](/pdf-compressor)

![PDF Compressor screenshot](/screenshots/compressor/pdf-compressor-01.png)

## Overview

PDF Compressor lets you shrink PDF file sizes to make them easier to share, upload, or archive — all from your browser. The tool balances size reduction with readable output and supports single or multiple PDFs.

Key benefits:
- Fast client-side or server-assisted compression (depending on file size and browser capabilities)
- Option to choose quality/size trade-offs
- Simple drag & drop workflow

## Video walkthrough

<div style="position: relative; width: 100%; padding-bottom: 56.25%; height: 0; overflow: hidden;">
	<iframe src="https://www.youtube.com/embed/ya4VRU4PRLA?si=4s6fGdBiiuKWSIH2" title="Image Crop walkthrough" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;"></iframe>
</div>

## Quick Steps

1. Open the PDF Compressor page: `/pdf-compressor`.
2. Drag & drop a PDF file onto the uploader, or click to browse and select files.
3. (Optional) Choose a compression preset: **High Quality**, **Balanced**, or **Maximum Compression**.
4. Click **Compress** and wait for the process to finish.
5. Download the compressed PDF when the tool finishes processing.

## Step-by-step with screenshots

### 1. Upload your PDF

Drop a PDF or click the upload area to select one from your device. The uploader shows filename, original size, and a brief preview when available.

![Upload PDF](/screenshots/compressor/pdf-compressor-02.png)
  
### 2. Pick a preset

Choose a preset depending on how much quality you want to preserve:
- **High Quality** — minimal visual loss, modest size reduction.
- **Balanced** — good quality with significant size savings.
- **Maximum Compression** — largest size reduction, some visual loss possible.

![Choose preset](/screenshots/compressor/pdf-compressor-03.png)
  
### 3. Compress and download

Click **Compress**. A progress indicator shows processing status. When finished, a download button appears for the compressed file.

![Compress progress](/screenshots/compressor/pdf-compressor-04.png)
  
## Tips for best results

- Try **Balanced** first for general use — it often gives the best trade-off.
- If the PDF contains many high-resolution images, expect larger savings from compression presets that downscale images.
- For documents with mostly text, compression may yield smaller improvements — consider converting scanned pages to a text-based PDF (OCR) before compressing.
- Keep an original copy before applying aggressive compression if you might need full-quality assets later.
  
## Privacy & retention

Files uploaded to the service are handled with privacy in mind. Compressed files are available for download and are removed from temporary storage after a short retention window. For maximum privacy, use the tool with small files so processing can occur entirely in your browser.
  
## Supported inputs

- PDF files (.pdf)
- Multi-page PDFs are supported — the whole document is compressed and returned as a single PDF.
  
---
Published by THRJ Tech'
);

INSERT INTO blogs (slug, title, description, thumbnail, content) VALUES
(
  'image-resizer-guide',
  'Resize images quickly',
  'A short walkthrough for using the Image Resizer tool on THRJ.',
  'https://thrjtech.com/screenshots/resizer/Image-resizer001.png',
  '# Image Resizer — Resize images quickly in your browser

A short walkthrough for using the **Image Resizer** tool on THRJ. This guide covers the basic workflow, useful tips, and privacy notes so you can shrink or scale images fast. [Open the Image Resizer](/image-resizer)

![Image Resizer screenshot](/screenshots/resizer/Image-resizer001.png)

## Overview

Image Resizer makes it easy to change image dimensions, scale for web or print, and reduce file size without leaving your browser. It supports common formats (JPEG, PNG, WebP) and offers presets for common targets like social posts or thumbnails.

## Quick steps

1. Open the Image Resizer page: `/image-resizer`.
2. Drag & drop an image or click to select files from your device.
3. Use Alt+Scroll or Pinch to zoom in and out of the image preview.
4. (Optional) Adjust image quality/compression.
5. Click **Resize** and download the resized image.

## Step-by-step with screenshots

### 1. Upload an image

Drop one or more images into the uploader or use the file picker. The uploader displays filename, dimensions, and original size.

![Upload image](/screenshots/resizer/Image-resizer002.png)

### 2. Pick size or preset

Select a preset for common destinations or type custom width and height. You can keep the aspect ratio locked to avoid distortion.

![Choose size](/screenshots/resizer/Image-resizer003.png)

### 3. Adjust quality and resize

Choose a compression/quality level if you want smaller files. Click **Resize** — a progress indicator appears and the resized image becomes available for download.

![Resize and download](/screenshots/resizer/Image-resizer004.png)

## Tips

- Use presets for quick, consistent results across social platforms.
- Lower quality slightly for big file-size savings when images are for web use.
- Keep the aspect ratio locked unless you specifically need a different shape.
- For batch edits, upload multiple files and download a ZIP of resized images.

## Privacy

Images uploaded for resizing are available briefly for download and then removed. If you prefer not to upload sensitive images, use the browser-only resizing option when available.

---
Published by THRJ Tech'
);

INSERT INTO blogs (slug, title, description, thumbnail, content) VALUES
(
  'pdf-converter-guide',
  'Convert files to and from PDF',
  'A concise guide for using the PDF Converter on THRJ.',
  'https://thrjtech.com/screenshots/converter/PDF-converter001.png',
  '# PDF Converter — Convert files to and from PDF

I built the **PDF Converter** on THRJ to make it simple to turn documents and images into PDFs — and to pull content back out of PDFs when you need it. Try it now: [Open the PDF Converter](/pdf-converter).

![PDF Converter screenshot](/screenshots/converter/PDF-converter001.png)

## Overview

I designed the PDF Converter to help you move files between PDFs and common formats like Word, PowerPoint, images, and plain text. It works both ways: export source files to PDF, or extract pages, images, or text from PDFs.

What you can do:
- Convert Word, PowerPoint, and image files into PDFs
- Extract images or text from PDFs (when supported)
- Batch-convert multiple files at once
- Use simple presets for print-ready or web-optimized output

## Quick steps

1. Go to the [PDF Converter](/pdf-converter).
2. Drag & drop or click to select one or more files (DOCX, PPTX, JPG, PNG, PDF, etc.).
3. Pick the conversion direction and any preset (for example `Print Quality`, `Web Optimized`, or `Extract Images`).
4. Click **Convert** and wait for the progress to finish.
5. Download your converted file(s).

## Step-by-step with screenshots

### 1. Upload files

Drag & drop files onto the converter or use the file selector. Supported types are shown in the upload area.

![Upload files](/screenshots/converter/PDF-converter002.png)

### 2. Select conversion options

Pick the output format and any presets. For example, convert a `DOCX` to `PDF` with `Print Quality`, or choose `Extract Images` to pull images out of a PDF.

![Choose options](/screenshots/converter/PDF-converter003.png)

### 3. Convert and download

Click **Convert**. The UI shows progress for each file. After conversion, each file has a download link or a combined ZIP for batch results.

![Conversion progress](/screenshots/converter/PDF-converter004.png)

## Making the most of conversions

Here are a few practical tips we recommend from day-to-day use:

- Choose `Print Quality` when you need accurate colors and detail for printing. It keeps images and layouts closer to the original.
- Pick `Web Optimized` for documents you plan to share online — it reduces file size without a noticeable drop in readability.
- If you need text from a scanned document, try the `Extract Text (OCR)` option. OCR accuracy depends on scan clarity and language.
- For presentations, double-check embedded fonts and large images after conversion; some fonts may be substituted if they aren''t embedded.

## Privacy and retention

Files uploaded for conversion are held only briefly to allow download and then removed. If your document is sensitive and you prefer not to upload it, use the browser-based conversion option where available.

## Supported formats

- Inputs: PDF(support varies in future by conversion direction)
- Outputs: JPG/PNG (extracted pages/images)

---
Published by THRJ Tech'
);
