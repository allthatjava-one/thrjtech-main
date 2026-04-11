# Image Converter — Convert images in the browser (JPG, PNG, WebP, AVIF, BMP, GIF, ICO)

A short guide to the **Image Converter** on THRJ. This article explains how to convert images between formats, preserve transparency, and create ICO files for favicons. [Open the Image Converter](/image-converter)

![Image Converter screenshot](/screenshots/image-converter/image-converter-001.png)

## Overview

Image Converter runs entirely in your browser — no uploads. It decodes your image, draws it to an offscreen canvas, and exports to the selected target format. Supported outputs include JPG, PNG, WebP, AVIF, BMP, GIF, and ICO. TIFF is supported as an input format (decoded in-browser).

## Quick steps

1. Open the Image Converter page: `/image-converter`.
2. Drag & drop an image or click to choose a file.
3. Pick the output format from the buttons.
4. (For ICO) choose the desired icon size and click **Convert**.
5. Download the converted image using **Download**.

## Step-by-step with screenshots

### 1. Upload an image

Drop a file onto the upload area or use the file picker. The tool auto-selects sensible defaults.

![Upload](/screenshots/image-converter/image-converter-002.png)

### 2. Choose a format and convert

Select the target format and click **Convert**. The preview shows the converted result and supports pan and zoom.

![Convert](/screenshots/image-converter/image-converter-003.png)

## Tips

- Use PNG, WebP, or AVIF to preserve transparency.
- For photos, JPG or AVIF typically give the best size/quality trade-off.
- ICO exports create single-size icons; pick the size you need for favicons.

## Privacy

All conversion happens locally in your browser; no files are uploaded.

---
Published by THRJ Tech
