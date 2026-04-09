INSERT INTO blogs (slug, title, description, thumbnail, content) VALUES
(
  'image-collage-guide',
  'Want beautifully collaged images?',
  'A short walkthrough for using the Image Collage tool on THRJ.',
  'https://thrjtech.com/screenshots/collage/image-collage004.png',
  '# Image Collage Guide

A short walkthrough for using the Image Collage tool on THRJ. This guide explains the UI, key controls, and step-by-step instructions with screenshots.

![Collage tool screenshot](/screenshots/collage/image-collage001.png)

## Quick Steps

1. Open the Image Collage tool from the main menu (Tools → Image Collage) or visit `/image-collage`.
2. Add images by dragging files into the drop zone or click to browse and select multiple files.
3. Set the grid: choose rows and columns, adjust spacing and border color as needed.
4. Reposition each image by dragging inside its cell; use zoom/pinch to change framing.
5. Click **Collage and Preview** to inspect the assembled result, then **Download** to save the final image.

## Step-by-step with screenshots

1. Add images and choose the grid

![Add images](/screenshots/collage/image-collage001.png)

- Drag & drop or browse to add images. The tool places them into the grid in the order you add them.
- Choose the number of rows and columns to control layout.

2. Adjust spacing, border, and cell framing

![Adjust grid](/screenshots/collage/image-collage002.png)

- Use the border gap control to add breathing room between tiles.
- Click each image to pan and scale it inside its cell so the most important part is visible.

3. Preview and finalize

![Preview collage](/screenshots/collage/image-collage003.png)

- Hit **Collage and Preview** to open the preview dialog with zoom and finalize controls.
- Use the preview tools to reset offsets, change background/border color, or finalize the export resolution.

4. Generate and download

![Download collage](/screenshots/collage/image-collage004.png)

- Finalize the collage to render a single raster image and download it as a PNG (or convert to JPEG externally if you need smaller files).

## Tips & FAQs

- All composition runs in your browser — images remain on your device unless you explicitly upload or share them.
- For social posts, aim for a canvas width between 1200–2048px for a good balance of quality and file size.
- If an image looks soft after export, use a higher-resolution source image or increase the export canvas size.
- Animated sources (GIF/WebP) are flattened to a single frame during export.

---
Published by THRJ Tech.'
);

INSERT INTO blogs (slug, title, description, thumbnail, content) VALUES
(
  'image-watermark-guide',
  'Let''s put a watermark on your images',
  'A short walkthrough for using the Image Watermarker tool on THRJ.',
  'https://thrjtech.com/screenshots/watermarker/watermarker001.png',
  '# Image Watermark Guide

A short walkthrough for using the Image Watermarker tool on THRJ. This guide explains the UI, key controls, and step-by-step instructions with screenshots.

![Watermarker tool screenshot](/screenshots/watermarker/watermarker001.png)

## Quick Steps

1. Open the Image Watermarker from the main menu (Tools → Image Watermarker) or visit `/image-watermarker`.
2. Drag & drop an image onto the drop zone or click to browse and select a file.
3. Choose **Text Watermark** or **Logo Watermark** using the radio buttons.
4. Enter your watermark text or upload a PNG/SVG logo file.
5. Adjust position, size, and opacity to place the watermark where you want it.
6. Click **Apply Watermark** to preview the result, then **Download** to save the watermarked image.

## Step-by-step with screenshots

### 1. Load an image

![Load an image](/screenshots/watermarker/watermarker001.png)

- Drag & drop or click the drop zone to select an image from your device.
- Any common web format is supported: JPEG, PNG, WebP, and more.

### 2. Choose text or logo and configure

![Set watermark options](/screenshots/watermarker/watermarker002.png)

- Select **Text Watermark** and type your text (e.g. your name, website, or copyright notice), or select **Logo Watermark** and upload a PNG/SVG graphic.
- Use transparent-background PNG or SVG logos for the cleanest result.

### 3. Adjust position, size, and opacity

![Adjust watermark placement](/screenshots/watermarker/watermarker003.png)

- Use the position, scale, and opacity controls to fine-tune where and how strongly the watermark appears.
- Placing the watermark in a corner is less likely to be cropped; full-frame or tiled placement gives stronger protection.

### 4. Preview and download

![Download watermarked image](/screenshots/watermarker/watermarker004.png)

- Click **Apply Watermark** to render the composite image and inspect it in the preview.
- When satisfied, click **Download** to save the watermarked file to your device.

## Tips & FAQs

- All processing runs in your browser — your images are not uploaded to any server.
- Use lower opacity for a subtle brand mark; higher opacity for stronger visible protection.
- Logos with transparent backgrounds (PNG or SVG) produce cleaner results than logos with white or solid-color backgrounds.
- Animated images (GIF/WebP) are flattened to a single frame on export.
- Visible watermarks deter casual reuse but are not foolproof — a determined actor can crop or remove them.

---
Published by THRJ Tech'
);

