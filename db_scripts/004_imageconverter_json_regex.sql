INSERT INTO blogs (slug, title, description, thumbnail, content, createdAt) VALUES
(
  'json-formatter-guide',
  'JSON Formatter — Pretty-print, validate, and explore JSON',
  'A quick guide to using the JSON Formatter tool on THRJ. This page covers the basic workflow, validation tips, and privacy notes.',
  'https://thrjtech.com/images/screenshots/json-formatter/JSON_formatter001.png',
  '# JSON Formatter — Pretty-print, validate, and explore JSON

A quick guide to using the **JSON Formatter** tool on THRJ. This page covers the basic workflow, validation tips, and privacy notes. [Open the JSON Formatter](/json-formatter)

![JSON Formatter screenshot](/images/screenshots/json-formatter/JSON_formatter001.png)

## Overview

JSON Formatter helps you clean, validate, and visualize JSON instantly in your browser. It supports formatting (pretty-print), minifying, syntax validation, and basic structure exploration.

## Quick steps

1. Open the JSON Formatter page: `/json-formatter`.
2. Paste or drop your JSON into the editor.
3. Click **Format** to pretty-print or **Minify** to compress.
4. Use **Validate** to check for syntax errors and line numbers.
5. Copy or download the result.

## Step-by-step with screenshots

### 1. Paste or load JSON

Paste raw JSON into the editor or drag a `.json` file onto the editor area.

![Load JSON](/images/screenshots/json-formatter/JSON_formatter002.png)

### 2. Format & validate

Click **Format** to pretty-print with indentation. If there are syntax errors, the tool highlights the line and shows an error message.

![Format JSON](/images/screenshots/json-formatter/JSON_formatter003.png)

### 3. Explore structure

Use the simple tree view to inspect objects and arrays. Collapse or expand sections to focus on the parts you care about.

![Explore JSON](/images/screenshots/json-formatter/JSON_formatter004.png)

## Tips

- Use **Minify** for sending JSON over networks where bandwidth matters.
- For large JSON files, paste or load in parts if your browser shows performance issues.
- Keep copies of original JSON before mass edits.

## Privacy

All processing happens in your browser; nothing is uploaded to servers. If you work with sensitive data, prefer an offline editor.

---
Published by THRJ Tech',
CURRENT_TIMESTAMP
),
(
  'regex-tester-guide',
  'Regex Tester — Build and test regular expressions quickly',
  'A concise guide to the Regex Tester tool on THRJ. Use this tool to compose, test, and debug regular expressions against sample input.',
  '',
  '# Regex Tester — Build and test regular expressions quickly

A concise guide to the **Regex Tester** tool on THRJ. Use this tool to compose, test, and debug regular expressions against sample input. [Open the Regex Tester](/regex-tester)

## Overview

Regex Tester provides a live environment to write regular expressions, test them against sample text, and visualize matches. It shows match groups, replacement previews, and common flags (g, i, m, s, u).

## Quick steps

1. Open the Regex Tester page: `/regex-tester`.
2. Enter or paste sample text into the input area.
3. Type your regular expression into the pattern field.
4. Toggle flags like `i` (ignore case) or `g` (global) as needed.
5. See matches highlighted live and use replacement preview to test substitutions.

## Features

- Live highlighting of matches and capture groups.
- Replacement preview (show what `replace()` would produce).
- Flag toggles and quick common pattern snippets.
- Export your pattern and sample text for sharing.

## Tips

- Use the replacement preview to verify complex substitutions before running them globally.
- Start with simple patterns and progressively add complexity.
- Test with multiple sample lines to ensure multiline behavior is correct.

## Privacy

All processing is local to your browser. Do not paste sensitive data if you are concerned about clipboard history.

---
Published by THRJ Tech',
CURRENT_TIMESTAMP
),
(
  'image-converter-guide',
  'Image Converter — Convert images in the browser (JPG, PNG, WebP, AVIF, BMP, GIF, ICO)',
  'A short guide to the Image Converter on THRJ describing how to convert images between formats and create ICO files for favicons.',
  'https://thrjtech.com/images/screenshots/image-converter/image-converter-003.png',
  '# Image Converter — Convert images in the browser (JPG, PNG, WebP, AVIF, BMP, GIF, ICO)

A short guide to the **Image Converter** on THRJ. This article explains how to convert images between formats, preserve transparency, and create ICO files for favicons. [Open the Image Converter](/image-converter)

![Image Converter screenshot](/images/screenshots/image-converter/image-converter-001.png)

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

![Upload](/images/screenshots/image-converter/image-converter-002.png)

### 2. Choose a format and convert

Select the target format and click **Convert**. The preview shows the converted result and supports pan and zoom.

![Convert](/images/screenshots/image-converter/image-converter-003.png)

## Tips

- Use PNG, WebP, or AVIF to preserve transparency.
- For photos, JPG or AVIF typically give the best size/quality trade-off.
- ICO exports create single-size icons; pick the size you need for favicons.

## Privacy

All conversion happens locally in your browser; no files are uploaded.

---
Published by THRJ Tech',
CURRENT_TIMESTAMP
);
