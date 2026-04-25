# Image Crop Guide — Crop, Rotate, and Frame Photos Directly in Your Browser
  
A complete walkthrough for using the Image Crop tool on THRJ. This guide explains the UI, key controls, and step-by-step instructions with screenshots. Whether you need to remove an unwanted background edge, produce a square crop for Instagram, or reframe a portrait, THRJ's browser-based crop tool has you covered. [Open the Crop Image](/image-crop)
  
## What Is Image Cropping?

Image cropping is the process of selecting a rectangular region of an image and discarding everything outside that region. It is one of the most fundamental photo editing operations and is used daily by content creators, marketers, social media managers, photographers, and developers.

Common reasons to crop an image include:

- Removing unwanted elements from the edges (a stranger walking into frame, distracting background clutter, timestamp overlays)
- Reframing a subject to improve composition or shift focus
- Resizing an image to a specific aspect ratio required by a platform (e.g. 1:1 for Instagram, 16:9 for YouTube, 9:16 for Stories)
- Extracting a specific portion of a screenshot or diagram for use in documentation or presentations
- Preparing product images for e-commerce listings that require a uniform square format

Traditional desktop software like Photoshop or GIMP handles cropping excellently but requires installation and a learning curve. Browser-based tools like THRJ's Image Crop tool let you complete the same task in seconds from any device.

![Crop tool screenshot](/screenshots/crop/crop_001.png)
  
## Video walkthrough

<div style="position: relative; width: 100%; padding-bottom: 56.25%; height: 0; overflow: hidden;">
	<iframe src="https://www.youtube.com/embed/obf1Bh2xsLw" title="Image Crop walkthrough" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;"></iframe>
</div>
  
## Quick Steps

1. Open the Image Crop tool from the main menu (Tools → Image Crop) or visit `/image-crop`.
2. Drag & drop an image onto the crop area or click to browse and select a file.
3. Drag the crop overlay to frame the portion you want to keep. Use aspect ratio presets or `Free` mode for custom cropping.
4. Adjust zoom (Alt + mouse wheel works), rotate, or flip the image to fine-tune the framing.
5. Click **Preview** to generate the cropped image, inspect it, then click **Download** to save the PNG.
  
## Step-by-step with screenshots

1. Load an image

![Load image](/screenshots/crop/crop_001.png)

- Click the crop area or drag an image file onto it to load.
- The image appears inside the crop window with a draggable selection box.

2. Choose aspect & select region

![Select region](/screenshots/crop/crop_002.png)

- Pick an aspect ratio from the dropdown (1:1, 16:9, 4:5) or choose Free for unconstrained cropping.
- Drag the corners to resize the selection or drag the selection to move it.

3. Zoom, rotate, flip

![Zoom rotate flip](/screenshots/crop/crop_003.png)

- Use the Zoom slider or hold Alt + scroll to zoom the image inside the crop window.
- Use the rotate buttons to rotate in 90° steps or enter a custom angle if available.
- Use the Flip controls to mirror horizontally or vertically.

4. Preview & download

![Preview result](/screenshots/crop/crop_004.png)

- Click **Preview** to render the cropped region and inspect it in the preview dialog.
- When satisfied, click **Download** to save the cropped PNG to your device.
  
## Tips & FAQs

- All processing runs in your browser — your image is not uploaded to our servers.
- Supported image formats: any format your browser supports (JPEG, PNG, WebP, GIF, etc.). Output is PNG.
- If the Download button is disabled, click Preview first to generate the output.
- Use presets (Instagram, YouTube, Profile) for common target sizes.
  
## Aspect Ratio Guide for Popular Platforms

Knowing the right aspect ratio before you crop saves time and avoids having to redo the crop after uploading:

| Platform / use | Aspect ratio | Pixels (recommended) |
|---|---|---|
| Instagram square post | 1:1 | 1080 × 1080 |
| Instagram portrait post | 4:5 | 1080 × 1350 |
| Instagram Stories / Reels | 9:16 | 1080 × 1920 |
| Twitter / X post image | 16:9 | 1200 × 675 |
| YouTube thumbnail | 16:9 | 1280 × 720 |
| Facebook cover photo | 205:78 (~2.63:1) | 820 × 312 |
| LinkedIn profile banner | 4:1 | 1584 × 396 |
| Profile picture (most platforms) | 1:1 | 400 × 400 minimum |
| E-commerce product (Amazon) | 1:1 | 1000 × 1000 minimum |
| Blog hero image | 16:9 | 1200 × 675 |
  
## Cropping Techniques for Better Composition

A crop is not just about removing the edges — it is an opportunity to improve the visual composition of your image. Here are some principles to keep in mind:

**Rule of thirds**: Divide the frame into a 3×3 grid. Placing the main subject at one of the four intersection points tends to produce a more visually balanced image than centering the subject.

**Headroom and look room**: For portrait shots, leave appropriate space above the head (headroom) and in the direction the subject is looking (look room). Cutting too tight above the head or cropping into the look space makes the image feel cramped.

**Remove distractions, not context**: Cropping out an unwanted element is fine, but make sure the crop doesn't also remove context that helps the viewer understand the scene. A tight crop on a product photo looks clean; a tight crop on a landscape photo can lose all sense of scale.

**Straightening**: If the horizon in your photo is slightly tilted, use the rotation control in the crop tool to straighten it before exporting. A straight horizon dramatically improves the perceived quality of landscape, architecture, and product photography.
  
## Using the Rotate and Flip Controls

Beyond cropping, THRJ's Image Crop tool includes controls to rotate and flip images:

- **90° rotation**: Quickly rotate a photo that was taken in the wrong orientation (e.g. a phone photo saved in landscape when it should be portrait).
- **Custom angle rotation**: Enter a specific degree value to straighten a horizon or correct a slight tilt from a handheld shot.
- **Horizontal flip**: Produce a mirror image. Useful for creating reflected or symmetrical compositions.
- **Vertical flip**: Flip an image upside down. Occasionally used for creative effects or to correct scanner orientation.
  
## Frequently Asked Questions

**Does the crop output keep EXIF metadata?**
The output is a PNG canvas export, which does not include the original EXIF data (location, camera model, etc.). This is actually useful for privacy — sharing a cropped export removes embedded location data from photos.

**Can I undo a crop?**
While the tool doesn't have multi-step undo, you can reload the original image at any time by dropping it back onto the upload area, and re-do the crop from scratch.

**Why is my output in PNG when my input was JPEG?**
The crop tool exports to PNG to avoid recompression artifacts. PNG is lossless, so the cropped region is an exact pixel-perfect copy of the selected area. If you need JPEG, run the output through the [Image Converter](/image-converter).

**Can I crop with a fixed pixel size instead of an aspect ratio?**
Set your desired aspect ratio, then use the [Image Resizer](/image-resizer) afterwards to scale the result to the exact pixel dimensions you need.

---
Published by THRJ Tech
