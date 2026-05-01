# PDF Merger — Combine Multiple PDFs Into One

Whether you need to consolidate project documents, combine contract addenda, or assemble a report from separate files, the **PDF Merger** on THRJ makes it fast. Drag in your files, reorder them, and download a single unified PDF — no software installation required. [Open the PDF Merger](/pdf-merger)
  
## Why Merge PDFs?

Keeping related content as separate PDF files creates friction: attaching multiple files to an email, uploading them one-by-one to a client portal, printing in the right order. Merging solves all of this.

**Common use cases:**

- **Business reports**: Combine an executive summary, financial spreadsheet export, and appendix into one deliverable.
- **Legal documents**: Assemble a contract body with exhibits, addenda, and signature pages into a single court-ready file.
- **Resume packages**: Merge your resume PDF with a cover letter and portfolio samples for a single, professional submission.
- **Scanned documents**: Scanner apps often save each page as a separate PDF — merge them into one cohesive document.
- **Project handoffs**: Combine spec sheets, design exports, and meeting notes into a package for a client or colleague.
- **Photo books and albums**: Organize scanned photos or image-to-PDF conversions into an ordered album file.
  
## Overview

PDF Merger lets you combine multiple PDF files into a single PDF quickly and privately in your browser. Files never leave your machine — the merge runs client-side and the resulting PDF is available for download.
  
## Step-by-step

1. Open the PDF Merger page: `/pdf-merger`.
2. Drag & drop or click to select multiple PDF files. The uploader accepts multiple files and shows a preview list.
3. Reorder files by dragging the list items into the desired sequence.
4. Optionally remove any file before merging.
5. Click **Merge** — the tool processes the PDFs and offers a single merged download when finished.
  
## Screenshots

The screenshots below are taken from the live UI and illustrate the key steps.

### Upload & list
![Upload and list](/screenshots/merger/merger-001.png)

### Reorder files
![Reorder files](/screenshots/merger/merger-002.png)

### Merge progress and download
![Merge progress](/screenshots/merger/merger-003.png)
  
## Reordering Strategies

Before clicking Merge, the file list gives you full control over page order. Here are practical strategies for common situations:

**Chronological order**: For meeting minutes or project logs, drag files to match the date order you want in the final document.

**Front-to-back assembly**: Place a cover page PDF first, followed by body content, then appendices or supporting documents last.

**Interleaving**: If you have odd and even pages scanned separately (a common two-pass scanning approach), reorder them so pages alternate correctly before merging.

**Selective removal**: Noticed you added the wrong version of a file? Click the remove button next to any file at any point before merging — no need to restart the upload.
  
## Tips for a Clean Merge

- **Check page orientation before merging**: If some PDFs are landscape and others portrait, the merged result will mix orientations. Rotate pages in the individual PDFs first if consistency matters.
- **Verify page counts in the preview list**: The upload list shows each file's name and size. Cross-reference against the original files to confirm you have everything.
- **Use consistent PDF versions**: Most modern PDFs merge without issue, but very old PDF 1.0–1.2 format files may behave unexpectedly. Re-export especially old files to a modern format if you encounter problems.
- **Large file merges**: Merging many large PDFs (especially scanned documents) can take longer. The progress indicator will remain active — just wait for it to complete.
  
## Privacy

The PDF Merger processes files for a short period of time (e.g. 30 min) before being automatically deleted from the server. This ensures your files are not stored indefinitely and helps maintain privacy. You should download the merged PDF as soon as possible after merging, as it will not be available after the expiration time.
  
## Frequently Asked Questions

**Is there a limit on how many files I can merge at once?**
The tool supports merging up to 20 files in a single operation. For very large batches, consider merging in two groups and then merging the resulting PDFs together.

**Will embedded hyperlinks be preserved after merging?**
Internal links within each PDF (such as clickable table-of-contents entries) are generally preserved. Links that pointed to specific page numbers within the original file may need to be updated since page numbering changes in the merged document.

**Can I merge password-protected PDFs?**
PDF security restrictions can prevent merging. If a PDF is protected with an "owner password" limiting editing and copying, the merge tool will not be able to process it. Remove restrictions using a password you own before uploading.

**Does merging affect image quality inside the PDFs?**
No. The merge operation combines the raw PDF page content without re-rendering or recompressing images. All content is passed through at its original quality.

**What happens if the merged PDF is very large?**
There is no hard size limit on the output PDF. Even large merges (50–100 MB+) will process and be available for download. Browser memory may be a limiting factor for extremely large batches on older devices.

**Can I edit the merged PDF after downloading?**
The resulting PDF is a standard PDF file. You can open it in any PDF editor (Adobe Acrobat, Preview on Mac, LibreOffice Draw, etc.) to make further edits if needed.

---
Published by THRJ Tech
