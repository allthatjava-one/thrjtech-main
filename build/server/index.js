import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { ServerRouter, UNSAFE_withComponentProps, Meta, Links, Outlet, ScrollRestoration, Scripts, useLocation as useLocation$1 } from "react-router";
import { renderToReadableStream } from "react-dom/server";
import i18n from "i18next";
import { initReactI18next, useTranslation } from "react-i18next";
import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useLocation, Link, useNavigate, useLoaderData, useSearchParams, useParams } from "react-router-dom";
import JSZip from "jszip";
import Cropper from "react-easy-crop";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
const nav = { "home": "Home", "tools": "Tools", "pdf": "PDF", "pdfCompressor": "PDF Compressor", "pdfMerger": "PDF Merger", "pdfConverter": "PDF Converter", "pdfSplitter": "PDF Splitter", "text": "Text", "jsonFormatter": "JSON Formatter", "regexTester": "Regex Tester", "image": "Image", "imageResize": "Resize", "imageWatermark": "Watermark", "imageCollage": "Collage", "imageCrop": "Crop", "imageMemeGenerator": "Meme Generator", "imageConverter": "Converter", "imageRotator": "Rotator", "video": "Video", "screenRecorder": "Quick Screen Recorder", "blog": "Blog", "contactUs": "Contact Us", "openMenu": "Open menu" };
const footer = { "copyright": "© {{year}} THRJTech. All rights reserved.", "aboutUs": "About Us", "privacyPolicy": "Privacy Policy", "termsOfService": "Terms of Service" };
const lang = { "en": "EN", "fr": "FR", "es": "ES", "ko": "KO" };
const common = {
  nav,
  footer,
  lang
};
const hero$e = { "title": "Simple Online Tools,\nZero Hassle", "subtitle": "Free, fast, and privacy-friendly utilities that work right in your browser." };
const popularGuides = { "heading": "Popular Guides", "jsonFormatter": "JSON Formatter — Pretty-print, validate & explore JSON", "imageCrop": "Image Crop — Trim and frame your images", "memeGenerator": "Meme Generator — Create shareable memes in seconds", "pdfCompressor": "PDF Compressor — Shrink PDF file sizes quickly", "imageCollage": "Image Collage — Build beautiful photo collages", "pdfMerger": "PDF Merger — Combine multiple PDFs into one" };
const developerTools = { "heading": "Developer Tools", "jsonFormatterName": "JSON Formatter", "jsonFormatterDesc": "Format, validate, and pretty-print JSON instantly in your browser. Supports syntax highlighting, minification, and clear error reporting.", "regexTesterName": "Regex Tester", "regexTesterDesc": "Test regular expressions with live match highlighting and replace support. Iterate quickly on patterns with real-time feedback." };
const imageTools = { "heading": "Image Tools", "imageCropName": "Crop Image", "imageCropDesc": "Crop any image to the exact size and aspect ratio you need. Supports free-form cropping and convenient presets like 1:1, 16:9, and 4:5 — all in your browser.", "memeGeneratorName": "Meme Generator", "memeGeneratorDesc": "Add bold text layers over any image, drag them into position, and download your custom meme as a PNG. No account needed." };
const cards$1 = { "howItWorks": "How it works", "pdfCompressor": { "title": "PDF Compressor", "btn": "Open PDF Compressor", "description": "Shrink your PDF files without sacrificing quality. Upload a document and download a smaller version in seconds — no account required, no watermarks.", "feature1": "Compress PDFs up to 90% smaller", "feature2": "Adjustable compression levels (low, medium, high)", "feature3": "Supports multi-page PDFs of any size", "feature4": "100% free, no sign-up needed", "step1": "1. Drag & drop or browse for your PDF", "step2": "2. Review the file, then hit Compress PDF", "step3": "3. Securely uploads & compresses in seconds", "step4": "4. Download your compressed PDF" }, "pdfMerger": { "title": "PDF Merger", "btn": "Open PDF Merger", "description": "Combine multiple PDF files into a single document in seconds. Drag, drop, and merge — no account required, no watermarks.", "feature1": "Merge unlimited PDFs for free", "feature2": "Reorder files before merging", "feature3": "No watermarks, no sign-up needed", "feature4": "Fast, secure, and privacy-friendly", "feature5": "Automatically compresses merged file to reduce size (Optional)", "step1": "1. Drag & drop or browse for your PDFs", "step2": "2. Arrange the order of your files", "step3": "3. Click Merge PDF to combine files", "step4": "4. Download your merged PDF" }, "pdfConverter": { "title": "PDF Converter", "btn": "Open PDF Converter", "description": "Convert PDF pages into JPG or PNG images quickly — upload, choose format, and download the results without signing up.", "feature1": "Convert PDF to JPG or PNG", "feature2": "Fast, single-click conversions", "feature3": "Preview and download converted images", "feature4": "Temporary storage with automatic cleanup", "feature5": "No account or watermarks", "step1": "1. Drag & drop or browse for your PDF", "step2": "2. Choose JPG or PNG", "step3": "3. Start conversion and watch progress", "step4": "4. Download converted images to your device" }, "jsonFormatter": { "title": "JSON Formatter", "btn": "Open JSON Formatter", "description": "Quickly validate, format, and beautify your JSON data. Instantly see errors, get readable output, and copy or download the result.", "feature1": "Validate and format JSON instantly", "feature2": "Paste, upload, or drag & drop JSON files", "feature3": "Highlights errors with line numbers", "feature4": "Download or copy formatted output", "step1": "1. Paste or upload your JSON data", "step2": "2. Click Validate and Format JSON", "step3": "3. Instantly see errors with line numbers if your JSON is invalid", "step4": "4. Download or copy the beautified JSON" }, "imageWatermarker": { "title": "Image Watermarker", "btn": "Open Image Watermarker", "description": "Add a text or logo watermark to your images in seconds. Drag, drop, and download — all in your browser, no account required.", "feature1": "Add text or logo as watermark", "feature2": "Preview before downloading", "feature3": "Drag & drop image upload", "feature4": "No watermarks or sign-up needed", "feature5": "Works with PNG, JPG, and more", "step1": "1. Drag & drop or browse for your image", "step2": "2. Enter watermark text or upload logo", "step3": "3. Preview the watermarked image", "step4": "4. Download your watermarked image" }, "imageResizer": { "title": "Image Resizer", "btn": "Open Image Resizer", "description": "Resize your images by percentage or by custom dimensions. Fast, privacy-friendly, and works entirely in your browser — no uploads, no accounts, no watermarks.", "feature1": "Resize by percentage or dimensions", "feature2": "Maintains aspect ratio (optional)", "feature3": "Works with PNG, JPG, and more", "feature4": "No watermarks, no sign-up needed", "feature5": "Preview before downloading", "step1": "1. Drag & drop or browse for your image", "step2": "2. Choose resize mode and set dimensions or zoom in/out", "step3": "3. Preview the resized image", "step4": "4. Download your resized image" }, "imageCollage": { "title": "Image Collage", "btn": "Open Image Collage", "description": "Arrange multiple images into a clean grid collage instantly. Drag, drop, reorder, and download — all in your browser, no account required, no watermarks.", "feature1": "Combine multiple images into a grid collage", "feature2": "Drag & drop to upload and reorder images", "feature3": "Auto-expands grid to fit all your images", "feature4": "Set custom output width and height", "feature5": "No watermarks, no sign-up needed", "step1": "1. Drag & drop or browse for your images", "step2": "2. Arrange images and set the grid layout", "step3": "3. Preview your collage instantly", "step4": "4. Download your finished collage" }, "imageConverter": { "title": "Image Converter", "btn": "Open Image Converter", "description": "Convert images between JPG, PNG, and WebP instantly in your browser. Drop your image, choose a format, and download — no uploads, no account required.", "feature1": "Convert between JPG, PNG, and WebP", "feature2": "Auto-detects input format", "feature3": "Transparent PNGs get white background on JPG export", "feature4": "100% local — files never leave your browser", "step1": "1. Drag & drop or browse for your images", "step2": "2. Choose output format (JPG, PNG, or WebP)", "step3": "3. Preview your converted image", "step4": "Optional — Convert multiple images at once" } };
const home = {
  hero: hero$e,
  popularGuides,
  developerTools,
  imageTools,
  cards: cards$1
};
const title$4 = "Contact Us";
const intro = "We love hearing from our users — your feedback is what drives us to keep improving. Whether you've spotted a bug, have a feature request, or just want to share your experience, we genuinely want to know. Drop us a message using the form below and we'll get back to you as soon as possible. Every message is read by a real person, and we do our best to respond promptly. Thank you for taking the time to reach out!";
const signature = "- The THRJTech Team";
const emailLabel = "Email Address";
const emailPlaceholder = "your@email.com";
const messageLabel = "Message";
const messagePlaceholder = "How can we help you?";
const submitBtn = "Submit";
const sendingBtn = "Sending…";
const successMsg = "Thank you! We received your message.";
const errorMsg = "Sorry, something went wrong. Please try again.";
const honeypotLabel = "Leave this field empty";
const contact$3 = {
  title: title$4,
  intro,
  signature,
  emailLabel,
  emailPlaceholder,
  messageLabel,
  messagePlaceholder,
  submitBtn,
  sendingBtn,
  successMsg,
  errorMsg,
  honeypotLabel
};
const title$3 = "About Us";
const whoWeAre = { "heading": "Who We Are", "body": "THRJTech is a small independent team of developers passionate about making everyday digital tasks simpler for everyone. We build free, browser-based tools so you can get things done without installing software, creating accounts, or paying subscriptions. We started because we were tired of hunting for simple utilities only to land on sites riddled with ads, paywalls, or mandatory sign-ups. There had to be a better way — so we built it ourselves." };
const ourMission = { "heading": "Our Mission", "body": "We believe that powerful, practical tools should be free and accessible to all. Whether you need to resize a photo, compress a PDF, create a meme, or watermark an image, our goal is to give you a fast, private, no-friction way to do it — right in your browser. We focus relentlessly on simplicity: every tool is designed to be intuitive enough to use in seconds, with no learning curve and no manual required." };
const builtForEveryone = { "heading": "Built for Everyone", "body": "Our users range from students and freelancers to small business owners and developers. What they all have in common is a need to get something done quickly without jumping through hoops. We design every feature with that in mind — fast load times, clean interfaces, and outputs you can trust. If a tool feels clunky or confusing, we consider that a bug worth fixing." };
const privacyFirst = { "heading": "Privacy First", "body": "Every tool we build is designed with your privacy in mind. Wherever possible, all processing happens locally on your device — your files never leave your browser. For features that do require server-side processing (such as PDF compression or merging), files are handled on short-lived infrastructure and deleted automatically within 30 minutes. We do not store, sell, or share your data. For more information on how we and our partners handle data, please see our full", "privacyLink": "Privacy Policy" };
const alwaysFree = { "heading": "Always Free", "body": "All of our tools are completely free to use with no hidden costs, no sign-up required, and no usage limits. We sustain the service through transparent, non-intrusive advertising partnerships (including Google AdSense), which allows us to keep our tools free and accessible to the global community without compromising user experience. We will never put core features behind a paywall — that goes against everything we stand for." };
const constantlyImproving = { "heading": "Constantly Improving", "body": "We ship updates regularly based on user feedback and our own day-to-day use of the tools. New tools are added when we identify a gap that isn't already well-served by a simple, free, browser-based solution. Our roadmap is driven by what is actually useful — not by trends or feature bloat. If something doesn't make the experience better, it doesn't ship." };
const getInTouch = { "heading": "Get in Touch", "body": "We are always looking to improve. If you have suggestions, feedback, or find a bug, please reach out — we read every message and genuinely appreciate the time people take to write in. Your input has directly shaped many of the features you see today, and we look forward to hearing what you think next.", "contactLink": "Contact Us →" };
const about = {
  title: title$3,
  whoWeAre,
  ourMission,
  builtForEveryone,
  privacyFirst,
  alwaysFree,
  constantlyImproving,
  getInTouch
};
const title$2 = "Privacy Policy";
const lastUpdated$1 = "Last updated: April 2026";
const overview = { "heading": "Overview", "body": 'THRJTech ("we", "our", or "us") respects your privacy. This policy explains how information is collected and used when you visit this site. All image and PDF processing tools run entirely in your browser — your files are never uploaded to our servers unless explicitly stated for a specific feature (such as PDF compression or merging which use short-lived cloud processing).' };
const googleAdsense = { "heading": "Google AdSense & Advertising", "body1": "We use Google AdSense to display advertisements on this site. Google, as a third-party vendor, uses cookies (including the DoubleClick cookie) to serve ads based on your prior visits to this website and other sites on the internet. Google's use of advertising cookies enables it and its partners to serve ads to our users based on their visit to thjrtech.com and/or other sites on the Internet.", "body2Pre": "You may opt out of personalised advertising by visiting", "googleAdsLink": "Google Ads Settings", "body2Mid": ". Alternatively, you can opt out of a third-party vendor's use of cookies for personalised advertising by visiting", "aboutadsLink": "aboutads.info", "body2Post": "." };
const cookies = { "heading": "Cookies", "body": "We do not set any first-party tracking cookies. Third-party advertising partners (Google AdSense) may set cookies on your device subject to their own privacy policies. You can control cookie preferences through your browser settings or the opt-out links above." };
const userConsent = { "heading": "User Consent", "body": "We use a Consent Management Platform (CMP) to obtain and record user consent where required by local laws (for example GDPR or CCPA). The CMP presents choices about cookie usage and personalised advertising to visitors in applicable regions; we respect those choices and limit data processing accordingly. You can review or change your consent preferences via the site's privacy controls or your browser settings. Opting out may prevent personalised ads but does not affect the core functionality of the tools. For users in the European Economic Area (EEA) and the UK, we use a Google-certified Consent Management Platform to manage user preferences and comply with the IAB Transparency and Consent Framework." };
const dataWeCollect = { "heading": "Data We Collect", "body": "We do not collect, store, or share any personally identifiable information. Usage analytics (if enabled) are anonymised and aggregated. Files you process with our tools remain on your device and are not transmitted to us. Files uploaded for server-side processing (such as PDF merging) are processed in memory, are never viewed by humans, and are permanently deleted from our servers automatically within 30 minutes of processing. We do not maintain backups or logs of the contents of these files." };
const googleAnalytics = { "heading": "Google Analytics", "body": "We use Google Analytics (GA4) to collect anonymised usage data such as page views, events, and performance metrics to help improve the website and our tools. We do not collect personal identifiers through Analytics; where available we enable IP anonymisation to minimise identifiability. Analytics data is processed by Google under their policies and may be subject to international transfer. Our CMP respects users' consent choices, and you may opt out of analytics tracking via the CMP or by using browser-level controls (for example, the Google Analytics opt-out add-on)." };
const thirdPartyLinks = { "heading": "Third-Party Links", "body": "This site may contain links to external websites. We are not responsible for the privacy practices or content of those sites." };
const californiaRights = { "heading": "California Privacy Rights (CCPA/CPRA)", "body": "If you are a California resident, you have the right to opt-out of the 'sale' or 'sharing' of your personal information. We do not sell your personal data; however, our use of advertising cookies may be considered 'sharing' under California law. You may exercise your right to opt-out via the ad settings links provided above." };
const contact$2 = { "heading": "Contact", "body": "If you have any questions about this Privacy Policy, please reach out via the contact information provided on this site at privacy@thjrtech.com" };
const privacy = {
  title: title$2,
  lastUpdated: lastUpdated$1,
  overview,
  googleAdsense,
  cookies,
  userConsent,
  dataWeCollect,
  googleAnalytics,
  thirdPartyLinks,
  californiaRights,
  contact: contact$2
};
const title$1 = "Terms of Service";
const lastUpdated = "Last updated: April 2026";
const freeService = { "heading": "Free Service", "body": "All tools on THRJTech are provided free of charge. We reserve the right to modify, suspend, or discontinue any part of the service at any time without notice." };
const privacyCore = { "heading": "Privacy as a Core Value", "body": "Most of our tools operate entirely in your browser — no files are uploaded to our servers. For tools that require server-side processing (such as PDF compression or merging), files are processed on short-lived infrastructure and are permanently and automatically deleted within 30 minutes. We do not view, store, or share the contents of any uploaded files." };
const acceptableUse = { "heading": "Acceptable Use", "body": "You agree to use this site lawfully and not to upload or process content that infringes on copyrights, contains malware, or violates the rights of others." };
const noWarranty = { "heading": "No Warranty", "body": "The tools are provided 'as-is' without any warranties of accuracy, reliability, or fitness for a particular purpose." };
const limitedLiability = { "heading": "Limitation of Liability", "body": "THRJTech is not liable for any loss of data or damages arising from your use of these tools." };
const changes = { "heading": "Changes", "body": "We may update these terms at any time. Continued use of the site constitutes acceptance of any revisions." };
const contact$1 = { "heading": "Contact", "body": "Questions? Contact us using the form available on this website." };
const terms = {
  title: title$1,
  lastUpdated,
  freeService,
  privacyCore,
  acceptableUse,
  noWarranty,
  limitedLiability,
  changes,
  contact: contact$1
};
const title = "Blog";
const loading = "Loading articles…";
const error = "Error: {{error}}";
const articlesHeader = "Articles";
const first = "First";
const last = "Last";
const perPage = "Per page:";
const back = "← Back to Blog";
const createdAt = "Created at: {{date}}";
const loadingArticle = "Loading…";
const errorArticle = "Error: {{error}}";
const blogs = {
  title,
  loading,
  error,
  articlesHeader,
  first,
  last,
  perPage,
  back,
  createdAt,
  loadingArticle,
  errorArticle
};
const hero$d = { "title": "PDF Compressor", "tagline": "Just Drop and Go - Reduce your PDF file size without losing quality. Upload your file, compress it in seconds, and download the smaller result.", "blogLink": "Learn how to compress PDF →" };
const hint$9 = { "text": "Do you need to split the PDFs before compress?", "btn": "Try PDF Splitter" };
const tabs$c = { "details": "Details", "howItWorks": "How it works" };
const details$d = { "whatIsCompression": { "heading": "What is PDF compression", "body": "PDF compression is the process of reducing the storage footprint of a PDF file by optimizing and re-encoding its internal resources — principally images, embedded fonts, and stream objects — while aiming to preserve the document's visible appearance. Compression helps when you need faster transfers, lower storage costs, or to meet attachment limits without having to manually edit or recreate the document in external applications." }, "howWorks": { "heading": "How compression works", "body": "Under the hood, a compressor inspects the PDF's object tree, identifies large embedded binaries (for example, raster images and redundant font subsets), and rewrites those resources with more efficient encodings. There are two broad strategies: lossless optimizations (which repackage streams and remove unused objects without altering pixel data) and lossy image recompression (which reduces image fidelity in exchange for significant size savings). Good compressors select the least-destructive option based on the content type and configured quality targets." }, "tradeoffs": { "heading": "Design tradeoffs", "item1": "Quality vs. Size: Aggressive, lossy recompression reduces bytes but can visibly affect photographs and scanned documents. For archival or print-ready assets prefer conservative, lossless steps; for web delivery, more aggressive settings often make sense.", "item2": "Speed and Resource Use: Compression of large, image-heavy PDFs is CPU- and memory-intensive — server-side processing can provide more consistent performance for very large files than client-only approaches.", "item3": "Predictability: Different PDF producers embed resources differently; results vary depending on how the original was generated." }, "practical": { "heading": "Practical recommendations", "item1": "Prefer lossless steps when exact visual fidelity is required (legal, regulated, or archival content).", "item2": "For scanned or photographic PDFs, try a mild lossy recompression first and review the output visually before further reductions.", "item3": "Keep a copy of the original file until you confirm the compressed output meets your needs." }, "whatItDoes": { "heading": "What it does", "item1": "Compresses PDFs by optimizing embedded images and streams.", "item2": "Reduces file size while preserving text and structural metadata when possible.", "item3": "Produces a smaller, downloadable PDF suitable for sharing and storage." }, "usefulWhen": { "heading": "Useful when", "item1": "need to send PDF file but the file size is over email attachment limits.", "item2": "save disk space.", "item3": "prepare documents for email or web publishing." }, "comparison": { "heading": "Comparison", "item1": "Quick and easy — no local software required.", "item2": "Server-side processing may be more consistent for large or complex PDFs.", "item3": "Not a full editor — for advanced edits use desktop tools." }, "privacy": { "heading": "Privacy & retention", "body": "Uploaded files are processed on short-lived infrastructure and removed according to the app's retention policy. If you are handling highly sensitive documents, prefer local desktop tools or an on-prem solution that matches your compliance requirements." }, "whenToUse": { "heading": "When to use PDF compression", "body": "Use compression when you want to optimize documents for email, website publishing, or to save storage. Compression is particularly valuable for scanned documents, photo-heavy reports, or any content where embedded images dominate file size." }, "faq": { "heading": "FAQs", "q1": "Q: Is my file private?", "a1": "A: Files are processed temporarily and auto-deleted according to the app's policy.", "q2": "Q: Will compression change layout or searchable text?", "a2": "A: No — compression focuses on images and streams while preserving textual content and layout in most cases.", "q3": "Q: Can I control compression level?", "a3": "A: This interface applies automatic heuristics; advanced presets are available in pro or expert modes in other tools.", "q4": "Q: What if the result looks worse?", "a4": "A: Keep the original and retry with milder settings or use lossless-only options." } };
const howItWorks$d = { "step1": "Upload a PDF using drag & drop or the browse button.", "step2": "The file is sent to the serverless compressor which optimizes embedded images and streams.", "step3": "Compression progress is shown and the compressed file becomes available for download.", "step4": "Download the compressed PDF before it is removed from temporary storage." };
const badges$3 = { "instant": "⚡ Instant", "secure": "🔒 Secure", "autoDeleted": "🗑️ Auto-deleted" };
const dropZone$8 = { "icon": "📂", "text": "Drag & drop your PDF here", "or": "or", "browse": "Browse File", "removeTitle": "Remove file" };
const quality = { "label": "Quality", "hq": "High Quality — minimal visual loss, modest size reduction.", "balanced": "Balanced — good quality with significant size savings.", "max": "Maximum Compression — largest size reduction, some visual loss possible." };
const compressBtn = "Compress PDF";
const progress$3 = { "uploading": "Uploading to R2 storage…", "compressing": "Compressing PDF…" };
const result$3 = { "icon": "✅", "title": "Compression Complete!", "originalLabel": "Original", "sizeLabel": "Size", "compressedLabel": "Compressed", "download": "Download Compressed PDF", "another": "Compress Another File" };
const note$2 = "Note: The compressed file will be stored in Cloudflare R2 storage for 30 min. Please download it within this period. After 30 min, the file will be automatically deleted.";
const guide$c = { "title": "How to Reduce PDF File Size Without Losing Quality (Fast & Simple Guide)", "intro": `You've probably run into this problem: "File size exceeds limit", email won't send your PDF, or an upload fails. Large PDFs are frustrating — but you don't need to recreate your file. This short guide explains why PDFs get large, how compression works, and how to reduce file size without ruining quality.`, "whyLarge": { "heading": "Why Are PDF Files So Large?", "body": "A PDF can contain much more than just text. Common reasons for large files:", "item1": "High-Resolution Images — images often use full resolution and are not optimized.", "item2": "Embedded Fonts — PDFs may include multiple full font sets.", "item3": "Scanned Documents — scanned PDFs are images saved as pages and can be very large.", "item4": "Uncompressed Elements — files created without optimization contain extra data." }, "whatDoes": { "heading": "What Does PDF Compression Do?", "body": "Compression reduces file size by lowering image resolution, removing unnecessary data, and optimizing internal structure — aiming for a smaller file while keeping acceptable visual quality." }, "whenToCompress": { "heading": "When Should You Compress a PDF?", "item1": "Sending via email — avoid 20–25MB attachment limits.", "item2": "Uploading to websites — job portals, forms, and submissions often limit file size.", "item3": "Saving storage — smaller files save disk space and speed backups.", "item4": "Improving performance — smaller PDFs open and load faster on all devices." }, "bestPractices": { "heading": "Best Practices for PDF Compression", "item1": "Choose the right compression level — low compression keeps quality, high compression reduces size more.", "item2": "Optimize images first — resize/compress images before creating the PDF when possible.", "item3": "Avoid repeated compression — always keep an original copy; repeated recompression degrades quality.", "item4": "Know your purpose — printing needs higher quality; sharing can be smaller.", "item5": "Use a reliable tool — balance size and quality; try this compressor for fast results." }, "mistakes": { "heading": "Common Mistakes to Avoid", "item1": "Over-compressing important documents", "item2": "Compressing already optimized PDFs", "item3": "Ignoring readability after compression", "item4": "Using low-quality scans as input", "item5": "Not checking the final output" }, "stepByStep": { "heading": "Step-by-Step: How to Compress a PDF", "step1": "Upload your PDF file", "step2": "Choose compression level", "step3": "Start compression", "step4": "Preview the result", "step5": "Download the optimized file" }, "useCases": { "heading": "Real-World Use Cases", "item1": "Job applications — upload resumes within limits", "item2": "Business documents — share reports efficiently", "item3": "Student assignments — submit without upload errors", "item4": "Mobile sharing — avoid long download times" }, "comparison": { "heading": "PDF Compression vs File Splitting", "col1": "Feature", "col2": "Compression", "col3": "Splitting", "row1col1": "Goal", "row1col2": "Reduce size", "row1col3": "Break into parts", "row2col1": "Keeps file intact", "row2col2": "✅ Yes", "row2col3": "❌ No", "row3col1": "Best for", "row3col2": "Email, uploads", "row3col3": "Large document sharing" }, "tips": { "heading": "Tips for Better Results", "item1": "Use clear, high-quality originals", "item2": "Avoid unnecessary images", "item3": "Keep formatting simple", "item4": "Test different compression levels" }, "faq": { "heading": "FAQ", "q1": "Does PDF compression reduce quality?", "a1": "Yes — but good tools minimize noticeable loss.", "q2": "How much can I reduce file size?", "a2": "It depends on content: image-heavy PDFs see large reductions; text-only PDFs see smaller changes.", "q3": "Can I reverse compression?", "a3": "No — compression is usually permanent. Keep originals." }, "conclusionTitle": "Conclusion", "conclusion": "Large PDFs don't have to slow you down. Use proper compression techniques to share files, meet upload limits, and improve performance without sacrificing usability.", "ctaBtn": "👉 Compress your PDF here: PDF Compressor Tool" };
const pdfCompressor$1 = {
  hero: hero$d,
  hint: hint$9,
  tabs: tabs$c,
  details: details$d,
  howItWorks: howItWorks$d,
  badges: badges$3,
  dropZone: dropZone$8,
  quality,
  compressBtn,
  progress: progress$3,
  result: result$3,
  note: note$2,
  guide: guide$c
};
const hero$c = { "title": "PDF Merger", "tagline": "Drop and Merge - Combine multiple PDF files into a single document in seconds. Upload your files, drag to reorder them, then merge and download the result.", "blogLink": "Learn how to merge PDF →" };
const hint$8 = { "text": "Do you need to split them before re-merge?", "btn": "Try PDF Splitter" };
const tabs$b = { "details": "Details", "howItWorks": "How it works" };
const details$c = { "howMergeWorks": { "heading": "How PDF merge works", "body": "A PDF merge operation takes the page streams from each source document in the order you specify and writes them sequentially into a new PDF container. The resulting file shares no data with the originals — each page is fully reproduced, preserving text, images, annotations, and vector graphics." }, "howSizeDetermined": { "heading": "How merged size is determined", "body": "The merged PDF's size is roughly the sum of the input files' sizes, plus a small amount of overhead for the new cross-reference table and trailer. Duplicate embedded resources (fonts, images) are not automatically de-duplicated unless the tool explicitly does so." }, "whyUseOnline": { "heading": "Why use an online merger", "body": "Browser-based merging eliminates the need to install software. Files are transferred to a short-lived server process, merged, and returned; the originals remain on your device." }, "bestPractices": { "heading": "Best practices", "item1": "Merge in order — arrange your files beforehand to avoid re-merging.", "item2": "Compress after merging — use the checkbox to reduce the size of the final file.", "item3": "Check file count — most online tools handle up to a reasonable number of files." }, "whatItDoes": { "heading": "What it does", "item1": "Combines multiple PDFs into a single ordered document." }, "usefulWhen": { "heading": "Useful when", "item1": "Combining chapters or sections written separately.", "item2": "Merging scanned pages saved as individual files.", "item3": "Combining a cover page, main document, and appendix." }, "comparison": { "heading": "Comparison", "item1": "Unlike desktop tools, this runs in your browser without installation." }, "privacy": { "heading": "Privacy & retention", "body": "Uploaded files are processed on short-lived infrastructure and removed according to the app's retention policy. If you are handling highly sensitive documents, prefer local desktop tools or an on-prem solution that matches your compliance requirements." }, "faq": { "heading": "FAQs", "q1": "Q: Is my file private?", "a1": "A: Files are processed temporarily and auto-deleted according to the app's policy.", "q2": "Q: Will merging change the formatting of individual PDFs?", "a2": "A: No — pages are reproduced as-is; formatting is preserved.", "q3": "Q: Can I control the order of pages?", "a3": "A: Yes — drag files to reorder them before merging.", "q4": "Q: Can I merge more than two PDFs?", "a4": "A: Yes — there is no fixed limit, though very large batches may be slower.", "q5": "Q: What if the result is larger than expected?", "a5": "A: Enable compression after merging to reduce the final file size." } };
const howItWorks$c = { "step1": "Upload the PDF files you want to merge.", "step2": "Drag to reorder files to set the merge order.", "step3": "Click Merge to send files to the backend merging process.", "step4": "Download the merged PDF when processing completes." };
const badges$2 = { "fast": "⚡ Fast", "secure": "🔒 Secure", "autoDeleted": "🗑️ Auto-deleted" };
const dropZone$7 = { "icon": "📚", "text": "Drag and drop your PDF files here", "or": "or", "browse": "Browse Files" };
const fileList = { "title": "PDF files ({{count}})", "reorderHint": "Drag files to reorder merge order.", "addMore": "Add More Files", "moveUp": "Move up", "moveDown": "Move down", "remove": "Remove file" };
const compress = "Compress merged PDF";
const mergeBtn = "Merge PDFs";
const progress$2 = { "merging": "Merging PDFs...", "uploading": "Uploading merged PDF...", "compressing": "Compressing merged PDF..." };
const result$2 = { "icon": "✅", "title": "Merge Complete!", "inputLabel": "Input", "totalSizeLabel": "Total Size", "filesCount": "{{count}} PDF files", "mergedLabel": "Merged", "sizeLabel": "Size", "download": "Download Merged PDF", "another": "Merge Another Set" };
const note$1 = "Note: The compressed file will be stored in Cloudflare R2 storage for 30 min. Please download it within this period. After 30 min, the file will be automatically deleted.";
const lowerHint = { "text": "Trouble merging because the files are too large?", "btn": "Try PDF Compressor" };
const guide$b = { "title": "Combine Multiple PDFs Into One (Clean, Organized & Stress-Free Guide)", "intro": "Working with multiple PDF files can get messy fast. Instead of sending or managing them one by one, you can merge everything into a single, clean document.", "cta": "👉 This guide shows you how to merge PDFs efficiently, organize them properly, and avoid common mistakes.", "whatIs": { "heading": "📌 What Is a PDF Merger?", "body": "A PDF merger is a tool that lets you:", "item1": "📄 Combine multiple PDF files", "item2": "🔀 Rearrange page order", "item3": "➕ Add or remove pages", "item4": "📥 Export as a single document" }, "whyMatters": { "heading": "🎯 Why Merging PDFs Matters", "item1": "Better Organization — turn several files into one structured document.", "item2": "Easier Sharing — one file is faster, cleaner, and less confusing.", "item3": "Professional Presentation — a single merged PDF looks polished.", "item4": "Improved Workflow — reduces clutter and repetitive tasks." }, "useCases": { "heading": "🛠 Common Use Cases", "item1": "💼 Business Documents — combine reports, invoices, contracts", "item2": "🎓 Student Assignments — merge multiple sections into one submission", "item3": "🧾 Scanned Files — combine scanned pages into a single file", "item4": "📑 Application Submissions — resume + cover letter + certificates" }, "howWorks": { "heading": "🧠 How PDF Merging Works (Simple Explanation)", "body": "Files are loaded, pages are extracted and arranged, and a new PDF is generated. The original files remain unchanged." }, "stepByStep": { "heading": "🧭 Step-by-Step: Merge PDFs Easily", "step1": "📤 Upload your PDF files", "step2": "👀 Preview all pages", "step3": "🔀 Drag to reorder", "step4": "➕ Add or remove files", "step5": "📥 Download merged PDF" }, "tips": { "heading": "🎨 Tips to Make Your Merged PDF Look Clean", "item1": "✅ Keep logical order (Cover → Content → Appendix)", "item2": "✅ Use clear file naming (rename files in correct order)", "item3": "✅ Remove unnecessary pages (blank pages, duplicates)", "item4": "✅ Check final output (page order, orientation, formatting)" }, "mistakes": { "heading": "⚠️ Common Mistakes to Avoid", "item1": "❌ Wrong page order", "item2": "❌ Mixing portrait & landscape awkwardly", "item3": "❌ Forgetting to remove duplicates", "item4": "❌ Merging low-quality scans", "item5": "❌ Not reviewing final file" }, "comparison": { "heading": "🔍 PDF Merger vs PDF Splitter", "col1": "Feature", "col2": "PDF Merger", "col3": "PDF Splitter", "row1col1": "Purpose", "row1col2": "Combine files", "row1col3": "Break files apart", "row2col1": "Output", "row2col2": "Single document", "row2col3": "Multiple documents", "row3col1": "Use case", "row3col2": "Organization", "row3col3": "Extraction" }, "proTips": { "heading": "🚀 Pro Tips for Faster Workflow", "item1": "🗂 Prepare files in advance", "item2": "🔢 Name files in order (01, 02, 03…)", "item3": "⚡ Merge once instead of repeatedly", "item4": "🔒 Use tools that respect privacy" }, "safety": { "heading": "🔐 Is It Safe to Merge PDFs Online?", "body": "Most tools process files temporarily and delete them after completion. Still, avoid uploading sensitive documents unless you trust the tool." }, "faq": { "heading": "❓ FAQ", "q1": "Can I change page order after merging?", "a1": "Yes — most tools allow reordering before final export.", "q2": "Will merging affect quality?", "a2": "No — good tools preserve layout and formatting.", "q3": "Can I merge images into PDFs?", "a3": "Yes — many tools support combining images and PDFs.", "q4": "Is there a limit on number of files?", "a4": "Depends on the tool, but many support multiple files easily." }, "conclusion": { "heading": "🧾 Conclusion", "body": "Merging PDFs helps you stay organized and present information professionally. With the right approach you can turn scattered files into a clean document in seconds." }, "ctaBtn": "👉 Try it here: PDF Merger Tool" };
const pdfMerger$1 = {
  hero: hero$c,
  hint: hint$8,
  tabs: tabs$b,
  details: details$c,
  howItWorks: howItWorks$c,
  badges: badges$2,
  dropZone: dropZone$7,
  fileList,
  compress,
  mergeBtn,
  progress: progress$2,
  result: result$2,
  note: note$1,
  lowerHint,
  guide: guide$b
};
const hero$b = { "title": "PDF Converter", "tagline": "Quickly convert PDF pages into high-quality JPG or PNG images. Choose the output format, preview the converted result, and download images for sharing, thumbnails, or embedding — no account required.", "blogLink": "Learn how to convert PDF →" };
const hint$7 = { "text": "Do you want to convert image type instead?", "btn": "Try Image Converter" };
const tabs$a = { "details": "Details", "howItWorks": "How it works" };
const details$b = { "whatIs": { "heading": "What is PDF conversion", "body": "PDF-to-image conversion renders each page of the document as a raster image at a defined resolution. The output is a set of image files (one per page) that capture the visual appearance of the PDF — including text rendered as pixels, embedded images, and vector graphics rasterized at the specified DPI." }, "whenToConvert": { "heading": "When to convert", "body": "Converting PDF pages to images is appropriate when you need to embed document content in a context that doesn't support PDF rendering (for example, web pages that display static thumbnails, presentation slides, or messaging platforms that only accept images)." }, "howBehaves": { "heading": "How conversion behaves", "body": "A PDF-to-image converter renders each page at a fixed resolution and saves the result in the chosen format. The quality and file size of the output depend on the resolution (DPI) and the selected image format." }, "quality": { "heading": "Quality and performance", "resolution": "Resolution: Higher DPI produces sharper images but larger files.", "format": "Format: JPEG uses lossy compression (smaller files, visible artifacts at low quality); PNG uses lossless compression (larger files, no artifacts, supports transparency).", "processing": "Processing time: Each page requires independent rendering; multi-page PDFs take proportionally longer." }, "benefits": { "heading": "Benefits of conversion", "item1": "Makes PDF content usable in image-only contexts.", "item2": "Allows individual pages to be shared, cropped, or annotated as images.", "item3": "Produces a visual representation that matches the exact PDF rendering." }, "privacy": { "heading": "Privacy & retention", "body": "Files are processed on short-lived server infrastructure. Converted images are made available for download and then deleted automatically after a short retention window. Do not upload documents containing personal or sensitive information if you cannot accept the associated privacy risk." }, "practical": { "heading": "Practical tips", "item1": "For thumbnails or web previews, lower DPI (72–96) is usually sufficient.", "item2": "For high-quality archival images, use higher DPI (150–300) and PNG.", "item3": "For large PDFs, convert only the pages you actually need." }, "usefulWhen": { "heading": "Useful when", "item1": "You need to share individual pages as images.", "item2": "You want to embed PDF pages in presentations or web content.", "item3": "You need to extract visual content from a PDF." }, "faq": { "heading": "FAQ", "q1": "Q: Does the conversion preserve all visual content?", "a1": "A: Yes — the converter renders the page at the specified DPI, capturing text, images, and graphics as they appear in the PDF.", "q2": "Q: Can I convert a multi-page PDF?", "a2": "A: Yes — each page is converted to a separate image file.", "q3": "Q: Which format is better, JPG or PNG?", "a3": "A: JPG for smaller files with minor quality loss; PNG for lossless quality with transparency support.", "q4": "Q: Why is my output image blurry?", "a4": "A: The DPI setting may be too low. Try a higher resolution setting.", "q5": "Q: Can I convert password-protected PDFs?", "a5": "A: Not directly — the PDF must be unlocked before conversion." } };
const howItWorks$b = { "step1": "Drag & drop your PDF or click Browse File to choose one. The file name and size are shown in the drop zone.", "step2": "Select the output format (JPG or PNG) using the Convert to selector.", "step3": "Tap Convert. A progress bar shows upload and conversion status.", "step4": "When ready, the converted image appears with a Download button." };
const badges$1 = { "instant": "⚡ Instant", "secure": "🔒 Secure", "autoDeleted": "🗑️ Auto-deleted" };
const dropZone$6 = { "icon": "📂", "text": "Drag & drop your PDF here", "or": "or", "browse": "Browse File", "removeTitle": "Remove file" };
const convertTo = "Convert to";
const convertBtn = "Convert to {{type}}";
const progress$1 = { "uploading": "Uploading…", "converting": "Converting PDF…" };
const result$1 = { "icon": "✅", "title": "Conversion Complete!", "originalLabel": "Original", "sizeLabel": "Size", "download": "Download Converted File", "another": "Convert Another File" };
const note = "Note: The converted file will be stored temporarily for a short time. Please download it within the available window.";
const guide$a = { "title": "How to Convert PDF Files Without Breaking Layout (Smart & Simple Guide)", "intro": "PDFs are great for sharing — but not always for editing. You've probably experienced this: you need to edit a PDF but it's locked, want to extract text but can't, or need a Word or Excel version but formatting breaks.", "cta": "👉 In this guide, you'll learn how to convert PDFs safely, preserve formatting, and choose the right format for your needs.", "whatIs": { "heading": "📄 What Is a PDF Converter?", "body": "A PDF converter is a tool that allows you to:", "item1": "🔁 Convert PDF → Word, Excel, PowerPoint", "item2": "🖼 Convert PDF → images (JPG, PNG)", "item3": "📥 Convert files → PDF (Word, images, etc.)", "note": "Modern tools support both directions and multiple formats, making them highly flexible. Think of it as a bridge between formats." }, "whyConvert": { "heading": "🤔 Why Convert PDFs?", "item1": "✏️ Edit Content Easily — convert to Word or Excel to modify text, update data, and reuse content.", "item2": "📊 Extract Data — convert PDF → Excel to save time and avoid manual typing.", "item3": "🖼 Use Content in Other Formats — convert to image to share visuals or embed in presentations.", "item4": "📤 Improve Compatibility — some systems require specific file types; conversion solves this instantly." }, "howWorks": { "heading": "⚙️ How PDF Conversion Works", "body": "When you convert a PDF, the system reads the file structure, identifies text, images, and layout, then rebuilds content in the new format. Good tools try to preserve layout and keep fonts and spacing intact." }, "whyBreaks": { "heading": "🧠 Why Formatting Sometimes Breaks", "body": 'PDFs are built for display, not structure. Text may not be stored logically and layout may be "visual only" — so converters sometimes have to guess structure. This is why results vary.' }, "bestPractices": { "heading": "✅ Best Practices for Accurate Conversion", "item1": "🔹 Use clean source files — clear text, standard fonts, simple layout.", "item2": "🔹 Choose the right output format — Word for editing, Excel for tables, JPG for sharing visuals.", "item3": "🔹 Check after conversion — always review alignment, fonts, and tables.", "item4": "🔹 Avoid re-converting files — each step can introduce errors; always convert from the original PDF.", "item5": "🔹 Use a reliable tool — a good converter should preserve formatting and support multiple formats." }, "stepByStep": { "heading": "🚀 Step-by-Step: Convert a PDF", "step1": "📤 Upload your PDF", "step2": "🎯 Select output format (JPG, PNG, etc.)", "step3": "⚙️ Start conversion", "step4": "📥 Download the new file", "note": "Most tools complete this in seconds." }, "scenarios": { "heading": "🧩 Common Conversion Scenarios", "item1": "📄 PDF → Word — edit documents, update text", "item2": "📊 PDF → Excel — extract tables, work with data", "item3": "🖼 PDF → Image — share pages visually, use in presentations", "item4": "📥 Word/Image → PDF — create shareable documents, preserve formatting" }, "mistakes": { "heading": "⚠️ Common Mistakes to Avoid", "item1": "❌ Converting scanned PDFs without OCR", "item2": "❌ Expecting perfect formatting every time", "item3": "❌ Using low-quality source files", "item4": "❌ Not reviewing final output", "item5": "❌ Converting multiple times unnecessarily" }, "comparison": { "heading": "🔍 PDF Converter vs PDF Editor", "col1": "Feature", "col2": "Converter", "col3": "Editor", "row1col1": "Purpose", "row1col2": "Change format", "row1col3": "Modify content", "row2col1": "Ease of use", "row2col2": "Easy", "row2col3": "Moderate", "row3col1": "Best for", "row3col2": "Flexibility", "row3col3": "Detailed editing" }, "proTips": { "heading": "💡 Pro Tips", "item1": "📌 Convert a small test file first", "item2": "📌 Use consistent fonts in original", "item3": "📌 Avoid complex layouts when possible", "item4": "📌 Keep a backup of the original file" }, "faq": { "heading": "❓ FAQ", "q1": "Does PDF conversion always keep formatting?", "a1": "Not always — but good tools preserve most layout and structure.", "q2": "Can I convert scanned PDFs?", "a2": "Yes, but you may need OCR (text recognition) for accurate results.", "q3": "What's the best format to convert to?", "a3": "Editing → Word, data → Excel, sharing → PDF/Image.", "q4": "Is online conversion safe?", "a4": "Most tools process files securely and temporarily." }, "conclusionTitle": "Conclusion", "conclusion": "PDF conversion isn't just about changing formats — it's about unlocking your content. With the right approach, you can edit documents easily, extract useful data, and share content in any format.", "ctaBtn": "👉 Try it here: PDF Converter Tool" };
const pdfConverter$1 = {
  hero: hero$b,
  hint: hint$7,
  tabs: tabs$a,
  details: details$b,
  howItWorks: howItWorks$b,
  badges: badges$1,
  dropZone: dropZone$6,
  convertTo,
  convertBtn,
  progress: progress$1,
  result: result$1,
  note,
  guide: guide$a
};
const hero$a = { "title": "PDF Splitter", "tagline": "Just Drop and Go — Extract the pages you need from any PDF by entering simple page ranges (e.g. 1, 3-5, 7-10). Get each range as its own file, or merge them all into one combined PDF. No software needed — upload, split, and download in seconds.", "blogLink": "Learn how to split PDF →" };
const hint$6 = { "text": "Do you need to merge PDFs?", "btn": "Try PDF Merger" };
const tabs$9 = { "details": "Details", "howItWorks": "How it works" };
const details$a = { "whatIs": { "heading": "What is PDF splitting", "body": "PDF splitting is the operation of extracting a subset of pages from a source PDF and writing them into one or more output documents. The operation is non-destructive — the source file is not modified — and produces output PDFs that share the same media boxes, fonts, and embedded resources as the original pages." }, "outputOptions": { "heading": "Output options", "intro": "Two output modes are supported, letting you choose the right result for your workflow:", "multiple": "Multiple files: each page range produces an independent PDF.", "single": "Single combined file: all selected ranges are assembled into one PDF in the order they appear." }, "pageRangeFormat": { "heading": "Page range format", "intro": "Ranges are entered as a comma-separated list. The supported syntax is:", "single": "Single page: 3", "contiguous": "Contiguous range: 3-7", "mixed": "Mixed list: 1,3-5,8,10-12", "note": "Ranges are inclusive and 1-indexed. The tool validates input and reports errors for out-of-range or malformed values." }, "tradeoffs": { "heading": "Design tradeoffs", "fidelity": "Fidelity: Page content is reproduced exactly; no recompression or re-encoding of resources.", "performance": "Performance: Processing time scales with file size and number of selected pages.", "order": "Order: Pages appear in the output in the order defined by the range expression." }, "practical": { "heading": "Practical recommendations", "item1": "For recurring extractions from a standard document, note the page numbers in advance.", "item2": "If you only need a few pages from a large file, splitting first reduces downstream processing time.", "item3": "Combine splitting and merging when you need to reorder or selectively combine pages from multiple documents." }, "whatItDoes": { "heading": "What it does", "item1": "Extracts one or more page ranges from a PDF.", "item2": "Produces one output file per range, or a single combined file.", "item3": "Preserves original page content and embedded resources.", "item4": "Runs server-side for reliable handling of large files." }, "usefulWhen": { "heading": "Useful when", "item1": "You need to share only specific chapters or sections of a document.", "item2": "You want to split a scanned multi-page document into individual files.", "item3": "You need to extract appendices or exhibits from a report.", "item4": "You need to reduce file size by removing unneeded pages before sharing or archiving." }, "comparison": { "heading": "Comparison with alternatives", "browser": "Browser-based: convenient, no installation; suitable for occasional use.", "desktop": "Desktop tools: better suited for batch workflows or documents requiring special handling.", "commandLine": "Command-line tools: fastest for automation and scripted workflows." }, "privacy": { "heading": "Privacy & retention", "body": "Uploaded files are processed on short-lived infrastructure and removed according to the app's retention policy. If you are handling highly sensitive documents, prefer local desktop tools or an on-prem solution that matches your compliance requirements." }, "faq": { "heading": "FAQs", "q1": "Q: Is my file private?", "a1": "A: Files are processed temporarily and auto-deleted according to the app's policy.", "q2": "Q: Can I extract non-contiguous pages?", "a2": "A: Yes — use a comma-separated list such as 1,3,7.", "q3": "Q: What happens to the original PDF?", "a3": "A: The original is not modified; only the selected pages are written to new output files.", "q4": "Q: Can I combine the split ranges into one file?", "a4": "A: Yes — select the 'Single' output option to receive all ranges merged into one file.", "q5": "Q: What if my range is out of bounds?", "a5": "A: The tool validates your input and shows an error before attempting to process." } };
const howItWorks$a = { "step1": "Upload a PDF using drag & drop or the browse button.", "step2": "Enter the page ranges you want (e.g. 1,3-5,7-10) and choose Single or Multiple output.", "step3": "Click Split PDF — the file is uploaded to R2 storage and the splitter processes your ranges.", "step4": "Download each segment (or the combined file) before it expires from temporary storage." };
const badges = { "instant": "⚡ Instant", "secure": "🔒 Secure", "autoDeleted": "🗑️ Auto-deleted" };
const dropZone$5 = { "icon": "📂", "text": "Drag & drop your PDF here", "or": "or", "browse": "Browse File", "removeTitle": "Remove file" };
const pageRangesLabel = "Page Ranges:";
const pageRangesPlaceholder = "e.g. 1,3-5,7-10";
const outputLabel = "Output to file(s):";
const outputSingle = "Single";
const outputMultiple = "Multiple";
const splitBtn = "Split PDF";
const progress = { "splitting": "Splitting PDF…" };
const result = { "icon": "✅", "title": "Split Complete", "segmentLabel": "Segment", "downloadLabel": "Download", "downloadBtn": "Download", "another": "Split Another File" };
const guide$9 = { "title": "How to Split PDF Files Efficiently (Take Control of Large Documents)", "intro": "Big PDF files can be overwhelming — dozens of pages, mixed content you don't need, sections that should really be separate. Instead of working with the entire file, you can split it into smaller, focused documents.", "cta": "👉 In this guide, you'll learn how to break PDFs into exactly what you need — quickly and cleanly.", "whatIs": { "heading": "📄 What Is a PDF Splitter?", "body": "A PDF splitter is a tool that lets you:", "item1": "✂️ Extract specific pages", "item2": "📑 Separate a large file into multiple PDFs", "item3": "🎯 Keep only the content you need" }, "whyUseful": { "heading": "🧠 Why Splitting PDFs Is Useful", "item1": "🎯 Focus on Relevant Content — keep only the pages you need instead of scrolling through everything.", "item2": "📤 Share Specific Sections — no need to send a 50-page document when only 3 pages matter.", "item3": "⚡ Improve Workflow Efficiency — smaller files are faster to open, easier to manage, and quicker to upload.", "item4": "📂 Better Organization — turn one large file into multiple categorized documents." }, "useCases": { "heading": "🛠 Common Use Cases", "item1": "💼 Business Documents — extract contracts, invoices, reports", "item2": "🎓 Academic Work — separate chapters or submit only required pages", "item3": "📑 Legal or Official Files — isolate important pages, keep records organized", "item4": "🧾 Scanned Documents — split scanned pages into individual files" }, "ways": { "heading": "🔍 Ways to Split a PDF", "item1": "📌 By Page Range — e.g. Pages 1–5 → File A, Pages 6–10 → File B", "item2": "📌 Extract Specific Pages — pick exact pages (Page 2, 5, 9 → new file)", "item3": "📌 Split Every Page — turn one PDF into multiple single-page files" }, "stepByStep": { "heading": "🪜 Step-by-Step: How to Split a PDF", "step1": "📤 Upload your PDF", "step2": "👀 Preview pages", "step3": "✂️ Select pages or ranges", "step4": "⚙️ Choose split method", "step5": "📥 Download results" }, "bestPractices": { "heading": "🎯 Best Practices for Splitting PDFs", "item1": "✅ Plan before splitting — know what pages you need and how you want them grouped.", "item2": '✅ Keep file names clear — name files logically (e.g., "Chapter1.pdf").', "item3": "✅ Avoid over-splitting — too many small files can become hard to manage.", "item4": "✅ Check output files — verify correct pages and proper order.", "item5": "✅ Keep the original file — in case you need additional pages later." }, "mistakes": { "heading": "⚠️ Common Mistakes to Avoid", "item1": "❌ Selecting wrong page range", "item2": "❌ Losing important pages", "item3": "❌ Creating too many tiny files", "item4": "❌ Not reviewing final output", "item5": "❌ Overwriting original file" }, "comparison": { "heading": "⚖️ PDF Splitter vs PDF Merger", "col1": "Feature", "col2": "PDF Splitter", "col3": "PDF Merger", "row1col1": "Purpose", "row1col2": "Break file apart", "row1col3": "Combine files", "row2col1": "Output", "row2col2": "Multiple PDFs", "row2col3": "Single PDF", "row3col1": "Use case", "row3col2": "Extraction", "row3col3": "Organization", "note": "Opposite tools — often used together." }, "proTips": { "heading": "🚀 Pro Tips for Better Workflow", "item1": "🔢 Use page numbers as reference", "item2": "🗂 Organize files immediately after splitting", "item3": "⚡ Split once instead of repeatedly", "item4": "📌 Combine with merging for full control" }, "safety": { "heading": "🔐 Is It Safe to Split PDFs Online?", "body": "Most modern tools process files temporarily and remove them after download. Still, avoid uploading sensitive documents unless you trust the tool." }, "faq": { "heading": "❓ FAQ", "q1": "Can I split a PDF without losing quality?", "a1": "Yes — splitting does not affect content quality.", "q2": "Can I extract just one page?", "a2": "Absolutely — you can extract any page individually.", "q3": "Is there a limit to file size?", "a3": "Depends on the tool, but most support reasonably large files.", "q4": "Can I undo splitting?", "a4": "No — but you can merge files back together if needed." }, "conclusionTitle": "Conclusion", "conclusion": "Splitting PDFs gives you control over your documents. Instead of dealing with large, cluttered files, you can extract only what matters, organize content efficiently, and work faster and smarter.", "ctaBtn": "👉 Start splitting your PDF here" };
const pdfSplitter$1 = {
  hero: hero$a,
  hint: hint$6,
  tabs: tabs$9,
  details: details$a,
  howItWorks: howItWorks$a,
  badges,
  dropZone: dropZone$5,
  pageRangesLabel,
  pageRangesPlaceholder,
  outputLabel,
  outputSingle,
  outputMultiple,
  splitBtn,
  progress,
  result,
  guide: guide$9
};
const hero$9 = { "title": "JSON Formatter", "icon": "{}", "tagline": "Paste your JSON below, click Format, and get clean, readable output instantly — no sign-up required. Invalid JSON is caught and reported with the line number so you can fix errors quickly.", "blogLink": "Learn how to format JSON →" };
const tabs$8 = { "details": "Details", "howItWorks": "How it works" };
const details$9 = { "whatIs": { "heading": "What is JSON", "body": "JSON (JavaScript Object Notation) is a lightweight text format used to represent structured data. It is both human-readable and machine-parseable, and is the dominant format for data exchange in REST APIs, configuration files, and inter-process communication." }, "whenToUse": { "heading": "When to use JSON", "body": "Use JSON when you need a simple, interoperable way to serialize structured data for transmission or storage — particularly in web contexts where JavaScript is involved on one or both ends." }, "howFormatterWorks": { "heading": "How the JSON formatter works", "body": "The formatter parses the raw input as JSON (using the browser's built-in JSON.parse), then serializes it back with JSON.stringify using a configurable indent level. If parsing fails, the error is caught and the approximate line number of the problem is reported." }, "prettyFormat": { "heading": "JSON in pretty format", "body": "Pretty-printed JSON inserts line breaks between key–value pairs and arrays, and indents nested objects and arrays. This makes the structure immediately visible without changing the data." }, "usefulWhen": { "heading": "Useful when", "item1": "Debugging API responses that are returned as minified JSON.", "item2": "Reviewing configuration objects or data payloads before deployment.", "item3": "Spotting structural errors in JSON before they reach production code." }, "faq": { "heading": "FAQs", "q1": "Q: Does formatting change the data?", "a1": "A: No — formatting only changes whitespace; all values and structure remain identical.", "q2": "Q: Can the formatter fix broken JSON?", "a2": "A: No — it reports the approximate line of the error but cannot repair malformed input.", "q3": "Q: What indentation is used?", "a3": "A: Two spaces, which is the most widely used convention for JSON.", "q4": "Q: Is the JSON processed on my device?", "a4": "A: Yes — all parsing and formatting runs in the browser; no data is sent to a server.", "q5": "Q: Why does the formatter report an error on a different line than I expect?", "a5": "A: JSON parsers often continue past an error before failing; the reported line is the best approximation the parser can provide." } };
const howItWorks$9 = { "step1": "Paste or type raw JSON into the input panel.", "step2": "Click Validate & Format (or press Ctrl+Enter) to run the parser.", "step3": "Review formatted output and copy or download as needed.", "step4": "Fix any parse errors indicated by the error panel and reformat." };
const howToUse$1 = { "heading": "How to use", "step1": "1: Paste or type your JSON into the input field below.", "step2": "2: Click Format JSON (or press Ctrl+Enter).", "step3": "3: Review the formatted output and click Copy to copy it." };
const input$1 = { "label": "Input JSON", "clearBtn": "Clear", "clearTitle": "Clear all", "placeholder": 'Paste your JSON here…\n\nExample:\n{\n  "name": "John",\n  "age": 30\n}', "errorLine": "Problem detected near line {{line}}.", "ariaLabel": "JSON input" };
const formatBtn = "Validate and Format JSON";
const output$1 = { "label": "Formatted Output", "copyBtn": "Copy", "copiedBtn": "✓ Copied!", "copyTitle": "Copy to clipboard", "placeholder": "Formatted JSON will appear here…", "ariaLabel": "Formatted JSON output" };
const errors = { "invalid": "Invalid JSON: {{message}}", "empty": "Please enter some JSON to format." };
const guide$8 = { "title": "How to Read and Fix JSON Faster (A Practical Guide for Developers)", "intro": "If you've ever worked with APIs, logs, or config files, you've seen messy minified JSON. Technically correct… but painful to read. That's where a JSON formatter becomes essential.", "cta": "👉 In this guide, you'll learn how to turn messy JSON into readable structure, debug errors faster, and work more efficiently with API data.", "whatIs": { "heading": "📦 What Is JSON (Quick Refresher)", "body": "JSON (JavaScript Object Notation) is a lightweight data format used to exchange structured data between systems. It's used in APIs, backend services, config files, and databases. Machines love JSON — humans, not so much (when it's messy)." }, "whatDoes": { "heading": "🔍 What Does a JSON Formatter Do?", "body": "A JSON formatter takes raw or minified JSON and adds indentation, organizes nested structures, and makes data readable. It doesn't change the data — only how it looks.", "beforeLabel": "Before:", "afterLabel": "After:" }, "whySlows": { "heading": "😵 Why Raw JSON Slows You Down", "item1": "🔍 Hard to scan — nested objects become dense, confusing, and easy to misread.", "item2": "🐞 Debugging becomes painful — one missing comma or bracket breaks everything and is hard to locate.", "item3": "⏱ Wasted time — you spend more time reading structure instead of solving problems." }, "whenToUse": { "heading": "⚡ When You Should Use a JSON Formatter", "item1": "🔌 API Responses — most APIs return minified JSON; formatting reveals structure immediately.", "item2": "🐞 Debugging Errors — formatter + validator shows exactly where JSON breaks.", "item3": "⚙️ Config Files — cleaner structure means fewer mistakes in .json settings.", "item4": "📄 Log Analysis — formatting nested JSON blobs in logs helps spot issues quickly." }, "commonErrors": { "heading": "🧪 Common JSON Errors", "item1": "❌ Trailing Comma", "item2": "❌ Missing Quotes on Keys", "item3": "❌ Single Quotes", "item4": "❌ Unclosed Brackets" }, "stepByStep": { "heading": "🪜 Step-by-Step: Format JSON Easily", "step1": "📋 Paste your JSON", "step2": "⚙️ Click Format", "step3": "👀 Review structured output", "step4": "❗ Fix any errors shown", "step5": "📄 Copy clean JSON" }, "bestPractices": { "heading": "🚀 Best Practices for Working With JSON", "item1": "✅ Keep it valid — always use double quotes and match brackets correctly.", "item2": "✅ Format before debugging — don't debug raw JSON; always format first.", "item3": "✅ Use consistent indentation — 2 spaces is the most common standard.", "item4": "✅ Avoid over-nesting — deep nesting is hard to read and hard to maintain.", "item5": "✅ Validate early — catch errors before using JSON in code." }, "comparison": { "heading": "🧰 JSON Formatter vs JSON Validator", "col1": "Feature", "col2": "Formatter", "col3": "Validator", "row1col1": "Purpose", "row1col2": "Improve readability", "row1col3": "Check correctness", "row2col1": "Fix errors", "row2col2": "❌ No", "row2col3": "✅ Yes", "row3col1": "Output", "row3col2": "Clean structure", "row3col3": "Error messages", "workflow": "Best workflow: Format → Validate → Fix." }, "proTips": { "heading": "⚡ Pro Tips", "item1": "🔍 Format before logging large JSON", "item2": "🧩 Break large JSON into smaller parts", "item3": "📋 Copy only what you need", "item4": "⚡ Use formatter + diff tool together" }, "safety": { "heading": "🔐 Is It Safe to Use Online JSON Formatters?", "body": "Most modern tools run directly in your browser and don't send data to servers. Still, avoid pasting API keys or sensitive production data." }, "faq": { "heading": "❓ FAQ", "q1": "Does formatting change my JSON data?", "a1": "No — it only changes appearance, not content.", "q2": "Can a formatter fix invalid JSON?", "a2": "No — but it helps you see where the issue is.", "q3": "What's the best indentation style?", "a3": "2 spaces is the most common standard.", "q4": "Why does my JSON fail to format?", "a4": "Likely due to syntax errors, missing brackets, or incorrect quote style." }, "conclusion": "Working with raw JSON doesn't have to be frustrating. With a JSON formatter, you can read data instantly, debug faster, and reduce errors — one of the simplest tools that can significantly improve your workflow.", "ctaBtn": "👉 Try it here: JSON Formatter Tool" };
const jsonFormatter$1 = {
  hero: hero$9,
  tabs: tabs$8,
  details: details$9,
  howItWorks: howItWorks$9,
  howToUse: howToUse$1,
  input: input$1,
  formatBtn,
  output: output$1,
  errors,
  guide: guide$8
};
const hero$8 = { "title": "Regex Tester", "icon": ".*", "tagline": "Paste text below, enter a search pattern, and see live match highlights instantly — no sign-up required. Toggle Regex for full JavaScript regex syntax with capture groups, or leave it off for plain-text search.", "blogLink": "Learn how to use the Regex Tester →" };
const tabs$7 = { "details": "Details", "howItWorks": "How it works" };
const details$8 = { "whatIs": { "heading": "What is Regex", "body": "A regular expression (regex) is a pattern that specifies a set of strings. In JavaScript, regexes are objects (RegExp) that can be applied to strings to test for matches, extract matches, or perform substitutions." }, "whenToUse": { "heading": "When to use Regex", "body": "Regex is appropriate when you need to find, validate, or transform text based on a structural pattern rather than a fixed string — for example, validating an email address format, extracting numbers from logs, or replacing all occurrences of a pattern." }, "flags": { "heading": "Regex Flags", "g": "g — global: always active. All non-overlapping matches are returned (not just the first).", "i": "i — case-insensitive: a matches A, B matches b.", "m": "m — multiline: ^ and $ match start/end of each line, not just the whole string." }, "captureGroups": { "heading": "Capture Groups & Replacements", "body": "Parentheses in a regex pattern create capture groups: (\\w+). In a replacement string, $1 refers to the first group, $2 to the second, and so on." }, "usefulWhen": { "heading": "Useful when", "item1": "Validating user input against a required format (email, phone, URL).", "item2": "Extracting structured fields (dates, IDs, tokens) from unstructured text.", "item3": "Performing batch find-and-replace on text with complex rules." }, "faq": { "heading": "FAQs", "q1": "Q: What regex flavor does this tester use?", "a1": "A: JavaScript (ECMAScript) regex, as executed by the browser's built-in RegExp engine.", "q2": "Q: Why does the match count include overlapping matches?", "a2": "A: It doesn't — the global flag returns non-overlapping matches in left-to-right order.", "q3": "Q: Why doesn't my pattern match across lines?", "a3": "A: Enable the m flag. By default, ^ and $ only match the start and end of the whole string." } };
const howItWorks$8 = { "step1": "Paste or type the text you want to search in the Input Text panel on the left.", "step2": "Type a search pattern in the Search field. Toggle Regex to use JavaScript regex syntax, or leave it off for a plain-text search.", "step3": "Matches are highlighted live in the Match Preview panel on the right. The match count updates automatically.", "step4": "Enter a replacement in the Replace field and click Replace All to see the result. Copy it from the output section that appears below." };
const howToUse = { "heading": "How to use", "step1": "1. Paste your text in the Input Text panel.", "step2": "2. Type a pattern in the Search field.", "step3": "3. Matches highlight live in the Match Preview panel.", "step4": "4. Use Replace All to replace matches." };
const controls$2 = { "searchPlaceholder": "Search pattern…", "searchAriaLabel": "Search pattern", "regexLabel": "Regex", "regexTitle": "Toggle regular expression mode", "flagI": "i", "flagITitle": "Case-insensitive", "flagM": "m", "flagMTitle": "Multiline", "clearBtn": "Clear", "matchCount": "{{count}} match(es)", "noMatches": "No matches", "replaceToggleOpen": "▾ Replace with…", "replaceToggleClose": "▸ Replace with…", "replacePlaceholder": "Replacement (supports $1, $2…)", "replaceAriaLabel": "Replacement text", "replaceAllBtn": "Replace All", "patternError": "Pattern error: {{message}}" };
const input = { "label": "Input Text", "placeholder": "Paste or type text here…\n\nExample:\nHello World 123\nfoo@bar.com", "ariaLabel": "Input text" };
const preview$2 = { "label": "Match Preview" };
const output = { "label": "Replaced Output", "copyBtn": "Copy", "copiedBtn": "✓ Copied!" };
const guide$7 = { "title": "How to Test and Debug Regex Quickly (Without Losing Your Mind)", "intro": "Regular expressions are powerful… but notoriously frustrating. You write a pattern expecting it to match perfectly — and instead it matches too much, nothing, or partially works.", "cta": "👉 The key to mastering regex isn't memorization — it's testing and iteration.", "learnItems": { "item1": "🧪 Test regex patterns effectively", "item2": "🐞 Debug common issues", "item3": "👁 Understand what your pattern is actually doing", "item4": "🚀 Build regex with confidence" }, "whatIs": { "heading": "🔍 What Is a Regex Tester?", "body": "A regex tester is an interactive tool that lets you write a pattern, provide sample text, and instantly see matches — turning regex from guessing into visual feedback." }, "whyDifficult": { "heading": "🧠 Why Regex Feels Difficult", "item1": "😵 Compact — a small pattern can represent a lot of logic and be hard to read.", "item2": "🔄 Sensitive — one character change can break everything or completely change behavior.", "item3": `🧩 Abstract — patterns don't always "look like" what they match.` }, "whyUse": { "heading": "⚡ Why You Should Always Use a Regex Tester", "item1": "👀 Instant Feedback — see matches as you type; no guessing, no running code repeatedly.", "item2": "🐞 Faster Debugging — quickly identify wrong groups, missing escapes, incorrect boundaries.", "item3": "🎯 Better Accuracy — test against real input data and edge cases.", "item4": "🚀 Faster Learning — experimentation helps you understand patterns and remember syntax naturally." }, "example": { "heading": "🧪 Example: Regex in Action", "goal": "Goal: Match email addresses", "testInput": "Test input:", "result": "A regex tester highlights ✅ valid matches and ❌ invalid ones — making debugging much easier." }, "mistakes": { "heading": "🛠 Common Regex Mistakes", "item1": "❌ Forgetting to escape characters", "item1Wrong": "// Wrong — matches ANY character", "item1Right": "// Correct — matches literal dot", "item2": "❌ Greedy matching", "item2Wrong": "// Wrong — matches too much", "item2Right": "// Correct — non-greedy", "item3": "❌ Missing anchors", "item3Wrong": "// Matches anywhere in string", "item3Right": "// Correct — anchored to full string", "item4": "❌ Incorrect character classes", "item4Wrong": "// Wrong — lowercase only", "item4Right": "// Correct — letters and digits" }, "stepByStep": { "heading": "🪜 Step-by-Step: How to Test Regex", "step1": "✍️ Enter your regex pattern", "step2": "📄 Paste sample text", "step3": "👀 Observe matches", "step4": "🔧 Adjust pattern", "step5": "🔁 Repeat until correct" }, "bestPractices": { "heading": "🧠 Best Practices for Writing Regex", "item1": "✅ Start simple — build patterns step by step, add complexity gradually.", "item2": "✅ Test real data — use actual user input and real-world examples.", "item3": "✅ Use comments when possible — break complex regex into understandable parts.", "item4": '✅ Avoid over-optimization — readable regex beats "clever" regex.', "item5": "✅ Validate edge cases — test empty input and unexpected formats." }, "useCases": { "heading": "🧑‍💻 Real-World Use Cases", "item1": "📧 Email Validation — check input format before submission", "item2": "🔐 Password Rules — enforce complexity requirements", "item3": "📄 Data Extraction — extract IDs, URLs, numbers from text", "item4": "📊 Log Parsing — analyze and filter system logs" }, "pitfalls": { "heading": "⚠️ Common Pitfalls", "item1": "❌ Writing entire regex at once", "item2": "❌ Not testing edge cases", "item3": "❌ Copy-pasting regex without understanding it", "item4": "❌ Ignoring readability" }, "comparison": { "heading": "🔍 Regex Tester vs Code Execution", "col1": "Feature", "col2": "Regex Tester", "col3": "Code", "row1col1": "Speed", "row1col2": "Instant", "row1col3": "Slower", "row2col1": "Debugging", "row2col2": "Visual", "row2col3": "Manual", "row3col1": "Learning", "row3col2": "Easy", "row3col3": "Harder" }, "proTips": { "heading": "🚀 Pro Tips", "item1": "🔍 Test small parts of regex first", "item2": "🧩 Break complex patterns into chunks", "item3": "⚡ Use non-greedy matching when needed", "item4": "📋 Keep sample inputs saved for reuse" }, "safety": { "heading": "🔐 Is It Safe to Use a Regex Tester?", "body": "Most modern tools:", "item1": "✅ Run directly in your browser", "item2": "✅ Don't store input", "warning": "👉 Still avoid pasting sensitive data or production secrets." }, "faq": { "heading": "❓ FAQ", "q1": "Why is my regex not matching anything?", "a1": "Possible reasons: missing anchors, incorrect syntax, or wrong test input.", "q2": "Why does my regex match too much?", "a2": "Likely due to greedy patterns like .*. Try .*? instead.", "q3": "Can I learn regex without memorizing everything?", "a3": "Yes — practice with testing tools is the fastest way.", "q4": "What's the best way to improve regex skills?", "a4": "Build + test + iterate repeatedly." }, "conclusion": "Regex doesn't have to be frustrating. With the right approach and a good tester, you can build patterns faster, debug with confidence, and truly understand what your regex is doing.", "ctaBtn": "👉 Try your regex here: Regex Tester Tool" };
const regexTester$1 = {
  hero: hero$8,
  tabs: tabs$7,
  details: details$8,
  howItWorks: howItWorks$8,
  howToUse,
  controls: controls$2,
  input,
  preview: preview$2,
  output,
  guide: guide$7
};
const hero$7 = { "title": "Image Watermarker", "tagline": "Protect your images by adding a custom text or logo watermark. Adjust the position and style to fit your needs, then download the watermarked result instantly.", "blogLink": "Learn how to put a watermark on your image →" };
const tabs$6 = { "details": "Details", "howItWorks": "How it works" };
const hint$5 = { "text": "Would you like to resize your image before put watermark?", "btn": "Try Image Resizer" };
const details$7 = { "whatIs": { "heading": "What is Image watermarker", "body": "An Image Watermarker applies a visible overlay—either text or a logo—onto an image to indicate ownership, branding, or provenance. The tool supports placement, scaling, opacity adjustments, and simple styling so you can make the watermark subtle or clearly visible depending on your goals." }, "howWorks": { "heading": "How watermarking works", "body": "After selecting a source image you can choose a text watermark or upload a logo. The editor renders the watermark on an offscreen canvas at the chosen position and opacity, and then exports the composite as a new image file for download. Processing is performed locally in the browser." }, "choosing": { "heading": "Choosing the right watermark", "item1": "Semi-transparent text is a good balance for branding without overwhelming the image.", "item2": "Logos (PNG/SVG) keep transparency and provide a cleaner brand mark—use vector or high-resolution PNG logos where possible.", "item3": "Consider placement: corners are less likely to be cropped, while tiled or full-frame watermarks offer stronger protection but impact aesthetics." }, "practical": { "heading": "Practical tips", "item1": "Use lower opacity and smaller scale for a subtle brand mark; increase opacity and size for stronger visible protection.", "item2": "For batch use, standardize watermark position and size to ensure consistent branding across images.", "item3": "Preview at actual export size to confirm legibility and visual balance before downloading." }, "usefulWhen": { "heading": "Useful when", "item1": "need to protect your images with a visible watermark.", "item2": "want to maintain control over watermark placement, size, and opacity.", "item3": "preparing images for sharing online or for branding purposes." }, "privacy": { "heading": "Privacy, retention and limitations", "body": "Because watermarking runs in your browser, your images remain on your device unless you explicitly upload them. Note that visible watermarks deter casual reuse but are not a foolproof copyright protection; determined actors can remove or crop them." }, "faq": { "heading": "FAQs", "q1": "Q: Can I use a logo?", "a1": "A: Yes — upload a PNG or SVG logo to apply as a watermark; transparent backgrounds are supported.", "q2": "Q: Will this change my original image?", "a2": "A: No — the tool creates a new watermarked file and does not overwrite your original file.", "q3": "Q: Does the image leave my browser?", "a3": "A: No — watermarking runs in your browser and does not upload the original image by default.", "q4": "Q: Can I control opacity, size, and position?", "a4": "A: Yes — use the controls to adjust the watermark's opacity, scale, and placement.", "q5": "Q: Does watermarking work with all image formats?", "a5": "A: Common web formats (JPEG, PNG, WebP) are supported." } };
const howItWorks$7 = { "step1": "Import an image to watermark via drag & drop or file select.", "step2": "Choose text or logo watermark and adjust position, size, and opacity.", "step3": "Apply the watermark preview and fine-tune placement.", "step4": "Export and download the watermarked image.", "step5": "Optional - You can apply watermark on multiple files at once." };
const dropZone$4 = { "text": "Drag & drop images here, or click to select" };
const fileRow$5 = { "count": "{{count}} images selected", "changeOne": "Change image", "changeMany": "Change images", "clear": "Clear" };
const type = { "label": "Type:", "text": "Text", "logo": "Logo" };
const textInput = { "placeholder": "Enter watermark text" };
const logoBtn = "Choose logo";
const position = { "label": "Position:", "default": "Default (center + diagonal)", "center": "Center", "topLeft": "Top Left", "topRight": "Top Right", "bottomLeft": "Bottom Left", "bottomRight": "Bottom Right" };
const repeated = "Repeated";
const opacity = "Opacity:";
const applyBtn = "Apply to {{count}} image(s)";
const processingBtn$1 = "Processing...";
const downloadBtn$2 = "Download";
const downloadAllBtn = "Download All";
const popup$2 = { "prev": "Prev", "next": "Next", "close": "×" };
const guide$6 = { "title": "How to Add Watermarks to Image(s) (Protect Your Work and Build Your Brand)", "lead": "If you share images online — whether photos, designs, or screenshots — you've probably worried about others using them without permission. That's where watermarking comes in.", "whatIs": { "heading": "What Is a Watermark?", "body": "A watermark is a visible overlay (text or logo) placed on an image to indicate ownership or origin. Common types include text watermarks (name, website), logo watermarks (brand identity), and pattern watermarks (repeated across image)." }, "why": { "heading": "Why You Should Use Watermarks", "item1": "Protect Your Content: Watermarks discourage casual reuse by clearly showing ownership.", "item2": "Build Brand Recognition: Every shared image carries your name or logo with it.", "item3": "Prevent Content Theft: Makes removal harder and reduces casual copying.", "item4": "Add Professional Identity: Watermarked images look intentional and authoritative." }, "types": { "heading": "Types of Watermarks", "text": '🔤 Text Watermark — Simple and fast — good for blogs and tools (e.g., "thrjtech.com").', "logo": "🖼 Logo Watermark — Strong branding — ideal for businesses; use PNG/SVG for transparency.", "repeated": "🔁 Repeated Watermark — Tiled across the image — best for high-value content, but less clean visually." }, "bestPractices": { "heading": "Best Practices", "item1": "Keep it visible but not distracting (opacity ~20–60%).", "item2": "Choose the right position: corner for subtle, center for strong protection.", "item3": "Use consistent branding (font, logo, placement).", "item4": "Avoid overpowering the image — balance is key.", "item5": "Match watermark color to image brightness for legibility." }, "stepByStep": { "heading": "Step-by-Step", "step1": "Upload your image(s)", "step2": "Enter text or upload a logo", "step3": "Adjust size, position, and opacity", "step4": "Preview the watermark", "step5": "Download the final image" }, "faq": { "heading": "FAQ", "q1": "Can you put watermarks on multiple images at once?", "a1": "Yes — you can select multiple images and apply the same watermark to all of them simultaneously.", "q2": "Can watermarks be removed?", "a2": "Yes — advanced tools may remove watermarks, but well-placed marks make removal harder.", "q3": "What opacity should I use?", "a3": "Usually between 30% and 60% depending on the background.", "q4": "Should I place watermark in the center?", "a4": "Center placement offers stronger protection; corners are subtler — choose based on your goal." }, "conclusionTitle": "Conclusion", "conclusion": "Watermarking is a simple way to protect images, promote your brand, and maintain ownership visibility. When done right it enhances your content without distracting from it.", "ctaBtn": "Try the Image Watermarker →" };
const imageWatermarker$1 = {
  hero: hero$7,
  tabs: tabs$6,
  hint: hint$5,
  details: details$7,
  howItWorks: howItWorks$7,
  dropZone: dropZone$4,
  fileRow: fileRow$5,
  type,
  textInput,
  logoBtn,
  position,
  repeated,
  opacity,
  applyBtn,
  processingBtn: processingBtn$1,
  downloadBtn: downloadBtn$2,
  downloadAllBtn,
  popup: popup$2,
  guide: guide$6
};
const hero$6 = { "title": "Image Resizer", "tagline": "Resize your image to any size by percentage or exact pixel dimensions. Lock the aspect ratio to prevent distortion, then download your result instantly.", "blogLink": "Learn how to resize your image →" };
const tabs$5 = { "details": "Details", "howItWorks": "How it works" };
const hint$4 = { "text": "Do you want your picture to fit on YouTube Thumbnail or Instagram?", "btn": "Try Image Crop" };
const details$6 = { "whatIs": { "heading": "What is Image Resizer", "body": "The Image Resizer lets you change an image's pixel dimensions by a percentage scale or by specifying exact width and height. It performs client-side scaling using an offscreen canvas so the original image remains on your device and the resized output is produced instantly for download." }, "howWorks": { "heading": "How resizing works", "body": "Resizing decodes the source image in the browser, draws it to a canvas at the target dimensions, and then exports the canvas content as a new image file. Downsizing reduces file size while preserving visual fidelity in most cases; upscaling cannot add real detail and will often produce softer results." }, "quality": { "heading": "Quality, interpolation and tradeoffs", "item1": "Downscaling: preserves perceived quality and reduces bytes; suitable for thumbnails and web delivery.", "item2": "Upscaling: limited by source resolution—avoid excessive upscaling (e.g., >2x) to prevent pixelation.", "item3": "Interpolation: browsers use built-in resampling; results vary by engine." }, "practical": { "heading": "Practical tips", "item1": "For web, aim for moderate dimensions (e.g., 1200–2048px on the long edge) to balance quality and performance.", "item2": "Use percentage mode for quick proportional scaling; use exact dimensions when a precise pixel size is required.", "item3": "Keep a copy of the original file if you expect to re-edit or export at larger sizes later." }, "whenToUse": { "heading": "When to use", "body": "Use the resizer when you need to prepare images for specific display contexts (web pages, email, thumbnails), reduce file weight for faster uploads, or adjust images to meet platform requirements." }, "faq": { "heading": "FAQs", "q1": "Q: Can I preserve aspect ratio?", "a1": "A: Yes — enable the aspect lock to maintain proportions while changing one dimension.", "q2": "Q: Is resizing local?", "a2": "A: Yes — resizing occurs in your browser via an offscreen canvas; files are not uploaded.", "q3": "Q: Will file size always decrease?", "a3": "A: Usually when downscaling, but file size also depends on format and compression settings.", "q4": "Q: Can I batch resize?", "a4": "A: This UI focuses on single-image operations; for many images use a batch tool or script." } };
const howItWorks$6 = { "step1": "Choose a source image by drag & drop or browsing.", "step2": "Select percentage or explicit width/height and lock the aspect ratio if needed. You can use Alt+Scroll or Pinch to zoom on mobile in the preview.", "step3": "Click Resize to run client-side scaling and produce the output file.", "step4": "Preview and download the resized image." };
const dropZone$3 = { "text": "Drag & drop an image here, or click to select", "hint": "Alt+Scroll to zoom · Pinch on mobile · {{percent}}%" };
const fileRow$4 = { "name": "Change Image", "clear": "Clear" };
const resizeMode = { "percentage": "Resize by Percentage", "dimensions": "Resize by Width & Height" };
const percentInput = { "placeholder": "Enter percentage (e.g. 50)", "suffix": "%" };
const dimensionInputs = { "width": "Width (px)", "height": "Height (px)", "unlinkAria": "Unlink width and height", "linkAria": "Link width and height" };
const previewBtn = "Preview";
const processingBtn = "Processing...";
const downloadBtn$1 = "Download";
const watermarkPrompt$1 = { "text": "Would you like to put private watermark on the resized image?", "yes": "Yes", "preparing": "Preparing...", "error": "Failed to send image to watermark tool." };
const guide$5 = { "title": "The Complete Guide to Resizing Images Without Losing Quality", "lead": "Resizing images seems simple — until you end up with blurry, pixelated, or distorted results. Whether you're uploading photos to a website, sending images by email, or optimizing for performance, resizing the right way matters more than most people think.", "learn": "In this guide, you'll learn:", "learnItems": { "item1": "How image resizing actually works", "item2": "Why quality loss happens", "item3": "The best ways to resize images without ruining them", "item4": "Practical tips you can use immediately" }, "whatMeans": { "heading": 'What Does "Resizing an Image" Really Mean?', "body": "Resizing an image means changing its dimensions — usually width and height in pixels.", "example": "Original: 4000 × 3000 px → Resized: 800 × 600 px", "resampling": "This process is called resampling, and it directly affects quality." }, "whyLoseQuality": { "heading": "Why Do Images Lose Quality?", "pixel": "Pixel Loss — When reducing size, pixels are permanently removed. If done poorly, edges become jagged and fine details disappear.", "resampling": "Poor Resampling Method — Not all resizing algorithms are equal. Nearest Neighbor is fast but blocky. Bilinear is smoother. Bicubic is best for most cases.", "repeated": "Repeated Resizing — Every resize discards more data. Always resize from the original image, never from a previously resized copy." }, "bestPractices": { "heading": "Best Practices to Resize Without Losing Quality", "aspectRatio": "Maintain Aspect Ratio — Always keep width and height proportional.", "resizeOnce": "Resize Once — Start with the original → resize once → save the final version.", "format": "Choose the Right Format — JPEG: smaller size, slight loss. PNG: higher quality, larger file. WebP: best balance.", "compression": "Avoid Over-Compression — Aim for balance, not maximum compression." }, "useCases": { "heading": "Common Use Cases", "website": "Website Uploads — Resize large images (4000px → 1200px) to dramatically improve page load speed.", "social": "Social Media — Resizing ensures no cropping issues and better visual quality across profiles, posts, and thumbnails.", "email": "Email Attachments — Large images slow down sending and may be rejected. Resizing keeps files manageable." }, "mistakes": { "heading": "Mistakes to Avoid", "item1": "❌ Stretching images (wrong aspect ratio)", "item2": "❌ Saving repeatedly in JPEG", "item3": "❌ Using tools with poor resampling algorithms", "item4": "❌ Upscaling small images expecting higher quality" }, "stepByStep": { "heading": "Quick Step-by-Step Guide", "step1": "Upload your image", "step2": "Choose desired width or height", "step3": "Keep aspect ratio enabled", "step4": "Select output format (JPEG / PNG / WebP)", "step5": "Download resized image" }, "faq": { "heading": "FAQ", "q1": "Does resizing reduce quality?", "a1": "Yes — but if done correctly, the loss is minimal and often unnoticeable to the human eye.", "q2": "Can I resize without losing any quality?", "a2": "Only if you're not reducing size significantly. Otherwise, some data loss is unavoidable.", "q3": "What's the best format after resizing?", "a3": "Web: WebP or JPEG — High quality archival: PNG", "q4": "Is it better to resize or compress?", "a4": "They serve different purposes. Resize changes dimensions; Compress reduces file size. Best results come from using both carefully." }, "conclusionTitle": "Conclusion", "conclusion": "Resizing images isn't just about making them smaller — it's about doing it correctly to preserve clarity and usability. By maintaining aspect ratio, resizing once from the original, and choosing the right format, you can significantly improve both image quality and performance.", "ctaBtn": "Try the Image Resizer →" };
const imageResizer$1 = {
  hero: hero$6,
  tabs: tabs$5,
  hint: hint$4,
  details: details$6,
  howItWorks: howItWorks$6,
  dropZone: dropZone$3,
  fileRow: fileRow$4,
  resizeMode,
  percentInput,
  dimensionInputs,
  previewBtn,
  processingBtn,
  downloadBtn: downloadBtn$1,
  watermarkPrompt: watermarkPrompt$1,
  guide: guide$5
};
const hero$5 = { "title": "Image Collage", "tagline": "Combine multiple images into a beautiful grid collage. Arrange photos into rows and columns, set a custom canvas size, then download the result as a single image.", "blogLink": "Learn how to create an image collage →" };
const tabs$4 = { "details": "Details", "howItWorks": "How it works" };
const details$5 = { "whatIs": { "heading": "What is Image Collage", "body": "A collage combines multiple images into a single tiled layout on a shared canvas. You control rows, columns, spacing, and final canvas dimensions to create social posts, montages, product previews, or portfolio images. Assembly happens locally in the browser, producing a single raster image you can download or share. This keeps your originals private unless you explicitly upload or use a sharing workflow." }, "howWorks": { "heading": "How the collage works", "body": `The tool computes each cell's placement by dividing the canvas into a uniform grid based on the selected rows and columns. For every cell it calculates a "cover" rectangle so the image fills the slot without leaving gaps; users can then pan and scale each image within its cell to adjust framing and composition. When you finalize the collage the images are drawn onto an offscreen HTML canvas at the chosen export resolution and exported as a PNG for download.` }, "design": { "heading": "Design choices and tradeoffs", "item1": "Quality vs. Size: Higher canvas sizes preserve detail but increase memory usage and final file size. For most social media scenarios, 1200–2048px on the long edge balances clarity and performance.", "item2": "Performance: All decoding and compositing are performed client-side. Very large canvases or many high-resolution images can slow the UI or exhaust browser memory — reduce export size or source resolutions for better responsiveness.", "item3": "Consistency: Fixed cell sizes ensure a predictable layout; tweak spacing and border color to alter the visual rhythm of the collage." }, "practical": { "heading": "Practical tips", "item1": "Start with lower-resolution images while composing and previewing, then use originals for the final export if necessary.", "item2": `Use the "lock ratio" option to keep proportional scaling when changing canvas dimensions so your layout doesn't distort.`, "item3": "Adjust border gap to create breathing room or tight tiles depending on your design goal.", "item4": "If an image looks soft at export, either increase the canvas resolution or supply a higher-resolution source image." }, "accessibility": { "heading": "Accessibility & UX", "body": "Controls are labeled and keyboard accessible, and preview mode scales to smaller screens so users can accurately inspect and adjust images before exporting. Large hit targets and clear visual focus help when using touch devices or screen magnification." }, "whenToUse": { "heading": "When to use a collage", "item1": "Creating social media posts that combine multiple shots into a single, shareable image.", "item2": "Building product grids or marketing montages for newsletters, landing pages, or ads.", "item3": "Quickly assembling family photo montages or event highlights to share with friends and family." }, "export": { "heading": "Export options", "body": "By default the final canvas is exported as a PNG to preserve quality. If you need smaller web-friendly files you can convert the PNG to a JPEG at a chosen quality level using an external image editor or additional client-side encoding step. Filenames include a timestamp to keep exports unique and easily traceable." }, "privacy": { "heading": "Privacy & sharing", "body": "Collage generation occurs entirely on your device — the images do not leave your browser unless you explicitly upload or share them via the app's sharing/watermarking workflow. If you choose to use the watermark or sharing features those steps will present clear prompts and require confirmation before any upload occurs." }, "limitations": { "heading": "Limitations", "item1": "Very large canvases (for example, >10000px) may be limited by browser memory or implementation limits.", "item2": "Animated sources (GIF/WebP) are flattened to a single frame during export.", "item3": "Embedded color profiles may be handled differently by different browsers and can affect exported color fidelity." }, "faq": { "heading": "FAQs", "q1": "Q: How many images can I use?", "a1": "A: Best for small to medium batches (roughly 4–25 images); very large sets can degrade performance depending on client resources.", "q2": "Q: Will image quality be preserved?", "a2": "A: Quality depends on chosen canvas export size and the source resolutions — use higher-resolution originals for larger exports.", "q3": "Q: Can I reorder or remove images?", "a3": "A: Yes — use the file list controls to move or delete items before generating the final collage.", "q4": "Q: Does this run in my browser?", "a4": "A: Yes — collage assembly is client-side; nothing is uploaded unless you explicitly use a sharing feature." } };
const howItWorks$5 = { "step1": "Add images via drag & drop or the file browser.", "step2": "Adjust rows, columns, and spacing to arrange the grid.", "step3": "Preview the collage and reposition images if needed.", "step4": "Finalize collaged image and download it." };
const dropZone$2 = { "text": "Drag & drop images here, or click to add. The grid will expand as needed." };
const fileRow$3 = { "count": "{{count}} images selected", "changeOne": "Change Image", "changeMany": "Change Images", "clear": "Clear" };
const controls$1 = { "columns": "Columns:", "rows": "Rows:", "widthHeight": "Width x Height:", "widthPlaceholder": "Width (px)", "heightPlaceholder": "Height (px)", "pxSuffix": "px", "unlinkAria": "Unlink width and height", "linkAria": "Link width and height" };
const infoBanner = "You can change the collage border color and thickness in the preview screen.";
const collageBtn = "Collage and Preview";
const finalSize = "Final Collage Size: {{width}} x {{height}} px";
const downloadBtn = "Download";
const downloadingBtn = "Downloading...";
const watermarkPrompt = { "text": "Would you like to put a private watermark on the collaged image?", "yes": "Yes", "preparing": "Preparing...", "error": "Failed to send image to watermark tool." };
const preview$1 = { "header": "Preview", "reset": "Reset", "finalize": "Finalize Collage", "close": "Close", "hint1": "- Drag images to reposition, click on Border color to change it", "hint2": "- Hold Alt + scroll to zoom (desktop). Use two-finger pinch to zoom on touch.", "borderColor": "Border color:", "borderThickness": "Border thickness:", "closeAria": "Close preview", "noPreview": "Preview not available for this image" };
const guide$4 = { "title": "How to Create Stunning Image Collages That Tell a Story", "introHeading": "Introduction", "lead": "Sometimes one photo isn't enough. Whether you're capturing a trip, showcasing products, or sharing moments on social media, a single image can feel limiting. That's where image collages come in.", "byCombining": "By combining multiple images into one, you can:", "introConclusion": "In this guide, you’ll learn how to design effective image collages, when to use them, and how to make them look professional (not messy).", "tryIt": "Try it here:", "intro": { "items": { "item1": "Tell a richer story", "item2": "Show variety in a single frame", "item3": "Create eye-catching visuals" } }, "whatIs": { "heading": "What Is an Image Collage?", "body": "An image collage is a collection of multiple images arranged into one unified composition. Instead of viewing photos individually, a collage lets you present them together, create meaning through arrangement, and highlight connections between images." }, "why": { "heading": "Why Use Image Collages?", "item1": "Tell a Complete Story — A single image shows one moment. A collage shows before and after, different angles, or a sequence of events.", "item2": "Maximize Limited Space — On social media, websites, or thumbnails you often have limited space. A collage allows you to show multiple visuals in one post.", "item3": "Create Strong Visual Impact — Collages stand out because they contain more information and naturally attract attention.", "item4": "Showcase Variety — Perfect for product galleries, portfolio previews, and feature comparisons." }, "types": { "heading": "Types of Image Collage Layouts", "grid": "🔲 Grid Layout — Clean and structured — equal-sized images, great for portfolios.", "freeform": "🧩 Freeform Layout — Different sizes and positions — more creative and dynamic.", "themed": "🎯 Themed Collage — Focused on a single concept — consistent colors or subject.", "beforeAfter": "🔍 Before & After Collage — Shows transformation — common in tutorials and comparisons." }, "bestPractices": { "heading": "Best Practices for Creating a Great Collage", "item1": "Start With a Clear Purpose — Ask yourself: What story am I telling?", "item2": "Choose Related Images — Images should share a theme and similar tone or subject.", "item3": "Keep It Simple — Too many images can overwhelm viewers — 3–6 images is often ideal.", "item4": "Use Consistent Spacing — Spacing creates balance and readability.", "item5": "Maintain Visual Balance — Avoid one side being too heavy.", "item6": "Pay Attention to Background — A good background supports the images and doesn't distract." }, "mistakes": { "heading": "Common Mistakes to Avoid", "item1": "Mixing unrelated images", "item2": "Using too many photos", "item3": "Poor alignment", "item4": "Inconsistent image quality", "item5": "Overcomplicated layouts" }, "stepByStep": { "heading": "Step-by-Step: How to Create an Image Collage", "step1": "Upload your images", "step2": "Select a layout (grid or custom)", "step3": "Arrange images in desired order", "step4": "Adjust spacing and alignment", "step5": "Preview the final composition", "step6": "Download your collage" }, "useCases": { "heading": "Real-World Use Cases", "item1": "📱 Social Media Posts — combine highlights into one post and increase engagement", "item2": "🛍 Product Showcases — display multiple angles and highlight features", "item3": "✈️ Travel Memories — show an entire trip in one frame", "item4": "💼 Portfolio Presentation — show variety of work quickly" }, "comparison": { "heading": "Image Collage vs Gallery", "collage": "Collage: Single image, strong storytelling, efficient space usage, high visual impact.", "gallery": "Gallery: Multiple images, moderate storytelling, requires scrolling." }, "tips": { "heading": "Tips to Make Your Collage Stand Out", "item1": "Use contrast (light vs dark images)", "item2": "Mix close-up and wide shots", "item3": "Add subtle borders", "item4": "Keep a consistent color tone" }, "faq": { "heading": "FAQ", "q1": "How many images should I use in a collage?", "a1": "Usually 3–6 images works best for clarity and balance.", "q2": "Can I use different image sizes?", "a2": "Yes — but keep alignment clean to avoid a messy look.", "q3": "Are collages good for SEO or websites?", "a3": "Yes — they save space, improve visual engagement, and reduce page clutter.", "q4": "Do collages reduce image quality?", "a4": "Not if created properly — ensure source images are high quality." }, "conclusion": "Image collages are more than just combining photos — they're a powerful way to tell stories, present information, and capture attention. With the right layout and purpose, a simple set of images can become a compelling visual experience.", "ctaBtn": "Image Collage Tool →" };
const imageCollage$1 = {
  hero: hero$5,
  tabs: tabs$4,
  details: details$5,
  howItWorks: howItWorks$5,
  dropZone: dropZone$2,
  fileRow: fileRow$3,
  controls: controls$1,
  infoBanner,
  collageBtn,
  finalSize,
  downloadBtn,
  downloadingBtn,
  watermarkPrompt,
  preview: preview$1,
  guide: guide$4
};
const hero$4 = { "title": "Image Crop", "tagline": "Select and crop a portion of your image. Choose from standard aspect ratios or set a custom one, rotate and flip as needed, then download the cropped result.", "blogLink": "Learn how to crop your image →" };
const tabs$3 = { "details": "Details", "howItWorks": "How it works" };
const hint$3 = { "text": "Would you like to put words on your image before cropping it?", "btn": "Try Meme Generator" };
const dropZone$1 = { "text": "Drag & drop an image here, or click to select" };
const fileRow$2 = { "loaded": "Image loaded", "change": "Change Image", "clear": "Clear" };
const controls = { "zoom": "Zoom", "rotation": "Rotation", "rotateLeft": "⟲", "rotateRight": "⟳", "rotateLeftAria": "rotate-left", "rotateRightAria": "rotate-right", "degrees": "{{rotation}}°", "flip": "Flip", "horizontal": "Horizontal", "vertical": "Vertical", "aspect": "Aspect", "ratio": "Ratio", "ratioSeparator": ":" };
const aspectOptions = { "custom": "Use Custom Aspect Ratio", "profile": "1:1 (Profile)", "standard": "4:3 (Standard)", "widescreen": "16:9 (Widescreen / YouTube)", "story": "9:16 (Story / Reels)", "instagram": "4:5 (Instagram Post)", "pinterest": "2:3 (Pinterest Pin)", "blog": "3:1 (Blog Featured)", "facebook": "1.91:1 (Facebook Post)" };
const actions$4 = { "preview": "Preview", "processing": "Processing...", "reset": "Reset", "download": "Download" };
const sendToMeme = { "text": "Would you like to put a text on cropped image?", "btn": "Send to Meme Generator" };
const details$4 = { "whatIs": { "heading": "What is Image Crop", "body": "The Image Crop tool provides an interactive way to select and export a rectangular portion of an image. It offers zoom, rotation, and flip controls, aspect ratio presets for common targets (social, profile, banners), and a preview step so you can confirm the crop before downloading. All transformation and export operations are performed in your browser using an offscreen canvas; your original file does not leave your device unless you explicitly share or upload it." }, "howWorks": { "heading": "How cropping works", "body": "After loading an image the editor displays a resizable crop overlay. You can drag the overlay to reposition it, resize using handles, or pick one of the provided aspect ratios for exact output dimensions. Zooming and rotation let you refine framing; flips mirror the image horizontally or vertically. When you click Preview or Download the selected region is rendered to an offscreen canvas with any transforms applied, and the result is exported as a PNG file for immediate download." }, "presets": { "heading": "Presets and precision", "item1": { "title": "1:1 (Profile)", "body": "Ideal for avatars and profile photos." }, "item2": { "title": "16:9 (Widescreen)", "body": "Useful for video thumbnails, banners, and widescreen presentations." }, "item3": { "title": "4:5 (Portrait)", "body": "A common format for social feeds and portrait-oriented content." }, "item4": { "title": "Free", "body": "No constraints; crop to any dimensions you need." } }, "practical": { "heading": "Practical tips", "item1": "Use the aspect-lock to keep exact proportions when resizing the crop area.", "item2": "For pixel-perfect exports, set the desired output resolution after choosing the crop area, then preview at 100% if possible.", "item3": "If you need to crop many images the same way, note the preset values so you can repeat the process consistently." }, "useful": { "heading": "Useful when", "item1": "preparing profile pictures or social media assets to exact dimensions.", "item2": "removing unwanted borders, background, or distracting elements from a photo.", "item3": "cropping a screenshot to a specific region for docs or presentations.", "item4": "quickly re-framing a photo without opening a desktop image editor." }, "accessibility": { "heading": "Accessibility & privacy", "body": "Controls are keyboard accessible and sized for touch interaction; the preview dialog helps users of all devices confirm changes. Because cropping is performed locally, your images remain private unless you choose to upload them as part of a sharing workflow." }, "faq": { "heading": "FAQs", "q1": "Q: Is my image uploaded anywhere?", "a1": "A: No — all cropping runs client-side in your browser. Your image never leaves your device.", "q2": "Q: What formats are supported?", "a2": "A: You can load any image format the browser supports (JPEG, PNG, WebP, GIF, etc.). The cropped output is always exported as PNG.", "q3": "Q: Can I undo a crop?", "a3": "A: Yes — simply adjust the crop selection and click Preview again to regenerate the output before downloading.", "q4": "Q: Why does the download button stay greyed out?", "a4": "A: Click Preview first to generate a cropped image, then the Download button becomes active." } };
const howItWorks$4 = { "step1": "Load an image by dragging and dropping it onto the crop area, or click to browse your files.", "step2": "Drag and resize the crop overlay to select the region you want to keep. Choose an aspect ratio preset or use Free mode.", "step3": "Optionally adjust zoom, rotation, and flip to fine-tune the framing before cropping.", "step4": "Click Preview to generate the cropped image and inspect the result in the preview dialog.", "step5": "Click Download to save the cropped PNG to your device.", "imgAlt": { "step1": "Step 1", "step2": "Step 2", "step3": "Step 3", "step4": "Step 4" } };
const guide$3 = { "title": "How to Crop Images Perfectly (Without Losing Quality or Composition)", "lead": "Cropping an image is one of the simplest edits you can make — but it has a huge impact on how your image looks and communicates.", "learnLabel": "In this guide, you'll learn:", "learnItems": { "item1": "How image cropping works", "item2": "When to use it", "item3": "How to crop properly without ruining quality" }, "whatIs": { "heading": "What Is Image Cropping?", "body": "Image cropping is the process of removing unwanted outer areas of an image to improve composition or adjust size. Instead of resizing the entire image, cropping lets you cut out unnecessary parts, focus on the subject, and change the aspect ratio.", "analogy": "Think of it as framing your image after it's already taken." }, "why": { "heading": "Why Cropping Matters", "focus": "Focus on the Subject — Cropping removes distractions and highlights the most important part of the image.", "composition": "Improve Composition — Use cropping to balance the image, apply the rule of thirds, and create a cleaner layout.", "platform": "Fit Platform Requirements — Different platforms need different sizes; crop to square, vertical, or landscape to avoid distortion." }, "croppingVsResizing": { "heading": "Cropping vs Resizing", "col1": "Feature", "col2": "Cropping", "col3": "Resizing", "row1col1": "What it does", "row1col2": "Removes part of image", "row1col3": "Scales entire image", "row2col1": "Keeps full content", "row2col2": "No", "row2col3": "Yes", "row3col1": "Changes composition", "row3col2": "Yes", "row3col3": "No", "row4col1": "Use case", "row4col2": "Focus / framing", "row4col3": "File size / dimensions", "tip": "Best practice: Crop first → then resize if needed." }, "bestPractices": { "heading": "Best Practices for Cropping", "item1": "Keep the Subject Clear — Ensure the main subject is centered or well-positioned and not cut awkwardly.", "item2": "Maintain Aspect Ratio — Use fixed ratios (1:1, 16:9, 4:5) when targeting specific platforms.", "item3": "Don't Crop Too Much — Excessive cropping reduces resolution and may make images blurry.", "item4": "Leave Breathing Space — Avoid tight crops—leave slight spacing around the subject for a natural look.", "item5": "Keep the Original — Always save the original image; cropped areas cannot be recovered." }, "mistakes": { "heading": "Common Mistakes to Avoid", "item1": "❌ Cutting off important parts (faces, edges, text)", "item2": "❌ Cropping without purpose", "item3": "❌ Ignoring aspect ratio", "item4": "❌ Over-cropping low-resolution images", "item5": "❌ Using random crop sizes across platforms" }, "stepByStep": { "heading": "Step-by-Step: How to Crop an Image", "step1": "Upload your image", "step2": "Select the area you want to keep", "step3": "Adjust the crop box (drag edges)", "step4": "Choose aspect ratio (optional)", "step5": "Apply crop", "step6": "Download the final image" }, "useCases": { "heading": "Real Use Cases", "social": "📱 Social Media Posts — Crop to square or vertical to improve engagement.", "website": "🌐 Website Images — Remove unnecessary space and make images consistent across pages.", "profile": "👤 Profile Pictures — Crop tightly around the face and center for better visibility.", "product": "🛍️ Product Images — Remove background clutter and highlight the product clearly." }, "faq": { "heading": "FAQ", "q1": "Does cropping reduce image quality?", "a1": "Yes — because pixels are removed, but if done carefully the quality loss is usually not noticeable.", "q2": "Can I undo cropping?", "a2": "Only if your tool supports non-destructive editing or you kept the original image.", "q3": "What is the best aspect ratio?", "a3": "Depends on usage: Instagram → 1:1 or 4:5; YouTube → 16:9; Websites → varies.", "q4": "Is cropping better than resizing?", "a4": "They serve different purposes: cropping changes composition, resizing changes dimensions." }, "conclusionTitle": "Conclusion", "conclusion": "Image cropping is a simple but powerful way to improve composition, highlight important content, and make images fit any platform. Use the right techniques to turn an average image into a clean, professional-looking one.", "ctaBtn": "Try the Image Crop Tool →" };
const imageCrop$1 = {
  hero: hero$4,
  tabs: tabs$3,
  hint: hint$3,
  dropZone: dropZone$1,
  fileRow: fileRow$2,
  controls,
  aspectOptions,
  actions: actions$4,
  sendToMeme,
  details: details$4,
  howItWorks: howItWorks$4,
  guide: guide$3
};
const hero$3 = { "title": "Meme Generator", "tagline": "Create fun memes by adding custom text to any image. Drag text anywhere on the canvas, adjust font size and color, then download your finished meme with one click.", "blogLink": "Learn how to use the Meme Generator →" };
const tabs$2 = { "details": "Details", "howItWorks": "How it works" };
const hint$2 = { "text": "Would you like to crop your image before creating a meme?", "btn": "Try Image Crop" };
const details$3 = { "whatIs": { "heading": "What is a Meme Generator", "body": "A meme generator is a lightweight creative editor that lets you place text overlays on images to produce humorous, informative, or expressive graphics quickly. It supports multiple text layers, free positioning, font sizing, color selection, and simple export controls so you can craft a share-ready image in seconds." }, "howWorks": { "heading": "How the generator works", "body": "Upload or drop an image into the canvas area, then add one or more text layers using the controls. Each layer can be positioned by dragging, resized via the advanced controls, and styled with a color picker. The preview area reflects changes in real time." }, "whyBrowser": { "heading": "Why use a browser-based tool", "body": "Browser-based meme editors are instant and accessible: they don't require installations, run offline once loaded, and keep your images local to your device." }, "tips": { "heading": "Tips for better memes", "item1": "Use short, punchy captions and capitalize text for classic meme styles.", "item2": "Keep good contrast between text and background; add stroke or shadow if needed for readability.", "item3": "Use multiple layers for complex layouts—title, subtitle, or small annotations all work well." }, "faq": { "heading": "FAQs", "q1": "Q: Will my image be uploaded anywhere?", "a1": "A: No — everything runs client-side in your browser.", "q2": "Q: Can I add more than two text lines?", "a2": "A: Yes — use the ＋ button to add as many text layers as you need.", "q3": "Q: What image formats are supported?", "a3": "A: Any image format your browser supports (JPEG, PNG, WebP, GIF, etc.)." }, "accessibility": { "heading": "Accessibility & privacy", "body": "Controls are designed with accessibility in mind (large targets, keyboard support). Since composition occurs locally, your images are not transmitted off your device by default — they only leave the browser if you choose to upload or share them." } };
const howItWorks$3 = { "step1": "Upload an image by clicking the canvas area or dragging and dropping a file onto it.", "step2": "Click the ＋ button to add a text layer and type your caption in the text box on the left panel.", "step3": "Drag the text overlay on the canvas to position it. Use the Advanced section to adjust font size and color.", "step4": "Add more text layers as needed, then click Download to save your meme as a PNG." };
const canvas = { "placeholder": "Click or drop image here to upload", "previewHint": "Drag to pan · Alt+Scroll to zoom · Pinch on mobile" };
const fileRow$1 = { "loaded": "Image loaded", "change": "Change Image", "clear": "Clear" };
const layers = { "label": "Text Layers", "addAria": "Add layer", "removeAria": "Remove layer", "topPlaceholder": "Top Text", "bottomPlaceholder": "Bottom Text", "newPlaceholder": "New Text" };
const advanced = { "toggleOpen": "▾", "toggleClosed": "▸", "label": "Font Options...", "fontSize": "Font Size", "fontSizePx": "{{size}}px", "textColor": "Text Color" };
const actions$3 = { "reset": "Reset", "preview": "Preview", "download": "Download" };
const popup$1 = { "close": "×" };
const guide$2 = { "title": "How to Create Memes That Actually Go Viral (Simple Guide for Beginners)", "intro": "Memes are everywhere. From social media feeds to group chats, memes have become one of the fastest ways to communicate ideas, humor, and opinions.", "learnItems": { "item1": "What makes a meme work", "item2": "How to create one from scratch", "item3": "Common mistakes to avoid", "item4": "Tips to make your memes more engaging" }, "whatIs": { "heading": "What Is a Meme (Really)?", "body": "A meme is a piece of content — usually an image with text — designed to be shared and adapted by others. Unlike regular images, memes are relatable, quick to understand, and easy to share.", "tip": "👉 A good meme delivers its message in seconds." }, "why": { "heading": "Why Memes Are So Popular", "item1": "Instant Communication — Memes compress ideas into one image and a few words, faster than paragraphs.", "item2": `Relatability — The best memes make people think "That's exactly me."`, "item3": "Shareability — Memes are designed to be reposted and modified.", "item4": "Low Effort, High Impact — You don't need design skills or expensive tools; just a good idea." }, "anatomy": { "heading": "Anatomy of a Good Meme", "image": "Image: Recognizable or expressive, supports the message.", "text": "Text: Short and clear, easy to read.", "punchline": "Punchline: The twist or humor that makes people share." }, "types": { "heading": "Types of Memes You Can Create", "item1": "😂 Relatable Memes — everyday situations", "item2": "🔥 Trend-Based Memes — use current formats", "item3": "💼 Niche Memes — target specific audiences", "item4": "🧠 Informational Memes — mix humor with useful info" }, "bestPractices": { "heading": "Best Practices", "item1": "Keep text short — 2–3 seconds to read.", "item2": "Use clear, bold fonts with high contrast.", "item3": "Match text to image so it reinforces the message.", "item4": "Stay relevant — trending formats perform better.", "item5": "Know your audience and tailor the humor." }, "mistakes": { "heading": "Common Mistakes to Avoid", "item1": "Too much text", "item2": "Unclear message", "item3": "Using outdated formats", "item4": "Low-quality images", "item5": "Trying too hard to be funny" }, "stepByStep": { "heading": "Step-by-Step: How to Create a Meme", "step1": "Upload or choose an image", "step2": "Add top and/or bottom text", "step3": "Adjust font size and position", "step4": "Preview your meme", "step5": "Download and share" }, "useCases": { "heading": "Real-World Use Cases", "item1": "📱 Social Media Content — boost engagement", "item2": "💼 Marketing — make brands feel human", "item3": "🧑‍💻 Developer Humor — build community", "item4": "👥 Group Chats — react faster than typing" }, "tips": { "heading": "Tips to Make Your Memes Stand Out", "item1": "Use unexpected twists", "item2": "Combine two ideas creatively", "item3": "Keep it simple but clever", "item4": "Test different variations" }, "comparison": { "heading": "Meme Generator vs Image Editor", "col1": "Feature", "col2": "Meme Generator", "col3": "Image Editor", "row1col1": "Purpose", "row1col2": "Quick meme creation", "row1col3": "General editing", "row2col1": "Speed", "row2col2": "Fast", "row2col3": "Slower", "row3col1": "Ease of use", "row3col2": "Very easy", "row3col3": "Moderate", "row4col1": "Focus", "row4col2": "Text + image", "row4col3": "Full customization" }, "faq": { "heading": "FAQ", "q1": "Do I need design skills?", "a1": "No — just a good idea and clear message.", "q2": "Can I use any image?", "a2": "You can, but be mindful of copyright and prefer common meme formats when possible.", "q3": "Why are my memes not getting engagement?", "a3": "Possible reasons: too much text, not relatable, outdated format." }, "conclusion": "Creating memes isn't about complex design — it's about communication and timing. Focus on clear ideas, simple text, and relatability.", "ctaBtn": "Image Meme Generator →", "lead2": "But creating a meme that people actually share? That’s a different story.", "learnIntro": "In this guide, you’ll learn:", "conclusionTitle": "Conclusion", "tryIt": "Try making your own here:" };
const imageMemeGenerator$1 = {
  hero: hero$3,
  tabs: tabs$2,
  hint: hint$2,
  details: details$3,
  howItWorks: howItWorks$3,
  canvas,
  fileRow: fileRow$1,
  layers,
  advanced,
  actions: actions$3,
  popup: popup$1,
  guide: guide$2
};
const hero$2 = { "title": "Image Converter", "tagline": "Convert image(s) between JPG, PNG, WebP, AVIF, BMP, GIF, and ICO entirely in your browser. No upload required — fast, private, and free.", "blogLink": "Learn about image formats →" };
const tabs$1 = { "details": "Details", "howItWorks": "How it works" };
const hint$1 = { "text": "Would you like to crop your image before converting your image?", "btn": "Try Image Crop" };
const details$2 = { "whatIs": { "heading": "What is Image Converter", "body": "The Image Converter lets you change the format of one or more images entirely in your browser. Select source files, pick a target format, and download the converted results — no server upload required." }, "howWorks": { "heading": "How conversion works", "body": "Each source image is decoded in the browser, drawn to an offscreen canvas, and then re-encoded in the chosen output format. Conversion quality and file size depend on the source image and the target format's compression characteristics." }, "formats": { "heading": "Supported formats", "jpgDesc": "JPEG — Lossy compression, great for photos, widely supported.", "pngDesc": "PNG — Lossless compression with transparency support.", "webpDesc": "WebP — Modern format with excellent size/quality ratio.", "avifDesc": "AVIF — Next-generation compression, best quality per byte.", "bmpDesc": "BMP — Uncompressed bitmap, maximum compatibility.", "gifDesc": "GIF — 256-color indexed format for simple graphics.", "icoDesc": "ICO — Windows icon format, multiple size options." }, "faq": { "heading": "FAQs", "q1": "Q: Are my images uploaded to a server?", "a1": "A: No — all conversion happens locally in your browser.", "q2": "Q: Can I convert multiple images at once?", "a2": "A: Yes — select multiple files and convert them all at once.", "q3": "Q: Will transparency be preserved?", "a3": "A: Only for formats that support it (PNG, WebP, AVIF). Converting to JPG removes transparency.", "q4": "Q: Why is AVIF not supported in my browser?", "a4": "A: AVIF requires a modern browser (Chrome 85+, Firefox 93+). Use WebP as an alternative." } };
const howItWorks$2 = { "step1": "Select one or more images by dragging them in or clicking to browse.", "step2": "Choose the output format from the format selector buttons.", "step3a": "Click <strong>Convert</strong> to process the image instantly in your browser.", "step3b": "Download your converted image with the <strong>Download</strong> button.", "step4": "You can also convert multiple images at once by selecting more than one file." };
const dropZone = { "text": "Drag & drop images here, or click to select", "hint": "Supports JPG, PNG, WebP, AVIF, GIF, BMP, and more" };
const fileRow = { "count": "{{count}} images selected", "changeOne": "Change image", "changeMany": "Change images", "clear": "Clear" };
const popup = { "converted": "✓ Converted to {{format}}", "progress": "({{current}} / {{total}})", "prev": "Prev", "next": "Next", "close": "×", "previewHint": "Alt+Scroll to zoom · Drag to pan" };
const format = { "label": "Convert to:", "jpgName": "JPG", "jpgDesc": "Best for photos. Smaller file, lossy compression.", "pngName": "PNG", "pngDesc": "Best for graphics with transparency. Lossless quality.", "webpName": "WebP", "webpDesc": "Modern format. Smaller than JPG & PNG with great quality.", "avifName": "AVIF", "avifDesc": "Next-gen format. Best compression. Chrome & Firefox recommended.", "bmpName": "BMP", "bmpDesc": "Uncompressed bitmap. Lossless, large file. Max compatibility.", "gifName": "GIF", "gifDesc": "256-color format. Best for simple graphics, not photos.", "icoName": "ICO", "icoDesc": "Windows icon format. Choose which sizes to include." };
const formats = { "jpg": "JPG", "jpgDesc": "Best for photos. Smaller file, lossy compression.", "png": "PNG", "pngDesc": "Best for graphics with transparency. Lossless quality.", "webp": "WebP", "webpDesc": "Modern format. Smaller than JPG & PNG with great quality.", "avif": "AVIF", "avifDesc": "Next-gen format. Best compression. Chrome & Firefox recommended.", "bmp": "BMP", "bmpDesc": "Uncompressed bitmap. Lossless, large file. Max compatibility.", "gif": "GIF", "gifDesc": "256-color format. Best for simple graphics, not photos.", "ico": "ICO", "icoDesc": "Windows icon format. Choose which sizes to include." };
const icoSize = { "label": "Output size:" };
const actions$2 = { "converting": "Converting…", "convertAll": "Convert All ({{count}})", "convert": "Convert", "download": "Download", "downloadAll": "Download All" };
const guide$1 = { "title": "Why Image Formats Matter (And How to Convert Images the Right Way)", "intro": `You try to upload an image… and suddenly: "File format not supported", image won't open on another device, file size is too large. These issues usually come down to one thing: image format.`, "whatIs": { "heading": "What Is Image Conversion?", "body": "Image conversion means changing an image from one format to another (for example PNG → JPG or HEIC → JPG). The image content stays the same, but file size, quality, and compatibility can change." }, "why": { "heading": "Why Do Image Formats Even Exist?", "body": "Different formats exist because they serve different purposes: performance (smaller file size), quality (more detail), and compatibility (works everywhere). One format rarely fits all situations." }, "whenToConvert": { "heading": "When Do You Need to Convert Images?", "item1": "Upload Errors: Some platforms accept only specific formats.", "item2": "File Size Too Large: Convert heavy formats like PNG to JPG/WebP to reduce size.", "item3": "Device Compatibility: Convert HEIC from iPhones to JPG for wider support.", "item4": "Web Optimization: Modern sites prefer WebP for smaller files and faster loading." }, "formats": { "heading": "Most Common Image Formats (Quick Guide)", "jpg": "JPEG (JPG) — Best for photos — small files, no transparency", "png": "PNG — High quality, supports transparency", "webp": "WebP — Modern — smaller size with good quality", "heic": "HEIC — Used by iPhones — efficient but limited support" }, "bestPractices": { "heading": "Best Practices for Converting Images", "item1": "Choose format by use case — WebP for web, JPG for photos, PNG for graphics.", "item2": "Avoid repeated conversions — always convert from the original.", "item3": "Understand lossy vs lossless: JPG is lossy, PNG is lossless.", "item4": "Balance quality and size — pick a middle ground.", "item5": "Use a reliable tool that preserves quality and supports many formats." }, "mistakes": { "heading": "Common Mistakes to Avoid", "item1": "Converting PNG → JPG (losing transparency)", "item2": "Repeatedly converting the same file", "item3": "Using the wrong format for the use case", "item4": "Ignoring quality settings", "item5": "Uploading huge images without optimization" }, "stepByStep": { "heading": "Step-by-Step: How to Convert an Image", "step1": "Upload your image", "step2": "Select output format", "step3": "Adjust quality settings (if available)", "step4": "Convert the image", "step5": "Download the result" }, "useCases": { "heading": "Real-World Use Cases", "item1": "Website optimization — PNG → WebP", "item2": "Social uploads — convert to supported formats", "item3": "Business docs — ensure cross-system compatibility", "item4": "iPhone photos — HEIC → JPG for sharing" }, "conclusion": "Image conversion isn't just technical — it's essential for compatibility, performance, and usability. By picking the right format you can avoid upload errors, improve speed, and keep good quality.", "ctaBtn": "Use the Image Converter Tool", "toolTitle": "What is Image Converter", "toolLead": "The Image Converter lets you convert images between common web formats — JPG, PNG, and WebP — directly in your browser. No file is ever sent to a server.", "outputFormatsTitle": "Supported Output Formats", "inputFormatsTitle": "Supported Input Formats", "inputFormatsBody": "You can upload JPG, PNG, WebP, AVIF, GIF, BMP, ICO, SVG, and TIFF files. Animated GIFs are converted using the first frame only.", "howItWorksTitle": "How conversion works", "howItWorksBody": "Your image is decoded in the browser, drawn onto an offscreen canvas, and exported to the target format. TIFF files are decoded using a lightweight JS library. For formats that don’t support transparency (JPG, BMP, GIF), transparent areas are filled with white.", "faqTitle": "FAQs", "faq": { "q1": "Does my image leave my browser?", "a1": "No. All processing is done locally; nothing is uploaded.", "q2": "Why is AVIF not working?", "a2": "AVIF encoding requires a modern browser; older browsers may not support it.", "q3": "What happens to transparency when converting to JPG, BMP, or GIF?", "a3": "Transparent areas are filled with white.", "q4": "Why does GIF look bad for photos?", "a4": "GIF supports only 256 colors; use PNG or WebP for photos." }, "introLead": "You try to upload an image… and suddenly:", "introBullet1": '"File format not supported"', "introBullet2": "Image won’t open on another device", "introBullet3": "File size is too large", "introConclusion": "These issues usually come down to one thing: image format. In this guide you’ll learn why formats exist, when to convert them, which format to choose, and how to convert without losing quality.", "asideTitle": "Quick Actions", "asideDesc": "Ready to convert? Jump straight to the tool." };
const imageConverter$1 = {
  hero: hero$2,
  tabs: tabs$1,
  hint: hint$1,
  details: details$2,
  howItWorks: howItWorks$2,
  dropZone,
  fileRow,
  popup,
  format,
  formats,
  icoSize,
  actions: actions$2,
  guide: guide$1
};
const hero$1 = { "title": "Image Rotator", "tagline": "Have you even been annoyed by rotated images? Look no further! Rotate one or more images 90°/180°/270° left or right. Preview the result instantly, then download your rotated image — or zip them all at once. No uploads, no server." };
const tabs = { "details": "Details", "howItWorks": "How it works" };
const dropzone = { "text": "Drag & drop images here, or click to browse", "sub": "Supports JPG, PNG, WebP, GIF, AVIF and more" };
const actions$1 = { "rotateLeft": "Rotate Left", "rotateRight": "Rotate Right", "applyAll": "Apply All", "download": "Download", "downloadAll": "Download All (ZIP)", "downloading": "Downloading…", "addMore": "+ Add More", "clearAll": "Clear All", "remove": "Remove" };
const hint = { "text": "Need to resize your image after rotating?", "btn": "Try Image Resizer" };
const details$1 = { "whatIs": { "heading": "What is Image Rotator", "body": "The Image Rotator lets you rotate one or multiple images by 90° increments directly in your browser. All processing is done locally — your files never leave your device." }, "howWorks": { "heading": "How rotation works", "body": "Each image is drawn to an offscreen canvas with the selected rotation applied. The canvas output is then exported in the original file format, preserving image quality. For 90°, 180° and 270° rotations, the canvas dimensions are automatically adjusted to ensure the output has the correct aspect ratio." }, "faq": { "heading": "FAQs", "q1": "Q: Are my images uploaded to a server?", "a1": "A: No — all rotation happens locally in your browser. Your images are never uploaded.", "q2": "Q: Can I rotate multiple images at once?", "a2": "A: Yes — drop multiple images, rotate each independently, then use Download All to get a ZIP.", "q3": "Q: Is the original image modified?", "a3": "A: No — the original file is unchanged. You download a new copy with the rotation baked in." } };
const howItWorks$1 = { "step1": "Upload one or more images by drag-and-drop or by browsing your files.", "step2": "Pick an image from the thumbnail strip and rotate left or right.", "step3": "Optionally enable Apply All to rotate every image together.", "step4": "Download the current image or download all rotated images as a ZIP file." };
const guide = { "title": "Image Rotator – Rotate Images Online Instantly Without Losing Quality", "lead": "Need to rotate a photo quickly? Our Image Rotator helps you rotate images online in seconds. Upload your image, choose the rotation angle, preview the result, and download instantly.", "intro2": "Whether you need to fix phone photo orientation, prepare images for social media, or adjust scanned documents, rotating an image should be simple and fast.", "why": { "heading": "🔄 Why Rotate an Image?", "body": "Images are often saved in the wrong orientation depending on the device used to capture them. Rotating helps correct alignment and improves presentation.", "reasons": "Common reasons people rotate images:", "item1": "📱 Fix sideways or upside-down photos", "item2": "🌐 Prepare images for websites or blogs", "item3": "📄 Correct scanned document orientation", "item4": "🛍️ Improve product photos for ecommerce", "item5": "📊 Adjust visuals for presentations or social media" }, "how": { "heading": "⚡ How to Rotate an Image Online", "intro": "Using an online image rotator is simple:", "step1": "📤 Upload your image file", "step2": "↩️ Select the rotation direction", "step3": "👀 Preview the rotated image", "step4": "⬇️ Download the updated image instantly" }, "formats": { "heading": "🧩 Supported Image Formats", "intro": "A good image rotator should support popular formats such as:", "item1": "🖼️ JPG / JPEG", "item2": "🎨 PNG", "item3": "🌐 WEBP", "item4": "🎞️ GIF", "item5": "🧱 BMP", "item6": "✏️ SVG", "item7": "📷 HEIC" }, "benefits": { "heading": "🚀 Benefits of Using an Online Image Rotator", "card1title": "No Software Installation", "card1desc": "Rotate photos directly from your browser without downloading editing programs.", "card2title": "Fast Processing", "card2desc": "Upload and rotate within seconds.", "card3title": "Privacy Friendly", "card3desc": "Browser-based tools often process files locally, reducing upload risks.", "card4title": "Works on Any Device", "card4desc": "Use on desktop, tablet, or mobile.", "card5title": "Easy for Everyone", "card5desc": "No editing experience required." }, "useCases": { "heading": "🎯 Common Use Cases", "intro": "Image rotation is useful across many scenarios:", "item1": "Correcting vacation photos", "item2": "Fixing portrait images from smartphones", "item3": "Rotating scanned screenshots", "item4": "Preparing marketplace product images", "item5": "Aligning graphics for presentations", "item6": "Social media content creation" }, "faq": { "heading": "❓ Frequently Asked Questions", "q1": "Does rotating an image reduce quality?", "a1": "Most modern image rotators preserve quality when rotating standard formats.", "q2": "Can I rotate images by custom angles?", "a2": "Some tools allow free-angle rotation beyond fixed 90° turns.", "q3": "Is image rotation free?", "a3": "Many browser-based image rotators are completely free to use.", "q4": "Do I need to create an account?", "a4": "Most online image rotators do not require registration." }, "whyUs": { "heading": "⭐ Why Use ThrjTech Image Rotator?", "body": "Your Image Rotator tool offers a simple workflow focused on speed and ease of use. Instead of opening heavy editing software, users can quickly rotate images online and download the corrected version immediately.", "greatFor": "Great for:", "item1": "⚡ Quick image corrections", "item2": "📅 Daily productivity tasks", "item3": "🧰 Lightweight photo editing", "item4": "👨‍💻 Casual and professional users" }, "relatedTools": { "heading": "🔗 Related Tools", "tool1": "🖼️ Image Resizer", "tool2": "✂️ Image Crop Tool", "tool3": "📦 Image Compressor", "tool4": "📄 PDF Compressor" }, "conclusion": { "heading": "Start Rotating Your Images Today", "body": "Fixing image orientation has never been easier. Use ThrjTech Image Rotator to rotate images online instantly — no installs, no sign-up required.", "ctaBtn": "Try the Image Rotator Tool →" } };
const imageRotator$1 = {
  hero: hero$1,
  tabs,
  dropzone,
  actions: actions$1,
  hint,
  details: details$1,
  howItWorks: howItWorks$1,
  guide
};
const hero = { "title": "Screen Recorder", "tagline": "Record your screen instantly — stays in your browser, private and free." };
const actions = { "start": "Start Recording", "stop": "Stop Recording", "download": "Download Recording" };
const status = { "recording": "Recording...", "idle": "Ready" };
const preview = { "title": "Preview" };
const warnings = { "browserUnsupported": "Your browser does not support screen capture. Try Chrome, Edge, or Firefox on desktop.", "desktopOnly": "Best used on desktop browsers." };
const details = { "whatIs": { "heading": "What is this?", "body": "A simple client-side screen recorder that saves recordings as WebM files in your browser." } };
const howItWorks = { "step1": "Click Start Recording and choose a screen, window, or tab.", "step2": "Stop Recording when finished; a preview and download link appear.", "step3": "Download the WebM file to your machine." };
const screenRecorder$1 = {
  hero,
  actions,
  status,
  preview,
  warnings,
  details,
  howItWorks
};
if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    lng: "en",
    fallbackLng: "en",
    ns: [
      "common",
      "home",
      "contact",
      "about",
      "privacy",
      "terms",
      "blogs",
      "pdfCompressor",
      "pdfMerger",
      "pdfConverter",
      "pdfSplitter",
      "jsonFormatter",
      "regexTester",
      "imageWatermarker",
      "imageResizer",
      "imageCollage",
      "imageCrop",
      "imageMemeGenerator",
      "imageConverter",
      "imageRotator",
      "screenRecorder"
    ],
    defaultNS: "common",
    resources: {
      en: {
        common,
        home,
        contact: contact$3,
        about,
        privacy,
        terms,
        blogs,
        pdfCompressor: pdfCompressor$1,
        pdfMerger: pdfMerger$1,
        pdfConverter: pdfConverter$1,
        pdfSplitter: pdfSplitter$1,
        jsonFormatter: jsonFormatter$1,
        regexTester: regexTester$1,
        imageWatermarker: imageWatermarker$1,
        imageResizer: imageResizer$1,
        imageCollage: imageCollage$1,
        imageCrop: imageCrop$1,
        imageMemeGenerator: imageMemeGenerator$1,
        imageConverter: imageConverter$1,
        imageRotator: imageRotator$1,
        screenRecorder: screenRecorder$1
      }
    },
    initImmediate: false,
    interpolation: {
      escapeValue: false
    }
  });
}
async function handleRequest(request, responseStatusCode, responseHeaders, routerContext, _loadContext) {
  const body = await renderToReadableStream(
    /* @__PURE__ */ jsx(ServerRouter, { context: routerContext, url: request.url }),
    {
      signal: request.signal,
      onError(error2) {
        console.error(error2);
        responseStatusCode = 500;
      }
    }
  );
  responseHeaders.set("Content-Type", "text/html");
  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest
}, Symbol.toStringTag, { value: "Module" }));
function GtagRouteTracker() {
  const location = useLocation();
  useEffect(() => {
    if (typeof window.gtag === "function") {
      window.gtag("config", "G-CTBF109J2G", {
        page_path: location.pathname + location.search
      });
    }
  }, [location]);
  return null;
}
const appCss = "/assets/App-DM0cT60Q.css";
const indexCss = "/assets/index-svV-Ygt7.css";
const links = () => [{
  rel: "stylesheet",
  href: appCss
}, {
  rel: "stylesheet",
  href: indexCss
}, {
  rel: "icon",
  type: "image/x-icon",
  href: "/images/main/favicon.ico"
}, {
  rel: "icon",
  type: "image/svg+xml",
  href: "/images/main/favicon.svg"
}];
function ScrollToTop() {
  const {
    pathname
  } = useLocation$1();
  useEffect(() => {
    try {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "auto"
      });
    } catch (_) {
    }
    const main = document.querySelector("main") || document.querySelector("#root") || document.body;
    if (main instanceof HTMLElement) {
      try {
        main.setAttribute("tabindex", "-1");
        main.focus({
          preventScroll: true
        });
      } catch (_) {
        try {
          main.focus();
        } catch (_2) {
        }
      }
    }
  }, [pathname]);
  return null;
}
const root = UNSAFE_withComponentProps(function Root() {
  return /* @__PURE__ */ jsxs("html", {
    lang: "en",
    children: [/* @__PURE__ */ jsxs("head", {
      children: [/* @__PURE__ */ jsx("meta", {
        charSet: "utf-8"
      }), /* @__PURE__ */ jsx("meta", {
        name: "viewport",
        content: "width=device-width, initial-scale=1.0"
      }), /* @__PURE__ */ jsx("script", {
        async: true,
        src: "https://www.googletagmanager.com/gtag/js?id=G-CTBF109J2G"
      }), /* @__PURE__ */ jsx("script", {
        dangerouslySetInnerHTML: {
          __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-CTBF109J2G',{send_page_view:false});gtag('event','page_view',{page_path:typeof window!=='undefined'?window.location.pathname+window.location.search:'/'});`
        }
      }), /* @__PURE__ */ jsx("script", {
        async: true,
        src: "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1683577108258942",
        crossOrigin: "anonymous"
      }), /* @__PURE__ */ jsx(Meta, {}), /* @__PURE__ */ jsx(Links, {})]
    }), /* @__PURE__ */ jsxs("body", {
      children: [/* @__PURE__ */ jsx(ScrollToTop, {}), /* @__PURE__ */ jsx(GtagRouteTracker, {}), /* @__PURE__ */ jsx(Outlet, {}), /* @__PURE__ */ jsx(ScrollRestoration, {}), /* @__PURE__ */ jsx(Scripts, {})]
    })]
  });
});
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: root,
  links
}, Symbol.toStringTag, { value: "Module" }));
const LANGS = [
  { code: "en", label: "English", flag: "/images/flags/gb.svg" },
  { code: "fr", label: "Français", flag: "/images/flags/fr.svg" },
  { code: "es", label: "Español", flag: "/images/flags/es.svg" },
  { code: "ko", label: "한국어", flag: "/images/flags/kr.svg" }
];
function LanguageSwitcher() {
  const { i18n: i18n2 } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const dropdownRef = useRef(null);
  const optionRefs = useRef([]);
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(max-width: 700px)").matches;
  });
  const currentLanguage = i18n2.resolvedLanguage || i18n2.language || "en";
  const current = LANGS.find(({ code }) => currentLanguage.startsWith(code)) || LANGS[0];
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  useEffect(() => {
    if (typeof window === "undefined") return void 0;
    const media = window.matchMedia("(max-width: 700px)");
    const handleChange = (e) => setIsMobile(e.matches);
    handleChange(media);
    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);
  useEffect(() => {
    if (!open || !isMobile) return;
    requestAnimationFrame(() => {
      dropdownRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
      optionRefs.current[0]?.focus({ preventScroll: true });
    });
  }, [open, isMobile]);
  return /* @__PURE__ */ jsxs("div", { className: `lang-switcher${open ? " open" : ""}`, ref, children: [
    /* @__PURE__ */ jsxs(
      "button",
      {
        className: "lang-trigger",
        onClick: () => setOpen((o) => !o),
        "aria-haspopup": "listbox",
        "aria-expanded": open,
        "aria-label": "Select language",
        children: [
          /* @__PURE__ */ jsx("img", { src: current.flag, alt: current.label, className: "lang-flag" }),
          /* @__PURE__ */ jsx("span", { className: "lang-trigger-label", children: current.label }),
          /* @__PURE__ */ jsx("span", { className: "lang-chevron", "aria-hidden": "true", children: "▾" })
        ]
      }
    ),
    open && /* @__PURE__ */ jsx("ul", { className: "lang-dropdown", role: "listbox", ref: dropdownRef, children: LANGS.map(({ code, label, flag }, index) => /* @__PURE__ */ jsxs(
      "li",
      {
        role: "option",
        "aria-selected": current.code === code,
        className: `lang-option${current.code === code ? " active" : ""}`,
        ref: (el) => {
          optionRefs.current[index] = el;
        },
        tabIndex: -1,
        onKeyDown: (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            i18n2.changeLanguage(code);
            setOpen(false);
          }
        },
        onClick: () => {
          i18n2.changeLanguage(code);
          setOpen(false);
        },
        children: [
          /* @__PURE__ */ jsx("img", { src: flag, alt: label, className: "lang-flag" }),
          /* @__PURE__ */ jsx("span", { children: label })
        ]
      },
      code
    )) })
  ] });
}
function Navbar() {
  const { t } = useTranslation("common");
  const [toolsOpen, setToolsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const toolsRef = useRef(null);
  useEffect(() => {
    const handler = (e) => {
      if (toolsRef.current && !toolsRef.current.contains(e.target)) {
        setToolsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  return /* @__PURE__ */ jsx("header", { className: "header", children: /* @__PURE__ */ jsxs("div", { className: "header-inner", children: [
    /* @__PURE__ */ jsxs(Link, { to: "/", className: "logo", children: [
      "THRJ",
      /* @__PURE__ */ jsx("span", { className: "logo-accent", children: "Tech" })
    ] }),
    /* @__PURE__ */ jsxs("button", { className: "hamburger", "aria-label": t("nav.openMenu"), onClick: () => setMobileMenuOpen((v) => !v), children: [
      /* @__PURE__ */ jsx("span", { className: "hamburger-bar" }),
      /* @__PURE__ */ jsx("span", { className: "hamburger-bar" }),
      /* @__PURE__ */ jsx("span", { className: "hamburger-bar" })
    ] }),
    /* @__PURE__ */ jsxs("nav", { className: `nav${mobileMenuOpen ? " nav-mobile-open" : ""}`, children: [
      /* @__PURE__ */ jsx(Link, { to: "/", className: "nav-link", onClick: () => setMobileMenuOpen(false), children: t("nav.home") }),
      /* @__PURE__ */ jsxs("div", { className: "dropdown", ref: toolsRef, children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            className: `dropbtn${toolsOpen ? " open" : ""}`,
            onClick: () => setToolsOpen((o) => !o),
            "aria-expanded": toolsOpen,
            "aria-haspopup": "true",
            children: [
              t("nav.tools"),
              " ▼"
            ]
          }
        ),
        toolsOpen && /* @__PURE__ */ jsxs("div", { className: "dropdown-content dropdown-columns", children: [
          /* @__PURE__ */ jsx("div", { className: "dropdown-col", children: /* @__PURE__ */ jsxs("div", { className: "dropdown-group", children: [
            /* @__PURE__ */ jsx("div", { className: "dropdown-group-title", children: t("nav.pdf") }),
            /* @__PURE__ */ jsx(Link, { to: "/pdf-compressor", onClick: () => {
              setToolsOpen(false);
              setMobileMenuOpen(false);
            }, children: t("nav.pdfCompressor") }),
            /* @__PURE__ */ jsx(Link, { to: "/pdf-merger", onClick: () => {
              setToolsOpen(false);
              setMobileMenuOpen(false);
            }, children: t("nav.pdfMerger") }),
            /* @__PURE__ */ jsx(Link, { to: "/pdf-converter", onClick: () => {
              setToolsOpen(false);
              setMobileMenuOpen(false);
            }, children: t("nav.pdfConverter") }),
            /* @__PURE__ */ jsx(Link, { to: "/pdf-splitter", onClick: () => {
              setToolsOpen(false);
              setMobileMenuOpen(false);
            }, children: t("nav.pdfSplitter") })
          ] }) }),
          /* @__PURE__ */ jsx("div", { className: "dropdown-col", children: /* @__PURE__ */ jsxs("div", { className: "dropdown-group", children: [
            /* @__PURE__ */ jsx("div", { className: "dropdown-group-title", children: t("nav.text") }),
            /* @__PURE__ */ jsx(Link, { to: "/json-formatter", onClick: () => {
              setToolsOpen(false);
              setMobileMenuOpen(false);
            }, children: t("nav.jsonFormatter") }),
            /* @__PURE__ */ jsx(Link, { to: "/regex-tester", onClick: () => {
              setToolsOpen(false);
              setMobileMenuOpen(false);
            }, children: t("nav.regexTester") })
          ] }) }),
          /* @__PURE__ */ jsx("div", { className: "dropdown-col", children: /* @__PURE__ */ jsxs("div", { className: "dropdown-group", children: [
            /* @__PURE__ */ jsx("div", { className: "dropdown-group-title", children: t("nav.image") }),
            /* @__PURE__ */ jsx(Link, { to: "/image-resizer", onClick: () => {
              setToolsOpen(false);
              setMobileMenuOpen(false);
            }, children: t("nav.imageResize") }),
            /* @__PURE__ */ jsx(Link, { to: "/image-watermarker", onClick: () => {
              setToolsOpen(false);
              setMobileMenuOpen(false);
            }, children: t("nav.imageWatermark") }),
            /* @__PURE__ */ jsx(Link, { to: "/image-collage", onClick: () => {
              setToolsOpen(false);
              setMobileMenuOpen(false);
            }, children: t("nav.imageCollage") }),
            /* @__PURE__ */ jsx(Link, { to: "/image-crop", onClick: () => {
              setToolsOpen(false);
              setMobileMenuOpen(false);
            }, children: t("nav.imageCrop") }),
            /* @__PURE__ */ jsx(Link, { to: "/image-meme-generator", onClick: () => {
              setToolsOpen(false);
              setMobileMenuOpen(false);
            }, children: t("nav.imageMemeGenerator") }),
            /* @__PURE__ */ jsx(Link, { to: "/image-converter", onClick: () => {
              setToolsOpen(false);
              setMobileMenuOpen(false);
            }, children: t("nav.imageConverter") }),
            /* @__PURE__ */ jsx(Link, { to: "/image-rotator", onClick: () => {
              setToolsOpen(false);
              setMobileMenuOpen(false);
            }, children: t("nav.imageRotator") })
          ] }) }),
          /* @__PURE__ */ jsx("div", { className: "dropdown-col", children: /* @__PURE__ */ jsxs("div", { className: "dropdown-group", children: [
            /* @__PURE__ */ jsx("div", { className: "dropdown-group-title", children: t("nav.video") }),
            /* @__PURE__ */ jsx(Link, { to: "/screen-recorder", onClick: () => {
              setToolsOpen(false);
              setMobileMenuOpen(false);
            }, children: t("nav.screenRecorder") })
          ] }) })
        ] })
      ] }),
      /* @__PURE__ */ jsx(Link, { to: "/blogs", className: "nav-link", onClick: () => setMobileMenuOpen(false), children: t("nav.blog") }),
      /* @__PURE__ */ jsx(Link, { to: "/contact", className: "nav-link", onClick: () => setMobileMenuOpen(false), children: t("nav.contactUs") }),
      /* @__PURE__ */ jsx(LanguageSwitcher, {})
    ] })
  ] }) });
}
function Footer() {
  const { t } = useTranslation("common");
  return /* @__PURE__ */ jsx("footer", { className: "footer", children: /* @__PURE__ */ jsxs("div", { className: "footer-inner", children: [
    /* @__PURE__ */ jsxs("p", { className: "footer-copy", children: [
      "© ",
      t("footer.copyright", { year: (/* @__PURE__ */ new Date()).getFullYear() })
    ] }),
    /* @__PURE__ */ jsxs("nav", { className: "footer-links", "aria-label": "Legal", children: [
      /* @__PURE__ */ jsx(Link, { to: "/about/us", className: "footer-link-btn", children: t("footer.aboutUs") }),
      /* @__PURE__ */ jsx("span", { className: "footer-link-sep", "aria-hidden": "true", children: "·" }),
      /* @__PURE__ */ jsx(Link, { to: "/about/policy", className: "footer-link-btn", children: t("footer.privacyPolicy") }),
      /* @__PURE__ */ jsx("span", { className: "footer-link-sep", "aria-hidden": "true", children: "·" }),
      /* @__PURE__ */ jsx(Link, { to: "/about/terms", className: "footer-link-btn", children: t("footer.termsOfService") })
    ] })
  ] }) });
}
const cards = [
  // PDF Compressor
  {
    key: "compressor",
    i18nKey: "pdfCompressor",
    icon: /* @__PURE__ */ jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", style: { width: 26, height: 26 }, children: [
      /* @__PURE__ */ jsx("path", { d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" }),
      /* @__PURE__ */ jsx("polyline", { points: "14 2 14 8 20 8" }),
      /* @__PURE__ */ jsx("line", { x1: "12", y1: "18", x2: "12", y2: "12" }),
      /* @__PURE__ */ jsx("line", { x1: "9", y1: "15", x2: "15", y2: "15" })
    ] }),
    title: "PDF Compressor",
    link: "/pdf-compressor",
    btn: "Open PDF Compressor",
    description: "Shrink your PDF files without sacrificing quality. Upload a document and download a smaller version in seconds — no account required, no watermarks.",
    features: [
      "Compress PDFs up to 90% smaller",
      "Adjustable compression levels (low, medium, high)",
      "Supports multi-page PDFs of any size",
      "100% free, no sign-up needed"
    ],
    screenshots: [
      {
        src: "/screenshots/compressor/pdf-compressor-01.png",
        alt: "Step 1 — Drag and drop your PDF file onto the upload area",
        caption: "1. Drag & drop or browse for your PDF"
      },
      {
        src: "/screenshots/compressor/pdf-compressor-02.png",
        alt: "Step 2 — File selected, ready to compress",
        caption: "2. Review the file, then hit Compress PDF"
      },
      {
        src: "/screenshots/compressor/pdf-compressor-03.png",
        alt: "Step 3 — File uploading to R2 storage with a progress bar",
        caption: "3. Securely uploads & compresses in seconds"
      },
      {
        src: "/screenshots/compressor/pdf-compressor-04.png",
        alt: "Step 4 — Compression complete, download your file",
        caption: "4. Download your compressed PDF"
      }
    ]
  },
  // PDF Merger
  {
    key: "merger",
    i18nKey: "pdfMerger",
    icon: /* @__PURE__ */ jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", style: { width: 26, height: 26 }, children: [
      /* @__PURE__ */ jsx("rect", { x: "3", y: "3", width: "7", height: "7", rx: "1.5" }),
      /* @__PURE__ */ jsx("rect", { x: "14", y: "3", width: "7", height: "7", rx: "1.5" }),
      /* @__PURE__ */ jsx("rect", { x: "14", y: "14", width: "7", height: "7", rx: "1.5" }),
      /* @__PURE__ */ jsx("rect", { x: "3", y: "14", width: "7", height: "7", rx: "1.5" }),
      /* @__PURE__ */ jsx("path", { d: "M7.5 7.5L16.5 16.5" })
    ] }),
    title: "PDF Merger",
    link: "/pdf-merger",
    btn: "Open PDF Merger",
    description: "Combine multiple PDF files into a single document in seconds. Drag, drop, and merge — no account required, no watermarks.",
    features: [
      "Merge unlimited PDFs for free",
      "Reorder files before merging",
      "No watermarks, no sign-up needed",
      "Fast, secure, and privacy-friendly",
      "Automatically compresses merged file to reduce size (Optional)"
    ],
    screenshots: [
      {
        src: "/screenshots/merger/merger-001.png",
        alt: "Step 1 — Drag and drop your PDF files onto the upload area",
        caption: "1. Drag & drop or browse for your PDFs"
      },
      {
        src: "/screenshots/merger/merger-002.png",
        alt: "Step 2 — Arrange the order of your files",
        caption: "2. Arrange the order of your files"
      },
      {
        src: "/screenshots/merger/merger-003.png",
        alt: "Step 3 — Click Merge PDF to combine files",
        caption: "3. Click Merge PDF to combine files"
      },
      {
        src: "/screenshots/merger/merger-004.png",
        alt: "Step 4 — Download your merged PDF",
        caption: "4. Download your merged PDF"
      }
    ]
  },
  // PDF Converter
  {
    key: "converter",
    i18nKey: "pdfConverter",
    icon: /* @__PURE__ */ jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", style: { width: 26, height: 26 }, children: [
      /* @__PURE__ */ jsx("path", { d: "M12 2v6" }),
      /* @__PURE__ */ jsx("path", { d: "M12 22v-6" }),
      /* @__PURE__ */ jsx("path", { d: "M4 12h16" }),
      /* @__PURE__ */ jsx("path", { d: "M7 7l-3 3 3 3" }),
      /* @__PURE__ */ jsx("path", { d: "M17 7l3 3-3 3" })
    ] }),
    title: "PDF Converter",
    link: "/pdf-converter",
    btn: "Open PDF Converter",
    description: "Convert PDF pages into JPG or PNG images quickly — upload, choose format, and download the results without signing up.",
    features: [
      "Convert PDF to JPG or PNG",
      "Fast, single-click conversions",
      "Preview and download converted images",
      "Temporary storage with automatic cleanup",
      "No account or watermarks"
    ],
    screenshots: [
      {
        src: "/screenshots/converter/PDF-converter001.png",
        alt: "Step 1 — Drag and drop your PDF file onto the upload area",
        caption: "1. Drag & drop or browse for your PDF"
      },
      {
        src: "/screenshots/converter/PDF-converter002.png",
        alt: "Step 2 — Select output format",
        caption: "2. Choose JPG or PNG"
      },
      {
        src: "/screenshots/converter/PDF-converter003.png",
        alt: "Step 3 — Conversion progress and preview",
        caption: "3. Start conversion and watch progress"
      },
      {
        src: "/screenshots/converter/PDF-converter004.png",
        alt: "Step 4 — Download your converted images",
        caption: "4. Download converted images to your device"
      }
    ]
  },
  // JSON Formatter
  {
    key: "json-formatter",
    i18nKey: "jsonFormatter",
    icon: /* @__PURE__ */ jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", style: { width: 26, height: 26 }, children: [
      /* @__PURE__ */ jsx("rect", { x: "3", y: "3", width: "7", height: "7", rx: "1.5" }),
      /* @__PURE__ */ jsx("rect", { x: "14", y: "3", width: "7", height: "7", rx: "1.5" }),
      /* @__PURE__ */ jsx("rect", { x: "14", y: "14", width: "7", height: "7", rx: "1.5" }),
      /* @__PURE__ */ jsx("rect", { x: "3", y: "14", width: "7", height: "7", rx: "1.5" }),
      /* @__PURE__ */ jsx("path", { d: "M8 8h8M8 16h8" })
    ] }),
    title: "JSON Formatter",
    link: "/json-formatter",
    btn: "Open JSON Formatter",
    description: "Quickly validate, format, and beautify your JSON data. Instantly see errors, get readable output, and copy or download the result.",
    features: [
      "Validate and format JSON instantly",
      "Paste, upload, or drag & drop JSON files",
      "Highlights errors with line numbers",
      "Download or copy formatted output"
    ],
    screenshots: [
      {
        src: "/screenshots/json-formatter/JSON_formatter001.png",
        alt: "Step 1 — Paste or upload your JSON data",
        caption: "1. Paste or upload your JSON data"
      },
      {
        src: "/screenshots/json-formatter/JSON_formatter002.png",
        alt: "Step 2 — Click Validate and Format JSON",
        caption: "2. Click Validate and Format JSON"
      },
      {
        src: "/screenshots/json-formatter/JSON_formatter003.png",
        alt: "Step 3 — Instantly see errors with line numbers if your JSON is invalid",
        caption: "3. Instantly see errors with line numbers if your JSON is invalid"
      },
      {
        src: "/screenshots/json-formatter/JSON_formatter004.png",
        alt: "Step 4 — Download or copy the beautified JSON",
        caption: "4. Download or copy the beautified JSON"
      }
    ]
  },
  // Image Watermarker
  {
    key: "image-watermarker",
    i18nKey: "imageWatermarker",
    icon: /* @__PURE__ */ jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", style: { width: 26, height: 26 }, children: [
      /* @__PURE__ */ jsx("rect", { x: "3", y: "3", width: "18", height: "18", rx: "4" }),
      /* @__PURE__ */ jsx("path", { d: "M8 12h8M12 8v8" })
    ] }),
    title: "Image Watermarker",
    link: "/image-watermarker",
    btn: "Open Image Watermarker",
    description: "Add a text or logo watermark to your images in seconds. Drag, drop, and download — all in your browser, no account required.",
    features: [
      "Add text or logo as watermark",
      "Preview before downloading",
      "Drag & drop image upload",
      "No watermarks or sign-up needed",
      "Works with PNG, JPG, and more"
    ],
    screenshots: [
      {
        src: "/screenshots/watermarker/watermarker001.png",
        alt: "Step 1 — Drag and drop your image onto the upload area",
        caption: "1. Drag & drop or browse for your image"
      },
      {
        src: "/screenshots/watermarker/watermarker002.png",
        alt: "Step 2 — Enter watermark text or upload logo",
        caption: "2. Enter watermark text or upload logo"
      },
      {
        src: "/screenshots/watermarker/watermarker003.png",
        alt: "Step 3 — Preview the watermarked image",
        caption: "3. Preview the watermarked image"
      },
      {
        src: "/screenshots/watermarker/watermarker004.png",
        alt: "Step 4 — Download your watermarked image",
        caption: "4. Download your watermarked image"
      }
    ]
  },
  // Image Resizer (new last card)
  {
    key: "image-resizer",
    i18nKey: "imageResizer",
    icon: /* @__PURE__ */ jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", style: { width: 26, height: 26 }, children: [
      /* @__PURE__ */ jsx("rect", { x: "3", y: "3", width: "18", height: "18", rx: "4" }),
      /* @__PURE__ */ jsx("path", { d: "M8 8h8M8 16h8M8 12h8" })
    ] }),
    title: "Image Resizer",
    link: "/image-resizer",
    btn: "Open Image Resizer",
    description: "Resize your images by percentage or by custom dimensions. Fast, privacy-friendly, and works entirely in your browser — no uploads, no accounts, no watermarks.",
    features: [
      "Resize by percentage or dimensions",
      "Maintains aspect ratio (optional)",
      "Works with PNG, JPG, and more",
      "No watermarks, no sign-up needed",
      "Preview before downloading"
    ],
    screenshots: [
      {
        src: "/screenshots/resizer/Image-resizer001.png",
        alt: "Step 1 — Drag and drop your image onto the upload area",
        caption: "1. Drag & drop or browse for your image"
      },
      {
        src: "/screenshots/resizer/Image-resizer002.png",
        alt: "Step 2 — Choose resize mode and set dimensions or zoom in/out",
        caption: "2. Choose resize mode and set dimensions or zoom in/out"
      },
      {
        src: "/screenshots/resizer/Image-resizer003.png",
        alt: "Step 3 — Preview the resized image",
        caption: "3. Preview the resized image"
      },
      {
        src: "/screenshots/resizer/Image-resizer004.png",
        alt: "Step 4 — Download your resized image",
        caption: "4. Download your resized image"
      }
    ]
  },
  // Image Collage
  {
    key: "image-collage",
    i18nKey: "imageCollage",
    icon: /* @__PURE__ */ jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", style: { width: 26, height: 26 }, children: [
      /* @__PURE__ */ jsx("rect", { x: "3", y: "3", width: "8", height: "8", rx: "1.5" }),
      /* @__PURE__ */ jsx("rect", { x: "13", y: "3", width: "8", height: "8", rx: "1.5" }),
      /* @__PURE__ */ jsx("rect", { x: "3", y: "13", width: "8", height: "8", rx: "1.5" }),
      /* @__PURE__ */ jsx("rect", { x: "13", y: "13", width: "8", height: "8", rx: "1.5" })
    ] }),
    title: "Image Collage",
    link: "/image-collage",
    btn: "Open Image Collage",
    description: "Arrange multiple images into a clean grid collage instantly. Drag, drop, reorder, and download — all in your browser, no account required, no watermarks.",
    features: [
      "Combine multiple images into a grid collage",
      "Drag & drop to upload and reorder images",
      "Auto-expands grid to fit all your images",
      "Set custom output width and height",
      "No watermarks, no sign-up needed"
    ],
    screenshots: [
      {
        src: "/screenshots/collage/image-collage001.png",
        alt: "Step 1 — Drag and drop your images onto the upload area",
        caption: "1. Drag & drop or browse for your images"
      },
      {
        src: "/screenshots/collage/image-collage002.png",
        alt: "Step 2 — Reorder images and set grid columns and rows",
        caption: "2. Arrange images and set the grid layout"
      },
      {
        src: "/screenshots/collage/image-collage003.png",
        alt: "Step 3 — Preview the collage",
        caption: "3. Preview your collage instantly"
      },
      {
        src: "/screenshots/collage/image-collage004.png",
        alt: "Step 4 — Download your finished collage",
        caption: "4. Download your finished collage"
      }
    ]
  },
  {
    key: "image-converter",
    i18nKey: "imageConverter",
    icon: /* @__PURE__ */ jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", style: { width: 26, height: 26 }, children: [
      /* @__PURE__ */ jsx("polyline", { points: "17 1 21 5 17 9" }),
      /* @__PURE__ */ jsx("path", { d: "M3 11V9a4 4 0 0 1 4-4h14" }),
      /* @__PURE__ */ jsx("polyline", { points: "7 23 3 19 7 15" }),
      /* @__PURE__ */ jsx("path", { d: "M21 13v2a4 4 0 0 1-4 4H3" })
    ] }),
    title: "Image Converter",
    link: "/image-converter",
    btn: "Open Image Converter",
    description: "Convert images between JPG, PNG, and WebP instantly in your browser. Drop your image, choose a format, and download — no uploads, no account required.",
    features: ["Convert between JPG, PNG, and WebP", "Auto-detects input format", "Transparent PNGs get white background on JPG export", "100% local — files never leave your browser"],
    screenshots: [
      {
        src: "/screenshots/image-converter/image-converter-001.png",
        alt: "Step 1 — Drag and drop your images onto the upload area",
        caption: "1. Drag & drop or browse for your images"
      },
      {
        src: "/screenshots/image-converter/image-converter-002.png",
        alt: "Step 2 — Choose output format",
        caption: "2. Choose output format (JPG, PNG, or WebP)"
      },
      {
        src: "/screenshots/image-converter/image-converter-003.png",
        alt: "Step 3 — Preview the converted image",
        caption: "3. Preview your converted image"
      },
      {
        src: "/screenshots/image-converter/image-converter-004.png",
        alt: "Optional — Convert multiple images at once",
        caption: "Optional — Convert multiple images at once"
      }
    ]
  }
];
function RotatingCards() {
  const { t } = useTranslation("home");
  const [active, setActive] = useState(0);
  const [next, setNext] = useState(null);
  const [direction, setDirection] = useState(1);
  const [isSliding, setIsSliding] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [modalImg, setModalImg] = useState(null);
  const timeoutRef = useRef();
  useEffect(() => {
    if (isHovered) return;
    timeoutRef.current = setTimeout(() => {
      slideTo((active + 1) % cards.length, 1);
    }, 7e3);
    return () => clearTimeout(timeoutRef.current);
  }, [active, isHovered]);
  function slideTo(idx, dir) {
    if (idx === active || isSliding) return;
    setDirection(dir);
    setNext(idx);
    setIsSliding(true);
    setTimeout(() => {
      setActive(idx);
      setNext(null);
      setIsSliding(false);
    }, 700);
  }
  const handleDotClick = (i) => {
    if (i !== active) {
      slideTo(i, i > active ? 1 : -1);
    }
  };
  const handleScreenshotClick = (src, alt) => {
    setModalImg({ src, alt });
  };
  const handleModalClose = () => {
    setModalImg(null);
  };
  const renderCard = (idx) => {
    const card = cards[idx];
    const i18nKey = card.i18nKey || card.key;
    return /* @__PURE__ */ jsxs("div", { className: "rotator-card", children: [
      /* @__PURE__ */ jsxs("div", { className: "tool-card", children: [
        /* @__PURE__ */ jsx("div", { className: "tool-icon", "aria-hidden": "true", children: card.icon }),
        /* @__PURE__ */ jsxs("div", { className: "tool-content", children: [
          /* @__PURE__ */ jsx("h3", { className: "tool-title", children: /* @__PURE__ */ jsx(Link, { to: card.link, children: t(`cards.${i18nKey}.title`) }) }),
          /* @__PURE__ */ jsx("p", { className: "tool-description", children: t(`cards.${i18nKey}.description`) }),
          /* @__PURE__ */ jsx("ul", { className: "feature-list", children: card.features.map((_, i) => /* @__PURE__ */ jsxs("li", { children: [
            /* @__PURE__ */ jsx("span", { className: "feature-check", "aria-hidden": "true", children: "✓" }),
            t(`cards.${i18nKey}.feature${i + 1}`)
          ] }, i)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "screenshots-section", children: [
        /* @__PURE__ */ jsx("h3", { className: "screenshots-heading", children: t("cards.howItWorks") }),
        /* @__PURE__ */ jsx("div", { className: "screenshots-grid", children: card.screenshots.map((s, i) => /* @__PURE__ */ jsxs("figure", { className: "screenshot-item", children: [
          /* @__PURE__ */ jsx(
            "img",
            {
              src: s.src,
              alt: s.alt,
              className: "screenshot-img",
              loading: "lazy",
              style: { cursor: "pointer" },
              onClick: () => handleScreenshotClick(s.src, s.alt),
              onError: (e) => {
                e.currentTarget.classList.add("screenshot-missing");
              }
            }
          ),
          /* @__PURE__ */ jsx("figcaption", { children: t(`cards.${i18nKey}.step${i + 1}`) })
        ] }, i)) })
      ] })
    ] }, card.key);
  };
  let cardsToShow = [active];
  let slideIndex = 0;
  if (next !== null) {
    if (direction === 1) {
      cardsToShow = [active, next];
      slideIndex = isSliding ? -1 : 0;
    } else {
      cardsToShow = [next, active];
      slideIndex = isSliding ? 0 : -1;
    }
  }
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: "rotator",
      onMouseEnter: () => setIsHovered(true),
      onMouseLeave: () => setIsHovered(false),
      children: [
        /* @__PURE__ */ jsx("div", { className: "rotator-controls", children: cards.map((c, i) => /* @__PURE__ */ jsx(
          "button",
          {
            className: i === active ? "rotator-dot active" : "rotator-dot",
            "aria-label": t(`cards.${c.i18nKey || c.key}.title`),
            onClick: () => handleDotClick(i)
          },
          c.key
        )) }),
        /* @__PURE__ */ jsxs("div", { className: "rotator-slider true-slide", children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "rotator-slide-track",
              style: {
                display: "flex",
                width: "100%",
                height: "100%",
                overflow: "hidden",
                position: "relative"
              },
              children: /* @__PURE__ */ jsx(
                "div",
                {
                  style: {
                    display: "flex",
                    flexDirection: "row",
                    width: `${cardsToShow.length * 100}%`,
                    height: "100%",
                    transform: `translateX(${slideIndex * 100}%)`,
                    transition: isSliding ? "transform 0.7s cubic-bezier(0.4,0,0.2,1)" : "none"
                  },
                  children: cardsToShow.map((idx, i) => /* @__PURE__ */ jsx("div", { style: { width: "100%", flexShrink: 0, height: "100%" }, children: renderCard(idx) }, i + "-" + idx))
                }
              )
            }
          ),
          modalImg && /* @__PURE__ */ jsx("div", { className: "screenshot-modal-overlay", onClick: handleModalClose, children: /* @__PURE__ */ jsxs("div", { className: "screenshot-modal-content", onClick: (e) => e.stopPropagation(), children: [
            /* @__PURE__ */ jsx("button", { className: "screenshot-modal-close", onClick: handleModalClose, "aria-label": "Close screenshot", children: "✕" }),
            /* @__PURE__ */ jsx("img", { src: modalImg.src, alt: modalImg.alt, className: "screenshot-modal-img" })
          ] }) })
        ] })
      ]
    }
  );
}
function Seo({ title: title2, description }) {
  useEffect(() => {
    if (title2) document.title = title2;
    if (description) {
      let meta2 = document.querySelector('meta[name="description"]');
      if (!meta2) {
        meta2 = document.createElement("meta");
        meta2.name = "description";
        document.head.appendChild(meta2);
      }
      meta2.content = description;
    }
  }, [title2, description]);
  return null;
}
async function uploadToR2(file, tool = "pdf-compressor") {
  const res = await fetch("/r2-presign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ filename: file.name, contentType: file.type || "application/pdf", tool })
  });
  if (!res.ok) {
    throw new Error(`Failed to get presigned URL: ${res.status} ${res.statusText}`);
  }
  const body = await res.json();
  const { presignedUrl, key } = body;
  const response = await fetch(presignedUrl, {
    method: "PUT",
    body: file,
    headers: { "Content-Type": file.type || "application/pdf" }
  });
  if (!response.ok) {
    throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
  }
  const result2 = { presignedUrl, key };
  if (tool === "pdf-compressor" && body.pdfCompressorBackendUrl) {
    result2.pdfCompressorBackendUrl = body.pdfCompressorBackendUrl;
  }
  if (tool === "pdf-merger" && body.pdfMergerBackendUrl) {
    result2.pdfMergerBackendUrl = body.pdfMergerBackendUrl;
  }
  if (tool === "pdf-converter" && body.pdfConverterBackendUrl) {
    result2.pdfConverterBackendUrl = body.pdfConverterBackendUrl;
  }
  if (tool === "pdf-splitter" && body.pdfSplitterBackendUrl) {
    result2.pdfSplitterBackendUrl = body.pdfSplitterBackendUrl;
  }
  if (body.backendUrl) {
    result2.backendUrl = body.backendUrl;
  }
  return result2;
}
function usePdfCompressor() {
  const [file, setFile] = useState(null);
  const [status2, setStatus] = useState("idle");
  const [progress2, setProgress] = useState(0);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [downloadName, setDownloadName] = useState("");
  const [errorMsg2, setErrorMsg] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const handleFile = (f) => {
    if (!f) return;
    if (f.type !== "application/pdf") {
      setErrorMsg("Please upload a valid PDF file.");
      return;
    }
    setFile(f);
    setOriginalSize(f.size);
    setStatus("idle");
    setErrorMsg("");
    setDownloadUrl("");
    setDownloadName("");
  };
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0]);
  }, []);
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);
  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);
  const handleFileInput = (e) => {
    handleFile(e.target.files[0]);
  };
  const handleCompress = async (option = "BALANCED") => {
    if (!file) return;
    try {
      setStatus("uploading");
      setProgress(20);
      setErrorMsg("");
      const { key: objectKey, pdfCompressorBackendUrl } = await uploadToR2(file, "pdf-compressor");
      setProgress(60);
      setStatus("compressing");
      const backendUrl = pdfCompressorBackendUrl || void 0;
      if (!backendUrl) {
        throw new Error("PDF compressor backend URL is not configured.");
      }
      const response = await fetch(backendUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ objectKey, option })
      });
      if (!response.ok) {
        throw new Error(`Compression failed: ${response.status} ${response.statusText}`);
      }
      const { presignedUrl } = await response.json();
      if (!presignedUrl) {
        throw new Error("No presigned URL returned from server.");
      }
      const downloadResponse = await fetch(presignedUrl);
      if (!downloadResponse.ok) {
        throw new Error(`Failed to fetch compressed file: ${downloadResponse.status} ${downloadResponse.statusText}`);
      }
      const blob = await downloadResponse.blob();
      const blobUrl = URL.createObjectURL(blob);
      const name = file.name.replace(/\.pdf$/i, "_compressed.pdf");
      setDownloadUrl(blobUrl);
      setDownloadName(name);
      setCompressedSize(blob.size);
      setProgress(100);
      setStatus("done");
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      setErrorMsg(err.message || "An unexpected error occurred.");
      setStatus("error");
    }
  };
  const handleReset = () => {
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setFile(null);
    setStatus("idle");
    setProgress(0);
    setOriginalSize(0);
    setCompressedSize(0);
    setDownloadUrl("");
    setDownloadName("");
    setErrorMsg("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  return {
    file,
    status: status2,
    progress: progress2,
    originalSize,
    compressedSize,
    downloadUrl,
    downloadName,
    errorMsg: errorMsg2,
    isDragging,
    fileInputRef,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    handleFileInput,
    handleCompress,
    handleReset
  };
}
function formatSize$2(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
function CustomSelect({ value, onChange, options = [], className = "" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const selected = options.find((o) => o.value === value) || null;
  useEffect(() => {
    function onDocClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);
  const handleSelect = (v) => {
    onChange(v);
    setOpen(false);
  };
  return /* @__PURE__ */ jsxs("div", { className: `custom-select ${className}`, ref, children: [
    /* @__PURE__ */ jsxs(
      "button",
      {
        type: "button",
        className: "custom-select-button",
        "aria-haspopup": "listbox",
        "aria-expanded": open,
        onClick: () => setOpen((o) => !o),
        children: [
          /* @__PURE__ */ jsx("span", { className: "custom-select-value", children: selected ? selected.label : String(value).toUpperCase() }),
          /* @__PURE__ */ jsx("span", { className: "custom-select-caret", "aria-hidden": "true", children: "▾" })
        ]
      }
    ),
    open && /* @__PURE__ */ jsx("ul", { className: "custom-select-list", role: "listbox", children: options.map((opt) => /* @__PURE__ */ jsx(
      "li",
      {
        role: "option",
        "aria-selected": opt.value === value,
        className: `custom-select-item ${opt.value === value ? "selected" : ""}`,
        onClick: () => handleSelect(opt.value),
        children: opt.label
      },
      opt.value
    )) })
  ] });
}
function PdfCompressorView({
  file,
  status: status2,
  progress: progress2,
  originalSize,
  compressedSize,
  downloadUrl,
  downloadName,
  errorMsg: errorMsg2,
  isDragging,
  fileInputRef,
  handleDrop,
  handleDragOver,
  handleDragLeave,
  handleFileInput,
  handleCompress,
  handleReset
}) {
  const { t } = useTranslation("pdfCompressor");
  const [openPanel, setOpenPanel] = useState("");
  const [qualityOption, setQualityOption] = useState("BALANCED");
  const togglePanel = (panel) => {
    setOpenPanel((prev) => prev === panel ? "" : panel);
  };
  const guideListStyle = { marginLeft: 0, paddingLeft: 0, listStylePosition: "inside" };
  const navigate = useNavigate();
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    status2 !== "done" && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs("div", { className: "hero-section", children: [
        /* @__PURE__ */ jsx("h1", { className: "hero-title", children: t("hero.title") }),
        /* @__PURE__ */ jsxs("p", { className: "hero-tagline", children: [
          t("hero.tagline"),
          " ",
          /* @__PURE__ */ jsx(Link, { to: "/blogs/pdf-compressor-guide", children: t("hero.blogLink") })
        ] }),
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: 12, background: "#fffbe6", border: "1px solid #ffe58f", borderRadius: 8, padding: "10px 16px", marginBottom: 12 }, children: [
          /* @__PURE__ */ jsx("span", { style: { fontSize: 18 }, children: "🖼️" }),
          /* @__PURE__ */ jsx("span", { style: { flex: 1, fontSize: 14, color: "#7c6000" }, children: t("hint.text") }),
          /* @__PURE__ */ jsx(
            Link,
            {
              to: "/pdf-splitter",
              style: { whiteSpace: "nowrap", background: "#faad14", color: "#fff", border: "none", borderRadius: 6, padding: "6px 14px", fontSize: 13, fontWeight: 600, textDecoration: "none", cursor: "pointer" },
              children: t("hint.btn")
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "details-controls", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              className: `tab-btn ${openPanel === "details" ? "active" : ""}`,
              onClick: () => togglePanel("details"),
              "aria-expanded": openPanel === "details",
              type: "button",
              children: t("tabs.details")
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              className: `tab-btn ${openPanel === "howitworks" ? "active" : ""}`,
              onClick: () => togglePanel("howitworks"),
              "aria-expanded": openPanel === "howitworks",
              type: "button",
              children: t("tabs.howItWorks")
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: `shared-collapse${!openPanel ? " panel-hidden" : ""}`, children: [
          /* @__PURE__ */ jsxs("div", { className: openPanel !== "details" ? "tool-details-open panel-hidden" : "tool-details-open", children: [
            /* @__PURE__ */ jsx("h3", { children: t("details.whatIsCompression.heading") }),
            /* @__PURE__ */ jsx("p", { children: t("details.whatIsCompression.body") }),
            /* @__PURE__ */ jsx("h3", { children: t("details.howWorks.heading") }),
            /* @__PURE__ */ jsx("p", { children: t("details.howWorks.body") }),
            /* @__PURE__ */ jsx("h3", { children: t("details.tradeoffs.heading") }),
            /* @__PURE__ */ jsxs("ul", { children: [
              /* @__PURE__ */ jsx("li", { children: t("details.tradeoffs.item1") }),
              /* @__PURE__ */ jsx("li", { children: t("details.tradeoffs.item2") }),
              /* @__PURE__ */ jsx("li", { children: t("details.tradeoffs.item3") })
            ] }),
            /* @__PURE__ */ jsx("h3", { children: t("details.practical.heading") }),
            /* @__PURE__ */ jsxs("ul", { children: [
              /* @__PURE__ */ jsx("li", { children: t("details.practical.item1") }),
              /* @__PURE__ */ jsx("li", { children: t("details.practical.item2") }),
              /* @__PURE__ */ jsx("li", { children: t("details.practical.item3") })
            ] }),
            /* @__PURE__ */ jsx("h3", { children: t("details.whatItDoes.heading") }),
            /* @__PURE__ */ jsxs("ul", { children: [
              /* @__PURE__ */ jsx("li", { children: t("details.whatItDoes.item1") }),
              /* @__PURE__ */ jsx("li", { children: t("details.whatItDoes.item2") }),
              /* @__PURE__ */ jsx("li", { children: t("details.whatItDoes.item3") })
            ] }),
            /* @__PURE__ */ jsx("h3", { children: t("details.usefulWhen.heading") }),
            /* @__PURE__ */ jsxs("ul", { children: [
              /* @__PURE__ */ jsx("li", { children: t("details.usefulWhen.item1") }),
              /* @__PURE__ */ jsx("li", { children: t("details.usefulWhen.item2") }),
              /* @__PURE__ */ jsx("li", { children: t("details.usefulWhen.item3") })
            ] }),
            /* @__PURE__ */ jsx("h3", { children: t("details.comparison.heading") }),
            /* @__PURE__ */ jsxs("ul", { children: [
              /* @__PURE__ */ jsx("li", { children: t("details.comparison.item1") }),
              /* @__PURE__ */ jsx("li", { children: t("details.comparison.item2") }),
              /* @__PURE__ */ jsx("li", { children: t("details.comparison.item3") })
            ] }),
            /* @__PURE__ */ jsx("h3", { children: t("details.privacy.heading") }),
            /* @__PURE__ */ jsx("p", { children: t("details.privacy.body") }),
            /* @__PURE__ */ jsx("h3", { children: t("details.whenToUse.heading") }),
            /* @__PURE__ */ jsx("p", { children: t("details.whenToUse.body") }),
            /* @__PURE__ */ jsx("h3", { children: t("details.faq.heading") }),
            /* @__PURE__ */ jsxs("ul", { children: [
              /* @__PURE__ */ jsxs("li", { children: [
                /* @__PURE__ */ jsx("strong", { children: t("details.faq.q1") }),
                " ",
                t("details.faq.a1")
              ] }),
              /* @__PURE__ */ jsxs("li", { children: [
                /* @__PURE__ */ jsx("strong", { children: t("details.faq.q2") }),
                " ",
                t("details.faq.a2")
              ] }),
              /* @__PURE__ */ jsxs("li", { children: [
                /* @__PURE__ */ jsx("strong", { children: t("details.faq.q3") }),
                " ",
                t("details.faq.a3")
              ] }),
              /* @__PURE__ */ jsxs("li", { children: [
                /* @__PURE__ */ jsx("strong", { children: t("details.faq.q4") }),
                " ",
                t("details.faq.a4")
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: openPanel !== "howitworks" ? "tool-howitworks-open panel-hidden" : "tool-howitworks-open", children: /* @__PURE__ */ jsxs("ol", { style: { margin: 0, paddingLeft: "1rem" }, children: [
            /* @__PURE__ */ jsxs("li", { style: { marginBottom: "0.75rem" }, children: [
              /* @__PURE__ */ jsx("img", { src: "/screenshots/compressor/pdf-compressor-01.png", alt: "Step 1", className: "how-img" }),
              /* @__PURE__ */ jsx("p", { children: t("howItWorks.step1") })
            ] }),
            /* @__PURE__ */ jsxs("li", { style: { marginBottom: "0.75rem" }, children: [
              /* @__PURE__ */ jsx("img", { src: "/screenshots/compressor/pdf-compressor-02.png", alt: "Step 2", className: "how-img" }),
              /* @__PURE__ */ jsx("p", { children: t("howItWorks.step2") })
            ] }),
            /* @__PURE__ */ jsxs("li", { style: { marginBottom: "0.75rem" }, children: [
              /* @__PURE__ */ jsx("img", { src: "/screenshots/compressor/pdf-compressor-03.png", alt: "Step 3", className: "how-img" }),
              /* @__PURE__ */ jsx("p", { children: t("howItWorks.step3") })
            ] }),
            /* @__PURE__ */ jsxs("li", { children: [
              /* @__PURE__ */ jsx("img", { src: "/screenshots/compressor/pdf-compressor-04.png", alt: "Step 4", className: "how-img" }),
              /* @__PURE__ */ jsx("p", { children: t("howItWorks.step4") })
            ] })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "hero-badges", children: [
          /* @__PURE__ */ jsx("span", { className: "hero-badge", children: t("badges.instant") }),
          /* @__PURE__ */ jsx("span", { className: "hero-badge", children: t("badges.secure") }),
          /* @__PURE__ */ jsx("span", { className: "hero-badge", children: t("badges.autoDeleted") })
        ] })
      ] }),
      /* @__PURE__ */ jsx(
        "div",
        {
          className: `drop-zone${isDragging ? " dragging" : ""}${file ? " has-file" : ""}`,
          onDrop: handleDrop,
          onDragOver: handleDragOver,
          onDragLeave: handleDragLeave,
          children: !file ? /* @__PURE__ */ jsxs("label", { className: "drop-content", htmlFor: "file-input", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                ref: fileInputRef,
                id: "file-input",
                type: "file",
                accept: "application/pdf",
                className: "file-input",
                onChange: handleFileInput
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "drop-icon", children: "📂" }),
            /* @__PURE__ */ jsx("p", { className: "drop-text", children: t("dropZone.text") }),
            /* @__PURE__ */ jsx("p", { className: "drop-sub", children: t("dropZone.or") }),
            /* @__PURE__ */ jsx("span", { className: "btn btn-outline", children: t("dropZone.browse") })
          ] }) : /* @__PURE__ */ jsxs("div", { className: "file-info", children: [
            /* @__PURE__ */ jsx("div", { className: "file-icon", children: "📄" }),
            /* @__PURE__ */ jsxs("div", { className: "file-details", children: [
              /* @__PURE__ */ jsx("span", { className: "file-name", children: file.name }),
              /* @__PURE__ */ jsx("span", { className: "file-size", children: formatSize$2(originalSize) })
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                className: "remove-btn",
                onClick: handleReset,
                title: t("dropZone.removeTitle"),
                children: "✕"
              }
            )
          ] })
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "quality-controls", children: [
        /* @__PURE__ */ jsx("label", { className: "quality-label", children: t("quality.label") }),
        /* @__PURE__ */ jsx("div", { className: "quality-select-wrap", children: /* @__PURE__ */ jsx(
          CustomSelect,
          {
            className: "wide",
            value: qualityOption,
            onChange: setQualityOption,
            options: [
              { value: "HQ", label: t("quality.hq") },
              { value: "BALANCED", label: t("quality.balanced") },
              { value: "MAX", label: t("quality.max") }
            ]
          }
        ) })
      ] }),
      errorMsg2 && /* @__PURE__ */ jsx("p", { className: "error-msg", children: errorMsg2 }),
      file && status2 === "idle" && /* @__PURE__ */ jsx("button", { className: "btn btn-primary compress-btn", onClick: () => handleCompress(qualityOption), children: t("compressBtn") }),
      (status2 === "uploading" || status2 === "compressing") && /* @__PURE__ */ jsxs("div", { className: "progress-section", children: [
        /* @__PURE__ */ jsx("div", { className: "progress-label", children: status2 === "uploading" ? t("progress.uploading") : t("progress.compressing") }),
        /* @__PURE__ */ jsx("div", { className: "progress-bar", children: /* @__PURE__ */ jsx("div", { className: "progress-fill", style: { width: `${progress2}%` } }) })
      ] })
    ] }),
    status2 === "done" && /* @__PURE__ */ jsxs("div", { className: "result-section", children: [
      /* @__PURE__ */ jsx("div", { className: "result-icon", children: t("result.icon") }),
      /* @__PURE__ */ jsx("h2", { className: "result-title", children: t("result.title") }),
      /* @__PURE__ */ jsxs("div", { className: "size-comparison", children: [
        /* @__PURE__ */ jsxs("div", { className: "size-row", children: [
          /* @__PURE__ */ jsx("span", { className: "size-col-label", children: t("result.originalLabel") }),
          /* @__PURE__ */ jsx("span", { className: "size-col-label", children: t("result.sizeLabel") })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "size-row size-row--data", children: [
          /* @__PURE__ */ jsx("span", { className: "size-col-value", children: file.name }),
          /* @__PURE__ */ jsx("span", { className: "size-col-value", children: formatSize$2(originalSize) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "size-row size-row--spacer" }),
        /* @__PURE__ */ jsxs("div", { className: "size-row", children: [
          /* @__PURE__ */ jsx("span", { className: "size-col-label", children: t("result.compressedLabel") }),
          /* @__PURE__ */ jsx("span", { className: "size-col-label", children: t("result.sizeLabel") })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "size-row size-row--data", children: [
          /* @__PURE__ */ jsx("span", { className: "size-col-value size-col-value--compressed", children: downloadName }),
          /* @__PURE__ */ jsx("span", { className: "size-col-value size-col-value--compressed", children: formatSize$2(compressedSize) })
        ] })
      ] }),
      /* @__PURE__ */ jsx(
        "a",
        {
          className: "btn btn-primary",
          href: downloadUrl,
          download: downloadName,
          target: "_blank",
          rel: "noopener noreferrer",
          children: t("result.download")
        }
      ),
      /* @__PURE__ */ jsx("button", { className: "btn btn-ghost", onClick: handleReset, children: t("result.another") })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "note", children: [
      /* @__PURE__ */ jsx("span", { className: "note-icon", children: "⚠️" }),
      t("note")
    ] }),
    /* @__PURE__ */ jsx("section", { className: "tool-guide", style: { marginTop: 28 }, children: /* @__PURE__ */ jsxs("div", { style: { maxWidth: 820, margin: "0 auto", padding: "12px 6px", color: "#222", lineHeight: 1.6 }, children: [
      /* @__PURE__ */ jsx("h2", { style: { fontSize: 22, marginBottom: 6 }, children: t("guide.title") }),
      /* @__PURE__ */ jsx("p", { children: t("guide.intro") }),
      /* @__PURE__ */ jsx("br", {}),
      /* @__PURE__ */ jsx("h3", { style: { fontSize: 16, marginTop: 6 }, children: t("guide.whyLarge.heading") }),
      /* @__PURE__ */ jsx("p", { children: t("guide.whyLarge.body") }),
      /* @__PURE__ */ jsxs("ul", { style: guideListStyle, children: [
        /* @__PURE__ */ jsx("li", { children: t("guide.whyLarge.item1") }),
        /* @__PURE__ */ jsx("li", { children: t("guide.whyLarge.item2") }),
        /* @__PURE__ */ jsx("li", { children: t("guide.whyLarge.item3") }),
        /* @__PURE__ */ jsx("li", { children: t("guide.whyLarge.item4") })
      ] }),
      /* @__PURE__ */ jsx("br", {}),
      /* @__PURE__ */ jsx("h3", { style: { fontSize: 16, marginTop: 6 }, children: t("guide.whatDoes.heading") }),
      /* @__PURE__ */ jsx("p", { children: t("guide.whatDoes.body") }),
      /* @__PURE__ */ jsx("br", {}),
      /* @__PURE__ */ jsx("h3", { style: { fontSize: 16, marginTop: 6 }, children: t("guide.whenToCompress.heading") }),
      /* @__PURE__ */ jsxs("ul", { style: guideListStyle, children: [
        /* @__PURE__ */ jsx("li", { children: t("guide.whenToCompress.item1") }),
        /* @__PURE__ */ jsx("li", { children: t("guide.whenToCompress.item2") }),
        /* @__PURE__ */ jsx("li", { children: t("guide.whenToCompress.item3") }),
        /* @__PURE__ */ jsx("li", { children: t("guide.whenToCompress.item4") })
      ] }),
      /* @__PURE__ */ jsx("br", {}),
      /* @__PURE__ */ jsx("h3", { style: { fontSize: 16, marginTop: 6 }, children: t("guide.bestPractices.heading") }),
      /* @__PURE__ */ jsxs("ol", { style: guideListStyle, children: [
        /* @__PURE__ */ jsx("li", { children: t("guide.bestPractices.item1") }),
        /* @__PURE__ */ jsx("li", { children: t("guide.bestPractices.item2") }),
        /* @__PURE__ */ jsx("li", { children: t("guide.bestPractices.item3") }),
        /* @__PURE__ */ jsx("li", { children: t("guide.bestPractices.item4") }),
        /* @__PURE__ */ jsx("li", { children: t("guide.bestPractices.item5") })
      ] }),
      /* @__PURE__ */ jsx("br", {}),
      /* @__PURE__ */ jsx("h3", { style: { fontSize: 16, marginTop: 6 }, children: t("guide.mistakes.heading") }),
      /* @__PURE__ */ jsxs("ul", { style: guideListStyle, children: [
        /* @__PURE__ */ jsxs("li", { style: { display: "flex", alignItems: "flex-start", gap: 8 }, children: [
          /* @__PURE__ */ jsx("span", { style: { color: "#b91c1c", fontWeight: 700, lineHeight: "1em" }, children: "✕" }),
          t("guide.mistakes.item1")
        ] }),
        /* @__PURE__ */ jsxs("li", { style: { display: "flex", alignItems: "flex-start", gap: 8 }, children: [
          /* @__PURE__ */ jsx("span", { style: { color: "#b91c1c", fontWeight: 700, lineHeight: "1em" }, children: "✕" }),
          t("guide.mistakes.item2")
        ] }),
        /* @__PURE__ */ jsxs("li", { style: { display: "flex", alignItems: "flex-start", gap: 8 }, children: [
          /* @__PURE__ */ jsx("span", { style: { color: "#b91c1c", fontWeight: 700, lineHeight: "1em" }, children: "✕" }),
          t("guide.mistakes.item3")
        ] }),
        /* @__PURE__ */ jsxs("li", { style: { display: "flex", alignItems: "flex-start", gap: 8 }, children: [
          /* @__PURE__ */ jsx("span", { style: { color: "#b91c1c", fontWeight: 700, lineHeight: "1em" }, children: "✕" }),
          t("guide.mistakes.item4")
        ] }),
        /* @__PURE__ */ jsxs("li", { style: { display: "flex", alignItems: "flex-start", gap: 8 }, children: [
          /* @__PURE__ */ jsx("span", { style: { color: "#b91c1c", fontWeight: 700, lineHeight: "1em" }, children: "✕" }),
          t("guide.mistakes.item5")
        ] })
      ] }),
      /* @__PURE__ */ jsx("br", {}),
      /* @__PURE__ */ jsx("h3", { style: { fontSize: 16, marginTop: 6 }, children: t("guide.stepByStep.heading") }),
      /* @__PURE__ */ jsxs("ol", { style: guideListStyle, children: [
        /* @__PURE__ */ jsx("li", { children: t("guide.stepByStep.step1") }),
        /* @__PURE__ */ jsx("li", { children: t("guide.stepByStep.step2") }),
        /* @__PURE__ */ jsx("li", { children: t("guide.stepByStep.step3") }),
        /* @__PURE__ */ jsx("li", { children: t("guide.stepByStep.step4") }),
        /* @__PURE__ */ jsx("li", { children: t("guide.stepByStep.step5") })
      ] }),
      /* @__PURE__ */ jsx("br", {}),
      /* @__PURE__ */ jsx("h3", { style: { fontSize: 16, marginTop: 6 }, children: t("guide.useCases.heading") }),
      /* @__PURE__ */ jsxs("ul", { style: guideListStyle, children: [
        /* @__PURE__ */ jsx("li", { children: t("guide.useCases.item1") }),
        /* @__PURE__ */ jsx("li", { children: t("guide.useCases.item2") }),
        /* @__PURE__ */ jsx("li", { children: t("guide.useCases.item3") }),
        /* @__PURE__ */ jsx("li", { children: t("guide.useCases.item4") })
      ] }),
      /* @__PURE__ */ jsx("br", {}),
      /* @__PURE__ */ jsx("h3", { style: { fontSize: 16, marginTop: 6 }, children: t("guide.comparison.heading") }),
      /* @__PURE__ */ jsxs("table", { style: { width: "100%", borderCollapse: "collapse", marginTop: 8 }, children: [
        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { style: { borderBottom: "1px solid #e6e6e6" }, children: [
          /* @__PURE__ */ jsx("th", { style: { textAlign: "left", padding: 6 }, children: t("guide.comparison.col1") }),
          /* @__PURE__ */ jsx("th", { style: { textAlign: "left", padding: 6 }, children: t("guide.comparison.col2") }),
          /* @__PURE__ */ jsx("th", { style: { textAlign: "left", padding: 6 }, children: t("guide.comparison.col3") })
        ] }) }),
        /* @__PURE__ */ jsxs("tbody", { children: [
          /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("td", { style: { padding: 6, borderBottom: "1px solid #f3f3f3" }, children: t("guide.comparison.row1col1") }),
            /* @__PURE__ */ jsx("td", { style: { padding: 6, borderBottom: "1px solid #f3f3f3" }, children: t("guide.comparison.row1col2") }),
            /* @__PURE__ */ jsx("td", { style: { padding: 6, borderBottom: "1px solid #f3f3f3" }, children: t("guide.comparison.row1col3") })
          ] }),
          /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("td", { style: { padding: 6, borderBottom: "1px solid #f3f3f3" }, children: t("guide.comparison.row2col1") }),
            /* @__PURE__ */ jsx("td", { style: { padding: 6, borderBottom: "1px solid #f3f3f3" }, children: t("guide.comparison.row2col2") }),
            /* @__PURE__ */ jsx("td", { style: { padding: 6, borderBottom: "1px solid #f3f3f3" }, children: t("guide.comparison.row2col3") })
          ] }),
          /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("td", { style: { padding: 6 }, children: t("guide.comparison.row3col1") }),
            /* @__PURE__ */ jsx("td", { style: { padding: 6 }, children: t("guide.comparison.row3col2") }),
            /* @__PURE__ */ jsx("td", { style: { padding: 6 }, children: t("guide.comparison.row3col3") })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("br", {}),
      /* @__PURE__ */ jsx("h3", { style: { fontSize: 16, marginTop: 6 }, children: t("guide.tips.heading") }),
      /* @__PURE__ */ jsxs("ul", { style: guideListStyle, children: [
        /* @__PURE__ */ jsx("li", { children: t("guide.tips.item1") }),
        /* @__PURE__ */ jsx("li", { children: t("guide.tips.item2") }),
        /* @__PURE__ */ jsx("li", { children: t("guide.tips.item3") }),
        /* @__PURE__ */ jsx("li", { children: t("guide.tips.item4") })
      ] }),
      /* @__PURE__ */ jsx("br", {}),
      /* @__PURE__ */ jsx("h3", { style: { fontSize: 16, marginTop: 6 }, children: t("guide.faq.heading") }),
      /* @__PURE__ */ jsxs("p", { children: [
        /* @__PURE__ */ jsx("strong", { children: t("guide.faq.q1") }),
        /* @__PURE__ */ jsx("br", {}),
        t("guide.faq.a1")
      ] }),
      /* @__PURE__ */ jsxs("p", { children: [
        /* @__PURE__ */ jsx("strong", { children: t("guide.faq.q2") }),
        /* @__PURE__ */ jsx("br", {}),
        t("guide.faq.a2")
      ] }),
      /* @__PURE__ */ jsxs("p", { children: [
        /* @__PURE__ */ jsx("strong", { children: t("guide.faq.q3") }),
        /* @__PURE__ */ jsx("br", {}),
        t("guide.faq.a3")
      ] }),
      /* @__PURE__ */ jsxs("p", { style: { marginTop: 10 }, children: [
        /* @__PURE__ */ jsx("strong", { children: t("guide.conclusionTitle") }),
        /* @__PURE__ */ jsx("br", {}),
        t("guide.conclusion")
      ] }),
      /* @__PURE__ */ jsx("p", { style: { marginTop: 12 }, children: /* @__PURE__ */ jsx(
        "a",
        {
          className: "btn btn-primary",
          href: "/pdf-compressor",
          onClick: (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
            navigate("/pdf-compressor");
          },
          children: t("guide.ctaBtn")
        }
      ) })
    ] }) })
  ] });
}
function PdfCompressorPage() {
  const props = usePdfCompressor();
  return /* @__PURE__ */ jsxs("div", { className: "pdf-compressor-page", children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsx("main", { className: "main", children: /* @__PURE__ */ jsx("div", { className: "container", children: /* @__PURE__ */ jsx("div", { className: "card", children: /* @__PURE__ */ jsx(PdfCompressorView, { ...props }) }) }) }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
function makeFileEntry(file) {
  const randomPart = Math.random().toString(36).slice(2, 8);
  return {
    id: `${Date.now()}-${randomPart}-${file.name}`,
    file
  };
}
function moveItem(list, fromIndex, toIndex) {
  const clone = [...list];
  const [item] = clone.splice(fromIndex, 1);
  clone.splice(toIndex, 0, item);
  return clone;
}
function usePdfMerger() {
  const [files, setFiles] = useState([]);
  const [status2, setStatus] = useState("idle");
  const [progress2, setProgress] = useState(0);
  const [mergedSize, setMergedSize] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [downloadName, setDownloadName] = useState("");
  const [errorMsg2, setErrorMsg] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [draggedId, setDraggedId] = useState("");
  const [compress2, setCompress] = useState(false);
  const fileInputRef = useRef(null);
  const originalSize = useMemo(
    () => files.reduce((total, item) => total + item.file.size, 0),
    [files]
  );
  const addFiles = useCallback((fileList2) => {
    const incoming = Array.from(fileList2 || []);
    if (!incoming.length) return;
    const invalid = incoming.find((f) => f.type !== "application/pdf");
    if (invalid) {
      setErrorMsg("Only PDF files are allowed.");
      return;
    }
    setFiles((current) => [...current, ...incoming.map(makeFileEntry)]);
    setStatus("idle");
    setErrorMsg("");
    setProgress(0);
    setMergedSize(0);
    setDownloadName("");
    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl);
      setDownloadUrl("");
    }
  }, [downloadUrl]);
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(e.dataTransfer.files);
  }, [addFiles]);
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);
  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);
  const handleFileInput = (e) => {
    addFiles(e.target.files);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  const openFilePicker = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const handleRemove = (id) => {
    setFiles((current) => current.filter((item) => item.id !== id));
    setStatus("idle");
    setErrorMsg("");
  };
  const moveFileUp = (index) => {
    if (index <= 0) return;
    setFiles((current) => moveItem(current, index, index - 1));
  };
  const moveFileDown = (index) => {
    setFiles((current) => {
      if (index >= current.length - 1) return current;
      return moveItem(current, index, index + 1);
    });
  };
  const handleItemDragStart = (id) => {
    setDraggedId(id);
  };
  const handleItemDragOver = (e, targetId) => {
    e.preventDefault();
    if (!draggedId || draggedId === targetId) return;
    setFiles((current) => {
      const fromIndex = current.findIndex((item) => item.id === draggedId);
      const toIndex = current.findIndex((item) => item.id === targetId);
      if (fromIndex < 0 || toIndex < 0) return current;
      return moveItem(current, fromIndex, toIndex);
    });
    setDraggedId(targetId);
  };
  const handleItemDragEnd = () => {
    setDraggedId("");
  };
  const handleMerge = async () => {
    if (files.length < 2) {
      setErrorMsg("Please add at least 2 PDF files to merge.");
      return;
    }
    try {
      setErrorMsg("");
      setStatus("merging");
      setProgress(10);
      const { PDFDocument } = await import("pdf-lib");
      const mergedPdf = await PDFDocument.create();
      for (let index = 0; index < files.length; index += 1) {
        const arrayBuffer = await files[index].file.arrayBuffer();
        const sourcePdf = await PDFDocument.load(arrayBuffer);
        const pageIndices = sourcePdf.getPageIndices();
        const copiedPages = await mergedPdf.copyPages(sourcePdf, pageIndices);
        copiedPages.forEach((page) => mergedPdf.addPage(page));
        const mergeProgress = 10 + Math.round((index + 1) / files.length * 60);
        setProgress(mergeProgress);
      }
      const mergedBytes = await mergedPdf.save();
      setProgress(80);
      if (downloadUrl) {
        URL.revokeObjectURL(downloadUrl);
      }
      if (!compress2) {
        const blob = new Blob([mergedBytes], { type: "application/pdf" });
        const blobUrl = URL.createObjectURL(blob);
        const mergedFileName = "merged.pdf";
        setDownloadUrl(blobUrl);
        setDownloadName(mergedFileName);
        setMergedSize(blob.size);
        setProgress(100);
        setStatus("done");
        const anchor = document.createElement("a");
        anchor.href = blobUrl;
        anchor.download = mergedFileName;
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
      } else {
        const mergedFile = new File([mergedBytes], "merged.pdf", { type: "application/pdf" });
        setStatus("uploading");
        setProgress(82);
        const { key: objectKey, pdfCompressorBackendUrl } = await uploadToR2(mergedFile, "pdf-compressor");
        setStatus("compressing");
        setProgress(90);
        const backendUrl = pdfCompressorBackendUrl || void 0;
        if (!backendUrl) {
          throw new Error("PDF compressor backend URL is not configured.");
        }
        const response = await fetch(backendUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ objectKey, option: "BALANCED" })
        });
        if (!response.ok) {
          throw new Error(`Compression failed: ${response.status} ${response.statusText}`);
        }
        const { presignedUrl } = await response.json();
        if (!presignedUrl) {
          throw new Error("No presigned URL returned from compressor.");
        }
        const downloadResponse = await fetch(presignedUrl);
        if (!downloadResponse.ok) {
          throw new Error(`Failed to fetch compressed file: ${downloadResponse.status} ${downloadResponse.statusText}`);
        }
        const blob = await downloadResponse.blob();
        const blobUrl = URL.createObjectURL(blob);
        const mergedFileName = "merged_compressed.pdf";
        setDownloadUrl(blobUrl);
        setDownloadName(mergedFileName);
        setMergedSize(blob.size);
        setProgress(100);
        setStatus("done");
        const anchor = document.createElement("a");
        anchor.href = blobUrl;
        anchor.download = mergedFileName;
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
      }
    } catch (err) {
      setErrorMsg(err.message || "An unexpected error occurred.");
      setStatus("error");
    }
  };
  const handleReset = () => {
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setFiles([]);
    setStatus("idle");
    setProgress(0);
    setMergedSize(0);
    setDownloadUrl("");
    setDownloadName("");
    setErrorMsg("");
    setIsDragging(false);
    setDraggedId("");
    setCompress(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  return {
    files,
    status: status2,
    progress: progress2,
    originalSize,
    mergedSize,
    downloadUrl,
    downloadName,
    errorMsg: errorMsg2,
    isDragging,
    fileInputRef,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    handleFileInput,
    handleMerge,
    handleReset,
    handleRemove,
    moveFileUp,
    moveFileDown,
    handleItemDragStart,
    handleItemDragOver,
    handleItemDragEnd,
    openFilePicker,
    compress: compress2,
    setCompress
  };
}
function formatSize$1(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
function PdfMergerView({
  files,
  status: status2,
  progress: progress2,
  originalSize,
  mergedSize,
  downloadUrl,
  downloadName,
  errorMsg: errorMsg2,
  isDragging,
  fileInputRef,
  handleDrop,
  handleDragOver,
  handleDragLeave,
  handleFileInput,
  handleMerge,
  handleReset,
  handleRemove,
  moveFileUp,
  moveFileDown,
  handleItemDragStart,
  handleItemDragOver,
  handleItemDragEnd,
  openFilePicker,
  compress: compress2,
  setCompress
}) {
  const { t } = useTranslation("pdfMerger");
  const [openPanel, setOpenPanel] = useState("");
  const navigate = useNavigate();
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    status2 !== "done" && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs("div", { className: "hero-section", children: [
        /* @__PURE__ */ jsx("h1", { className: "hero-title", children: t("hero.title") }),
        /* @__PURE__ */ jsxs("p", { className: "hero-tagline", children: [
          t("hero.tagline"),
          " ",
          /* @__PURE__ */ jsx(Link, { to: "/blogs/pdf-merger-guide", children: t("hero.blogLink") })
        ] }),
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: 12, background: "#fffbe6", border: "1px solid #ffe58f", borderRadius: 8, padding: "10px 16px", marginBottom: 12 }, children: [
          /* @__PURE__ */ jsx("span", { style: { fontSize: 18 }, children: "🖼️" }),
          /* @__PURE__ */ jsx("span", { style: { flex: 1, fontSize: 14, color: "#7c6000" }, children: t("hint.text") }),
          /* @__PURE__ */ jsx(
            Link,
            {
              to: "/pdf-splitter",
              style: { whiteSpace: "nowrap", background: "#faad14", color: "#fff", border: "none", borderRadius: 6, padding: "6px 14px", fontSize: 13, fontWeight: 600, textDecoration: "none", cursor: "pointer" },
              children: t("hint.btn")
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "details-row", "data-open": openPanel, children: [
          /* @__PURE__ */ jsxs("div", { className: "details-controls", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                className: `tab-btn ${openPanel === "details" ? "active" : ""}`,
                onClick: () => setOpenPanel((prev) => prev === "details" ? "" : "details"),
                "aria-expanded": openPanel === "details",
                type: "button",
                children: t("tabs.details")
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                className: `tab-btn ${openPanel === "howitworks" ? "active" : ""}`,
                onClick: () => setOpenPanel((prev) => prev === "howitworks" ? "" : "howitworks"),
                "aria-expanded": openPanel === "howitworks",
                type: "button",
                children: t("tabs.howItWorks")
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: `shared-collapse${!openPanel ? " panel-hidden" : ""}`, children: [
            /* @__PURE__ */ jsxs("div", { className: openPanel !== "details" ? "details-content panel-hidden" : "details-content", children: [
              /* @__PURE__ */ jsx("h3", { children: t("details.howMergeWorks.heading") }),
              /* @__PURE__ */ jsx("p", { children: t("details.howMergeWorks.body") }),
              /* @__PURE__ */ jsx("h3", { children: t("details.howSizeDetermined.heading") }),
              /* @__PURE__ */ jsx("p", { children: t("details.howSizeDetermined.body") }),
              /* @__PURE__ */ jsx("h3", { children: t("details.whyUseOnline.heading") }),
              /* @__PURE__ */ jsx("p", { children: t("details.whyUseOnline.body") }),
              /* @__PURE__ */ jsx("h3", { children: t("details.bestPractices.heading") }),
              /* @__PURE__ */ jsxs("ul", { children: [
                /* @__PURE__ */ jsx("li", { children: t("details.bestPractices.item1") }),
                /* @__PURE__ */ jsx("li", { children: t("details.bestPractices.item2") }),
                /* @__PURE__ */ jsx("li", { children: t("details.bestPractices.item3") })
              ] }),
              /* @__PURE__ */ jsx("h3", { children: t("details.whatItDoes.heading") }),
              /* @__PURE__ */ jsx("ul", { children: /* @__PURE__ */ jsx("li", { children: t("details.whatItDoes.item1") }) }),
              /* @__PURE__ */ jsx("h3", { children: t("details.usefulWhen.heading") }),
              /* @__PURE__ */ jsxs("ul", { children: [
                /* @__PURE__ */ jsx("li", { children: t("details.usefulWhen.item1") }),
                /* @__PURE__ */ jsx("li", { children: t("details.usefulWhen.item2") }),
                /* @__PURE__ */ jsx("li", { children: t("details.usefulWhen.item3") })
              ] }),
              /* @__PURE__ */ jsx("h3", { children: t("details.comparison.heading") }),
              /* @__PURE__ */ jsx("ul", { children: /* @__PURE__ */ jsx("li", { children: t("details.comparison.item1") }) }),
              /* @__PURE__ */ jsx("h3", { children: t("details.privacy.heading") }),
              /* @__PURE__ */ jsx("p", { children: t("details.privacy.body") }),
              /* @__PURE__ */ jsx("h3", { children: t("details.faq.heading") }),
              /* @__PURE__ */ jsxs("ul", { children: [
                /* @__PURE__ */ jsxs("li", { children: [
                  /* @__PURE__ */ jsx("strong", { children: t("details.faq.q1") }),
                  " ",
                  t("details.faq.a1")
                ] }),
                /* @__PURE__ */ jsxs("li", { children: [
                  /* @__PURE__ */ jsx("strong", { children: t("details.faq.q2") }),
                  " ",
                  t("details.faq.a2")
                ] }),
                /* @__PURE__ */ jsxs("li", { children: [
                  /* @__PURE__ */ jsx("strong", { children: t("details.faq.q3") }),
                  " ",
                  t("details.faq.a3")
                ] }),
                /* @__PURE__ */ jsxs("li", { children: [
                  /* @__PURE__ */ jsx("strong", { children: t("details.faq.q4") }),
                  " ",
                  t("details.faq.a4")
                ] }),
                /* @__PURE__ */ jsxs("li", { children: [
                  /* @__PURE__ */ jsx("strong", { children: t("details.faq.q5") }),
                  " ",
                  t("details.faq.a5")
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: openPanel !== "howitworks" ? "howitworks-content panel-hidden" : "howitworks-content", children: /* @__PURE__ */ jsxs("ol", { style: { margin: 0, paddingLeft: "1rem" }, children: [
              /* @__PURE__ */ jsxs("li", { style: { marginBottom: "0.75rem" }, children: [
                /* @__PURE__ */ jsx("img", { src: "/screenshots/merger/merger-001.png", alt: "Step 1", className: "how-img" }),
                /* @__PURE__ */ jsx("p", { children: t("howItWorks.step1") })
              ] }),
              /* @__PURE__ */ jsxs("li", { style: { marginBottom: "0.75rem" }, children: [
                /* @__PURE__ */ jsx("img", { src: "/screenshots/merger/merger-002.png", alt: "Step 2", className: "how-img" }),
                /* @__PURE__ */ jsx("p", { children: t("howItWorks.step2") })
              ] }),
              /* @__PURE__ */ jsxs("li", { style: { marginBottom: "0.75rem" }, children: [
                /* @__PURE__ */ jsx("img", { src: "/screenshots/merger/merger-003.png", alt: "Step 3", className: "how-img" }),
                /* @__PURE__ */ jsx("p", { children: t("howItWorks.step3") })
              ] }),
              /* @__PURE__ */ jsxs("li", { children: [
                /* @__PURE__ */ jsx("img", { src: "/screenshots/merger/merger-004.png", alt: "Step 4", className: "how-img" }),
                /* @__PURE__ */ jsx("p", { children: t("howItWorks.step4") })
              ] })
            ] }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "hero-badges", children: [
          /* @__PURE__ */ jsx("span", { className: "hero-badge", children: t("badges.fast") }),
          /* @__PURE__ */ jsx("span", { className: "hero-badge", children: t("badges.secure") }),
          /* @__PURE__ */ jsx("span", { className: "hero-badge", children: t("badges.autoDeleted") })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(
        "div",
        {
          className: `drop-zone${isDragging ? " dragging" : ""}${files.length ? " has-file" : ""}`,
          onDrop: handleDrop,
          onDragOver: handleDragOver,
          onDragLeave: handleDragLeave,
          children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                ref: fileInputRef,
                id: "file-input",
                type: "file",
                accept: "application/pdf",
                multiple: true,
                className: "file-input",
                onChange: handleFileInput
              }
            ),
            !files.length ? /* @__PURE__ */ jsxs("label", { className: "drop-content", htmlFor: "file-input", children: [
              /* @__PURE__ */ jsx("div", { className: "drop-icon", children: "📚" }),
              /* @__PURE__ */ jsx("p", { className: "drop-text", children: t("dropZone.text") }),
              /* @__PURE__ */ jsx("p", { className: "drop-sub", children: t("dropZone.or") }),
              /* @__PURE__ */ jsx("span", { className: "btn btn-outline", children: t("dropZone.browse") })
            ] }) : /* @__PURE__ */ jsxs("div", { className: "file-list-wrap", children: [
              /* @__PURE__ */ jsxs("div", { className: "file-list-header", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("span", { className: "file-list-title", children: t("fileList.title", { count: files.length }) }),
                  /* @__PURE__ */ jsx("p", { className: "file-list-sub", children: t("fileList.reorderHint") })
                ] }),
                /* @__PURE__ */ jsx("button", { className: "btn btn-outline file-list-add", onClick: openFilePicker, type: "button", children: t("fileList.addMore") })
              ] }),
              /* @__PURE__ */ jsx("ul", { className: "file-list", children: files.map((item, index) => /* @__PURE__ */ jsxs(
                "li",
                {
                  className: "file-row",
                  draggable: true,
                  onDragStart: () => handleItemDragStart(item.id),
                  onDragOver: (e) => handleItemDragOver(e, item.id),
                  onDragEnd: handleItemDragEnd,
                  children: [
                    /* @__PURE__ */ jsx("span", { className: "file-row-order", children: index + 1 }),
                    /* @__PURE__ */ jsxs("div", { className: "file-row-main", children: [
                      /* @__PURE__ */ jsx("span", { className: "file-name", children: item.file.name }),
                      /* @__PURE__ */ jsx("span", { className: "file-size", children: formatSize$1(item.file.size) })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "file-row-actions", children: [
                      /* @__PURE__ */ jsx(
                        "button",
                        {
                          className: "reorder-btn",
                          type: "button",
                          onClick: () => moveFileUp(index),
                          disabled: index === 0,
                          title: t("fileList.moveUp"),
                          children: "↑"
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        "button",
                        {
                          className: "reorder-btn",
                          type: "button",
                          onClick: () => moveFileDown(index),
                          disabled: index === files.length - 1,
                          title: t("fileList.moveDown"),
                          children: "↓"
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        "button",
                        {
                          className: "remove-btn",
                          type: "button",
                          onClick: () => handleRemove(item.id),
                          title: t("fileList.remove"),
                          children: "✕"
                        }
                      )
                    ] })
                  ]
                },
                item.id
              )) })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxs("label", { className: "compress-option", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "checkbox",
            checked: compress2,
            onChange: (e) => setCompress(e.target.checked)
          }
        ),
        t("compress")
      ] }),
      errorMsg2 && /* @__PURE__ */ jsx("p", { className: "error-msg", children: errorMsg2 }),
      files.length > 0 && status2 === "idle" && /* @__PURE__ */ jsx("button", { className: "btn btn-primary compress-btn", onClick: handleMerge, type: "button", children: t("mergeBtn") }),
      (status2 === "merging" || status2 === "uploading" || status2 === "compressing") && /* @__PURE__ */ jsxs("div", { className: "progress-section", children: [
        /* @__PURE__ */ jsxs("div", { className: "progress-label", children: [
          status2 === "merging" && t("progress.merging"),
          status2 === "uploading" && t("progress.uploading"),
          status2 === "compressing" && t("progress.compressing")
        ] }),
        /* @__PURE__ */ jsx("div", { className: "progress-bar", children: /* @__PURE__ */ jsx("div", { className: "progress-fill", style: { width: `${progress2}%` } }) })
      ] })
    ] }),
    status2 === "done" && /* @__PURE__ */ jsxs("div", { className: "result-section", children: [
      /* @__PURE__ */ jsx("div", { className: "result-icon", children: t("result.icon") }),
      /* @__PURE__ */ jsx("h2", { className: "result-title", children: t("result.title") }),
      /* @__PURE__ */ jsxs("div", { className: "size-comparison", children: [
        /* @__PURE__ */ jsxs("div", { className: "size-row", children: [
          /* @__PURE__ */ jsx("span", { className: "size-col-label", children: t("result.inputLabel") }),
          /* @__PURE__ */ jsx("span", { className: "size-col-label", children: t("result.totalSizeLabel") })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "size-row size-row--data", children: [
          /* @__PURE__ */ jsx("span", { className: "size-col-value", children: t("result.filesCount", { count: files.length }) }),
          /* @__PURE__ */ jsx("span", { className: "size-col-value", children: formatSize$1(originalSize) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "size-row size-row--spacer" }),
        /* @__PURE__ */ jsxs("div", { className: "size-row", children: [
          /* @__PURE__ */ jsx("span", { className: "size-col-label", children: t("result.mergedLabel") }),
          /* @__PURE__ */ jsx("span", { className: "size-col-label", children: t("result.sizeLabel") })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "size-row size-row--data", children: [
          /* @__PURE__ */ jsx("span", { className: "size-col-value size-col-value--compressed", children: downloadName }),
          /* @__PURE__ */ jsx("span", { className: "size-col-value size-col-value--compressed", children: formatSize$1(mergedSize) })
        ] })
      ] }),
      /* @__PURE__ */ jsx(
        "a",
        {
          className: "btn btn-primary",
          href: downloadUrl,
          download: downloadName,
          target: "_blank",
          rel: "noopener noreferrer",
          children: t("result.download")
        }
      ),
      /* @__PURE__ */ jsx("button", { className: "btn btn-ghost", onClick: handleReset, type: "button", children: t("result.another") })
    ] }),
    compress2 && status2 === "done" && /* @__PURE__ */ jsxs("div", { className: "note", children: [
      /* @__PURE__ */ jsx("span", { className: "note-icon", children: "⚠️" }),
      t("note")
    ] }),
    /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: 12, background: "#fffbe6", border: "1px solid #ffe58f", borderRadius: 8, padding: "10px 16px", marginBottom: 12 }, children: [
      /* @__PURE__ */ jsx("span", { style: { fontSize: 18 }, children: "🖼️" }),
      /* @__PURE__ */ jsx("span", { style: { flex: 1, fontSize: 14, color: "#7c6000" }, children: t("lowerHint.text") }),
      /* @__PURE__ */ jsx(
        Link,
        {
          to: "/pdf-compressor",
          style: { whiteSpace: "nowrap", background: "#faad14", color: "#fff", border: "none", borderRadius: 6, padding: "6px 14px", fontSize: 13, fontWeight: 600, textDecoration: "none", cursor: "pointer" },
          children: t("lowerHint.btn")
        }
      )
    ] }),
    /* @__PURE__ */ jsx("section", { className: "merger-guide", style: { marginTop: 28 }, children: /* @__PURE__ */ jsx("div", { style: { maxWidth: 880, margin: "0 auto", padding: 18, background: "linear-gradient(180deg,#f7fbff,#ffffff)", borderRadius: 10, border: "1px solid #e6f0ff", color: "#111" }, children: /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 12 }, children: [
      /* @__PURE__ */ jsx("div", { style: { flex: "0 0 60px", fontSize: 34, lineHeight: 1 }, children: "🧩" }),
      /* @__PURE__ */ jsxs("div", { style: { flex: 1, minWidth: 0 }, children: [
        /* @__PURE__ */ jsx("h2", { style: { margin: 0, fontSize: 22 }, children: t("guide.title") }),
        /* @__PURE__ */ jsx("p", { style: { marginTop: 8 }, children: t("guide.intro") }),
        /* @__PURE__ */ jsx("p", { style: { marginTop: 6, fontWeight: 700 }, children: t("guide.cta") }),
        /* @__PURE__ */ jsx("br", {}),
        /* @__PURE__ */ jsx("h3", { style: { marginTop: 12 }, children: t("guide.whatIs.heading") }),
        /* @__PURE__ */ jsx("p", { children: t("guide.whatIs.body") }),
        /* @__PURE__ */ jsxs("ul", { style: { marginLeft: 16 }, children: [
          /* @__PURE__ */ jsx("li", { children: t("guide.whatIs.item1") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.whatIs.item2") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.whatIs.item3") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.whatIs.item4") })
        ] }),
        /* @__PURE__ */ jsx("br", {}),
        /* @__PURE__ */ jsx("h3", { style: { marginTop: 10 }, children: t("guide.whyMatters.heading") }),
        /* @__PURE__ */ jsxs("ul", { style: { marginLeft: 16 }, children: [
          /* @__PURE__ */ jsx("li", { children: t("guide.whyMatters.item1") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.whyMatters.item2") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.whyMatters.item3") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.whyMatters.item4") })
        ] }),
        /* @__PURE__ */ jsx("br", {}),
        /* @__PURE__ */ jsx("h3", { style: { marginTop: 10 }, children: t("guide.useCases.heading") }),
        /* @__PURE__ */ jsxs("ul", { style: { marginLeft: 16 }, children: [
          /* @__PURE__ */ jsx("li", { children: t("guide.useCases.item1") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.useCases.item2") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.useCases.item3") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.useCases.item4") })
        ] }),
        /* @__PURE__ */ jsx("br", {}),
        /* @__PURE__ */ jsx("h3", { style: { marginTop: 10 }, children: t("guide.howWorks.heading") }),
        /* @__PURE__ */ jsx("p", { children: t("guide.howWorks.body") }),
        /* @__PURE__ */ jsx("br", {}),
        /* @__PURE__ */ jsx("h3", { style: { marginTop: 10 }, children: t("guide.stepByStep.heading") }),
        /* @__PURE__ */ jsxs("ol", { style: { marginLeft: 16 }, children: [
          /* @__PURE__ */ jsx("li", { children: t("guide.stepByStep.step1") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.stepByStep.step2") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.stepByStep.step3") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.stepByStep.step4") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.stepByStep.step5") })
        ] }),
        /* @__PURE__ */ jsx("br", {}),
        /* @__PURE__ */ jsx("h3", { style: { marginTop: 10 }, children: t("guide.tips.heading") }),
        /* @__PURE__ */ jsxs("ul", { style: { marginLeft: 16 }, children: [
          /* @__PURE__ */ jsx("li", { children: t("guide.tips.item1") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.tips.item2") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.tips.item3") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.tips.item4") })
        ] }),
        /* @__PURE__ */ jsx("br", {}),
        /* @__PURE__ */ jsx("h3", { style: { marginTop: 10 }, children: t("guide.mistakes.heading") }),
        /* @__PURE__ */ jsxs("ul", { style: { marginLeft: 16 }, children: [
          /* @__PURE__ */ jsx("li", { children: t("guide.mistakes.item1") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.mistakes.item2") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.mistakes.item3") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.mistakes.item4") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.mistakes.item5") })
        ] }),
        /* @__PURE__ */ jsx("br", {}),
        /* @__PURE__ */ jsx("h3", { style: { marginTop: 10 }, children: t("guide.comparison.heading") }),
        /* @__PURE__ */ jsx("div", { style: { overflowX: "auto" }, children: /* @__PURE__ */ jsxs("table", { style: { width: "100%", borderCollapse: "collapse", marginTop: 8 }, children: [
          /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { style: { borderBottom: "1px solid #e6f0ff" }, children: [
            /* @__PURE__ */ jsx("th", { style: { textAlign: "left", padding: 6 }, children: t("guide.comparison.col1") }),
            /* @__PURE__ */ jsx("th", { style: { textAlign: "left", padding: 6 }, children: t("guide.comparison.col2") }),
            /* @__PURE__ */ jsx("th", { style: { textAlign: "left", padding: 6 }, children: t("guide.comparison.col3") })
          ] }) }),
          /* @__PURE__ */ jsxs("tbody", { children: [
            /* @__PURE__ */ jsxs("tr", { children: [
              /* @__PURE__ */ jsx("td", { style: { padding: 6, borderBottom: "1px solid #f3f7ff" }, children: t("guide.comparison.row1col1") }),
              /* @__PURE__ */ jsx("td", { style: { padding: 6, borderBottom: "1px solid #f3f7ff" }, children: t("guide.comparison.row1col2") }),
              /* @__PURE__ */ jsx("td", { style: { padding: 6, borderBottom: "1px solid #f3f7ff" }, children: t("guide.comparison.row1col3") })
            ] }),
            /* @__PURE__ */ jsxs("tr", { children: [
              /* @__PURE__ */ jsx("td", { style: { padding: 6, borderBottom: "1px solid #f3f7ff" }, children: t("guide.comparison.row2col1") }),
              /* @__PURE__ */ jsx("td", { style: { padding: 6, borderBottom: "1px solid #f3f7ff" }, children: t("guide.comparison.row2col2") }),
              /* @__PURE__ */ jsx("td", { style: { padding: 6, borderBottom: "1px solid #f3f7ff" }, children: t("guide.comparison.row2col3") })
            ] }),
            /* @__PURE__ */ jsxs("tr", { children: [
              /* @__PURE__ */ jsx("td", { style: { padding: 6 }, children: t("guide.comparison.row3col1") }),
              /* @__PURE__ */ jsx("td", { style: { padding: 6 }, children: t("guide.comparison.row3col2") }),
              /* @__PURE__ */ jsx("td", { style: { padding: 6 }, children: t("guide.comparison.row3col3") })
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsx("br", {}),
        /* @__PURE__ */ jsx("h3", { style: { marginTop: 10 }, children: t("guide.proTips.heading") }),
        /* @__PURE__ */ jsxs("ul", { style: { marginLeft: 16 }, children: [
          /* @__PURE__ */ jsx("li", { children: t("guide.proTips.item1") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.proTips.item2") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.proTips.item3") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.proTips.item4") })
        ] }),
        /* @__PURE__ */ jsx("br", {}),
        /* @__PURE__ */ jsx("h3", { style: { marginTop: 10 }, children: t("guide.safety.heading") }),
        /* @__PURE__ */ jsx("p", { children: t("guide.safety.body") }),
        /* @__PURE__ */ jsx("br", {}),
        /* @__PURE__ */ jsx("h3", { style: { marginTop: 10 }, children: t("guide.faq.heading") }),
        /* @__PURE__ */ jsxs("p", { children: [
          /* @__PURE__ */ jsx("strong", { children: t("guide.faq.q1") }),
          " ",
          t("guide.faq.a1")
        ] }),
        /* @__PURE__ */ jsxs("p", { children: [
          /* @__PURE__ */ jsx("strong", { children: t("guide.faq.q2") }),
          " ",
          t("guide.faq.a2")
        ] }),
        /* @__PURE__ */ jsxs("p", { children: [
          /* @__PURE__ */ jsx("strong", { children: t("guide.faq.q3") }),
          " ",
          t("guide.faq.a3")
        ] }),
        /* @__PURE__ */ jsxs("p", { children: [
          /* @__PURE__ */ jsx("strong", { children: t("guide.faq.q4") }),
          " ",
          t("guide.faq.a4")
        ] }),
        /* @__PURE__ */ jsx("br", {}),
        /* @__PURE__ */ jsxs("p", { style: { marginTop: 12 }, children: [
          /* @__PURE__ */ jsx("strong", { children: t("guide.conclusion.heading") }),
          /* @__PURE__ */ jsx("br", {}),
          t("guide.conclusion.body")
        ] }),
        /* @__PURE__ */ jsx("p", { style: { marginTop: 12 }, children: /* @__PURE__ */ jsx(
          "a",
          {
            className: "btn btn-primary",
            href: "/pdf-merger",
            onClick: (e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
              navigate("/pdf-merger");
            },
            children: t("guide.ctaBtn")
          }
        ) })
      ] })
    ] }) }) })
  ] });
}
function PdfMergerPage() {
  const props = usePdfMerger();
  return /* @__PURE__ */ jsxs("div", { className: "pdf-merger-page", children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsx("main", { className: "main", children: /* @__PURE__ */ jsx("div", { className: "container", children: /* @__PURE__ */ jsx("div", { className: "card", children: /* @__PURE__ */ jsx(PdfMergerView, { ...props }) }) }) }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
function usePdfConverter() {
  const [file, setFile] = useState(null);
  const [status2, setStatus] = useState("idle");
  const [progress2, setProgress] = useState(0);
  const [originalSize, setOriginalSize] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [downloadName, setDownloadName] = useState("");
  const [errorMsg2, setErrorMsg] = useState("");
  const [convertType, setConvertType] = useState("jpg");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const handleFile = (f) => {
    if (!f) return;
    if (f.type !== "application/pdf") {
      setErrorMsg("Please upload a valid PDF file.");
      return;
    }
    setFile(f);
    setOriginalSize(f.size);
    setStatus("idle");
    setErrorMsg("");
    setDownloadUrl("");
    setDownloadName("");
  };
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0]);
  }, []);
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);
  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);
  const handleFileInput = (e) => {
    handleFile(e.target.files[0]);
  };
  const handleConvert = async () => {
    if (!file) return;
    try {
      setStatus("uploading");
      setProgress(20);
      setErrorMsg("");
      const { key: objectKey, pdfConverterBackendUrl } = await uploadToR2(file, "pdf-converter");
      setProgress(60);
      setStatus("converting");
      const backendUrl = pdfConverterBackendUrl || void 0;
      if (!backendUrl) {
        throw new Error("PDF converter backend URL is not configured.");
      }
      const response = await fetch(backendUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ objectKey, convertType })
      });
      if (!response.ok) {
        throw new Error(`Conversion failed: ${response.status} ${response.statusText}`);
      }
      const { presignedUrl } = await response.json();
      if (!presignedUrl) {
        throw new Error("No presigned URL returned from server.");
      }
      const downloadResponse = await fetch(presignedUrl);
      if (!downloadResponse.ok) {
        throw new Error(`Failed to fetch converted file: ${downloadResponse.status} ${downloadResponse.statusText}`);
      }
      const blob = await downloadResponse.blob();
      const blobUrl = URL.createObjectURL(blob);
      let resultFilename = "";
      const contentDisp = downloadResponse.headers.get("Content-Disposition");
      if (contentDisp) {
        const fnStarMatch = contentDisp.match(/filename\*=(?:UTF-8'')?([^;\n\r]+)/i);
        const fnMatch = contentDisp.match(/filename=(?:"?)([^";]+)(?:"?)/i);
        if (fnStarMatch && fnStarMatch[1]) {
          try {
            resultFilename = decodeURIComponent(fnStarMatch[1]);
          } catch (e) {
            resultFilename = fnStarMatch[1];
          }
        } else if (fnMatch && fnMatch[1]) {
          resultFilename = fnMatch[1];
        }
      }
      if (!resultFilename) {
        try {
          const urlPath = new URL(presignedUrl).pathname;
          const lastSeg = urlPath.split("/").filter(Boolean).pop() || "";
          resultFilename = decodeURIComponent(lastSeg);
        } catch (e) {
        }
      }
      let ext = "";
      if (resultFilename) {
        const m = resultFilename.match(/\.([a-zA-Z0-9]{1,8})(?:\?.*)?$/);
        if (m && m[1]) ext = m[1].toLowerCase();
      }
      const originalBase = file.name.replace(/\.pdf$/i, "");
      let finalName = originalBase + "_converted";
      if (ext) {
        finalName += `.${ext}`;
      } else if (convertType) {
        finalName += `.${convertType}`;
      }
      setDownloadUrl(blobUrl);
      setDownloadName(finalName);
      setProgress(100);
      setStatus("done");
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = finalName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      setErrorMsg(err.message || "An unexpected error occurred.");
      setStatus("error");
    }
  };
  const handleReset = () => {
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setFile(null);
    setStatus("idle");
    setProgress(0);
    setOriginalSize(0);
    setDownloadUrl("");
    setDownloadName("");
    setErrorMsg("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  return {
    file,
    status: status2,
    progress: progress2,
    originalSize,
    downloadUrl,
    downloadName,
    errorMsg: errorMsg2,
    convertType,
    setConvertType,
    isDragging,
    fileInputRef,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    handleFileInput,
    handleConvert,
    handleReset
  };
}
function PdfConverterView({
  file,
  status: status2,
  progress: progress2,
  originalSize,
  downloadUrl,
  downloadName,
  errorMsg: errorMsg2,
  isDragging,
  fileInputRef,
  handleDrop,
  handleDragOver,
  handleDragLeave,
  handleFileInput,
  handleConvert,
  convertType,
  setConvertType,
  handleReset
}) {
  const { t } = useTranslation("pdfConverter");
  const [openPanel, setOpenPanel] = useState("");
  const navigate = useNavigate();
  const togglePanel = (panel) => {
    setOpenPanel((prev) => prev === panel ? "" : panel);
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    status2 !== "done" && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs("div", { className: "hero-section", children: [
        /* @__PURE__ */ jsx("h1", { className: "hero-title", children: t("hero.title") }),
        /* @__PURE__ */ jsxs("p", { className: "hero-tagline", children: [
          t("hero.tagline"),
          " ",
          /* @__PURE__ */ jsx(Link, { to: "/blogs/pdf-converter-guide", children: t("hero.blogLink") })
        ] }),
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: 12, background: "#fffbe6", border: "1px solid #ffe58f", borderRadius: 8, padding: "10px 16px", marginBottom: 12 }, children: [
          /* @__PURE__ */ jsx("span", { style: { fontSize: 18 }, children: "🖼️" }),
          /* @__PURE__ */ jsx("span", { style: { flex: 1, fontSize: 14, color: "#7c6000" }, children: t("hint.text") }),
          /* @__PURE__ */ jsx(
            Link,
            {
              to: "/image-converter",
              style: { whiteSpace: "nowrap", background: "#faad14", color: "#fff", border: "none", borderRadius: 6, padding: "6px 14px", fontSize: 13, fontWeight: 600, textDecoration: "none", cursor: "pointer" },
              children: t("hint.btn")
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "details-controls", children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              className: `tab-btn ${openPanel === "details" ? "active" : ""}`,
              onClick: () => togglePanel("details"),
              "aria-expanded": openPanel === "details",
              type: "button",
              children: [
                t("tabs.details"),
                "              "
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              className: `tab-btn ${openPanel === "howitworks" ? "active" : ""}`,
              onClick: () => togglePanel("howitworks"),
              "aria-expanded": openPanel === "howitworks",
              type: "button",
              children: t("tabs.howItWorks")
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: `shared-collapse${!openPanel ? " panel-hidden" : ""}`, children: [
          /* @__PURE__ */ jsxs("div", { className: openPanel !== "details" ? "tool-details-open panel-hidden" : "tool-details-open", children: [
            /* @__PURE__ */ jsx("h3", { children: t("details.whatIs.heading") }),
            /* @__PURE__ */ jsx("p", { children: t("details.whatIs.body") }),
            /* @__PURE__ */ jsx("h3", { children: t("details.whenToConvert.heading") }),
            /* @__PURE__ */ jsx("p", { children: t("details.whenToConvert.body") }),
            /* @__PURE__ */ jsx("h3", { children: t("details.howBehaves.heading") }),
            /* @__PURE__ */ jsx("p", { children: t("details.howBehaves.body") }),
            /* @__PURE__ */ jsx("h3", { children: t("details.quality.heading") }),
            /* @__PURE__ */ jsxs("ul", { children: [
              /* @__PURE__ */ jsx("li", { children: t("details.quality.resolution") }),
              /* @__PURE__ */ jsx("li", { children: t("details.quality.format") }),
              /* @__PURE__ */ jsx("li", { children: t("details.quality.processing") })
            ] }),
            /* @__PURE__ */ jsx("h4", { children: t("details.benefits.heading") }),
            /* @__PURE__ */ jsxs("ul", { children: [
              /* @__PURE__ */ jsx("li", { children: t("details.benefits.item1") }),
              /* @__PURE__ */ jsx("li", { children: t("details.benefits.item2") }),
              /* @__PURE__ */ jsx("li", { children: t("details.benefits.item3") })
            ] }),
            /* @__PURE__ */ jsx("h3", { children: t("details.privacy.heading") }),
            /* @__PURE__ */ jsx("p", { children: t("details.privacy.body") }),
            /* @__PURE__ */ jsx("h3", { children: t("details.practical.heading") }),
            /* @__PURE__ */ jsxs("ul", { children: [
              /* @__PURE__ */ jsx("li", { children: t("details.practical.item1") }),
              /* @__PURE__ */ jsx("li", { children: t("details.practical.item2") }),
              /* @__PURE__ */ jsx("li", { children: t("details.practical.item3") })
            ] }),
            /* @__PURE__ */ jsx("h4", { children: t("details.usefulWhen.heading") }),
            /* @__PURE__ */ jsxs("ul", { children: [
              /* @__PURE__ */ jsx("li", { children: t("details.usefulWhen.item1") }),
              /* @__PURE__ */ jsx("li", { children: t("details.usefulWhen.item2") }),
              /* @__PURE__ */ jsx("li", { children: t("details.usefulWhen.item3") })
            ] }),
            /* @__PURE__ */ jsx("h4", { children: t("details.faq.heading") }),
            /* @__PURE__ */ jsxs("ul", { children: [
              /* @__PURE__ */ jsxs("li", { children: [
                /* @__PURE__ */ jsx("strong", { children: t("details.faq.q1") }),
                " ",
                t("details.faq.a1")
              ] }),
              /* @__PURE__ */ jsxs("li", { children: [
                /* @__PURE__ */ jsx("strong", { children: t("details.faq.q2") }),
                " ",
                t("details.faq.a2")
              ] }),
              /* @__PURE__ */ jsxs("li", { children: [
                /* @__PURE__ */ jsx("strong", { children: t("details.faq.q3") }),
                " ",
                t("details.faq.a3")
              ] }),
              /* @__PURE__ */ jsxs("li", { children: [
                /* @__PURE__ */ jsx("strong", { children: t("details.faq.q4") }),
                " ",
                t("details.faq.a4")
              ] }),
              /* @__PURE__ */ jsxs("li", { children: [
                /* @__PURE__ */ jsx("strong", { children: t("details.faq.q5") }),
                " ",
                t("details.faq.a5")
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: openPanel !== "howitworks" ? "tool-howitworks-open panel-hidden" : "tool-howitworks-open", children: /* @__PURE__ */ jsxs("ol", { style: { margin: 0, paddingLeft: "1rem" }, children: [
            /* @__PURE__ */ jsxs("li", { style: { marginBottom: "0.75rem" }, children: [
              /* @__PURE__ */ jsx("img", { src: "/screenshots/converter/PDF-converter001.png", alt: "Upload PDF", className: "how-img" }),
              /* @__PURE__ */ jsx("p", { children: t("howItWorks.step1") })
            ] }),
            /* @__PURE__ */ jsxs("li", { style: { marginBottom: "0.75rem" }, children: [
              /* @__PURE__ */ jsx("img", { src: "/screenshots/converter/PDF-converter002.png", alt: "Choose format", className: "how-img" }),
              /* @__PURE__ */ jsx("p", { children: t("howItWorks.step2") })
            ] }),
            /* @__PURE__ */ jsxs("li", { style: { marginBottom: "0.75rem" }, children: [
              /* @__PURE__ */ jsx("img", { src: "/screenshots/converter/PDF-converter003.png", alt: "Start conversion", className: "how-img" }),
              /* @__PURE__ */ jsx("p", { children: t("howItWorks.step3") })
            ] }),
            /* @__PURE__ */ jsxs("li", { style: { marginBottom: "0.75rem" }, children: [
              /* @__PURE__ */ jsx("img", { src: "/screenshots/converter/PDF-converter004.png", alt: "Preview and download", className: "how-img" }),
              /* @__PURE__ */ jsx("p", { children: t("howItWorks.step4") })
            ] })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "hero-badges", children: [
          /* @__PURE__ */ jsx("span", { className: "hero-badge", children: t("badges.instant") }),
          /* @__PURE__ */ jsx("span", { className: "hero-badge", children: t("badges.secure") }),
          /* @__PURE__ */ jsx("span", { className: "hero-badge", children: t("badges.autoDeleted") })
        ] })
      ] }),
      /* @__PURE__ */ jsx(
        "div",
        {
          className: `drop-zone${isDragging ? " dragging" : ""}${file ? " has-file" : ""}`,
          onDrop: handleDrop,
          onDragOver: handleDragOver,
          onDragLeave: handleDragLeave,
          children: !file ? /* @__PURE__ */ jsxs("label", { className: "drop-content", htmlFor: "file-input", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                ref: fileInputRef,
                id: "file-input",
                type: "file",
                accept: "application/pdf",
                className: "file-input",
                onChange: handleFileInput
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "drop-icon", children: "📂" }),
            /* @__PURE__ */ jsx("p", { className: "drop-text", children: t("dropZone.text") }),
            /* @__PURE__ */ jsx("p", { className: "drop-sub", children: t("dropZone.or") }),
            /* @__PURE__ */ jsx("span", { className: "btn btn-outline", children: t("dropZone.browse") })
          ] }) : /* @__PURE__ */ jsxs("div", { className: "file-info", children: [
            /* @__PURE__ */ jsx("div", { className: "file-icon", children: "📄" }),
            /* @__PURE__ */ jsxs("div", { className: "file-details", children: [
              /* @__PURE__ */ jsx("span", { className: "file-name", children: file.name }),
              /* @__PURE__ */ jsx("span", { className: "file-size", children: formatSize$2(originalSize) })
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                className: "remove-btn",
                onClick: handleReset,
                title: t("dropZone.removeTitle"),
                children: "✕"
              }
            )
          ] })
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "convert-controls", children: [
        /* @__PURE__ */ jsx("label", { className: "convert-label", children: t("convertTo") }),
        /* @__PURE__ */ jsx("div", { className: "convert-select-wrap", children: /* @__PURE__ */ jsx(
          CustomSelect,
          {
            value: convertType,
            onChange: setConvertType,
            options: [{ value: "jpg", label: "JPG" }, { value: "png", label: "PNG" }]
          }
        ) })
      ] }),
      errorMsg2 && /* @__PURE__ */ jsx("p", { className: "error-msg", children: errorMsg2 }),
      file && status2 === "idle" && /* @__PURE__ */ jsx("button", { className: "btn btn-primary compress-btn", onClick: handleConvert, children: t("convertBtn", { type: convertType.toUpperCase() }) }),
      (status2 === "uploading" || status2 === "converting") && /* @__PURE__ */ jsxs("div", { className: "progress-section", children: [
        /* @__PURE__ */ jsx("div", { className: "progress-label", children: status2 === "uploading" ? t("progress.uploading") : t("progress.converting") }),
        /* @__PURE__ */ jsx("div", { className: "progress-bar", children: /* @__PURE__ */ jsx("div", { className: "progress-fill", style: { width: `${progress2}%` } }) })
      ] })
    ] }),
    status2 === "done" && /* @__PURE__ */ jsxs("div", { className: "result-section", children: [
      /* @__PURE__ */ jsx("div", { className: "result-icon", children: t("result.icon") }),
      /* @__PURE__ */ jsx("h2", { className: "result-title", children: t("result.title") }),
      /* @__PURE__ */ jsxs("div", { className: "size-comparison", children: [
        /* @__PURE__ */ jsxs("div", { className: "size-row", children: [
          /* @__PURE__ */ jsx("span", { className: "size-col-label", children: t("result.originalLabel") }),
          /* @__PURE__ */ jsx("span", { className: "size-col-label", children: t("result.sizeLabel") })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "size-row size-row--data", children: [
          /* @__PURE__ */ jsx("span", { className: "size-col-value", children: file.name }),
          /* @__PURE__ */ jsx("span", { className: "size-col-value", children: formatSize$2(originalSize) })
        ] })
      ] }),
      /* @__PURE__ */ jsx(
        "a",
        {
          className: "btn btn-primary",
          href: downloadUrl,
          download: downloadName,
          target: "_blank",
          rel: "noopener noreferrer",
          children: t("result.download")
        }
      ),
      /* @__PURE__ */ jsx("button", { className: "btn btn-ghost", onClick: handleReset, children: t("result.another") })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "note", children: [
      /* @__PURE__ */ jsx("span", { className: "note-icon", children: "⚠️" }),
      t("note")
    ] }),
    /* @__PURE__ */ jsx("section", { className: "converter-guide", style: { marginTop: 28 }, children: /* @__PURE__ */ jsx("div", { style: { maxWidth: 880, margin: "0 auto", padding: 18, background: "linear-gradient(180deg,#fffdf7,#ffffff)", borderRadius: 10, border: "1px solid #f0e8cc", color: "#111" }, children: /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 12 }, children: [
      /* @__PURE__ */ jsx("div", { style: { flex: "0 0 60px", fontSize: 34, lineHeight: 1 }, children: "🔄" }),
      /* @__PURE__ */ jsxs("div", { style: { flex: 1, minWidth: 0 }, children: [
        /* @__PURE__ */ jsx("h2", { style: { margin: 0, fontSize: 22 }, children: t("guide.title") }),
        /* @__PURE__ */ jsx("p", { style: { marginTop: 8 }, children: t("guide.intro") }),
        /* @__PURE__ */ jsx("p", { style: { marginTop: 6, fontWeight: 700 }, children: t("guide.cta") }),
        /* @__PURE__ */ jsx("br", {}),
        /* @__PURE__ */ jsx("h3", { style: { marginTop: 12 }, children: t("guide.whatIs.heading") }),
        /* @__PURE__ */ jsx("p", { children: t("guide.whatIs.body") }),
        /* @__PURE__ */ jsxs("ul", { style: { marginLeft: 0, paddingLeft: 0, listStyle: "none" }, children: [
          /* @__PURE__ */ jsx("li", { style: { color: "#AAA" }, children: t("guide.whatIs.item1") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.whatIs.item2") }),
          /* @__PURE__ */ jsx("li", { style: { color: "#AAA" }, children: t("guide.whatIs.item3") })
        ] }),
        /* @__PURE__ */ jsx("p", { style: { marginTop: 6 }, children: t("guide.whatIs.note") }),
        /* @__PURE__ */ jsx("br", {}),
        /* @__PURE__ */ jsx("h3", { style: { marginTop: 10 }, children: t("guide.whyConvert.heading") }),
        /* @__PURE__ */ jsxs("ul", { style: { marginLeft: 0, paddingLeft: 0, listStyle: "none" }, children: [
          /* @__PURE__ */ jsx("li", { children: t("guide.whyConvert.item1") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.whyConvert.item2") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.whyConvert.item3") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.whyConvert.item4") })
        ] }),
        /* @__PURE__ */ jsx("br", {}),
        /* @__PURE__ */ jsx("h3", { style: { marginTop: 10 }, children: t("guide.howWorks.heading") }),
        /* @__PURE__ */ jsx("p", { children: t("guide.howWorks.body") }),
        /* @__PURE__ */ jsx("br", {}),
        /* @__PURE__ */ jsx("h3", { style: { marginTop: 10 }, children: t("guide.whyBreaks.heading") }),
        /* @__PURE__ */ jsx("p", { children: t("guide.whyBreaks.body") }),
        /* @__PURE__ */ jsx("br", {}),
        /* @__PURE__ */ jsx("h3", { style: { marginTop: 10 }, children: t("guide.bestPractices.heading") }),
        /* @__PURE__ */ jsxs("ul", { style: { marginLeft: 0, paddingLeft: 0, listStyle: "none" }, children: [
          /* @__PURE__ */ jsx("li", { children: t("guide.bestPractices.item1") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.bestPractices.item2") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.bestPractices.item3") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.bestPractices.item4") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.bestPractices.item5") })
        ] }),
        /* @__PURE__ */ jsx("br", {}),
        /* @__PURE__ */ jsx("h3", { style: { marginTop: 10 }, children: t("guide.stepByStep.heading") }),
        /* @__PURE__ */ jsxs("ol", { style: { marginLeft: 16 }, children: [
          /* @__PURE__ */ jsx("li", { children: t("guide.stepByStep.step1") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.stepByStep.step2") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.stepByStep.step3") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.stepByStep.step4") })
        ] }),
        /* @__PURE__ */ jsx("p", { style: { marginTop: 6 }, children: t("guide.stepByStep.note") }),
        /* @__PURE__ */ jsx("br", {}),
        /* @__PURE__ */ jsx("h3", { style: { marginTop: 10 }, children: t("guide.scenarios.heading") }),
        /* @__PURE__ */ jsxs("ul", { style: { marginLeft: 0, paddingLeft: 0, listStyle: "none" }, children: [
          /* @__PURE__ */ jsx("li", { children: t("guide.scenarios.item1") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.scenarios.item2") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.scenarios.item3") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.scenarios.item4") })
        ] }),
        /* @__PURE__ */ jsx("br", {}),
        /* @__PURE__ */ jsx("h3", { style: { marginTop: 10 }, children: t("guide.mistakes.heading") }),
        /* @__PURE__ */ jsxs("ul", { style: { marginLeft: 0, paddingLeft: 0, listStyle: "none" }, children: [
          /* @__PURE__ */ jsx("li", { children: t("guide.mistakes.item1") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.mistakes.item2") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.mistakes.item3") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.mistakes.item4") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.mistakes.item5") })
        ] }),
        /* @__PURE__ */ jsx("br", {}),
        /* @__PURE__ */ jsx("h3", { style: { marginTop: 10 }, children: t("guide.comparison.heading") }),
        /* @__PURE__ */ jsxs("table", { style: { width: "100%", borderCollapse: "collapse", marginTop: 8 }, children: [
          /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { style: { borderBottom: "1px solid #f0e8cc" }, children: [
            /* @__PURE__ */ jsx("th", { style: { textAlign: "left", padding: 6 }, children: t("guide.comparison.col1") }),
            /* @__PURE__ */ jsx("th", { style: { textAlign: "left", padding: 6 }, children: t("guide.comparison.col2") }),
            /* @__PURE__ */ jsx("th", { style: { textAlign: "left", padding: 6 }, children: t("guide.comparison.col3") })
          ] }) }),
          /* @__PURE__ */ jsxs("tbody", { children: [
            /* @__PURE__ */ jsxs("tr", { children: [
              /* @__PURE__ */ jsx("td", { style: { padding: 6, borderBottom: "1px solid #faf5e4" }, children: t("guide.comparison.row1col1") }),
              /* @__PURE__ */ jsx("td", { style: { padding: 6, borderBottom: "1px solid #faf5e4" }, children: t("guide.comparison.row1col2") }),
              /* @__PURE__ */ jsx("td", { style: { padding: 6, borderBottom: "1px solid #faf5e4" }, children: t("guide.comparison.row1col3") })
            ] }),
            /* @__PURE__ */ jsxs("tr", { children: [
              /* @__PURE__ */ jsx("td", { style: { padding: 6, borderBottom: "1px solid #faf5e4" }, children: t("guide.comparison.row2col1") }),
              /* @__PURE__ */ jsx("td", { style: { padding: 6, borderBottom: "1px solid #faf5e4" }, children: t("guide.comparison.row2col2") }),
              /* @__PURE__ */ jsx("td", { style: { padding: 6, borderBottom: "1px solid #faf5e4" }, children: t("guide.comparison.row2col3") })
            ] }),
            /* @__PURE__ */ jsxs("tr", { children: [
              /* @__PURE__ */ jsx("td", { style: { padding: 6 }, children: t("guide.comparison.row3col1") }),
              /* @__PURE__ */ jsx("td", { style: { padding: 6 }, children: t("guide.comparison.row3col2") }),
              /* @__PURE__ */ jsx("td", { style: { padding: 6 }, children: t("guide.comparison.row3col3") })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx("br", {}),
        /* @__PURE__ */ jsx("h3", { style: { marginTop: 10 }, children: t("guide.proTips.heading") }),
        /* @__PURE__ */ jsxs("ul", { style: { marginLeft: 0, paddingLeft: 0, listStyle: "none" }, children: [
          /* @__PURE__ */ jsx("li", { children: t("guide.proTips.item1") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.proTips.item2") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.proTips.item3") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.proTips.item4") })
        ] }),
        /* @__PURE__ */ jsx("br", {}),
        /* @__PURE__ */ jsx("h3", { style: { marginTop: 10 }, children: t("guide.faq.heading") }),
        /* @__PURE__ */ jsxs("p", { children: [
          /* @__PURE__ */ jsx("strong", { children: t("guide.faq.q1") }),
          " ",
          t("guide.faq.a1")
        ] }),
        /* @__PURE__ */ jsxs("p", { children: [
          /* @__PURE__ */ jsx("strong", { children: t("guide.faq.q2") }),
          " ",
          t("guide.faq.a2")
        ] }),
        /* @__PURE__ */ jsxs("p", { children: [
          /* @__PURE__ */ jsx("strong", { children: t("guide.faq.q3") }),
          " ",
          t("guide.faq.a3")
        ] }),
        /* @__PURE__ */ jsxs("p", { children: [
          /* @__PURE__ */ jsx("strong", { children: t("guide.faq.q4") }),
          " ",
          t("guide.faq.a4")
        ] }),
        /* @__PURE__ */ jsx("br", {}),
        /* @__PURE__ */ jsxs("p", { style: { marginTop: 12 }, children: [
          /* @__PURE__ */ jsxs("strong", { children: [
            "🧾 ",
            t("guide.conclusionTitle")
          ] }),
          /* @__PURE__ */ jsx("br", {}),
          t("guide.conclusion")
        ] }),
        /* @__PURE__ */ jsx("p", { style: { marginTop: 12 }, children: /* @__PURE__ */ jsx(
          "a",
          {
            className: "btn btn-primary",
            href: "/pdf-converter",
            onClick: (e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
              navigate("/pdf-converter");
            },
            children: t("guide.ctaBtn")
          }
        ) })
      ] })
    ] }) }) })
  ] });
}
function PdfConverterPage() {
  const props = usePdfConverter();
  return /* @__PURE__ */ jsxs("div", { className: "pdf-converter-page", children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsx("main", { className: "main", children: /* @__PURE__ */ jsx("div", { className: "container", children: /* @__PURE__ */ jsx("div", { className: "card", children: /* @__PURE__ */ jsx(PdfConverterView, { ...props }) }) }) }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
function parseSegments(cleaned) {
  return cleaned.split(",").map((token) => {
    const trimmed = token.trim();
    if (trimmed.includes("-")) {
      const [start, end] = trimmed.split("-").map(Number);
      const pages = [];
      for (let p = start; p <= end; p += 1) pages.push(p - 1);
      return { label: trimmed, pages };
    }
    return { label: trimmed, pages: [Number(trimmed) - 1] };
  });
}
function usePdfSplitter() {
  const [file, setFile] = useState(null);
  const [status2, setStatus] = useState("idle");
  const [progress2, setProgress] = useState(0);
  const [originalSize, setOriginalSize] = useState(0);
  const [segments, setSegments] = useState("");
  const [outputOption, setOutputOption] = useState("ONE");
  const [results, setResults] = useState([]);
  const [errorMsg2, setErrorMsg] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const handleFile = (f) => {
    if (!f) return;
    if (f.type !== "application/pdf") {
      setErrorMsg("Please upload a valid PDF file.");
      return;
    }
    setFile(f);
    setOriginalSize(f.size);
    setStatus("idle");
    setErrorMsg("");
    setResults([]);
  };
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0]);
  }, []);
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);
  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);
  const handleFileInput = (e) => {
    handleFile(e.target.files[0]);
  };
  const validateSegments = (s) => {
    if (!s) return false;
    const cleaned = s.replace(/\s+/g, "");
    return /^([0-9]+(-[0-9]+)?)(,[0-9]+(-[0-9]+)?)*$/.test(cleaned);
  };
  const handleSplit = async () => {
    if (!file) return;
    const cleaned = segments.trim();
    if (!validateSegments(cleaned)) {
      setErrorMsg("Invalid page ranges. Use formats like: 1,3-5,7-10");
      return;
    }
    try {
      setStatus("splitting");
      setProgress(10);
      setErrorMsg("");
      const arrayBuffer = await file.arrayBuffer();
      const { PDFDocument } = await import("pdf-lib");
      const sourcePdf = await PDFDocument.load(arrayBuffer);
      setProgress(30);
      const parsed = parseSegments(cleaned);
      const totalPages = sourcePdf.getPageCount();
      for (const token of parsed) {
        for (const pageIndex of token.pages) {
          if (pageIndex < 0 || pageIndex >= totalPages) {
            const pageNum = pageIndex + 1;
            throw new Error(`Page ${pageNum} does not exist. This PDF has ${totalPages} page${totalPages === 1 ? "" : "s"}.`);
          }
        }
      }
      const newResults = [];
      if (outputOption === "ONE") {
        const outPdf = await PDFDocument.create();
        for (const token of parsed) {
          const copied = await outPdf.copyPages(sourcePdf, token.pages);
          copied.forEach((page) => outPdf.addPage(page));
        }
        const bytes = await outPdf.save();
        const blob = new Blob([bytes], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        newResults.push({ splitKey: "0", segment: cleaned, url });
      } else {
        for (let i = 0; i < parsed.length; i += 1) {
          const token = parsed[i];
          const outPdf = await PDFDocument.create();
          const copied = await outPdf.copyPages(sourcePdf, token.pages);
          copied.forEach((page) => outPdf.addPage(page));
          const bytes = await outPdf.save();
          const blob = new Blob([bytes], { type: "application/pdf" });
          const url = URL.createObjectURL(blob);
          newResults.push({ splitKey: String(i), segment: token.label, url });
          const splitProgress = 30 + Math.round((i + 1) / parsed.length * 60);
          setProgress(splitProgress);
        }
      }
      setResults(newResults);
      setProgress(100);
      setStatus("done");
    } catch (err) {
      setErrorMsg(err.message || "An unexpected error occurred.");
      setStatus("error");
    }
  };
  const handleReset = () => {
    results.forEach((r) => URL.revokeObjectURL(r.url));
    setFile(null);
    setStatus("idle");
    setProgress(0);
    setOriginalSize(0);
    setResults([]);
    setErrorMsg("");
    setSegments("");
    setOutputOption("ONE");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  return {
    file,
    status: status2,
    progress: progress2,
    originalSize,
    segments,
    setSegments,
    outputOption,
    setOutputOption,
    results,
    errorMsg: errorMsg2,
    isDragging,
    fileInputRef,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    handleFileInput,
    handleSplit,
    handleReset
  };
}
function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
function PdfSplitterView({
  file,
  status: status2,
  progress: progress2,
  originalSize,
  segments,
  setSegments,
  outputOption,
  setOutputOption,
  results,
  errorMsg: errorMsg2,
  isDragging,
  fileInputRef,
  handleDrop,
  handleDragOver,
  handleDragLeave,
  handleFileInput,
  handleSplit,
  handleReset
}) {
  const { t } = useTranslation("pdfSplitter");
  const [openPanel, setOpenPanel] = useState("");
  const navigate = useNavigate();
  const togglePanel = (panel) => setOpenPanel((prev) => prev === panel ? "" : panel);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    status2 !== "done" && /* @__PURE__ */ jsxs("div", { className: "hero-section", children: [
      /* @__PURE__ */ jsx("h1", { className: "hero-title", children: t("hero.title") }),
      /* @__PURE__ */ jsx("p", { className: "hero-tagline", children: t("hero.tagline") }),
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: 12, background: "#fffbe6", border: "1px solid #ffe58f", borderRadius: 8, padding: "10px 16px", marginBottom: 12 }, children: [
        /* @__PURE__ */ jsx("span", { style: { fontSize: 18 }, children: "🖼️" }),
        /* @__PURE__ */ jsx("span", { style: { flex: 1, fontSize: 14, color: "#7c6000" }, children: t("hint.text") }),
        /* @__PURE__ */ jsx(
          Link,
          {
            to: "/pdf-merger",
            style: { whiteSpace: "nowrap", background: "#faad14", color: "#fff", border: "none", borderRadius: 6, padding: "6px 14px", fontSize: 13, fontWeight: 600, textDecoration: "none", cursor: "pointer" },
            children: t("hint.btn")
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "details-controls", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            className: `tab-btn${openPanel === "details" ? " active" : ""}`,
            onClick: () => togglePanel("details"),
            "aria-expanded": openPanel === "details",
            type: "button",
            children: t("tabs.details")
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            className: `tab-btn${openPanel === "howitworks" ? " active" : ""}`,
            onClick: () => togglePanel("howitworks"),
            "aria-expanded": openPanel === "howitworks",
            type: "button",
            children: t("tabs.howItWorks")
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: `shared-collapse${!openPanel ? " panel-hidden" : ""}`, children: [
        /* @__PURE__ */ jsxs("div", { className: openPanel !== "details" ? "tool-details-open panel-hidden" : "tool-details-open", children: [
          /* @__PURE__ */ jsx("h3", { children: t("details.whatIs.heading") }),
          /* @__PURE__ */ jsx("p", { children: t("details.whatIs.body") }),
          /* @__PURE__ */ jsx("h3", { children: t("details.outputOptions.heading") }),
          /* @__PURE__ */ jsx("p", { children: t("details.outputOptions.intro") }),
          /* @__PURE__ */ jsxs("ul", { children: [
            /* @__PURE__ */ jsx("li", { children: t("details.outputOptions.multiple") }),
            /* @__PURE__ */ jsx("li", { children: t("details.outputOptions.single") })
          ] }),
          /* @__PURE__ */ jsx("h3", { children: t("details.pageRangeFormat.heading") }),
          /* @__PURE__ */ jsx("p", { children: t("details.pageRangeFormat.intro") }),
          /* @__PURE__ */ jsxs("ul", { children: [
            /* @__PURE__ */ jsx("li", { children: t("details.pageRangeFormat.single") }),
            /* @__PURE__ */ jsx("li", { children: t("details.pageRangeFormat.contiguous") }),
            /* @__PURE__ */ jsx("li", { children: t("details.pageRangeFormat.mixed") })
          ] }),
          /* @__PURE__ */ jsx("p", { children: t("details.pageRangeFormat.note") }),
          /* @__PURE__ */ jsx("h3", { children: t("details.tradeoffs.heading") }),
          /* @__PURE__ */ jsxs("ul", { children: [
            /* @__PURE__ */ jsx("li", { children: t("details.tradeoffs.fidelity") }),
            /* @__PURE__ */ jsx("li", { children: t("details.tradeoffs.performance") }),
            /* @__PURE__ */ jsx("li", { children: t("details.tradeoffs.order") })
          ] }),
          /* @__PURE__ */ jsx("h3", { children: t("details.practical.heading") }),
          /* @__PURE__ */ jsxs("ul", { children: [
            /* @__PURE__ */ jsx("li", { children: t("details.practical.item1") }),
            /* @__PURE__ */ jsx("li", { children: t("details.practical.item2") }),
            /* @__PURE__ */ jsx("li", { children: t("details.practical.item3") })
          ] }),
          /* @__PURE__ */ jsx("h3", { children: t("details.whatItDoes.heading") }),
          /* @__PURE__ */ jsxs("ul", { children: [
            /* @__PURE__ */ jsx("li", { children: t("details.whatItDoes.item1") }),
            /* @__PURE__ */ jsx("li", { children: t("details.whatItDoes.item2") }),
            /* @__PURE__ */ jsx("li", { children: t("details.whatItDoes.item3") }),
            /* @__PURE__ */ jsx("li", { children: t("details.whatItDoes.item4") })
          ] }),
          /* @__PURE__ */ jsx("h3", { children: t("details.usefulWhen.heading") }),
          /* @__PURE__ */ jsxs("ul", { children: [
            /* @__PURE__ */ jsx("li", { children: t("details.usefulWhen.item1") }),
            /* @__PURE__ */ jsx("li", { children: t("details.usefulWhen.item2") }),
            /* @__PURE__ */ jsx("li", { children: t("details.usefulWhen.item3") }),
            /* @__PURE__ */ jsx("li", { children: t("details.usefulWhen.item4") })
          ] }),
          /* @__PURE__ */ jsx("h3", { children: t("details.comparison.heading") }),
          /* @__PURE__ */ jsxs("ul", { children: [
            /* @__PURE__ */ jsx("li", { children: t("details.comparison.browser") }),
            /* @__PURE__ */ jsx("li", { children: t("details.comparison.desktop") }),
            /* @__PURE__ */ jsx("li", { children: t("details.comparison.commandLine") })
          ] }),
          /* @__PURE__ */ jsx("h3", { children: t("details.privacy.heading") }),
          /* @__PURE__ */ jsx("p", { children: t("details.privacy.body") }),
          /* @__PURE__ */ jsx("h3", { children: t("details.faq.heading") }),
          /* @__PURE__ */ jsxs("ul", { children: [
            /* @__PURE__ */ jsxs("li", { children: [
              /* @__PURE__ */ jsx("strong", { children: t("details.faq.q1") }),
              " ",
              t("details.faq.a1")
            ] }),
            /* @__PURE__ */ jsxs("li", { children: [
              /* @__PURE__ */ jsx("strong", { children: t("details.faq.q2") }),
              " ",
              t("details.faq.a2")
            ] }),
            /* @__PURE__ */ jsxs("li", { children: [
              /* @__PURE__ */ jsx("strong", { children: t("details.faq.q3") }),
              " ",
              t("details.faq.a3")
            ] }),
            /* @__PURE__ */ jsxs("li", { children: [
              /* @__PURE__ */ jsx("strong", { children: t("details.faq.q4") }),
              " ",
              t("details.faq.a4")
            ] }),
            /* @__PURE__ */ jsxs("li", { children: [
              /* @__PURE__ */ jsx("strong", { children: t("details.faq.q5") }),
              " ",
              t("details.faq.a5")
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: openPanel !== "howitworks" ? "tool-howitworks-open panel-hidden" : "tool-howitworks-open", children: /* @__PURE__ */ jsxs("ol", { style: { margin: 0, paddingLeft: "1rem" }, children: [
          /* @__PURE__ */ jsxs("li", { style: { marginBottom: "0.75rem" }, children: [
            /* @__PURE__ */ jsx("img", { src: "/screenshots/splitter/PDF-splitter-001.png", alt: "Step 1", className: "how-img" }),
            /* @__PURE__ */ jsx("p", { children: t("howItWorks.step1") })
          ] }),
          /* @__PURE__ */ jsxs("li", { style: { marginBottom: "0.75rem" }, children: [
            /* @__PURE__ */ jsx("img", { src: "/screenshots/splitter/PDF-splitter-002.png", alt: "Step 2", className: "how-img" }),
            /* @__PURE__ */ jsx("p", { children: t("howItWorks.step2") })
          ] }),
          /* @__PURE__ */ jsxs("li", { style: { marginBottom: "0.75rem" }, children: [
            /* @__PURE__ */ jsx("img", { src: "/screenshots/splitter/PDF-splitter-003.png", alt: "Step 3", className: "how-img" }),
            /* @__PURE__ */ jsx("p", { children: t("howItWorks.step3") })
          ] }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("p", { children: t("howItWorks.step4") }) })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "hero-badges", children: [
        /* @__PURE__ */ jsx("span", { className: "hero-badge", children: t("badges.instant") }),
        /* @__PURE__ */ jsx("span", { className: "hero-badge", children: t("badges.secure") }),
        /* @__PURE__ */ jsx("span", { className: "hero-badge", children: t("badges.autoDeleted") })
      ] })
    ] }),
    status2 !== "done" && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          className: `drop-zone${isDragging ? " dragging" : ""}${file ? " has-file" : ""}`,
          onDrop: handleDrop,
          onDragOver: handleDragOver,
          onDragLeave: handleDragLeave,
          children: !file ? /* @__PURE__ */ jsxs("label", { className: "drop-content", htmlFor: "file-input", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                ref: fileInputRef,
                id: "file-input",
                type: "file",
                accept: "application/pdf",
                className: "file-input",
                onChange: handleFileInput
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "drop-icon", children: "📂" }),
            /* @__PURE__ */ jsx("p", { className: "drop-text hero-tagline", children: t("dropZone.text") }),
            /* @__PURE__ */ jsx("p", { className: "drop-sub", children: t("dropZone.or") }),
            /* @__PURE__ */ jsx("span", { className: "btn btn-outline", children: t("dropZone.browse") })
          ] }) : /* @__PURE__ */ jsxs("div", { className: "file-info", children: [
            /* @__PURE__ */ jsx("div", { className: "file-icon", children: "📄" }),
            /* @__PURE__ */ jsxs("div", { className: "file-details", children: [
              /* @__PURE__ */ jsx("span", { className: "file-name", children: file.name }),
              /* @__PURE__ */ jsx("span", { className: "file-size", children: formatSize(originalSize) })
            ] }),
            /* @__PURE__ */ jsx("button", { className: "remove-btn", onClick: handleReset, title: t("dropZone.removeTitle"), children: "✕" })
          ] })
        }
      ),
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "0.75rem" }, children: [
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }, children: [
          /* @__PURE__ */ jsxs("label", { className: "hero-tagline", style: { display: "flex", gap: 8, alignItems: "center" }, children: [
            t("pageRangesLabel"),
            /* @__PURE__ */ jsx(
              "input",
              {
                "aria-label": t("pageRangesLabel").replace(":", ""),
                placeholder: t("pageRangesPlaceholder"),
                value: segments,
                onChange: (e) => setSegments(e.target.value),
                className: "segments-input",
                style: { padding: "6px 8px", borderRadius: 6, border: `1px solid ${segments && !/^(\d+\s*(-\s*\d+)?)(,\s*(\d+\s*(-\s*\d+)?))*$/.test(segments.trim()) ? "#ef4444" : "#d1d5db"}` }
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "hero-tagline", style: { display: "flex", gap: 8, alignItems: "center" }, children: [
            /* @__PURE__ */ jsx("label", { style: { display: "flex", gap: 6, alignItems: "center" }, children: t("outputLabel") }),
            /* @__PURE__ */ jsxs("label", { style: { display: "flex", gap: 6, alignItems: "center" }, children: [
              /* @__PURE__ */ jsx("input", { type: "radio", name: "output", checked: outputOption === "ONE", onChange: () => setOutputOption("ONE") }),
              " ",
              t("outputSingle")
            ] }),
            /* @__PURE__ */ jsxs("label", { style: { display: "flex", gap: 6, alignItems: "center" }, children: [
              /* @__PURE__ */ jsx("input", { type: "radio", name: "output", checked: outputOption === "MULTIPLE", onChange: () => setOutputOption("MULTIPLE") }),
              " ",
              t("outputMultiple")
            ] })
          ] })
        ] }),
        errorMsg2 && /* @__PURE__ */ jsx("p", { className: "error-msg", children: errorMsg2 }),
        file && (status2 === "idle" || status2 === "error") && /* @__PURE__ */ jsx("button", { className: "btn btn-primary compress-btn", onClick: handleSplit, disabled: !segments, children: t("splitBtn") })
      ] }),
      status2 === "splitting" && /* @__PURE__ */ jsxs("div", { className: "progress-section", style: { marginTop: 12 }, children: [
        /* @__PURE__ */ jsx("div", { className: "progress-label", children: t("progress.splitting") }),
        /* @__PURE__ */ jsx("div", { className: "progress-bar", children: /* @__PURE__ */ jsx("div", { className: "progress-fill", style: { width: `${progress2}%` } }) })
      ] })
    ] }),
    status2 === "done" && /* @__PURE__ */ jsxs("div", { className: "result-section", children: [
      /* @__PURE__ */ jsx("div", { className: "result-icon", children: t("result.icon") }),
      /* @__PURE__ */ jsx("h2", { className: "result-title", children: t("result.title") }),
      /* @__PURE__ */ jsxs("div", { className: "split-results", children: [
        /* @__PURE__ */ jsxs("div", { className: "split-row", children: [
          /* @__PURE__ */ jsx("span", { className: "split-col-label", children: t("result.segmentLabel") }),
          /* @__PURE__ */ jsx("span", { className: "split-col-label", children: t("result.downloadLabel") })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "split-row--spacer" }),
        results.map((r) => /* @__PURE__ */ jsxs("div", { className: "split-row split-row--data", children: [
          /* @__PURE__ */ jsx("span", { className: "split-col-value", children: r.segment }),
          /* @__PURE__ */ jsx(
            "button",
            {
              className: "btn btn-primary split-download-btn",
              type: "button",
              onClick: (e) => {
                e.preventDefault();
                const a = document.createElement("a");
                a.href = r.url;
                a.download = `Segments: ${r.segment}.pdf`;
                document.body.appendChild(a);
                a.click();
                a.remove();
              },
              children: t("result.downloadBtn")
            }
          )
        ] }, r.splitKey))
      ] }),
      /* @__PURE__ */ jsx("button", { className: "btn btn-ghost", onClick: handleReset, children: t("result.another") })
    ] }),
    /* @__PURE__ */ jsx("section", { className: "splitter-guide", style: { marginTop: 28 }, children: /* @__PURE__ */ jsx("div", { style: { maxWidth: 880, margin: "0 auto", padding: 18, background: "linear-gradient(180deg,#f4fdf7,#ffffff)", borderRadius: 10, border: "1px solid #c8ebd5", color: "#111" }, children: /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 12 }, children: [
      /* @__PURE__ */ jsx("div", { style: { flex: "0 0 60px", fontSize: 34, lineHeight: 1 }, children: "✂️" }),
      /* @__PURE__ */ jsxs("div", { style: { flex: 1, minWidth: 0 }, children: [
        /* @__PURE__ */ jsx("h2", { style: { margin: 0, fontSize: 22 }, children: t("guide.title") }),
        /* @__PURE__ */ jsx("p", { style: { marginTop: 8 }, children: t("guide.intro") }),
        /* @__PURE__ */ jsx("p", { style: { marginTop: 6, fontWeight: 700 }, children: t("guide.cta") }),
        /* @__PURE__ */ jsx("br", {}),
        /* @__PURE__ */ jsx("h3", { style: { marginTop: 12 }, children: t("guide.whatIs.heading") }),
        /* @__PURE__ */ jsx("p", { children: t("guide.whatIs.body") }),
        /* @__PURE__ */ jsxs("ul", { style: { marginLeft: 0, paddingLeft: 0, listStyle: "none" }, children: [
          /* @__PURE__ */ jsx("li", { children: t("guide.whatIs.item1") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.whatIs.item2") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.whatIs.item3") })
        ] }),
        /* @__PURE__ */ jsx("br", {}),
        /* @__PURE__ */ jsx("h3", { style: { marginTop: 10 }, children: t("guide.whyUseful.heading") }),
        /* @__PURE__ */ jsxs("ul", { style: { marginLeft: 0, paddingLeft: 0, listStyle: "none" }, children: [
          /* @__PURE__ */ jsx("li", { children: t("guide.whyUseful.item1") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.whyUseful.item2") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.whyUseful.item3") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.whyUseful.item4") })
        ] }),
        /* @__PURE__ */ jsx("br", {}),
        /* @__PURE__ */ jsx("h3", { style: { marginTop: 10 }, children: t("guide.useCases.heading") }),
        /* @__PURE__ */ jsxs("ul", { style: { marginLeft: 0, paddingLeft: 0, listStyle: "none" }, children: [
          /* @__PURE__ */ jsx("li", { children: t("guide.useCases.item1") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.useCases.item2") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.useCases.item3") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.useCases.item4") })
        ] }),
        /* @__PURE__ */ jsx("br", {}),
        /* @__PURE__ */ jsx("h3", { style: { marginTop: 10 }, children: t("guide.ways.heading") }),
        /* @__PURE__ */ jsxs("ul", { style: { marginLeft: 0, paddingLeft: 0, listStyle: "none" }, children: [
          /* @__PURE__ */ jsx("li", { children: t("guide.ways.item1") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.ways.item2") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.ways.item3") })
        ] }),
        /* @__PURE__ */ jsx("br", {}),
        /* @__PURE__ */ jsx("h3", { style: { marginTop: 10 }, children: t("guide.stepByStep.heading") }),
        /* @__PURE__ */ jsxs("ol", { style: { marginLeft: 16 }, children: [
          /* @__PURE__ */ jsx("li", { children: t("guide.stepByStep.step1") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.stepByStep.step2") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.stepByStep.step3") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.stepByStep.step4") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.stepByStep.step5") })
        ] }),
        /* @__PURE__ */ jsx("br", {}),
        /* @__PURE__ */ jsx("h3", { style: { marginTop: 10 }, children: t("guide.bestPractices.heading") }),
        /* @__PURE__ */ jsxs("ul", { style: { marginLeft: 0, paddingLeft: 0, listStyle: "none" }, children: [
          /* @__PURE__ */ jsx("li", { children: t("guide.bestPractices.item1") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.bestPractices.item2") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.bestPractices.item3") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.bestPractices.item4") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.bestPractices.item5") })
        ] }),
        /* @__PURE__ */ jsx("br", {}),
        /* @__PURE__ */ jsx("h3", { style: { marginTop: 10 }, children: t("guide.mistakes.heading") }),
        /* @__PURE__ */ jsxs("ul", { style: { marginLeft: 0, paddingLeft: 0, listStyle: "none" }, children: [
          /* @__PURE__ */ jsx("li", { children: t("guide.mistakes.item1") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.mistakes.item2") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.mistakes.item3") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.mistakes.item4") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.mistakes.item5") })
        ] }),
        /* @__PURE__ */ jsx("br", {}),
        /* @__PURE__ */ jsx("h3", { style: { marginTop: 10 }, children: t("guide.comparison.heading") }),
        /* @__PURE__ */ jsxs("div", { style: { overflowX: "auto" }, children: [
          /* @__PURE__ */ jsxs("table", { style: { width: "100%", borderCollapse: "collapse", marginTop: 8 }, children: [
            /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { style: { borderBottom: "1px solid #c8ebd5" }, children: [
              /* @__PURE__ */ jsx("th", { style: { textAlign: "left", padding: 6 }, children: t("guide.comparison.col1") }),
              /* @__PURE__ */ jsx("th", { style: { textAlign: "left", padding: 6 }, children: t("guide.comparison.col2") }),
              /* @__PURE__ */ jsx("th", { style: { textAlign: "left", padding: 6 }, children: t("guide.comparison.col3") })
            ] }) }),
            /* @__PURE__ */ jsxs("tbody", { children: [
              /* @__PURE__ */ jsxs("tr", { children: [
                /* @__PURE__ */ jsx("td", { style: { padding: 6, borderBottom: "1px solid #edf7f1" }, children: t("guide.comparison.row1col1") }),
                /* @__PURE__ */ jsx("td", { style: { padding: 6, borderBottom: "1px solid #edf7f1" }, children: t("guide.comparison.row1col2") }),
                /* @__PURE__ */ jsx("td", { style: { padding: 6, borderBottom: "1px solid #edf7f1" }, children: t("guide.comparison.row1col3") })
              ] }),
              /* @__PURE__ */ jsxs("tr", { children: [
                /* @__PURE__ */ jsx("td", { style: { padding: 6, borderBottom: "1px solid #edf7f1" }, children: t("guide.comparison.row2col1") }),
                /* @__PURE__ */ jsx("td", { style: { padding: 6, borderBottom: "1px solid #edf7f1" }, children: t("guide.comparison.row2col2") }),
                /* @__PURE__ */ jsx("td", { style: { padding: 6, borderBottom: "1px solid #edf7f1" }, children: t("guide.comparison.row2col3") })
              ] }),
              /* @__PURE__ */ jsxs("tr", { children: [
                /* @__PURE__ */ jsx("td", { style: { padding: 6 }, children: t("guide.comparison.row3col1") }),
                /* @__PURE__ */ jsx("td", { style: { padding: 6 }, children: t("guide.comparison.row3col2") }),
                /* @__PURE__ */ jsx("td", { style: { padding: 6 }, children: t("guide.comparison.row3col3") })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsx("p", { style: { marginTop: 6 }, children: t("guide.comparison.note") })
        ] }),
        /* @__PURE__ */ jsx("br", {}),
        /* @__PURE__ */ jsx("h3", { style: { marginTop: 10 }, children: t("guide.proTips.heading") }),
        /* @__PURE__ */ jsxs("ul", { style: { marginLeft: 0, paddingLeft: 0, listStyle: "none" }, children: [
          /* @__PURE__ */ jsx("li", { children: t("guide.proTips.item1") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.proTips.item2") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.proTips.item3") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.proTips.item4") })
        ] }),
        /* @__PURE__ */ jsx("br", {}),
        /* @__PURE__ */ jsx("h3", { style: { marginTop: 10 }, children: t("guide.safety.heading") }),
        /* @__PURE__ */ jsx("p", { children: t("guide.safety.body") }),
        /* @__PURE__ */ jsx("br", {}),
        /* @__PURE__ */ jsx("h3", { style: { marginTop: 10 }, children: t("guide.faq.heading") }),
        /* @__PURE__ */ jsxs("p", { children: [
          /* @__PURE__ */ jsx("strong", { children: t("guide.faq.q1") }),
          " ",
          t("guide.faq.a1")
        ] }),
        /* @__PURE__ */ jsxs("p", { children: [
          /* @__PURE__ */ jsx("strong", { children: t("guide.faq.q2") }),
          " ",
          t("guide.faq.a2")
        ] }),
        /* @__PURE__ */ jsxs("p", { children: [
          /* @__PURE__ */ jsx("strong", { children: t("guide.faq.q3") }),
          " ",
          t("guide.faq.a3")
        ] }),
        /* @__PURE__ */ jsxs("p", { children: [
          /* @__PURE__ */ jsx("strong", { children: t("guide.faq.q4") }),
          " ",
          t("guide.faq.a4")
        ] }),
        /* @__PURE__ */ jsx("br", {}),
        /* @__PURE__ */ jsxs("h3", { style: { marginTop: 10 }, children: [
          "🧾 ",
          t("guide.conclusionTitle")
        ] }),
        /* @__PURE__ */ jsx("p", { children: t("guide.conclusion") }),
        /* @__PURE__ */ jsx("p", { style: { marginTop: 12 }, children: /* @__PURE__ */ jsx(
          "a",
          {
            className: "btn btn-primary",
            href: "/pdf-splitter",
            onClick: (e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
              navigate("/pdf-splitter");
            },
            children: t("guide.ctaBtn")
          }
        ) })
      ] })
    ] }) }) })
  ] });
}
function PdfSplitterPage() {
  const props = usePdfSplitter();
  return /* @__PURE__ */ jsxs("div", { className: "pdf-splitter-page", children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsx("main", { className: "main", children: /* @__PURE__ */ jsx("div", { className: "container", children: /* @__PURE__ */ jsx("div", { className: "card", children: /* @__PURE__ */ jsx(PdfSplitterView, { ...props }) }) }) }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
const INDENT = 2;
function formatJson(raw) {
  const parsed = JSON.parse(raw);
  return JSON.stringify(parsed, null, INDENT);
}
function JsonFormatterView() {
  const { t } = useTranslation("jsonFormatter");
  const [input2, setInput] = useState("");
  const [output2, setOutput] = useState("");
  const [error2, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [errorLine, setErrorLine] = useState(null);
  const [openPanel, setOpenPanel] = useState("");
  const navigate = useNavigate();
  const handleFormat = useCallback(() => {
    const trimmed = input2.trim();
    if (!trimmed) {
      setError(t("errors.empty"));
      setOutput("");
      setErrorLine(null);
      return;
    }
    try {
      const formatted = formatJson(trimmed);
      setOutput(formatted);
      setError("");
      setErrorLine(null);
    } catch (e) {
      setOutput("");
      let line = null;
      const match = e.message.match(/at position (\d+)/i);
      if (match) {
        const pos = parseInt(match[1], 10);
        const upToErr = trimmed.slice(0, pos);
        line = upToErr.split(/\r?\n/).length;
      } else {
        const match2 = e.message.match(/line (\d+)/i);
        if (match2) line = parseInt(match2[1], 10);
      }
      setError(t("errors.invalid", { message: e.message }));
      setErrorLine(line);
    }
  }, [input2]);
  const handleClear = () => {
    setInput("");
    setOutput("");
    setError("");
    setCopied(false);
    setErrorLine(null);
  };
  const handleCopy = async () => {
    if (!output2) return;
    try {
      await navigator.clipboard.writeText(output2);
      setCopied(true);
      setTimeout(() => setCopied(false), 2e3);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = output2;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2e3);
    }
  };
  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleFormat();
    }
  };
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx("section", { className: "formatter-section", children: /* @__PURE__ */ jsx("div", { className: "jf-container", children: /* @__PURE__ */ jsxs("div", { className: "card", children: [
    /* @__PURE__ */ jsxs("div", { className: "jf-hero", children: [
      /* @__PURE__ */ jsx("div", { className: "jf-tool-icon", "aria-hidden": "true", children: t("hero.icon") }),
      /* @__PURE__ */ jsx("h1", { className: "jf-hero-title", children: t("hero.title") }),
      /* @__PURE__ */ jsxs("p", { className: "jf-hero-subtitle", children: [
        t("hero.tagline"),
        " ",
        /* @__PURE__ */ jsx(Link, { to: "/blogs/json-formatter-guide", children: t("hero.blogLink") })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "details-row", "data-open": openPanel, children: [
        /* @__PURE__ */ jsxs("div", { className: "details-controls", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              className: `tab-btn ${openPanel === "details" ? "active" : ""}`,
              onClick: () => setOpenPanel((prev) => prev === "details" ? "" : "details"),
              "aria-expanded": openPanel === "details",
              type: "button",
              children: t("tabs.details")
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              className: `tab-btn ${openPanel === "howitworks" ? "active" : ""}`,
              onClick: () => setOpenPanel((prev) => prev === "howitworks" ? "" : "howitworks"),
              "aria-expanded": openPanel === "howitworks",
              type: "button",
              children: t("tabs.howItWorks")
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: `shared-collapse${!openPanel ? " panel-hidden" : ""}`, children: [
          /* @__PURE__ */ jsxs("div", { className: openPanel !== "details" ? "details-content panel-hidden" : "details-content", children: [
            /* @__PURE__ */ jsx("h3", { children: t("details.whatIs.heading") }),
            /* @__PURE__ */ jsx("ul", { children: /* @__PURE__ */ jsx("li", { children: t("details.whatIs.body") }) }),
            /* @__PURE__ */ jsx("h3", { children: t("details.whenToUse.heading") }),
            /* @__PURE__ */ jsx("ul", { children: /* @__PURE__ */ jsx("li", { children: t("details.whenToUse.body") }) }),
            /* @__PURE__ */ jsx("h3", { children: t("details.howFormatterWorks.heading") }),
            /* @__PURE__ */ jsx("ul", { children: /* @__PURE__ */ jsx("li", { children: t("details.howFormatterWorks.body") }) }),
            /* @__PURE__ */ jsx("h3", { children: t("details.prettyFormat.heading") }),
            /* @__PURE__ */ jsx("ul", { children: /* @__PURE__ */ jsx("li", { children: t("details.prettyFormat.body") }) }),
            /* @__PURE__ */ jsx("h3", { children: t("details.usefulWhen.heading") }),
            /* @__PURE__ */ jsxs("ul", { children: [
              /* @__PURE__ */ jsx("li", { children: t("details.usefulWhen.item1") }),
              /* @__PURE__ */ jsx("li", { children: t("details.usefulWhen.item2") }),
              /* @__PURE__ */ jsx("li", { children: t("details.usefulWhen.item3") })
            ] }),
            /* @__PURE__ */ jsx("h3", { children: t("details.faq.heading") }),
            /* @__PURE__ */ jsxs("ul", { children: [
              /* @__PURE__ */ jsxs("li", { children: [
                /* @__PURE__ */ jsx("strong", { children: t("details.faq.q1") }),
                " ",
                t("details.faq.a1")
              ] }),
              /* @__PURE__ */ jsxs("li", { children: [
                /* @__PURE__ */ jsx("strong", { children: t("details.faq.q2") }),
                " ",
                t("details.faq.a2")
              ] }),
              /* @__PURE__ */ jsxs("li", { children: [
                /* @__PURE__ */ jsx("strong", { children: t("details.faq.q3") }),
                " ",
                t("details.faq.a3")
              ] }),
              /* @__PURE__ */ jsxs("li", { children: [
                /* @__PURE__ */ jsx("strong", { children: t("details.faq.q4") }),
                " ",
                t("details.faq.a4")
              ] }),
              /* @__PURE__ */ jsxs("li", { children: [
                /* @__PURE__ */ jsx("strong", { children: t("details.faq.q5") }),
                " ",
                t("details.faq.a5")
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: openPanel !== "howitworks" ? "howitworks-content panel-hidden" : "howitworks-content", children: /* @__PURE__ */ jsxs("ol", { style: { margin: 0, paddingLeft: "1rem" }, children: [
            /* @__PURE__ */ jsxs("li", { style: { marginBottom: "0.75rem" }, children: [
              /* @__PURE__ */ jsx("img", { src: "/screenshots/json-formatter/JSON_formatter001.png", alt: "Step 1", className: "how-img" }),
              /* @__PURE__ */ jsx("p", { children: t("howItWorks.step1") })
            ] }),
            /* @__PURE__ */ jsxs("li", { style: { marginBottom: "0.75rem" }, children: [
              /* @__PURE__ */ jsx("img", { src: "/screenshots/json-formatter/JSON_formatter002.png", alt: "Step 2", className: "how-img" }),
              /* @__PURE__ */ jsx("p", { children: t("howItWorks.step2") })
            ] }),
            /* @__PURE__ */ jsxs("li", { style: { marginBottom: "0.75rem" }, children: [
              /* @__PURE__ */ jsx("img", { src: "/screenshots/json-formatter/JSON_formatter003.png", alt: "Step 3", className: "how-img" }),
              /* @__PURE__ */ jsx("p", { children: t("howItWorks.step3") })
            ] }),
            /* @__PURE__ */ jsxs("li", { children: [
              /* @__PURE__ */ jsx("img", { src: "/screenshots/json-formatter/JSON_formatter004.png", alt: "Step 4", className: "how-img" }),
              /* @__PURE__ */ jsx("p", { children: t("howItWorks.step4") })
            ] })
          ] }) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "jf-instructions-card", children: [
      /* @__PURE__ */ jsx("h2", { className: "jf-instructions-heading", children: t("howToUse.heading") }),
      /* @__PURE__ */ jsxs("ol", { className: "jf-instructions-list", children: [
        /* @__PURE__ */ jsx("li", { children: t("howToUse.step1") }),
        /* @__PURE__ */ jsx("li", { children: t("howToUse.step2") }),
        /* @__PURE__ */ jsx("li", { children: t("howToUse.step3") })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "jf-panels", children: [
      /* @__PURE__ */ jsxs("div", { className: "jf-panel", children: [
        /* @__PURE__ */ jsxs("div", { className: "jf-panel-header", children: [
          /* @__PURE__ */ jsx("span", { className: "jf-panel-label", children: t("input.label") }),
          /* @__PURE__ */ jsx(
            "button",
            {
              className: "jf-btn jf-btn-ghost",
              onClick: handleClear,
              disabled: !input2 && !output2,
              title: t("input.clearTitle"),
              children: t("input.clearBtn")
            }
          )
        ] }),
        /* @__PURE__ */ jsx(
          "textarea",
          {
            className: `jf-json-textarea${error2 ? " has-error" : ""}`,
            value: input2,
            onChange: (e) => {
              setInput(e.target.value);
              setError("");
            },
            onKeyDown: handleKeyDown,
            placeholder: t("input.placeholder"),
            spellCheck: false,
            "aria-label": t("input.ariaLabel"),
            "aria-describedby": error2 ? "json-error" : void 0
          }
        ),
        error2 && /* @__PURE__ */ jsxs("div", { id: "json-error", className: "jf-error-msg", role: "alert", children: [
          /* @__PURE__ */ jsx("span", { className: "jf-error-icon", "aria-hidden": "true", children: "⚠" }),
          error2,
          errorLine && /* @__PURE__ */ jsx("div", { className: "jf-error-line", children: t("input.errorLine", { line: errorLine }) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "jf-panel-actions", children: /* @__PURE__ */ jsx(
          "button",
          {
            className: "jf-btn jf-btn-primary",
            onClick: handleFormat,
            disabled: !input2.trim(),
            children: t("formatBtn")
          }
        ) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "jf-panel", children: [
        /* @__PURE__ */ jsxs("div", { className: "jf-panel-header", children: [
          /* @__PURE__ */ jsx("span", { className: "jf-panel-label", children: t("output.label") }),
          /* @__PURE__ */ jsx(
            "button",
            {
              className: `jf-btn jf-btn-ghost${copied ? " copied" : ""}`,
              onClick: handleCopy,
              disabled: !output2,
              title: t("output.copyTitle"),
              children: copied ? t("output.copiedBtn") : t("output.copyBtn")
            }
          )
        ] }),
        /* @__PURE__ */ jsx(
          "pre",
          {
            className: `jf-json-output${!output2 ? " empty" : ""}`,
            "aria-live": "polite",
            "aria-label": t("output.ariaLabel"),
            children: output2 || t("output.placeholder")
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "jf-guide", style: { marginTop: 28, padding: 18, borderTop: "1px solid #dddaff", color: "#111" }, children: /* @__PURE__ */ jsxs("div", { className: "jf-guide-row", style: { display: "flex", gap: 12 }, children: [
      /* @__PURE__ */ jsx("div", { className: "jf-guide-icon", style: { flex: "0 0 60px", fontSize: 34, lineHeight: 1, fontFamily: "monospace", fontWeight: 700, color: "#6c63ff" }, children: t("hero.icon") }),
      /* @__PURE__ */ jsxs("div", { className: "jf-guide-content", style: { flex: 1 }, children: [
        /* @__PURE__ */ jsx("h2", { style: { margin: 0, fontSize: 22 }, children: t("guide.title") }),
        /* @__PURE__ */ jsx("p", { style: { marginTop: 8 }, children: t("guide.intro") }),
        /* @__PURE__ */ jsx("p", { style: { marginTop: 6, fontWeight: 700 }, children: t("guide.cta") }),
        /* @__PURE__ */ jsx("h3", { style: { marginTop: 12 }, children: t("guide.whatIs.heading") }),
        /* @__PURE__ */ jsx("p", { children: t("guide.whatIs.body") }),
        /* @__PURE__ */ jsx("h3", { style: { marginTop: 10 }, children: t("guide.whatDoes.heading") }),
        /* @__PURE__ */ jsx("p", { children: t("guide.whatDoes.body") }),
        /* @__PURE__ */ jsx("p", { style: { marginTop: 8, fontWeight: 600 }, children: t("guide.whatDoes.beforeLabel") }),
        /* @__PURE__ */ jsx("pre", { style: { background: "#1e1e2e", color: "#cdd6f4", borderRadius: 6, padding: "10px 14px", fontSize: 13, overflowX: "auto" }, children: '{"name":"app","features":["json","image","pdf"],"active":true}' }),
        /* @__PURE__ */ jsx("p", { style: { marginTop: 8, fontWeight: 600 }, children: t("guide.whatDoes.afterLabel") }),
        /* @__PURE__ */ jsx("pre", { style: { background: "#1e1e2e", color: "#cdd6f4", borderRadius: 6, padding: "10px 14px", fontSize: 13, overflowX: "auto" }, children: `{
  "name": "app",
  "features": [
    "json",
    "image",
    "pdf"
  ],
  "active": true
}` }),
        /* @__PURE__ */ jsx("h3", { style: { marginTop: 10 }, children: t("guide.whySlows.heading") }),
        /* @__PURE__ */ jsxs("ul", { style: { marginLeft: 0, paddingLeft: 0, listStyle: "none" }, children: [
          /* @__PURE__ */ jsx("li", { children: t("guide.whySlows.item1") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.whySlows.item2") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.whySlows.item3") })
        ] }),
        /* @__PURE__ */ jsx("h3", { style: { marginTop: 10 }, children: t("guide.whenToUse.heading") }),
        /* @__PURE__ */ jsxs("ul", { style: { marginLeft: 0, paddingLeft: 0, listStyle: "none" }, children: [
          /* @__PURE__ */ jsx("li", { children: t("guide.whenToUse.item1") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.whenToUse.item2") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.whenToUse.item3") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.whenToUse.item4") })
        ] }),
        /* @__PURE__ */ jsx("h3", { style: { marginTop: 10 }, children: t("guide.commonErrors.heading") }),
        /* @__PURE__ */ jsxs("ul", { style: { marginLeft: 0, paddingLeft: 0, listStyle: "none" }, children: [
          /* @__PURE__ */ jsxs("li", { children: [
            t("guide.commonErrors.item1"),
            " — ",
            /* @__PURE__ */ jsx("code", { style: { background: "#eee", padding: "1px 4px", borderRadius: 3 }, children: '{"name": "test",}' })
          ] }),
          /* @__PURE__ */ jsxs("li", { children: [
            t("guide.commonErrors.item2"),
            " — ",
            /* @__PURE__ */ jsx("code", { style: { background: "#eee", padding: "1px 4px", borderRadius: 3 }, children: '{name: "test"}' })
          ] }),
          /* @__PURE__ */ jsxs("li", { children: [
            t("guide.commonErrors.item3"),
            " — ",
            /* @__PURE__ */ jsx("code", { style: { background: "#eee", padding: "1px 4px", borderRadius: 3 }, children: "{' name': ' test'}" })
          ] }),
          /* @__PURE__ */ jsxs("li", { children: [
            t("guide.commonErrors.item4"),
            " — ",
            /* @__PURE__ */ jsx("code", { style: { background: "#eee", padding: "1px 4px", borderRadius: 3 }, children: '{"user": {"id": 1}' })
          ] })
        ] }),
        /* @__PURE__ */ jsx("h3", { style: { marginTop: 10 }, children: t("guide.stepByStep.heading") }),
        /* @__PURE__ */ jsxs("ol", { style: { marginLeft: 16 }, children: [
          /* @__PURE__ */ jsx("li", { children: t("guide.stepByStep.step1") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.stepByStep.step2") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.stepByStep.step3") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.stepByStep.step4") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.stepByStep.step5") })
        ] }),
        /* @__PURE__ */ jsx("h3", { style: { marginTop: 10 }, children: t("guide.bestPractices.heading") }),
        /* @__PURE__ */ jsxs("ul", { style: { marginLeft: 0, paddingLeft: 0, listStyle: "none" }, children: [
          /* @__PURE__ */ jsx("li", { children: t("guide.bestPractices.item1") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.bestPractices.item2") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.bestPractices.item3") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.bestPractices.item4") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.bestPractices.item5") })
        ] }),
        /* @__PURE__ */ jsx("h3", { style: { marginTop: 10 }, children: t("guide.comparison.heading") }),
        /* @__PURE__ */ jsxs("table", { style: { width: "100%", borderCollapse: "collapse", marginTop: 8 }, children: [
          /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { style: { borderBottom: "1px solid #dddaff" }, children: [
            /* @__PURE__ */ jsx("th", { style: { textAlign: "left", padding: 6 }, children: t("guide.comparison.col1") }),
            /* @__PURE__ */ jsx("th", { style: { textAlign: "left", padding: 6 }, children: t("guide.comparison.col2") }),
            /* @__PURE__ */ jsx("th", { style: { textAlign: "left", padding: 6 }, children: t("guide.comparison.col3") })
          ] }) }),
          /* @__PURE__ */ jsxs("tbody", { children: [
            /* @__PURE__ */ jsxs("tr", { children: [
              /* @__PURE__ */ jsx("td", { style: { padding: 6, borderBottom: "1px solid #eeeeff" }, children: t("guide.comparison.row1col1") }),
              /* @__PURE__ */ jsx("td", { style: { padding: 6, borderBottom: "1px solid #eeeeff" }, children: t("guide.comparison.row1col2") }),
              /* @__PURE__ */ jsx("td", { style: { padding: 6, borderBottom: "1px solid #eeeeff" }, children: t("guide.comparison.row1col3") })
            ] }),
            /* @__PURE__ */ jsxs("tr", { children: [
              /* @__PURE__ */ jsx("td", { style: { padding: 6, borderBottom: "1px solid #eeeeff" }, children: t("guide.comparison.row2col1") }),
              /* @__PURE__ */ jsx("td", { style: { padding: 6, borderBottom: "1px solid #eeeeff" }, children: t("guide.comparison.row2col2") }),
              /* @__PURE__ */ jsx("td", { style: { padding: 6, borderBottom: "1px solid #eeeeff" }, children: t("guide.comparison.row2col3") })
            ] }),
            /* @__PURE__ */ jsxs("tr", { children: [
              /* @__PURE__ */ jsx("td", { style: { padding: 6 }, children: t("guide.comparison.row3col1") }),
              /* @__PURE__ */ jsx("td", { style: { padding: 6 }, children: t("guide.comparison.row3col2") }),
              /* @__PURE__ */ jsx("td", { style: { padding: 6 }, children: t("guide.comparison.row3col3") })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx("p", { style: { marginTop: 6 }, children: t("guide.comparison.workflow") }),
        /* @__PURE__ */ jsx("h3", { style: { marginTop: 10 }, children: t("guide.proTips.heading") }),
        /* @__PURE__ */ jsxs("ul", { style: { marginLeft: 0, paddingLeft: 0, listStyle: "none" }, children: [
          /* @__PURE__ */ jsx("li", { children: t("guide.proTips.item1") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.proTips.item2") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.proTips.item3") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.proTips.item4") })
        ] }),
        /* @__PURE__ */ jsx("h3", { style: { marginTop: 10 }, children: t("guide.safety.heading") }),
        /* @__PURE__ */ jsx("p", { children: t("guide.safety.body") }),
        /* @__PURE__ */ jsx("h3", { style: { marginTop: 10 }, children: t("guide.faq.heading") }),
        /* @__PURE__ */ jsxs("p", { children: [
          /* @__PURE__ */ jsx("strong", { children: t("guide.faq.q1") }),
          " ",
          t("guide.faq.a1")
        ] }),
        /* @__PURE__ */ jsxs("p", { children: [
          /* @__PURE__ */ jsx("strong", { children: t("guide.faq.q2") }),
          " ",
          t("guide.faq.a2")
        ] }),
        /* @__PURE__ */ jsxs("p", { children: [
          /* @__PURE__ */ jsx("strong", { children: t("guide.faq.q3") }),
          " ",
          t("guide.faq.a3")
        ] }),
        /* @__PURE__ */ jsxs("p", { children: [
          /* @__PURE__ */ jsx("strong", { children: t("guide.faq.q4") }),
          " ",
          t("guide.faq.a4")
        ] }),
        /* @__PURE__ */ jsx("br", {}),
        /* @__PURE__ */ jsx("p", { style: { marginTop: 12 }, children: /* @__PURE__ */ jsx("strong", { children: t("guide.conclusion") }) }),
        /* @__PURE__ */ jsx("p", { style: { marginTop: 12 }, children: /* @__PURE__ */ jsx(
          "a",
          {
            className: "btn btn-primary",
            href: "/json-formatter",
            onClick: (e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
              navigate("/json-formatter");
            },
            children: t("guide.ctaBtn")
          }
        ) })
      ] })
    ] }) })
  ] }) }) }) });
}
function JsonFormatterPage() {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsx("main", { style: { flex: 1, display: "flex", flexDirection: "column" }, children: /* @__PURE__ */ jsx(JsonFormatterView, {}) }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
function escapeRegexLiteral(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}
function buildRegex(pattern, isRegex, flagsToggle) {
  const flags = "g" + (flagsToggle.i ? "i" : "") + (flagsToggle.m ? "m" : "");
  try {
    const source = isRegex ? pattern : escapeRegexLiteral(pattern);
    return { regex: new RegExp(source, flags), error: null };
  } catch (e) {
    return { regex: null, error: e.message || "Invalid pattern" };
  }
}
function highlightHtml(text, regex) {
  if (!regex) return escapeHtml(text);
  let result2 = "";
  let lastIndex = 0;
  let m;
  while ((m = regex.exec(text)) !== null) {
    result2 += escapeHtml(text.slice(lastIndex, m.index));
    result2 += `<mark class="rt-match">${escapeHtml(m[0])}</mark>`;
    lastIndex = m.index + (m[0].length || 0);
    if (regex.lastIndex === m.index) regex.lastIndex++;
  }
  result2 += escapeHtml(text.slice(lastIndex));
  return result2;
}
function RegexTesterView() {
  const { t } = useTranslation("regexTester");
  const navigate = useNavigate();
  const [inputText, setInputText] = useState("");
  const [searchPattern, setSearchPattern] = useState("");
  const [replaceText, setReplaceText] = useState("");
  const [isRegex, setIsRegex] = useState(true);
  const [flagsToggle, setFlagsToggle] = useState({ i: false, m: false });
  const [regexError, setRegexError] = useState(null);
  const [outputText, setOutputText] = useState("");
  const [matchCount, setMatchCount] = useState(0);
  const [copied, setCopied] = useState(false);
  const [openPanel, setOpenPanel] = useState("");
  const [showReplace, setShowReplace] = useState(false);
  const { regex, error: error2 } = useMemo(
    () => buildRegex(searchPattern, isRegex, flagsToggle),
    [searchPattern, isRegex, flagsToggle]
  );
  useEffect(() => {
    setRegexError(error2);
    if (!regex || !searchPattern) {
      setMatchCount(0);
      return;
    }
    try {
      const r = new RegExp(regex.source, regex.flags);
      setMatchCount([...inputText.matchAll(r)].length);
    } catch {
      setMatchCount(0);
    }
  }, [inputText, regex, searchPattern, error2]);
  const highlightedHtml = useMemo(() => {
    if (!searchPattern || regexError || !regex) return escapeHtml(inputText);
    return highlightHtml(inputText, new RegExp(regex.source, regex.flags));
  }, [inputText, regex, searchPattern, regexError]);
  const handleReplaceAll = useCallback(() => {
    if (!regex) return;
    try {
      setOutputText(inputText.replace(new RegExp(regex.source, regex.flags), replaceText));
    } catch (e) {
      setRegexError(e.message || "Replace failed");
    }
  }, [inputText, regex, replaceText]);
  const handleCopy = async () => {
    if (!outputText) return;
    try {
      await navigator.clipboard.writeText(outputText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2e3);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = outputText;
      ta.style.cssText = "position:fixed;opacity:0";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2e3);
    }
  };
  const clearAll = () => {
    setInputText("");
    setSearchPattern("");
    setReplaceText("");
    setOutputText("");
    setRegexError(null);
    setMatchCount(0);
    setCopied(false);
  };
  return /* @__PURE__ */ jsx("section", { className: "rt-section", children: /* @__PURE__ */ jsx("div", { className: "rt-container", children: /* @__PURE__ */ jsxs("div", { className: "card", children: [
    /* @__PURE__ */ jsxs("div", { className: "rt-hero", children: [
      /* @__PURE__ */ jsx("div", { className: "rt-tool-icon", "aria-hidden": "true", children: t("hero.icon") }),
      /* @__PURE__ */ jsx("h1", { className: "rt-hero-title", children: t("hero.title") }),
      /* @__PURE__ */ jsxs("p", { className: "rt-hero-subtitle", children: [
        t("hero.tagline"),
        " ",
        /* @__PURE__ */ jsx(Link, { to: "/blogs/regex-tester-guide", children: t("hero.blogLink") })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "details-row", "data-open": openPanel, children: [
        /* @__PURE__ */ jsxs("div", { className: "details-controls", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              className: `tab-btn ${openPanel === "details" ? "active" : ""}`,
              onClick: () => setOpenPanel((prev) => prev === "details" ? "" : "details"),
              "aria-expanded": openPanel === "details",
              type: "button",
              children: t("tabs.details")
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              className: `tab-btn ${openPanel === "howitworks" ? "active" : ""}`,
              onClick: () => setOpenPanel((prev) => prev === "howitworks" ? "" : "howitworks"),
              "aria-expanded": openPanel === "howitworks",
              type: "button",
              children: t("tabs.howItWorks")
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: `shared-collapse${!openPanel ? " panel-hidden" : ""}`, children: [
          /* @__PURE__ */ jsxs("div", { className: openPanel !== "details" ? "details-content panel-hidden" : "details-content", children: [
            /* @__PURE__ */ jsx("h3", { children: t("details.whatIs.heading") }),
            /* @__PURE__ */ jsx("ul", { children: /* @__PURE__ */ jsx("li", { children: t("details.whatIs.body") }) }),
            /* @__PURE__ */ jsx("h3", { children: t("details.whenToUse.heading") }),
            /* @__PURE__ */ jsx("ul", { children: /* @__PURE__ */ jsx("li", { children: t("details.whenToUse.body") }) }),
            /* @__PURE__ */ jsx("h3", { children: t("details.flags.heading") }),
            /* @__PURE__ */ jsxs("ul", { children: [
              /* @__PURE__ */ jsx("li", { children: t("details.flags.g") }),
              /* @__PURE__ */ jsx("li", { children: t("details.flags.i") }),
              /* @__PURE__ */ jsx("li", { children: t("details.flags.m") })
            ] }),
            /* @__PURE__ */ jsx("h3", { children: t("details.captureGroups.heading") }),
            /* @__PURE__ */ jsx("ul", { children: /* @__PURE__ */ jsx("li", { children: t("details.captureGroups.body") }) }),
            /* @__PURE__ */ jsx("h3", { children: t("details.usefulWhen.heading") }),
            /* @__PURE__ */ jsxs("ul", { children: [
              /* @__PURE__ */ jsx("li", { children: t("details.usefulWhen.item1") }),
              /* @__PURE__ */ jsx("li", { children: t("details.usefulWhen.item2") }),
              /* @__PURE__ */ jsx("li", { children: t("details.usefulWhen.item3") })
            ] }),
            /* @__PURE__ */ jsx("h3", { children: t("details.faq.heading") }),
            /* @__PURE__ */ jsxs("ul", { children: [
              /* @__PURE__ */ jsxs("li", { children: [
                /* @__PURE__ */ jsx("strong", { children: t("details.faq.q1") }),
                " ",
                t("details.faq.a1")
              ] }),
              /* @__PURE__ */ jsxs("li", { children: [
                /* @__PURE__ */ jsx("strong", { children: t("details.faq.q2") }),
                " ",
                t("details.faq.a2")
              ] }),
              /* @__PURE__ */ jsxs("li", { children: [
                /* @__PURE__ */ jsx("strong", { children: t("details.faq.q3") }),
                " ",
                t("details.faq.a3")
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: openPanel !== "howitworks" ? "howitworks-content panel-hidden" : "howitworks-content", children: /* @__PURE__ */ jsxs("ol", { style: { margin: 0, paddingLeft: "1rem" }, children: [
            /* @__PURE__ */ jsxs("li", { style: { marginBottom: "0.75rem" }, children: [
              /* @__PURE__ */ jsx("img", { src: "/screenshots/regex-tester/regex-tester-001.png", alt: "Step 1", className: "how-img" }),
              /* @__PURE__ */ jsx("p", { children: t("howItWorks.step1") })
            ] }),
            /* @__PURE__ */ jsxs("li", { style: { marginBottom: "0.75rem" }, children: [
              /* @__PURE__ */ jsx("img", { src: "/screenshots/regex-tester/regex-tester-002.png", alt: "Step 2", className: "how-img" }),
              /* @__PURE__ */ jsx("p", { children: t("howItWorks.step2") })
            ] }),
            /* @__PURE__ */ jsxs("li", { style: { marginBottom: "0.75rem" }, children: [
              /* @__PURE__ */ jsx("img", { src: "/screenshots/regex-tester/regex-tester-003.png", alt: "Step 3", className: "how-img" }),
              /* @__PURE__ */ jsx("p", { children: t("howItWorks.step3") })
            ] }),
            /* @__PURE__ */ jsxs("li", { children: [
              /* @__PURE__ */ jsx("img", { src: "/screenshots/regex-tester/regex-tester-004.png", alt: "Step 4", className: "how-img" }),
              /* @__PURE__ */ jsx("p", { children: t("howItWorks.step4") })
            ] })
          ] }) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "rt-instructions-card", children: [
      /* @__PURE__ */ jsx("h2", { className: "rt-instructions-heading", children: t("howToUse.heading") }),
      /* @__PURE__ */ jsxs("ol", { className: "rt-instructions-list", children: [
        /* @__PURE__ */ jsx("li", { children: t("howToUse.step1") }),
        /* @__PURE__ */ jsx("li", { children: t("howToUse.step2") }),
        /* @__PURE__ */ jsx("li", { children: t("howToUse.step3") }),
        /* @__PURE__ */ jsx("li", { children: t("howToUse.step4") })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "rt-controls-bar", children: [
      /* @__PURE__ */ jsxs("div", { className: "rt-search-row", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            className: "rt-search-input",
            placeholder: t("controls.searchPlaceholder"),
            value: searchPattern,
            onChange: (e) => {
              setSearchPattern(e.target.value);
              setOutputText("");
            },
            spellCheck: false,
            "aria-label": t("controls.searchAriaLabel")
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "rt-search-controls", children: [
          /* @__PURE__ */ jsxs(
            "label",
            {
              className: `rt-regex-toggle-label${isRegex ? " active" : ""}`,
              title: t("controls.regexTitle"),
              children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "checkbox",
                    checked: isRegex,
                    onChange: (e) => setIsRegex(e.target.checked)
                  }
                ),
                t("controls.regexLabel")
              ]
            }
          ),
          isRegex && /* @__PURE__ */ jsxs("div", { className: "rt-flags", children: [
            /* @__PURE__ */ jsxs("label", { title: t("controls.flagITitle"), children: [
              /* @__PURE__ */ jsx("input", { type: "checkbox", checked: flagsToggle.i, onChange: (e) => setFlagsToggle((f) => ({ ...f, i: e.target.checked })) }),
              " ",
              t("controls.flagI")
            ] }),
            /* @__PURE__ */ jsxs("label", { title: t("controls.flagMTitle"), children: [
              /* @__PURE__ */ jsx("input", { type: "checkbox", checked: flagsToggle.m, onChange: (e) => setFlagsToggle((f) => ({ ...f, m: e.target.checked })) }),
              " ",
              t("controls.flagM")
            ] })
          ] }),
          /* @__PURE__ */ jsx("button", { className: "rt-btn rt-btn-ghost", onClick: clearAll, disabled: !inputText && !searchPattern, children: t("controls.clearBtn") })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "rt-below-search-row", children: [
        searchPattern && !regexError && /* @__PURE__ */ jsx("span", { className: "rt-match-badge", children: matchCount > 0 ? t("controls.matchCount", { count: matchCount }) : t("controls.noMatches") }),
        /* @__PURE__ */ jsx(
          "button",
          {
            className: "rt-replace-toggle",
            type: "button",
            onClick: () => setShowReplace((v) => !v),
            children: showReplace ? t("controls.replaceToggleOpen") : t("controls.replaceToggleClose")
          }
        )
      ] }),
      showReplace && /* @__PURE__ */ jsxs("div", { className: "rt-replace-row", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            className: "rt-replace-input",
            placeholder: t("controls.replacePlaceholder"),
            value: replaceText,
            onChange: (e) => setReplaceText(e.target.value),
            spellCheck: false,
            "aria-label": t("controls.replaceAriaLabel"),
            autoFocus: true
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            className: "rt-btn rt-btn-primary",
            onClick: handleReplaceAll,
            disabled: !searchPattern || !!regexError || matchCount === 0,
            children: t("controls.replaceAllBtn")
          }
        )
      ] }),
      regexError && /* @__PURE__ */ jsxs("div", { className: "rt-error-msg", role: "alert", children: [
        /* @__PURE__ */ jsx("span", { className: "rt-error-icon", "aria-hidden": "true", children: "⚠" }),
        t("controls.patternError", { message: regexError })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "rt-panels", children: [
      /* @__PURE__ */ jsxs("div", { className: "rt-panel", children: [
        /* @__PURE__ */ jsx("div", { className: "rt-panel-header", children: /* @__PURE__ */ jsx("span", { className: "rt-panel-label", children: t("input.label") }) }),
        /* @__PURE__ */ jsx(
          "textarea",
          {
            className: "rt-textarea",
            value: inputText,
            onChange: (e) => {
              setInputText(e.target.value);
              setOutputText("");
            },
            placeholder: t("input.placeholder"),
            spellCheck: false,
            "aria-label": t("input.ariaLabel")
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "rt-panel", children: [
        /* @__PURE__ */ jsx("div", { className: "rt-panel-header", children: /* @__PURE__ */ jsx("span", { className: "rt-panel-label", children: t("preview.label") }) }),
        /* @__PURE__ */ jsx(
          "pre",
          {
            className: `rt-preview-output${!inputText ? " empty" : ""}`,
            "aria-live": "polite",
            "aria-label": t("preview.label"),
            dangerouslySetInnerHTML: { __html: highlightedHtml || "&nbsp;" }
          }
        )
      ] })
    ] }),
    outputText && /* @__PURE__ */ jsxs("div", { className: "rt-panel rt-output-panel", children: [
      /* @__PURE__ */ jsxs("div", { className: "rt-panel-header", children: [
        /* @__PURE__ */ jsx("span", { className: "rt-panel-label", children: t("output.label") }),
        /* @__PURE__ */ jsx(
          "button",
          {
            className: `rt-btn rt-btn-ghost${copied ? " copied" : ""}`,
            onClick: handleCopy,
            title: "Copy to clipboard",
            children: copied ? t("output.copiedBtn") : t("output.copyBtn")
          }
        )
      ] }),
      /* @__PURE__ */ jsx("pre", { className: "rt-preview-output", children: outputText })
    ] }),
    /* @__PURE__ */ jsx("div", { style: { marginTop: 28, borderTop: "2px solid #ff6b2b22", paddingTop: 24, color: "#111" }, children: /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 12 }, children: [
      /* @__PURE__ */ jsx("div", { style: { flex: "0 0 56px", fontSize: 30, lineHeight: 1, fontFamily: "monospace", fontWeight: 900, color: "#ff6b2b", letterSpacing: -1 }, children: t("hero.icon") }),
      /* @__PURE__ */ jsxs("div", { style: { flex: 1 }, children: [
        /* @__PURE__ */ jsx("h2", { style: { margin: 0, fontSize: 22 }, children: t("guide.title") }),
        /* @__PURE__ */ jsx("p", { style: { marginTop: 8 }, children: t("guide.intro") }),
        /* @__PURE__ */ jsx("p", { style: { marginTop: 6, fontWeight: 700 }, children: t("guide.cta") }),
        /* @__PURE__ */ jsx("p", { style: { marginTop: 8 }, children: "In this guide, you'll learn how to:" }),
        /* @__PURE__ */ jsxs("ul", { style: { marginLeft: 0, paddingLeft: 0, listStyle: "none" }, children: [
          /* @__PURE__ */ jsx("li", { children: t("guide.learnItems.item1") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.learnItems.item2") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.learnItems.item3") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.learnItems.item4") })
        ] }),
        /* @__PURE__ */ jsx("h3", { style: { marginTop: 14 }, children: t("guide.whatIs.heading") }),
        /* @__PURE__ */ jsx("p", { children: t("guide.whatIs.body") }),
        /* @__PURE__ */ jsx("h3", { style: { marginTop: 12 }, children: t("guide.whyDifficult.heading") }),
        /* @__PURE__ */ jsxs("ul", { style: { marginLeft: 0, paddingLeft: 0, listStyle: "none" }, children: [
          /* @__PURE__ */ jsx("li", { children: t("guide.whyDifficult.item1") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.whyDifficult.item2") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.whyDifficult.item3") })
        ] }),
        /* @__PURE__ */ jsx("h3", { style: { marginTop: 12 }, children: t("guide.whyUse.heading") }),
        /* @__PURE__ */ jsxs("ul", { style: { marginLeft: 0, paddingLeft: 0, listStyle: "none" }, children: [
          /* @__PURE__ */ jsx("li", { children: t("guide.whyUse.item1") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.whyUse.item2") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.whyUse.item3") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.whyUse.item4") })
        ] }),
        /* @__PURE__ */ jsx("h3", { style: { marginTop: 12 }, children: t("guide.example.heading") }),
        /* @__PURE__ */ jsx("p", { children: t("guide.example.goal") }),
        /* @__PURE__ */ jsx("pre", { style: { background: "#1a1a2e", color: "#e94560", borderRadius: 6, padding: "10px 14px", fontSize: 13, overflowX: "auto", marginTop: 6 }, children: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$" }),
        /* @__PURE__ */ jsxs("p", { style: { marginTop: 8 }, children: [
          t("guide.example.testInput"),
          " ",
          /* @__PURE__ */ jsx("code", { style: { background: "#f3f3f3", padding: "1px 5px", borderRadius: 3 }, children: "test@example.com" }),
          ", ",
          /* @__PURE__ */ jsx("code", { style: { background: "#f3f3f3", padding: "1px 5px", borderRadius: 3 }, children: "invalid-email" }),
          ", ",
          /* @__PURE__ */ jsx("code", { style: { background: "#f3f3f3", padding: "1px 5px", borderRadius: 3 }, children: "hello@site" })
        ] }),
        /* @__PURE__ */ jsx("p", { style: { marginTop: 6 }, children: t("guide.example.result") }),
        /* @__PURE__ */ jsx("h3", { style: { marginTop: 12 }, children: t("guide.mistakes.heading") }),
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 10, marginTop: 8 }, children: [
          /* @__PURE__ */ jsxs("div", { style: { background: "#1a1a2e", borderRadius: 6, padding: "10px 14px", fontSize: 13 }, children: [
            /* @__PURE__ */ jsx("div", { style: { color: "#ff6b6b", marginBottom: 4 }, children: t("guide.mistakes.item1") }),
            /* @__PURE__ */ jsx("div", { style: { color: "#888", marginBottom: 2 }, children: t("guide.mistakes.item1Wrong") }),
            /* @__PURE__ */ jsx("div", { style: { color: "#e94560" }, children: "." }),
            /* @__PURE__ */ jsx("div", { style: { color: "#888", marginTop: 6, marginBottom: 2 }, children: t("guide.mistakes.item1Right") }),
            /* @__PURE__ */ jsx("div", { style: { color: "#a8ff78" }, children: "\\." })
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { background: "#1a1a2e", borderRadius: 6, padding: "10px 14px", fontSize: 13 }, children: [
            /* @__PURE__ */ jsx("div", { style: { color: "#ff6b6b", marginBottom: 4 }, children: t("guide.mistakes.item2") }),
            /* @__PURE__ */ jsx("div", { style: { color: "#888", marginBottom: 2 }, children: t("guide.mistakes.item2Wrong") }),
            /* @__PURE__ */ jsx("div", { style: { color: "#e94560" }, children: ".*" }),
            /* @__PURE__ */ jsx("div", { style: { color: "#888", marginTop: 6, marginBottom: 2 }, children: t("guide.mistakes.item2Right") }),
            /* @__PURE__ */ jsx("div", { style: { color: "#a8ff78" }, children: ".*?" })
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { background: "#1a1a2e", borderRadius: 6, padding: "10px 14px", fontSize: 13 }, children: [
            /* @__PURE__ */ jsx("div", { style: { color: "#ff6b6b", marginBottom: 4 }, children: t("guide.mistakes.item3") }),
            /* @__PURE__ */ jsx("div", { style: { color: "#888", marginBottom: 2 }, children: t("guide.mistakes.item3Wrong") }),
            /* @__PURE__ */ jsx("div", { style: { color: "#e94560" }, children: "hello" }),
            /* @__PURE__ */ jsx("div", { style: { color: "#888", marginTop: 6, marginBottom: 2 }, children: t("guide.mistakes.item3Right") }),
            /* @__PURE__ */ jsx("div", { style: { color: "#a8ff78" }, children: "\\^hello\\$" })
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { background: "#1a1a2e", borderRadius: 6, padding: "10px 14px", fontSize: 13 }, children: [
            /* @__PURE__ */ jsx("div", { style: { color: "#ff6b6b", marginBottom: 4 }, children: t("guide.mistakes.item4") }),
            /* @__PURE__ */ jsx("div", { style: { color: "#888", marginBottom: 2 }, children: t("guide.mistakes.item4Wrong") }),
            /* @__PURE__ */ jsx("div", { style: { color: "#e94560" }, children: "[a-z]" }),
            /* @__PURE__ */ jsx("div", { style: { color: "#888", marginTop: 6, marginBottom: 2 }, children: t("guide.mistakes.item4Right") }),
            /* @__PURE__ */ jsx("div", { style: { color: "#a8ff78" }, children: "[a-zA-Z0-9]" })
          ] })
        ] }),
        /* @__PURE__ */ jsx("h3", { style: { marginTop: 12 }, children: t("guide.stepByStep.heading") }),
        /* @__PURE__ */ jsxs("ol", { style: { marginLeft: 16 }, children: [
          /* @__PURE__ */ jsx("li", { children: t("guide.stepByStep.step1") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.stepByStep.step2") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.stepByStep.step3") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.stepByStep.step4") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.stepByStep.step5") })
        ] }),
        /* @__PURE__ */ jsx("h3", { style: { marginTop: 12 }, children: t("guide.bestPractices.heading") }),
        /* @__PURE__ */ jsxs("ul", { style: { marginLeft: 0, paddingLeft: 0, listStyle: "none" }, children: [
          /* @__PURE__ */ jsx("li", { children: t("guide.bestPractices.item1") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.bestPractices.item2") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.bestPractices.item3") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.bestPractices.item4") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.bestPractices.item5") })
        ] }),
        /* @__PURE__ */ jsx("h3", { style: { marginTop: 12 }, children: t("guide.useCases.heading") }),
        /* @__PURE__ */ jsxs("ul", { style: { marginLeft: 0, paddingLeft: 0, listStyle: "none" }, children: [
          /* @__PURE__ */ jsx("li", { children: t("guide.useCases.item1") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.useCases.item2") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.useCases.item3") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.useCases.item4") })
        ] }),
        /* @__PURE__ */ jsx("h3", { style: { marginTop: 12 }, children: t("guide.pitfalls.heading") }),
        /* @__PURE__ */ jsxs("ul", { style: { marginLeft: 0, paddingLeft: 0, listStyle: "none" }, children: [
          /* @__PURE__ */ jsx("li", { children: t("guide.pitfalls.item1") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.pitfalls.item2") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.pitfalls.item3") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.pitfalls.item4") })
        ] }),
        /* @__PURE__ */ jsx("h3", { style: { marginTop: 12 }, children: t("guide.comparison.heading") }),
        /* @__PURE__ */ jsxs("table", { style: { width: "100%", borderCollapse: "collapse", marginTop: 8 }, children: [
          /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { style: { borderBottom: "2px solid #ff6b2b33" }, children: [
            /* @__PURE__ */ jsx("th", { style: { textAlign: "left", padding: 6 }, children: t("guide.comparison.col1") }),
            /* @__PURE__ */ jsx("th", { style: { textAlign: "left", padding: 6 }, children: t("guide.comparison.col2") }),
            /* @__PURE__ */ jsx("th", { style: { textAlign: "left", padding: 6 }, children: t("guide.comparison.col3") })
          ] }) }),
          /* @__PURE__ */ jsxs("tbody", { children: [
            /* @__PURE__ */ jsxs("tr", { children: [
              /* @__PURE__ */ jsx("td", { style: { padding: 6, borderBottom: "1px solid #fff0eb" }, children: t("guide.comparison.row1col1") }),
              /* @__PURE__ */ jsx("td", { style: { padding: 6, borderBottom: "1px solid #fff0eb" }, children: t("guide.comparison.row1col2") }),
              /* @__PURE__ */ jsx("td", { style: { padding: 6, borderBottom: "1px solid #fff0eb" }, children: t("guide.comparison.row1col3") })
            ] }),
            /* @__PURE__ */ jsxs("tr", { children: [
              /* @__PURE__ */ jsx("td", { style: { padding: 6, borderBottom: "1px solid #fff0eb" }, children: t("guide.comparison.row2col1") }),
              /* @__PURE__ */ jsx("td", { style: { padding: 6, borderBottom: "1px solid #fff0eb" }, children: t("guide.comparison.row2col2") }),
              /* @__PURE__ */ jsx("td", { style: { padding: 6, borderBottom: "1px solid #fff0eb" }, children: t("guide.comparison.row2col3") })
            ] }),
            /* @__PURE__ */ jsxs("tr", { children: [
              /* @__PURE__ */ jsx("td", { style: { padding: 6 }, children: t("guide.comparison.row3col1") }),
              /* @__PURE__ */ jsx("td", { style: { padding: 6 }, children: t("guide.comparison.row3col2") }),
              /* @__PURE__ */ jsx("td", { style: { padding: 6 }, children: t("guide.comparison.row3col3") })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx("h3", { style: { marginTop: 12 }, children: t("guide.proTips.heading") }),
        /* @__PURE__ */ jsxs("ul", { style: { marginLeft: 0, paddingLeft: 0, listStyle: "none" }, children: [
          /* @__PURE__ */ jsx("li", { children: t("guide.proTips.item1") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.proTips.item2") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.proTips.item3") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.proTips.item4") })
        ] }),
        /* @__PURE__ */ jsx("h3", { style: { marginTop: 12 }, children: t("guide.safety.heading") }),
        /* @__PURE__ */ jsx("p", { children: t("guide.safety.body") }),
        /* @__PURE__ */ jsxs("ul", { style: { marginLeft: 0, paddingLeft: 0, listStyle: "none" }, children: [
          /* @__PURE__ */ jsx("li", { children: t("guide.safety.item1") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.safety.item2") })
        ] }),
        /* @__PURE__ */ jsx("p", { style: { marginTop: 6 }, children: t("guide.safety.warning") }),
        /* @__PURE__ */ jsx("h3", { style: { marginTop: 12 }, children: t("guide.faq.heading") }),
        /* @__PURE__ */ jsxs("p", { children: [
          /* @__PURE__ */ jsx("strong", { children: t("guide.faq.q1") }),
          " ",
          t("guide.faq.a1")
        ] }),
        /* @__PURE__ */ jsxs("p", { children: [
          /* @__PURE__ */ jsx("strong", { children: t("guide.faq.q2") }),
          " ",
          t("guide.faq.a2")
        ] }),
        /* @__PURE__ */ jsxs("p", { children: [
          /* @__PURE__ */ jsx("strong", { children: t("guide.faq.q3") }),
          " ",
          t("guide.faq.a3")
        ] }),
        /* @__PURE__ */ jsxs("p", { children: [
          /* @__PURE__ */ jsx("strong", { children: t("guide.faq.q4") }),
          " ",
          t("guide.faq.a4")
        ] }),
        /* @__PURE__ */ jsx("p", { style: { marginTop: 14 }, children: /* @__PURE__ */ jsx("strong", { children: t("guide.conclusion") }) }),
        /* @__PURE__ */ jsx("p", { style: { marginTop: 12 }, children: /* @__PURE__ */ jsx(
          "a",
          {
            className: "btn btn-primary",
            href: "/regex-tester",
            onClick: (e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
              navigate("/regex-tester");
            },
            children: t("guide.ctaBtn")
          }
        ) })
      ] })
    ] }) })
  ] }) }) });
}
function RegexTesterPage() {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsx("main", { style: { flex: 1, display: "flex", flexDirection: "column" }, children: /* @__PURE__ */ jsx(RegexTesterView, {}) }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
const HEIC_BRANDS = /* @__PURE__ */ new Set([
  "heic",
  "heis",
  "hevc",
  "hevx",
  "heim",
  "heix",
  "hevm",
  "hevs",
  "mif1",
  "msf1"
]);
async function readHeader(file) {
  try {
    const buf = await file.slice(0, 12).arrayBuffer();
    return new Uint8Array(buf);
  } catch {
    return new Uint8Array(0);
  }
}
async function sniffMime(file) {
  const b = await readHeader(file);
  if (b[0] === 255 && b[1] === 216 && b[2] === 255) return "image/jpeg";
  if (b[0] === 137 && b[1] === 80 && b[2] === 78 && b[3] === 71) return "image/png";
  if (b[0] === 71 && b[1] === 73 && b[2] === 70 && b[3] === 56) return "image/gif";
  if (b.length >= 12 && b[0] === 82 && b[1] === 73 && b[2] === 70 && b[3] === 70 && b[8] === 87 && b[9] === 69 && b[10] === 66 && b[11] === 80) return "image/webp";
  if (b.length >= 12 && b[4] === 102 && b[5] === 116 && b[6] === 121 && b[7] === 112) {
    const brand = String.fromCharCode(b[8], b[9], b[10], b[11]).toLowerCase();
    if (HEIC_BRANDS.has(brand)) return "image/heic";
    if (brand === "avif" || brand === "avis") return "image/avif";
  }
  if (b[0] === 66 && b[1] === 77) return "image/bmp";
  return null;
}
function outputName(file) {
  return /\.(heic|heif)$/i.test(file.name) ? file.name.replace(/\.(heic|heif)$/i, ".jpg") : file.name;
}
function mimeToExt(mime) {
  if (!mime) return "";
  const m = mime.split("/")[1];
  if (!m) return "";
  if (m.startsWith("jpeg")) return "jpg";
  if (m.startsWith("tiff")) return "tif";
  return m.replace(/[^a-z0-9]+/g, "").toLowerCase();
}
function ensureExtension(name, mime) {
  const ext = mimeToExt(mime);
  if (!ext) return name;
  if (/\.[a-z0-9]+$/i.test(name)) {
    return name.replace(/\.[a-z0-9]+$/i, `.${ext}`);
  }
  return `${name}.${ext}`;
}
const DEBUG_FLAG_NAME = "DEBUG_NORMALIZE_IMAGE";
function log(...args) {
  try {
    if (globalThis && globalThis[DEBUG_FLAG_NAME]) {
      console.debug("[normalizeImageFiles]", ...args);
      if (globalThis.DEBUG_NORMALIZE_IMAGE_REMOTE_URL) {
        try {
          emitRemoteLog(args);
        } catch (e) {
        }
      }
      if (globalThis.DEBUG_NORMALIZE_IMAGE_UI) try {
        emitToPanel(args);
      } catch (e) {
      }
    }
  } catch (e) {
  }
}
function sanitizeArg(a) {
  if (!a) return a;
  if (typeof File !== "undefined" && a instanceof File) {
    return { __file: true, name: a.name, type: a.type, size: a.size };
  }
  if (a && typeof a === "object") {
    try {
      JSON.stringify(a);
      return a;
    } catch {
      return String(a);
    }
  }
  return a;
}
async function emitRemoteLog(args) {
  const url = globalThis.DEBUG_NORMALIZE_IMAGE_REMOTE_URL;
  if (!url) return;
  const payload = {
    ts: (/* @__PURE__ */ new Date()).toISOString(),
    origin: "normalizeImageFiles",
    payload: args.map(sanitizeArg)
  };
  const body = JSON.stringify(payload);
  try {
    if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
      const blob = new Blob([body], { type: "application/json" });
      navigator.sendBeacon(url, blob);
      return;
    }
    if (typeof fetch === "function") {
      fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true }).catch(() => {
      });
    }
  } catch (e) {
  }
}
function ensureLogPanel() {
  try {
    if (!globalThis.DEBUG_NORMALIZE_IMAGE_UI) return null;
    if (typeof document === "undefined") return null;
    let panel = document.getElementById("normalize-log-panel");
    if (panel) return panel;
    panel = document.createElement("div");
    panel.id = "normalize-log-panel";
    Object.assign(panel.style, {
      position: "fixed",
      right: "8px",
      bottom: "8px",
      width: "320px",
      maxHeight: "40vh",
      overflow: "auto",
      background: "rgba(0,0,0,0.85)",
      color: "white",
      fontSize: "12px",
      zIndex: 999999,
      padding: "8px",
      borderRadius: "6px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.5)"
    });
    const header = document.createElement("div");
    header.style.display = "flex";
    header.style.justifyContent = "space-between";
    header.style.marginBottom = "6px";
    const title2 = document.createElement("div");
    title2.textContent = "normalize logs";
    title2.style.fontWeight = "600";
    const controls2 = document.createElement("div");
    const clearBtn = document.createElement("button");
    clearBtn.textContent = "Clear";
    clearBtn.style.marginRight = "6px";
    clearBtn.onclick = () => {
      window.__normalizeImageLogs = [];
      body.innerHTML = "";
    };
    const closeBtn = document.createElement("button");
    closeBtn.textContent = "Hide";
    closeBtn.onclick = () => {
      panel.style.display = "none";
    };
    controls2.appendChild(clearBtn);
    controls2.appendChild(closeBtn);
    header.appendChild(title2);
    header.appendChild(controls2);
    const body = document.createElement("div");
    body.id = "normalize-log-body";
    panel.appendChild(header);
    panel.appendChild(body);
    document.body.appendChild(panel);
    if (!window.__normalizeImageLogs) window.__normalizeImageLogs = [];
    return panel;
  } catch (e) {
    return null;
  }
}
function emitToPanel(args) {
  try {
    const panel = ensureLogPanel();
    if (!panel) return;
    const body = panel.querySelector("#normalize-log-body");
    const entry2 = { ts: (/* @__PURE__ */ new Date()).toISOString(), payload: args.map(sanitizeArg) };
    window.__normalizeImageLogs = window.__normalizeImageLogs || [];
    window.__normalizeImageLogs.push(entry2);
    const row = document.createElement("div");
    row.style.borderTop = "1px solid rgba(255,255,255,0.06)";
    row.style.paddingTop = "6px";
    row.style.marginTop = "6px";
    row.textContent = `${entry2.ts} — ${JSON.stringify(entry2.payload)}`;
    body.appendChild(row);
    body.scrollTop = body.scrollHeight;
  } catch (e) {
  }
}
async function convertViaImg(file) {
  for (const mime of ["image/heic", "image/heif"]) {
    let url = null;
    log("convertViaImg: trying mime", mime, "file", file.name);
    try {
      url = URL.createObjectURL(new Blob([file], { type: mime }));
      const result2 = await new Promise((resolve) => {
        const img = new Image();
        const timer = setTimeout(() => {
          img.src = "";
          resolve(null);
        }, 2e4);
        img.onload = () => {
          clearTimeout(timer);
          if (!img.naturalWidth || !img.naturalHeight) return resolve(null);
          try {
            const canvas2 = document.createElement("canvas");
            canvas2.width = img.naturalWidth;
            canvas2.height = img.naturalHeight;
            const ctx = canvas2.getContext("2d");
            if (!ctx) return resolve(null);
            ctx.drawImage(img, 0, 0);
            canvas2.toBlob(
              (b) => resolve(b ? new File([b], outputName(file), { type: "image/jpeg" }) : null),
              "image/jpeg",
              0.92
            );
          } catch {
            resolve(null);
          }
        };
        img.onerror = () => {
          clearTimeout(timer);
          resolve(null);
        };
        img.src = url;
      });
      if (result2) {
        log("convertViaImg: success", mime, "->", result2.type, result2.name);
        return result2;
      }
    } catch {
    } finally {
      if (url) try {
        URL.revokeObjectURL(url);
      } catch {
      }
    }
  }
  return null;
}
async function materializeFile(file) {
  try {
    const buf = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error);
      reader.readAsArrayBuffer(file);
    });
    return new File([buf], file.name, { type: file.type });
  } catch (e) {
    log("materializeFile failed — keeping original", e && e.message ? e.message : e);
    return file;
  }
}
async function normalizeImageFile(file) {
  let f = file;
  log("normalizeImageFile start", { name: file && file.name, type: file && file.type, size: file && file.size });
  if (typeof FileReader !== "undefined") {
    f = await materializeFile(file);
    log("normalizeImageFile materialized in-memory", { name: f.name, type: f.type, size: f.size });
  }
  const shouldSniff = !f.type || !f.type.startsWith("image/") || f.type === "image/jpeg";
  if (shouldSniff) {
    const sniffed = await sniffMime(f);
    log("sniffMime result", sniffed);
    if (sniffed && sniffed !== f.type) {
      const name = ensureExtension(f.name || "unnamed", sniffed);
      f = new File([f], name, { type: sniffed });
      log("normalizeImageFile created corrected File", { name: f.name, type: f.type });
    }
  } else {
    if ((!f.name || !/\.[a-z0-9]+$/i.test(f.name)) && f.type && f.type.startsWith("image/")) {
      const name = ensureExtension(f.name || "unnamed", f.type);
      f = new File([f], name, { type: f.type });
      log("normalizeImageFile ensured extension", { name: f.name, type: f.type });
    }
  }
  if (f.type !== "image/heic" && f.type !== "image/heif") {
    if (/\.(heic|heif)$/i.test(f.name)) {
      f = new File([f], f.name, { type: "image/heic" });
    }
  }
  if (f.type !== "image/heic" && f.type !== "image/heif") {
    log("normalizeImageFile non-HEIC candidate", { name: f.name, type: f.type });
    try {
      const actual = await sniffMime(f);
      log("post-sniff check", { declared: f.type, actual });
      if (actual && actual !== f.type) {
        log("type/data mismatch detected — attempting conversion", { name: f.name, declared: f.type, actual });
        if (actual === "image/heic" || actual === "image/heif") {
          const converted = await convertViaImg(f);
          if (converted) {
            log("conversion after mismatch succeeded", { name: converted.name, type: converted.type });
            return converted;
          }
          try {
            const heic2any = await import("heic2any").then((m) => m.default ?? m);
            const blob = await heic2any({ blob: f, toType: "image/jpeg", quality: 0.92 });
            const converted2 = Array.isArray(blob) ? blob[0] : blob;
            const out = new File([converted2], outputName(f), { type: "image/jpeg" });
            log("heic2any conversion after mismatch succeeded", { name: out.name, type: out.type });
            return out;
          } catch (e) {
            log("heic2any conversion after mismatch failed", e && e.message ? e.message : e);
          }
        }
      }
    } catch (e) {
      log("post-sniff verification failed", e && e.message ? e.message : e);
    }
    log("normalizeImageFile returning non-HEIC", { name: f.name, type: f.type });
    return f;
  }
  const imgResult = await convertViaImg(f);
  if (imgResult) {
    log("normalizeImageFile converted via <img>", { name: imgResult.name, type: imgResult.type });
    return imgResult;
  }
  try {
    const heic2any = await import("heic2any").then((m) => m.default ?? m);
    const blob = await heic2any({ blob: f, toType: "image/jpeg", quality: 0.92 });
    const converted = Array.isArray(blob) ? blob[0] : blob;
    const out = new File([converted], outputName(file), { type: "image/jpeg" });
    log("normalizeImageFile converted via heic2any", { name: out.name, type: out.type });
    return out;
  } catch {
  }
  return f;
}
async function normalizeImageFiles(files) {
  const arr = Array.from(files);
  log("normalizeImageFiles phase-1 materialize", arr.length, "files");
  const materialized = await Promise.all(arr.map((f) => materializeFile(f)));
  log("normalizeImageFiles phase-2 normalize", materialized.length, "files");
  const results = [];
  for (const f of materialized) {
    results.push(await normalizeImageFile(f));
  }
  return results;
}
function isImageFile(file) {
  if (!file) return false;
  if (file.type && file.type.startsWith("image/")) return true;
  return !file.type || /\.(jpe?g|png|webp|gif|avif|bmp|tiff?|heic|heif)$/i.test(file.name);
}
try {
  if (typeof globalThis !== "undefined") {
    globalThis.normalizeImageFile = normalizeImageFile;
    globalThis.normalizeImageFiles = normalizeImageFiles;
    globalThis.isImageFile = isImageFile;
  }
} catch (e) {
}
const normalizeImageFiles$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  isImageFile,
  normalizeImageFile,
  normalizeImageFiles
}, Symbol.toStringTag, { value: "Module" }));
function useWatermarker(initialImage) {
  const [mainImages, setMainImages] = useState(initialImage ? [initialImage] : []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [watermarkType, setWatermarkType] = useState("text");
  const [watermarkText, setWatermarkText] = useState("");
  const [logoFile, setLogoFile] = useState(null);
  const [outputUrls, setOutputUrls] = useState([]);
  const [outputNames, setOutputNames] = useState([]);
  const [status2, setStatus] = useState("idle");
  const [errorMsg2, setErrorMsg] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [repeated2, setRepeated] = useState(false);
  const [position2, setPosition] = useState("default");
  const [opacity2, setOpacity] = useState(0.25);
  const fileInputRef = useRef(null);
  const handleMainImage = async (files) => {
    if (!files) return;
    const normalized = await normalizeImageFiles(files instanceof FileList ? files : Array.from(files));
    const arr = normalized.filter(isImageFile);
    if (!arr.length) {
      setErrorMsg("Please upload valid image files.");
      return;
    }
    setMainImages(arr);
    setCurrentIndex(0);
    setStatus("idle");
    setErrorMsg("");
    if (outputUrls && outputUrls.length) {
      outputUrls.forEach((u) => u && URL.revokeObjectURL(u));
    }
    setOutputUrls([]);
    setOutputNames([]);
  };
  const handleLogoFile = async (f) => {
    if (!f) return;
    const normalized = await normalizeImageFile(f);
    if (!isImageFile(normalized)) {
      setErrorMsg("Please upload a valid logo image file.");
      return;
    }
    setLogoFile(normalized);
    setErrorMsg("");
  };
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    handleMainImage(e.dataTransfer.files);
  }, [outputUrls]);
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);
  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);
  const handleFileInput = (e) => {
    handleMainImage(e.target.files);
  };
  const handleLogoInput = (e) => {
    handleLogoFile(e.target.files[0]);
  };
  const handleWatermark = async () => {
    const imgFile = mainImages[currentIndex];
    if (!imgFile) return;
    setStatus("processing");
    setErrorMsg("");
    try {
      const img = await loadImage2(imgFile);
      let watermarkedCanvas;
      const useRepeated = repeated2 && position2 === "default";
      if (watermarkType === "text") {
        watermarkedCanvas = useRepeated ? addTextWatermarkRepeated(img, watermarkText) : addTextWatermark(img, watermarkText);
      } else if (watermarkType === "logo" && logoFile) {
        const logoImg = await loadImage2(logoFile);
        watermarkedCanvas = useRepeated ? addLogoWatermarkRepeated(img, logoImg) : addLogoWatermark(img, logoImg);
      } else {
        setErrorMsg("Please provide watermark text or logo.");
        setStatus("idle");
        return;
      }
      watermarkedCanvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          if (outputUrls[currentIndex]) URL.revokeObjectURL(outputUrls[currentIndex]);
          const nextUrls = outputUrls.slice();
          const nextNames = outputNames.slice();
          nextUrls[currentIndex] = url;
          nextNames[currentIndex] = "watermarked-" + imgFile.name;
          setOutputUrls(nextUrls);
          setOutputNames(nextNames);
          setStatus("done");
        } else {
          setErrorMsg("Failed to create output image.");
          setStatus("error");
        }
      }, imgFile.type);
    } catch (err) {
      setErrorMsg("Failed to process image.");
      setStatus("error");
    }
  };
  const handleWatermarkAll = async () => {
    if (!mainImages || !mainImages.length) return;
    setStatus("processing");
    setErrorMsg("");
    const urls = outputUrls.slice();
    const names = outputNames.slice();
    try {
      for (let i = 0; i < mainImages.length; i++) {
        const imgFile = mainImages[i];
        const img = await loadImage2(imgFile);
        let canvas2;
        const useRepeated = repeated2 && position2 === "default";
        if (watermarkType === "text") {
          canvas2 = useRepeated ? addTextWatermarkRepeated(img, watermarkText) : addTextWatermark(img, watermarkText);
        } else if (watermarkType === "logo" && logoFile) {
          const logoImg = await loadImage2(logoFile);
          canvas2 = useRepeated ? addLogoWatermarkRepeated(img, logoImg) : addLogoWatermark(img, logoImg);
        } else {
          setErrorMsg("Please provide watermark text or logo.");
          setStatus("idle");
          return;
        }
        const blob = await new Promise((resolve) => canvas2.toBlob(resolve, imgFile.type));
        if (blob) {
          if (urls[i]) URL.revokeObjectURL(urls[i]);
          urls[i] = URL.createObjectURL(blob);
          names[i] = "watermarked-" + imgFile.name;
          setOutputUrls(urls.slice());
          setOutputNames(names.slice());
        }
      }
      setStatus("done");
    } catch (err) {
      setErrorMsg("Failed to process images.");
      setStatus("error");
    }
  };
  const handleClear = () => {
    outputUrls.forEach((u) => u && URL.revokeObjectURL(u));
    setMainImages([]);
    setCurrentIndex(0);
    setOutputUrls([]);
    setOutputNames([]);
    setStatus("idle");
    setErrorMsg("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  function loadImage2(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new window.Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
  function anchorCoords(canvas2, widthPx, heightPx, pos) {
    const margin = Math.max(16, Math.floor(Math.min(canvas2.width, canvas2.height) * 0.04));
    switch (pos) {
      case "top-left":
        return { x: margin, y: margin + heightPx / 2, align: "left" };
      case "top-right":
        return { x: canvas2.width - margin, y: margin + heightPx / 2, align: "right" };
      case "bottom-left":
        return { x: margin, y: canvas2.height - margin - heightPx / 2, align: "left" };
      case "bottom-right":
        return { x: canvas2.width - margin, y: canvas2.height - margin - heightPx / 2, align: "right" };
      case "center":
        return { x: canvas2.width / 2, y: canvas2.height / 2, align: "center" };
      default:
        return { x: canvas2.width / 2, y: canvas2.height / 2, align: "center" };
    }
  }
  function addTextWatermark(img, text) {
    const canvas2 = document.createElement("canvas");
    canvas2.width = img.width;
    canvas2.height = img.height;
    const ctx = canvas2.getContext("2d");
    ctx.drawImage(img, 0, 0);
    if (position2 === "default") {
      const fontSize2 = Math.floor(img.width / 7);
      ctx.font = `bold ${fontSize2}px sans-serif`;
      ctx.fillStyle = `rgba(255,255,255,${opacity2})`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.save();
      ctx.translate(canvas2.width / 2, canvas2.height / 2);
      ctx.rotate(-Math.PI / 12);
      ctx.fillText(text, 0, 0);
      ctx.restore();
      return canvas2;
    }
    const fontSize = Math.max(14, Math.floor(img.width / 14));
    ctx.font = `bold ${fontSize}px sans-serif`;
    ctx.fillStyle = `rgba(255,255,255,${opacity2})`;
    const metricsHeight = fontSize;
    const anchor = anchorCoords(canvas2, ctx.measureText(text).width, metricsHeight, position2);
    ctx.textAlign = anchor.align;
    ctx.textBaseline = "middle";
    ctx.fillText(text, anchor.x, anchor.y);
    return canvas2;
  }
  function addLogoWatermark(img, logoImg) {
    const canvas2 = document.createElement("canvas");
    canvas2.width = img.width;
    canvas2.height = img.height;
    const ctx = canvas2.getContext("2d");
    ctx.drawImage(img, 0, 0);
    if (position2 === "default") {
      const logoWidth2 = img.width * 0.4;
      const logoHeight2 = logoImg.height * (logoWidth2 / logoImg.width);
      ctx.globalAlpha = opacity2;
      ctx.drawImage(
        logoImg,
        (canvas2.width - logoWidth2) / 2,
        (canvas2.height - logoHeight2) / 2,
        logoWidth2,
        logoHeight2
      );
      ctx.globalAlpha = 1;
      return canvas2;
    }
    const logoWidth = Math.max(32, Math.floor(img.width * 0.18));
    const logoHeight = Math.floor(logoImg.height * (logoWidth / logoImg.width));
    const anchor = anchorCoords(canvas2, logoWidth, logoHeight, position2);
    ctx.globalAlpha = opacity2;
    let drawX = anchor.x;
    if (anchor.align === "center") drawX = anchor.x - logoWidth / 2;
    if (anchor.align === "left") drawX = anchor.x;
    if (anchor.align === "right") drawX = anchor.x - logoWidth;
    const drawY = anchor.y - logoHeight / 2;
    ctx.drawImage(logoImg, drawX, drawY, logoWidth, logoHeight);
    ctx.globalAlpha = 1;
    return canvas2;
  }
  function addTextWatermarkRepeated(img, text) {
    const canvas2 = document.createElement("canvas");
    canvas2.width = img.width;
    canvas2.height = img.height;
    const ctx = canvas2.getContext("2d");
    ctx.drawImage(img, 0, 0);
    const fontSize = Math.max(14, Math.floor(img.width / 18));
    ctx.font = `bold ${fontSize}px sans-serif`;
    ctx.fillStyle = `rgba(255,255,255,${opacity2})`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const textWidth = ctx.measureText(text).width;
    const gapX = textWidth + fontSize * 2.5;
    const gapY = fontSize * 3.5;
    const diagonal = Math.ceil(Math.sqrt(img.width ** 2 + img.height ** 2));
    ctx.save();
    ctx.translate(img.width / 2, img.height / 2);
    ctx.rotate(-Math.PI / 6);
    for (let y = -diagonal; y <= diagonal; y += gapY) {
      for (let x = -diagonal; x <= diagonal; x += gapX) {
        ctx.fillText(text, x, y);
      }
    }
    ctx.restore();
    return canvas2;
  }
  function addLogoWatermarkRepeated(img, logoImg) {
    const canvas2 = document.createElement("canvas");
    canvas2.width = img.width;
    canvas2.height = img.height;
    const ctx = canvas2.getContext("2d");
    ctx.drawImage(img, 0, 0);
    const logoWidth = Math.max(32, Math.floor(img.width / 6));
    const logoHeight = Math.floor(logoImg.height * (logoWidth / logoImg.width));
    const gapX = logoWidth * 2.2;
    const gapY = logoHeight * 2.5;
    const diagonal = Math.ceil(Math.sqrt(img.width ** 2 + img.height ** 2));
    ctx.globalAlpha = opacity2;
    ctx.save();
    ctx.translate(img.width / 2, img.height / 2);
    ctx.rotate(-Math.PI / 6);
    for (let y = -diagonal; y <= diagonal; y += gapY) {
      for (let x = -diagonal; x <= diagonal; x += gapX) {
        ctx.drawImage(logoImg, x - logoWidth / 2, y - logoHeight / 2, logoWidth, logoHeight);
      }
    }
    ctx.restore();
    ctx.globalAlpha = 1;
    return canvas2;
  }
  return {
    mainImages,
    currentIndex,
    setCurrentIndex,
    watermarkType,
    setWatermarkType,
    watermarkText,
    setWatermarkText,
    logoFile,
    setLogoFile,
    repeated: repeated2,
    setRepeated,
    position: position2,
    setPosition,
    opacity: opacity2,
    setOpacity,
    outputUrls,
    outputNames,
    status: status2,
    errorMsg: errorMsg2,
    isDragging,
    fileInputRef,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    handleFileInput,
    handleLogoInput,
    handleWatermark,
    handleWatermarkAll,
    handleClear
  };
}
function WatermarkerView({
  mainImages,
  currentIndex,
  setCurrentIndex,
  watermarkType,
  setWatermarkType,
  watermarkText,
  setWatermarkText,
  logoFile,
  setLogoFile,
  repeated: repeated2,
  setRepeated,
  position: position2,
  setPosition,
  opacity: opacity2,
  setOpacity,
  outputUrls,
  outputNames,
  status: status2,
  errorMsg: errorMsg2,
  isDragging,
  fileInputRef,
  handleDrop,
  handleDragOver,
  handleDragLeave,
  handleFileInput,
  handleLogoInput,
  handleWatermark,
  handleWatermarkAll,
  handleClear
}) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [openPanel, setOpenPanel] = useState("");
  const logoInputRef = useRef(null);
  const navigate = useNavigate();
  const { t } = useTranslation("imageWatermarker");
  useEffect(() => {
    if (outputUrls && outputUrls[currentIndex]) setPreviewOpen(true);
  }, [outputUrls, currentIndex]);
  return /* @__PURE__ */ jsxs("div", { className: "watermarker-view", children: [
    /* @__PURE__ */ jsx("h2", { className: "hero-title", children: t("hero.title") }),
    /* @__PURE__ */ jsxs("p", { className: "hero-tagline", children: [
      t("hero.tagline"),
      " ",
      /* @__PURE__ */ jsx(Link, { to: "/blogs/image-watermark-guide", children: t("hero.blogLink") })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "ir-tip-banner", children: [
      /* @__PURE__ */ jsx("span", { className: "ir-tip-text", children: t("hint.text") }),
      /* @__PURE__ */ jsx("button", { className: "ir-tip-btn", onClick: () => navigate("/image-resizer"), children: t("hint.btn") })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "details-row", "data-open": openPanel, children: [
      /* @__PURE__ */ jsxs("div", { className: "details-controls", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            className: `tab-btn ${openPanel === "details" ? "active" : ""}`,
            onClick: () => setOpenPanel((prev) => prev === "details" ? "" : "details"),
            "aria-expanded": openPanel === "details",
            type: "button",
            children: t("tabs.details")
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            className: `tab-btn ${openPanel === "howitworks" ? "active" : ""}`,
            onClick: () => setOpenPanel((prev) => prev === "howitworks" ? "" : "howitworks"),
            "aria-expanded": openPanel === "howitworks",
            type: "button",
            children: t("tabs.howItWorks")
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: `shared-collapse${!openPanel ? " panel-hidden" : ""}`, children: [
        /* @__PURE__ */ jsxs("div", { className: openPanel !== "details" ? "details-content panel-hidden" : "details-content", children: [
          /* @__PURE__ */ jsx("h3", { children: t("details.whatIs.heading") }),
          /* @__PURE__ */ jsx("p", { children: t("details.whatIs.body") }),
          /* @__PURE__ */ jsx("h3", { children: t("details.howWorks.heading") }),
          /* @__PURE__ */ jsx("p", { children: t("details.howWorks.body") }),
          /* @__PURE__ */ jsx("h3", { children: t("details.choosing.heading") }),
          /* @__PURE__ */ jsxs("ul", { children: [
            /* @__PURE__ */ jsx("li", { children: t("details.choosing.item1") }),
            /* @__PURE__ */ jsx("li", { children: t("details.choosing.item2") }),
            /* @__PURE__ */ jsx("li", { children: t("details.choosing.item3") })
          ] }),
          /* @__PURE__ */ jsx("h3", { children: t("details.practical.heading") }),
          /* @__PURE__ */ jsxs("ul", { children: [
            /* @__PURE__ */ jsx("li", { children: t("details.practical.item1") }),
            /* @__PURE__ */ jsx("li", { children: t("details.practical.item2") }),
            /* @__PURE__ */ jsx("li", { children: t("details.practical.item3") })
          ] }),
          /* @__PURE__ */ jsx("h3", { children: t("details.usefulWhen.heading") }),
          /* @__PURE__ */ jsxs("ul", { children: [
            /* @__PURE__ */ jsx("li", { children: t("details.usefulWhen.item1") }),
            /* @__PURE__ */ jsx("li", { children: t("details.usefulWhen.item2") }),
            /* @__PURE__ */ jsx("li", { children: t("details.usefulWhen.item3") })
          ] }),
          /* @__PURE__ */ jsx("h3", { children: t("details.privacy.heading") }),
          /* @__PURE__ */ jsx("p", { children: t("details.privacy.body") }),
          /* @__PURE__ */ jsx("h3", { children: t("details.faq.heading") }),
          /* @__PURE__ */ jsxs("ul", { children: [
            /* @__PURE__ */ jsxs("li", { children: [
              /* @__PURE__ */ jsx("strong", { children: t("details.faq.q1") }),
              " ",
              t("details.faq.a1")
            ] }),
            /* @__PURE__ */ jsxs("li", { children: [
              /* @__PURE__ */ jsx("strong", { children: t("details.faq.q2") }),
              " ",
              t("details.faq.a2")
            ] }),
            /* @__PURE__ */ jsxs("li", { children: [
              /* @__PURE__ */ jsx("strong", { children: t("details.faq.q3") }),
              " ",
              t("details.faq.a3")
            ] }),
            /* @__PURE__ */ jsxs("li", { children: [
              /* @__PURE__ */ jsx("strong", { children: t("details.faq.q4") }),
              " ",
              t("details.faq.a4")
            ] }),
            /* @__PURE__ */ jsxs("li", { children: [
              /* @__PURE__ */ jsx("strong", { children: t("details.faq.q5") }),
              " ",
              t("details.faq.a5")
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: openPanel !== "howitworks" ? "howitworks-content panel-hidden" : "howitworks-content", children: /* @__PURE__ */ jsxs("ol", { style: { margin: 0, paddingLeft: "1rem" }, children: [
          /* @__PURE__ */ jsxs("li", { style: { marginBottom: "0.75rem" }, children: [
            /* @__PURE__ */ jsx("img", { src: "/screenshots/watermarker/watermarker001.png", alt: "Step 1", className: "how-img" }),
            /* @__PURE__ */ jsx("p", { children: t("howItWorks.step1") })
          ] }),
          /* @__PURE__ */ jsxs("li", { style: { marginBottom: "0.75rem" }, children: [
            /* @__PURE__ */ jsx("img", { src: "/screenshots/watermarker/watermarker002.png", alt: "Step 2", className: "how-img" }),
            /* @__PURE__ */ jsx("p", { children: t("howItWorks.step2") })
          ] }),
          /* @__PURE__ */ jsxs("li", { style: { marginBottom: "0.75rem" }, children: [
            /* @__PURE__ */ jsx("img", { src: "/screenshots/watermarker/watermarker003.png", alt: "Step 3", className: "how-img" }),
            /* @__PURE__ */ jsx("p", { children: t("howItWorks.step3") })
          ] }),
          /* @__PURE__ */ jsxs("li", { children: [
            /* @__PURE__ */ jsx("img", { src: "/screenshots/watermarker/watermarker004.png", alt: "Step 4", className: "how-img" }),
            /* @__PURE__ */ jsx("p", { children: t("howItWorks.step4") })
          ] }),
          /* @__PURE__ */ jsxs("li", { children: [
            /* @__PURE__ */ jsx("img", { src: "/screenshots/watermarker/watermarker005.png", alt: "Step 5", className: "how-img" }),
            /* @__PURE__ */ jsx("p", { children: t("howItWorks.step5") })
          ] })
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: `drop-zone${isDragging ? " dragging" : ""}`,
        onDrop: handleDrop,
        onDragOver: handleDragOver,
        onDragLeave: handleDragLeave,
        onClick: () => fileInputRef.current && fileInputRef.current.click(),
        children: [
          mainImages && mainImages.length ? (() => {
            const displayCount = Math.min(8, mainImages.length);
            const spacing = 22;
            const thumbW = 200;
            const containerW = (displayCount - 1) * spacing + thumbW + 8;
            return /* @__PURE__ */ jsxs("div", { className: "overlap-stack", onClick: (e) => {
              e.stopPropagation();
              setPreviewOpen(true);
            }, style: { width: containerW }, children: [
              mainImages.slice(0, displayCount).map((f, i) => {
                const left = i * spacing - (displayCount - 1) * spacing / 2 + (containerW / 2 - thumbW / 2);
                return /* @__PURE__ */ jsx(
                  "img",
                  {
                    src: URL.createObjectURL(f),
                    alt: `upload-${i}`,
                    className: "stacked-thumb clickable",
                    style: { left: `${left}px`, zIndex: 1 + i },
                    onClick: (ev) => {
                      ev.stopPropagation();
                      setCurrentIndex(i);
                      setPreviewOpen(true);
                    }
                  },
                  i
                );
              }),
              mainImages.length > 8 && /* @__PURE__ */ jsxs("div", { className: "stack-more", style: { left: `${displayCount * spacing - (displayCount - 1) * spacing / 2 + (containerW / 2 - thumbW / 2)}px` }, children: [
                "+",
                mainImages.length - 8
              ] })
            ] });
          })() : /* @__PURE__ */ jsx("span", { className: "hero-tagline", children: t("dropZone.text") }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "file",
              accept: "image/*,.heic,.heif",
              multiple: true,
              style: { display: "none" },
              ref: fileInputRef,
              onChange: handleFileInput
            }
          )
        ]
      }
    ),
    mainImages && mainImages.length > 0 && /* @__PURE__ */ jsxs("div", { className: "wm-file-row", children: [
      /* @__PURE__ */ jsx("span", { className: "wm-file-name", children: mainImages.length === 1 ? mainImages[0].name : t("fileRow.count", { count: mainImages.length }) }),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          className: "wm-change-btn",
          onClick: () => fileInputRef.current && fileInputRef.current.click(),
          children: mainImages.length === 1 ? t("fileRow.changeOne") : t("fileRow.changeMany")
        }
      ),
      /* @__PURE__ */ jsx("button", { type: "button", className: "wm-clear-btn", onClick: handleClear, children: t("fileRow.clear") })
    ] }),
    previewOpen && (outputUrls && outputUrls.length > 0 && outputUrls[currentIndex]) && /* @__PURE__ */ jsxs("div", { className: "image-popup-overlay", onClick: () => setPreviewOpen(false), children: [
      /* @__PURE__ */ jsxs(
        "div",
        {
          className: "image-popup-dialog",
          onClick: (e) => e.stopPropagation(),
          style: { display: "flex", alignItems: "center", justifyContent: "center" },
          children: [
            /* @__PURE__ */ jsx(
              "img",
              {
                src: outputUrls[currentIndex],
                alt: `Watermarked preview ${currentIndex + 1}`,
                className: "image-popup-img",
                style: {
                  position: "static",
                  top: "unset",
                  left: "unset",
                  transform: "none",
                  maxWidth: "100%",
                  maxHeight: "calc(93vh - 6rem)",
                  width: "auto",
                  height: "auto",
                  objectFit: "contain"
                }
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                className: "watermark-btn popup-nav-btn popup-nav-prev",
                onClick: () => setCurrentIndex((idx) => Math.max(0, idx - 1)),
                disabled: currentIndex === 0,
                children: t("popup.prev")
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                className: "watermark-btn popup-nav-btn popup-nav-next",
                onClick: () => setCurrentIndex((idx) => Math.min((mainImages.length || 1) - 1, idx + 1)),
                disabled: currentIndex >= (mainImages.length || 1) - 1,
                children: t("popup.next")
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsx("button", { className: "close-popup-btn", onClick: () => setPreviewOpen(false), children: t("popup.close") })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "watermark-options", children: [
      /* @__PURE__ */ jsx("label", { children: t("type.label") }),
      /* @__PURE__ */ jsxs("label", { children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "radio",
            name: "watermarkType",
            value: "text",
            checked: watermarkType === "text",
            onChange: () => setWatermarkType("text")
          }
        ),
        t("type.text")
      ] }),
      /* @__PURE__ */ jsxs("label", { children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "radio",
            name: "watermarkType",
            value: "logo",
            checked: watermarkType === "logo",
            onChange: () => setWatermarkType("logo")
          }
        ),
        t("type.logo")
      ] })
    ] }),
    watermarkType === "text" && /* @__PURE__ */ jsx(
      "input",
      {
        type: "text",
        className: "watermark-input",
        placeholder: t("textInput.placeholder"),
        value: watermarkText,
        onChange: (e) => setWatermarkText(e.target.value),
        style: !watermarkText ? { borderColor: "#ef4444" } : void 0
      }
    ),
    watermarkType === "logo" && /* @__PURE__ */ jsxs("div", { className: "watermark-input", style: { display: "flex", alignItems: "center", gap: 12, ...!logoFile ? { borderColor: "#ef4444" } : {} }, children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          className: "btn btn-outline",
          onClick: () => logoInputRef.current && logoInputRef.current.click(),
          children: t("logoBtn")
        }
      ),
      /* @__PURE__ */ jsx(
        "input",
        {
          id: "logo-input",
          ref: logoInputRef,
          type: "file",
          accept: "image/*,.heic,.heif",
          style: { display: "none" },
          onChange: handleLogoInput
        }
      ),
      logoFile && /* @__PURE__ */ jsx("span", { style: { color: "#6b7280", fontSize: "0.95rem" }, children: logoFile.name })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "watermark-options", children: [
      /* @__PURE__ */ jsxs("label", { style: { display: "flex", alignItems: "center", gap: 8 }, children: [
        /* @__PURE__ */ jsxs("span", { style: { marginRight: 6, fontSize: "0.95rem" }, children: [
          t("position.label"),
          " "
        ] }),
        /* @__PURE__ */ jsx("div", { style: { display: "flex", alignItems: "center" }, children: /* @__PURE__ */ jsx(
          CustomSelect,
          {
            value: position2,
            onChange: (v) => {
              setPosition(v);
              if (v !== "default" && repeated2) {
                setRepeated(false);
              }
            },
            options: [
              { value: "default", label: t("position.default") },
              { value: "center", label: t("position.center") },
              { value: "top-left", label: t("position.topLeft") },
              { value: "top-right", label: t("position.topRight") },
              { value: "bottom-left", label: t("position.bottomLeft") },
              { value: "bottom-right", label: t("position.bottomRight") }
            ]
          }
        ) })
      ] }),
      /* @__PURE__ */ jsxs("label", { className: "repeated-label", style: { marginLeft: "0.5rem", display: "flex", alignItems: "center", gap: 6, cursor: position2 === "default" ? "pointer" : "not-allowed" }, children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "checkbox",
            checked: repeated2,
            onChange: (e) => setRepeated(e.target.checked),
            disabled: position2 !== "default"
          }
        ),
        t("repeated")
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "opacity-row", children: [
      /* @__PURE__ */ jsx("label", { htmlFor: "watermark-opacity", style: { fontSize: "0.95rem", whiteSpace: "nowrap" }, children: t("opacity") }),
      /* @__PURE__ */ jsx(
        "input",
        {
          id: "watermark-opacity",
          type: "range",
          min: "0.05",
          max: "1",
          step: "0.05",
          value: opacity2,
          onChange: (e) => setOpacity(parseFloat(e.target.value)),
          className: "opacity-slider",
          style: { background: `linear-gradient(to right, #6366f1 0%, #6366f1 ${opacity2 * 100}%, #e2e6f0 ${opacity2 * 100}%, #e2e6f0 100%)` },
          "aria-label": "Watermark opacity"
        }
      ),
      /* @__PURE__ */ jsxs("span", { className: "opacity-value", children: [
        Math.round(opacity2 * 100),
        "%"
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "watermark-actions", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          className: "watermark-btn",
          onClick: handleWatermarkAll,
          disabled: status2 === "processing" || !mainImages.length || watermarkType === "logo" && !logoFile || watermarkType === "text" && !watermarkText,
          style: { background: "linear-gradient(135deg,#10b981,#06b6d4)" },
          children: status2 === "processing" ? t("processingBtn") : t("applyBtn", { count: mainImages.length || 0 })
        }
      ),
      mainImages.length <= 1 && (outputUrls && outputUrls[currentIndex]) && /* @__PURE__ */ jsx(
        "button",
        {
          className: "watermark-btn watermark-btn--download",
          onClick: () => {
            const a = document.createElement("a");
            a.href = outputUrls[currentIndex];
            a.download = outputNames[currentIndex] || `watermarked-${currentIndex + 1}.jpg`;
            a.click();
          },
          children: t("downloadBtn")
        }
      ),
      mainImages.length > 1 && (outputUrls && outputUrls.some(Boolean)) && /* @__PURE__ */ jsx(
        "button",
        {
          className: "watermark-btn watermark-btn--download",
          onClick: async () => {
            try {
              const zip = new JSZip();
              const entries = outputUrls.map((u, i) => ({ url: u, name: outputNames[i] || `watermarked-${i + 1}.jpg` })).filter((e) => e.url);
              const fetchBlobs = entries.map(async (e) => {
                const res = await fetch(e.url);
                const blob = await res.blob();
                zip.file(e.name, blob);
              });
              await Promise.all(fetchBlobs);
              const zipBlob = await zip.generateAsync({ type: "blob" });
              const a = document.createElement("a");
              const zurl = URL.createObjectURL(zipBlob);
              a.href = zurl;
              a.download = "watermarked-images.zip";
              a.click();
              setTimeout(() => URL.revokeObjectURL(zurl), 5e3);
            } catch (err) {
              console.error("Failed to create zip:", err);
            }
          },
          style: { marginLeft: 8 },
          children: t("downloadAllBtn")
        }
      )
    ] }),
    errorMsg2 && /* @__PURE__ */ jsx("div", { className: "error-msg", children: errorMsg2 }),
    /* @__PURE__ */ jsxs("div", { className: "wm-guide", children: [
      /* @__PURE__ */ jsxs("div", { className: "wm-guide-intro", children: [
        /* @__PURE__ */ jsx("h2", { className: "wm-guide-title", children: t("guide.title") }),
        /* @__PURE__ */ jsx("p", { className: "wm-guide-lead", children: t("guide.lead") })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "wm-guide-section", children: [
        /* @__PURE__ */ jsx("h3", { className: "wm-guide-h3", children: t("guide.whatIs.heading") }),
        /* @__PURE__ */ jsx("p", { children: t("guide.whatIs.body") })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "wm-guide-section wm-guide-why", children: [
        /* @__PURE__ */ jsx("h3", { className: "wm-guide-h3", children: t("guide.why.heading") }),
        /* @__PURE__ */ jsxs("ol", { className: "wm-guide-list", children: [
          /* @__PURE__ */ jsx("li", { children: t("guide.why.item1") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.why.item2") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.why.item3") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.why.item4") })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "wm-guide-section", children: [
        /* @__PURE__ */ jsx("h3", { className: "wm-guide-h3", children: t("guide.types.heading") }),
        /* @__PURE__ */ jsxs("div", { className: "wm-guide-types", children: [
          /* @__PURE__ */ jsxs("div", { className: "wm-type", children: [
            "🔤",
            /* @__PURE__ */ jsx("div", { className: "wm-type-body", children: /* @__PURE__ */ jsx("p", { children: t("guide.types.text").replace(/^🔤\s*/, "") }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "wm-type", children: [
            "🖼",
            /* @__PURE__ */ jsx("div", { className: "wm-type-body", children: /* @__PURE__ */ jsx("p", { children: t("guide.types.logo").replace(/^🖼\s*/, "") }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "wm-type", children: [
            "🔁",
            /* @__PURE__ */ jsx("div", { className: "wm-type-body", children: /* @__PURE__ */ jsx("p", { children: t("guide.types.repeated").replace(/^🔁\s*/, "") }) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "wm-guide-section", children: [
        /* @__PURE__ */ jsx("h3", { className: "wm-guide-h3", children: t("guide.bestPractices.heading") }),
        /* @__PURE__ */ jsxs("ul", { className: "wm-guide-best", children: [
          /* @__PURE__ */ jsx("li", { children: t("guide.bestPractices.item1") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.bestPractices.item2") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.bestPractices.item3") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.bestPractices.item4") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.bestPractices.item5") })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "wm-guide-section", children: [
        /* @__PURE__ */ jsx("h3", { className: "wm-guide-h3", children: t("guide.stepByStep.heading") }),
        /* @__PURE__ */ jsxs("ol", { className: "wm-guide-steps", children: [
          /* @__PURE__ */ jsx("li", { children: t("guide.stepByStep.step1") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.stepByStep.step2") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.stepByStep.step3") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.stepByStep.step4") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.stepByStep.step5") })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "wm-guide-section wm-guide-faq", children: [
        /* @__PURE__ */ jsx("h3", { className: "wm-guide-h3", children: t("guide.faq.heading") }),
        /* @__PURE__ */ jsxs("details", { className: "wm-faq-item", children: [
          /* @__PURE__ */ jsx("summary", { children: t("guide.faq.q1") }),
          /* @__PURE__ */ jsx("p", { children: t("guide.faq.a1") })
        ] }),
        /* @__PURE__ */ jsxs("details", { className: "wm-faq-item", children: [
          /* @__PURE__ */ jsx("summary", { children: t("guide.faq.q2") }),
          /* @__PURE__ */ jsx("p", { children: t("guide.faq.a2") })
        ] }),
        /* @__PURE__ */ jsxs("details", { className: "wm-faq-item", children: [
          /* @__PURE__ */ jsx("summary", { children: t("guide.faq.q3") }),
          /* @__PURE__ */ jsx("p", { children: t("guide.faq.a3") })
        ] }),
        /* @__PURE__ */ jsxs("details", { className: "wm-faq-item", children: [
          /* @__PURE__ */ jsx("summary", { children: t("guide.faq.q4") }),
          /* @__PURE__ */ jsx("p", { children: t("guide.faq.a4") })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "wm-guide-conclusion", children: [
        /* @__PURE__ */ jsx("h3", { children: t("guide.conclusionTitle", { defaultValue: "Conclusion" }) }),
        /* @__PURE__ */ jsx("p", { children: t("guide.conclusion") }),
        /* @__PURE__ */ jsx("a", { href: "/image-watermarker", className: "wm-guide-cta", onClick: (e) => {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: "smooth" });
          navigate("/image-watermarker");
        }, children: t("guide.ctaBtn") })
      ] })
    ] })
  ] });
}
function WatermarkerPage() {
  const location = useLocation();
  const stateImage = location.state && location.state.mainImage;
  const props = useWatermarker(stateImage);
  return /* @__PURE__ */ jsxs("div", { className: "watermarker-page", children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsx("main", { className: "main", children: /* @__PURE__ */ jsx("div", { className: "container", children: /* @__PURE__ */ jsx("div", { className: "card", children: /* @__PURE__ */ jsx(WatermarkerView, { ...props }) }) }) }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
function useImageResizer() {
  const [mainImage, setMainImage] = useState(null);
  const [resizeMode2, setResizeMode] = useState("percentage");
  const [percentage, setPercentage] = useState(100);
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [outputUrl, setOutputUrl] = useState(null);
  const [outputName2, setOutputName] = useState("resized-image.png");
  const [status2, setStatus] = useState("idle");
  const [errorMsg2, setErrorMsg] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef();
  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = await normalizeImageFile(e.dataTransfer.files[0]);
    if (file && isImageFile(file)) {
      setMainImage(file);
      setOutputUrl(null);
      setErrorMsg("");
      const img = new window.Image();
      img.onload = () => {
        setWidth(img.width.toString());
        setHeight(img.height.toString());
      };
      img.src = URL.createObjectURL(file);
    } else {
      setErrorMsg("Please select a valid image file.");
    }
  };
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const handleResize = () => {
    if (!mainImage) return;
    setStatus("processing");
    setErrorMsg("");
    const img = new window.Image();
    img.onload = () => {
      let newWidth, newHeight;
      if (resizeMode2 === "percentage") {
        const pct = parseFloat(percentage) / 100;
        newWidth = Math.round(img.width * pct);
        newHeight = Math.round(img.height * pct);
      } else {
        newWidth = parseInt(width, 10);
        newHeight = parseInt(height, 10);
      }
      if (!newWidth || !newHeight || newWidth <= 0 || newHeight <= 0) {
        setStatus("idle");
        setErrorMsg("Invalid dimensions.");
        return;
      }
      const canvas2 = document.createElement("canvas");
      canvas2.width = newWidth;
      canvas2.height = newHeight;
      const ctx = canvas2.getContext("2d");
      ctx.drawImage(img, 0, 0, newWidth, newHeight);
      canvas2.toBlob((blob) => {
        if (blob) {
          setOutputUrl(URL.createObjectURL(blob));
          setOutputName(mainImage.name.replace(/\.[^.]+$/, "") + "-resized.png");
        } else {
          setErrorMsg("Failed to resize image.");
        }
        setStatus("idle");
      }, "image/png");
    };
    img.onerror = () => {
      setStatus("idle");
      setErrorMsg("Failed to load image.");
    };
    img.src = URL.createObjectURL(mainImage);
  };
  const handleFileInput = async (e) => {
    const file = await normalizeImageFile(e.target.files[0]);
    if (file && isImageFile(file)) {
      setMainImage(file);
      setOutputUrl(null);
      setErrorMsg("");
      const img = new window.Image();
      img.onload = () => {
        setWidth(img.width.toString());
        setHeight(img.height.toString());
      };
      img.src = URL.createObjectURL(file);
    } else {
      setErrorMsg("Please select a valid image file.");
    }
  };
  const handleClear = () => {
    setMainImage(null);
    setOutputUrl(null);
    setWidth("");
    setHeight("");
    setPercentage(100);
    setStatus("idle");
    setErrorMsg("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  return {
    mainImage,
    resizeMode: resizeMode2,
    setResizeMode,
    percentage,
    setPercentage,
    width,
    setWidth,
    height,
    setHeight,
    outputUrl,
    outputName: outputName2,
    status: status2,
    errorMsg: errorMsg2,
    isDragging,
    fileInputRef,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    handleFileInput,
    handleResize,
    handleClear
  };
}
function ImageResizerView({
  mainImage,
  resizeMode: resizeMode2,
  setResizeMode,
  percentage,
  setPercentage,
  width,
  setWidth,
  height,
  setHeight,
  outputUrl,
  outputName: outputName2,
  status: status2,
  errorMsg: errorMsg2,
  isDragging,
  fileInputRef,
  handleDrop,
  handleDragOver,
  handleDragLeave,
  handleFileInput,
  handleResize,
  handleClear
}) {
  const { t } = useTranslation("imageResizer");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [openPanel, setOpenPanel] = useState("");
  const [linked, setLinked] = useState(true);
  const originalWidth = useRef(null);
  const originalHeight = useRef(null);
  const [previewZoom, setPreviewZoomState] = useState(1);
  const previewZoomRef = useRef(1);
  const dropZoneRef = useRef(null);
  const [popupPan, setPopupPan] = useState({ x: 0, y: 0 });
  const [popupDragging, setPopupDragging] = useState(false);
  const popupPanRef = useRef({ x: 0, y: 0 });
  const popupDragRef = useRef({ active: false, startX: 0, startY: 0, startPanX: 0, startPanY: 0 });
  const popupDialogRef = useRef(null);
  const [popupImgSize, setPopupImgSize] = useState({ w: null, h: null });
  React.useEffect(() => {
    if (mainImage) {
      const img = new window.Image();
      img.onload = () => {
        originalWidth.current = img.width;
        originalHeight.current = img.height;
        setWidth(img.width.toString());
        setHeight(img.height.toString());
        previewZoomRef.current = 1;
        setPreviewZoomState(1);
        setResizeMode("dimensions");
      };
      img.src = URL.createObjectURL(mainImage);
    }
  }, [mainImage]);
  React.useEffect(() => {
    const el = dropZoneRef.current;
    if (!el) return;
    let lastDist = null;
    const applyZoom = (next) => {
      previewZoomRef.current = next;
      setPreviewZoomState(next);
      if (originalWidth.current && originalHeight.current) {
        setWidth(Math.round(originalWidth.current * next).toString());
        setHeight(Math.round(originalHeight.current * next).toString());
      }
    };
    const onWheel = (e) => {
      if (!e.altKey) return;
      e.preventDefault();
      const factor = e.deltaY < 0 ? 1.1 : 0.9;
      applyZoom(Math.max(0.1, Math.min(10, previewZoomRef.current * factor)));
    };
    const onTouchStart = (e) => {
      if (e.touches.length === 2) {
        lastDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
      }
    };
    const onTouchMove = (e) => {
      if (e.touches.length === 2 && lastDist !== null) {
        e.preventDefault();
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        applyZoom(Math.max(0.1, Math.min(10, previewZoomRef.current * (dist / lastDist))));
        lastDist = dist;
      }
    };
    const onTouchEnd = () => {
      lastDist = null;
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("touchstart", onTouchStart, { passive: false });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd);
    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, [setWidth, setHeight]);
  React.useEffect(() => {
    if (outputUrl) {
      setPopupImgSize({ w: null, h: null });
      setPreviewOpen(true);
    }
  }, [outputUrl]);
  React.useEffect(() => {
    if (!previewOpen) return;
    setPopupPan({ x: 0, y: 0 });
    popupPanRef.current = { x: 0, y: 0 };
    const onMouseMove = (e) => {
      if (!popupDragRef.current.active) return;
      const newPan = {
        x: popupDragRef.current.startPanX + (e.clientX - popupDragRef.current.startX),
        y: popupDragRef.current.startPanY + (e.clientY - popupDragRef.current.startY)
      };
      popupPanRef.current = newPan;
      setPopupPan(newPan);
    };
    const onMouseUp = () => {
      if (popupDragRef.current.active) {
        popupDragRef.current.active = false;
        setPopupDragging(false);
      }
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    const el = popupDialogRef.current;
    let touchStartX = 0, touchStartY = 0, touchStartPanX = 0, touchStartPanY = 0;
    const onTouchStart = (e) => {
      if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        touchStartPanX = popupPanRef.current.x;
        touchStartPanY = popupPanRef.current.y;
      }
    };
    const onTouchMove = (e) => {
      if (e.touches.length !== 1) return;
      e.preventDefault();
      const newPan = {
        x: touchStartPanX + (e.touches[0].clientX - touchStartX),
        y: touchStartPanY + (e.touches[0].clientY - touchStartY)
      };
      popupPanRef.current = newPan;
      setPopupPan(newPan);
    };
    const onTouchEnd = () => {
    };
    if (el) {
      el.addEventListener("touchstart", onTouchStart, { passive: true });
      el.addEventListener("touchmove", onTouchMove, { passive: false });
      el.addEventListener("touchend", onTouchEnd);
    }
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      if (el) {
        el.removeEventListener("touchstart", onTouchStart);
        el.removeEventListener("touchmove", onTouchMove);
        el.removeEventListener("touchend", onTouchEnd);
      }
    };
  }, [previewOpen]);
  const navigate = useNavigate();
  const [sendStatus, setSendStatus] = useState("idle");
  const handleSendToWatermark = async () => {
    setSendStatus("processing");
    try {
      const response = await fetch(outputUrl);
      const blob = await response.blob();
      const file = new File([blob], outputName2, { type: blob.type });
      navigate("/image-watermarker", { state: { mainImage: file } });
    } catch (e) {
      setSendStatus("error");
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "image-resizer-view", children: [
    /* @__PURE__ */ jsx("h2", { className: "hero-title", children: t("hero.title") }),
    /* @__PURE__ */ jsxs("p", { className: "hero-tagline", children: [
      t("hero.tagline"),
      " ",
      /* @__PURE__ */ jsx(Link, { to: "/blogs/image-resizer-guide", children: t("hero.blogLink") })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "ir-tip-banner", children: [
      /* @__PURE__ */ jsx("span", { className: "ir-tip-text", children: t("hint.text") }),
      /* @__PURE__ */ jsx("button", { className: "ir-tip-btn", onClick: () => navigate("/image-crop"), children: t("hint.btn") })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "details-row", "data-open": openPanel, children: [
      /* @__PURE__ */ jsxs("div", { className: "details-controls", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            className: `tab-btn ${openPanel === "details" ? "active" : ""}`,
            onClick: () => setOpenPanel((prev) => prev === "details" ? "" : "details"),
            "aria-expanded": openPanel === "details",
            type: "button",
            children: t("tabs.details")
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            className: `tab-btn ${openPanel === "howitworks" ? "active" : ""}`,
            onClick: () => setOpenPanel((prev) => prev === "howitworks" ? "" : "howitworks"),
            "aria-expanded": openPanel === "howitworks",
            type: "button",
            children: t("tabs.howItWorks")
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: `shared-collapse${!openPanel ? " panel-hidden" : ""}`, children: [
        /* @__PURE__ */ jsxs("div", { className: openPanel !== "details" ? "details-content panel-hidden" : "details-content", children: [
          /* @__PURE__ */ jsx("h3", { children: t("details.whatIs.heading") }),
          /* @__PURE__ */ jsx("p", { children: t("details.whatIs.body") }),
          /* @__PURE__ */ jsx("h3", { children: t("details.howWorks.heading") }),
          /* @__PURE__ */ jsx("p", { children: t("details.howWorks.body") }),
          /* @__PURE__ */ jsx("h3", { children: t("details.quality.heading") }),
          /* @__PURE__ */ jsxs("ul", { children: [
            /* @__PURE__ */ jsx("li", { children: t("details.quality.item1") }),
            /* @__PURE__ */ jsx("li", { children: t("details.quality.item2") }),
            /* @__PURE__ */ jsx("li", { children: t("details.quality.item3") })
          ] }),
          /* @__PURE__ */ jsx("h3", { children: t("details.practical.heading") }),
          /* @__PURE__ */ jsxs("ul", { children: [
            /* @__PURE__ */ jsx("li", { children: t("details.practical.item1") }),
            /* @__PURE__ */ jsx("li", { children: t("details.practical.item2") }),
            /* @__PURE__ */ jsx("li", { children: t("details.practical.item3") })
          ] }),
          /* @__PURE__ */ jsx("h3", { children: t("details.whenToUse.heading") }),
          /* @__PURE__ */ jsx("p", { children: t("details.whenToUse.body") }),
          /* @__PURE__ */ jsx("h3", { children: t("details.faq.heading") }),
          /* @__PURE__ */ jsxs("ul", { children: [
            /* @__PURE__ */ jsxs("li", { children: [
              /* @__PURE__ */ jsx("strong", { children: t("details.faq.q1") }),
              " ",
              t("details.faq.a1")
            ] }),
            /* @__PURE__ */ jsxs("li", { children: [
              /* @__PURE__ */ jsx("strong", { children: t("details.faq.q2") }),
              " ",
              t("details.faq.a2")
            ] }),
            /* @__PURE__ */ jsxs("li", { children: [
              /* @__PURE__ */ jsx("strong", { children: t("details.faq.q3") }),
              " ",
              t("details.faq.a3")
            ] }),
            /* @__PURE__ */ jsxs("li", { children: [
              /* @__PURE__ */ jsx("strong", { children: t("details.faq.q4") }),
              " ",
              t("details.faq.a4")
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: openPanel !== "howitworks" ? "howitworks-content panel-hidden" : "howitworks-content", children: /* @__PURE__ */ jsxs("ol", { style: { margin: 0, paddingLeft: "1rem" }, children: [
          /* @__PURE__ */ jsxs("li", { style: { marginBottom: "0.75rem" }, children: [
            /* @__PURE__ */ jsx("img", { src: "/screenshots/resizer/Image-resizer001.png", alt: "Step 1", className: "how-img" }),
            /* @__PURE__ */ jsx("p", { children: t("howItWorks.step1") })
          ] }),
          /* @__PURE__ */ jsxs("li", { style: { marginBottom: "0.75rem" }, children: [
            /* @__PURE__ */ jsx("img", { src: "/screenshots/resizer/Image-resizer002.png", alt: "Step 2", className: "how-img" }),
            /* @__PURE__ */ jsx("p", { children: t("howItWorks.step2") })
          ] }),
          /* @__PURE__ */ jsxs("li", { style: { marginBottom: "0.75rem" }, children: [
            /* @__PURE__ */ jsx("img", { src: "/screenshots/resizer/Image-resizer003.png", alt: "Step 3", className: "how-img" }),
            /* @__PURE__ */ jsx("p", { children: t("howItWorks.step3") })
          ] }),
          /* @__PURE__ */ jsxs("li", { children: [
            /* @__PURE__ */ jsx("img", { src: "/screenshots/resizer/Image-resizer004.png", alt: "Step 4", className: "how-img" }),
            /* @__PURE__ */ jsx("p", { children: t("howItWorks.step4") })
          ] })
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(
      "div",
      {
        ref: dropZoneRef,
        className: `drop-zone${isDragging ? " dragging" : ""}${mainImage ? " has-image" : ""}`,
        style: { overflow: "hidden", position: "relative" },
        onDrop: handleDrop,
        onDragOver: handleDragOver,
        onDragLeave: handleDragLeave,
        onClick: () => !mainImage && fileInputRef.current && fileInputRef.current.click(),
        children: [
          mainImage ? /* @__PURE__ */ jsx(
            "img",
            {
              src: URL.createObjectURL(mainImage),
              alt: "Main",
              className: "preview-image clickable",
              style: {
                cursor: "pointer",
                transform: `scale(${previewZoom})`,
                transformOrigin: "center center",
                transition: "transform 0.08s ease"
              },
              onClick: (e) => {
                e.stopPropagation();
                setPreviewOpen(true);
              }
            }
          ) : /* @__PURE__ */ jsx("span", { className: "hero-tagline", children: t("dropZone.text") }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "file",
              accept: "image/*,.heic,.heif",
              style: { display: "none" },
              ref: fileInputRef,
              onChange: handleFileInput
            }
          ),
          mainImage && /* @__PURE__ */ jsx("div", { className: "drop-zone-hint", children: t("dropZone.hint", { percent: Math.round(previewZoom * 100) }) })
        ]
      }
    ),
    mainImage && /* @__PURE__ */ jsxs("div", { className: "ir-file-row", children: [
      /* @__PURE__ */ jsx("span", { className: "ir-file-name", children: mainImage.name }),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          className: "ir-change-btn",
          onClick: () => fileInputRef.current && fileInputRef.current.click(),
          children: t("fileRow.name")
        }
      ),
      /* @__PURE__ */ jsx("button", { type: "button", className: "ir-clear-btn", onClick: handleClear, children: t("fileRow.clear") })
    ] }),
    previewOpen && (mainImage || outputUrl) && /* @__PURE__ */ jsxs("div", { className: "image-popup-overlay", onClick: () => setPreviewOpen(false), children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          ref: popupDialogRef,
          className: "image-popup-dialog",
          onClick: (e) => e.stopPropagation(),
          onMouseDown: (e) => {
            e.stopPropagation();
            popupDragRef.current = {
              active: true,
              startX: e.clientX,
              startY: e.clientY,
              startPanX: popupPanRef.current.x,
              startPanY: popupPanRef.current.y
            };
            setPopupDragging(true);
          },
          style: {
            cursor: popupDragging ? "grabbing" : "grab",
            position: "relative",
            overflow: "hidden",
            display: "block"
          },
          children: /* @__PURE__ */ jsx(
            "img",
            {
              src: outputUrl ? outputUrl : URL.createObjectURL(mainImage),
              alt: "Preview",
              className: "image-popup-img",
              onLoad: (e) => setPopupImgSize({ w: e.target.naturalWidth, h: e.target.naturalHeight }),
              style: {
                position: "absolute",
                top: "50%",
                left: "50%",
                width: popupImgSize.w != null ? `${popupImgSize.w}px` : "auto",
                height: popupImgSize.h != null ? `${popupImgSize.h}px` : "auto",
                maxWidth: "none",
                maxHeight: "none",
                flexShrink: 0,
                transform: `translate(calc(-50% + ${popupPan.x}px), calc(-50% + ${popupPan.y}px))`,
                pointerEvents: "none",
                userSelect: "none",
                display: "block"
              },
              draggable: false
            }
          )
        }
      ),
      /* @__PURE__ */ jsx("button", { className: "close-popup-btn", onClick: () => setPreviewOpen(false), children: "×" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "resize-options", children: [
      /* @__PURE__ */ jsxs("label", { children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "radio",
            name: "resizeMode",
            value: "percentage",
            checked: resizeMode2 === "percentage",
            onChange: () => setResizeMode("percentage")
          }
        ),
        t("resizeMode.percentage")
      ] }),
      /* @__PURE__ */ jsxs("label", { children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "radio",
            name: "resizeMode",
            value: "dimensions",
            checked: resizeMode2 === "dimensions",
            onChange: () => setResizeMode("dimensions")
          }
        ),
        t("resizeMode.dimensions")
      ] })
    ] }),
    resizeMode2 === "percentage" && /* @__PURE__ */ jsxs("label", { className: "resize-input-percent", children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "number",
          className: "resize-input",
          placeholder: t("percentInput.placeholder"),
          value: percentage,
          min: 1,
          max: 500,
          onChange: (e) => setPercentage(e.target.value)
        }
      ),
      "%"
    ] }),
    resizeMode2 === "dimensions" && /* @__PURE__ */ jsxs("div", { className: "dimension-inputs", style: { display: "flex", alignItems: "center", marginTop: "auto", marginBottom: "auto" }, children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "number",
          className: "resize-input",
          placeholder: t("dimensionInputs.width"),
          value: width,
          min: 1,
          style: { alignSelf: "center" },
          onChange: (e) => {
            const newWidth = e.target.value;
            if (linked && originalWidth.current && originalHeight.current && width && height) {
              const ratio = originalHeight.current / originalWidth.current;
              setWidth(newWidth);
              setHeight(newWidth ? Math.round(Number(newWidth) * ratio).toString() : "");
            } else {
              setWidth(newWidth);
            }
          }
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          "aria-label": linked ? t("dimensionInputs.unlinkAria") : t("dimensionInputs.linkAria"),
          style: {
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "0 0.3rem",
            fontSize: "1.3rem",
            color: linked ? "#3182ce" : "#a0aec0",
            display: "flex",
            alignItems: "center",
            alignSelf: "center"
          },
          onClick: () => setLinked((l) => !l),
          children: linked ? /* @__PURE__ */ jsxs("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
            /* @__PURE__ */ jsx("path", { d: "M10 13a5 5 0 0 1 7 0l1 1a5 5 0 0 1 0 7 5 5 0 0 1-7 0l-1-1" }),
            /* @__PURE__ */ jsx("path", { d: "M14 11a5 5 0 0 0-7 0l-1 1a5 5 0 0 0 0 7 5 5 0 0 0 7 0l1-1" })
          ] }) : /* @__PURE__ */ jsxs("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
            /* @__PURE__ */ jsx("path", { d: "M17 7a5 5 0 0 0-7 0l-1 1a5 5 0 0 0 0 7 5 5 0 0 0 7 0l1-1" }),
            /* @__PURE__ */ jsx("line", { x1: "2", y1: "2", x2: "22", y2: "22" })
          ] })
        }
      ),
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "number",
          className: "resize-input",
          placeholder: t("dimensionInputs.height"),
          value: height,
          min: 1,
          style: { alignSelf: "center" },
          onChange: (e) => {
            const newHeight = e.target.value;
            if (linked && originalWidth.current && originalHeight.current && width && height) {
              const ratio = originalWidth.current / originalHeight.current;
              setHeight(newHeight);
              setWidth(newHeight ? Math.round(Number(newHeight) * ratio).toString() : "");
            } else {
              setHeight(newHeight);
            }
          }
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "action-row", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          className: "resize-btn",
          onClick: handleResize,
          disabled: status2 === "processing" || !mainImage || resizeMode2 === "dimensions" && (!width || !height),
          children: status2 === "processing" ? t("processingBtn") : t("previewBtn")
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          className: `download-btn${!outputUrl ? " disabled" : ""}`,
          disabled: !outputUrl,
          onClick: () => {
            if (!outputUrl) return;
            try {
              const link = document.createElement("a");
              link.href = outputUrl;
              link.download = outputName2 || "";
              document.body.appendChild(link);
              link.click();
              link.remove();
            } catch (e) {
              window.open(outputUrl, "_blank", "noopener");
            }
          },
          children: t("downloadBtn")
        }
      )
    ] }),
    errorMsg2 && /* @__PURE__ */ jsx("div", { className: "error-msg", children: errorMsg2 }),
    outputUrl && /* @__PURE__ */ jsxs("div", { className: "output-section", children: [
      /* @__PURE__ */ jsxs(
        "div",
        {
          style: {
            marginTop: "1.5rem",
            width: "100%",
            boxSizing: "border-box",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            border: "1.5px solid #e2e6f0",
            borderRadius: 10,
            background: "#f7f8fa",
            padding: "1rem 1.2rem",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            minHeight: 64
          },
          children: [
            /* @__PURE__ */ jsx("span", { style: { fontWeight: 600, color: "#222", fontSize: "1.08rem", marginBottom: 0, textAlign: "left", flex: 1, display: "block", alignSelf: "center" }, children: t("watermarkPrompt.text") }),
            /* @__PURE__ */ jsx(
              "button",
              {
                className: "resize-btn",
                onClick: handleSendToWatermark,
                disabled: sendStatus === "processing",
                children: sendStatus === "processing" ? t("watermarkPrompt.preparing") : t("watermarkPrompt.yes")
              }
            )
          ]
        }
      ),
      sendStatus === "error" && /* @__PURE__ */ jsx("div", { className: "error-msg", style: { marginTop: 8 }, children: t("watermarkPrompt.error") })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "ir-guide", children: [
      /* @__PURE__ */ jsxs("div", { className: "ir-guide-intro", children: [
        /* @__PURE__ */ jsx("h2", { className: "ir-guide-title", children: t("guide.title") }),
        /* @__PURE__ */ jsx("p", { className: "ir-guide-lead", children: t("guide.lead") }),
        /* @__PURE__ */ jsxs("div", { className: "ir-guide-learn-box", children: [
          /* @__PURE__ */ jsx("span", { className: "ir-guide-learn-label", children: t("guide.learn") }),
          /* @__PURE__ */ jsxs("ul", { className: "ir-guide-learn-list", children: [
            /* @__PURE__ */ jsx("li", { children: t("guide.learnItems.item1") }),
            /* @__PURE__ */ jsx("li", { children: t("guide.learnItems.item2") }),
            /* @__PURE__ */ jsx("li", { children: t("guide.learnItems.item3") }),
            /* @__PURE__ */ jsx("li", { children: t("guide.learnItems.item4") })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "ir-guide-section", children: [
        /* @__PURE__ */ jsx("h3", { className: "ir-guide-h3", children: t("guide.whatMeans.heading") }),
        /* @__PURE__ */ jsx("p", { children: t("guide.whatMeans.body") }),
        /* @__PURE__ */ jsxs("div", { className: "ir-guide-example-box", children: [
          /* @__PURE__ */ jsxs("div", { className: "ir-guide-example-row", children: [
            /* @__PURE__ */ jsx("span", { className: "ir-guide-example-label", children: "Original" }),
            /* @__PURE__ */ jsx("span", { className: "ir-guide-example-val", children: "4000 × 3000 px" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "ir-guide-example-arrow", children: "↓" }),
          /* @__PURE__ */ jsxs("div", { className: "ir-guide-example-row", children: [
            /* @__PURE__ */ jsx("span", { className: "ir-guide-example-label", children: "Resized" }),
            /* @__PURE__ */ jsx("span", { className: "ir-guide-example-val ir-guide-example-val--accent", children: "800 × 600 px" })
          ] })
        ] }),
        /* @__PURE__ */ jsx("p", { children: t("guide.whatMeans.resampling") })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "ir-guide-section", children: [
        /* @__PURE__ */ jsx("h3", { className: "ir-guide-h3", children: t("guide.whyLoseQuality.heading") }),
        /* @__PURE__ */ jsxs("div", { className: "ir-guide-cards", children: [
          /* @__PURE__ */ jsxs("div", { className: "ir-guide-card", children: [
            /* @__PURE__ */ jsx("span", { className: "ir-guide-card-num", children: "1" }),
            /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("p", { children: t("guide.whyLoseQuality.pixel") }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "ir-guide-card", children: [
            /* @__PURE__ */ jsx("span", { className: "ir-guide-card-num", children: "2" }),
            /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("p", { children: t("guide.whyLoseQuality.resampling") }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "ir-guide-card", children: [
            /* @__PURE__ */ jsx("span", { className: "ir-guide-card-num", children: "3" }),
            /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("p", { children: t("guide.whyLoseQuality.repeated") }) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "ir-guide-section", children: [
        /* @__PURE__ */ jsx("h3", { className: "ir-guide-h3", children: t("guide.bestPractices.heading") }),
        /* @__PURE__ */ jsxs("div", { className: "ir-guide-best-list", children: [
          /* @__PURE__ */ jsxs("div", { className: "ir-guide-best-item", children: [
            /* @__PURE__ */ jsx("span", { className: "ir-guide-best-icon", children: "✅" }),
            /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("p", { children: t("guide.bestPractices.aspectRatio") }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "ir-guide-best-item", children: [
            /* @__PURE__ */ jsx("span", { className: "ir-guide-best-icon", children: "✅" }),
            /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("p", { children: t("guide.bestPractices.resizeOnce") }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "ir-guide-best-item", children: [
            /* @__PURE__ */ jsx("span", { className: "ir-guide-best-icon", children: "✅" }),
            /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("p", { children: t("guide.bestPractices.format") }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "ir-guide-best-item", children: [
            /* @__PURE__ */ jsx("span", { className: "ir-guide-best-icon", children: "✅" }),
            /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("p", { children: t("guide.bestPractices.compression") }) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "ir-guide-section", children: [
        /* @__PURE__ */ jsx("h3", { className: "ir-guide-h3", children: t("guide.useCases.heading") }),
        /* @__PURE__ */ jsxs("div", { className: "ir-guide-usecases", children: [
          /* @__PURE__ */ jsxs("div", { className: "ir-guide-usecase", children: [
            /* @__PURE__ */ jsx("span", { className: "ir-guide-usecase-icon", children: "🌐" }),
            /* @__PURE__ */ jsx("p", { children: t("guide.useCases.website") })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "ir-guide-usecase", children: [
            /* @__PURE__ */ jsx("span", { className: "ir-guide-usecase-icon", children: "📱" }),
            /* @__PURE__ */ jsx("p", { children: t("guide.useCases.social") })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "ir-guide-usecase", children: [
            /* @__PURE__ */ jsx("span", { className: "ir-guide-usecase-icon", children: "📧" }),
            /* @__PURE__ */ jsx("p", { children: t("guide.useCases.email") })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "ir-guide-section", children: [
        /* @__PURE__ */ jsx("h3", { className: "ir-guide-h3", children: t("guide.mistakes.heading") }),
        /* @__PURE__ */ jsxs("div", { className: "ir-guide-mistakes", children: [
          /* @__PURE__ */ jsx("div", { className: "ir-guide-mistake", children: t("guide.mistakes.item1") }),
          /* @__PURE__ */ jsx("div", { className: "ir-guide-mistake", children: t("guide.mistakes.item2") }),
          /* @__PURE__ */ jsx("div", { className: "ir-guide-mistake", children: t("guide.mistakes.item3") }),
          /* @__PURE__ */ jsx("div", { className: "ir-guide-mistake", children: t("guide.mistakes.item4") })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "ir-guide-section", children: [
        /* @__PURE__ */ jsx("h3", { className: "ir-guide-h3", children: t("guide.stepByStep.heading") }),
        /* @__PURE__ */ jsxs("ol", { className: "ir-guide-steps", children: [
          /* @__PURE__ */ jsx("li", { children: t("guide.stepByStep.step1") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.stepByStep.step2") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.stepByStep.step3") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.stepByStep.step4") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.stepByStep.step5") })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "ir-guide-section", children: [
        /* @__PURE__ */ jsx("h3", { className: "ir-guide-h3", children: t("guide.faq.heading") }),
        /* @__PURE__ */ jsxs("div", { className: "ir-guide-faq", children: [
          /* @__PURE__ */ jsxs("details", { className: "ir-guide-faq-item", children: [
            /* @__PURE__ */ jsx("summary", { children: t("guide.faq.q1") }),
            /* @__PURE__ */ jsx("p", { children: t("guide.faq.a1") })
          ] }),
          /* @__PURE__ */ jsxs("details", { className: "ir-guide-faq-item", children: [
            /* @__PURE__ */ jsx("summary", { children: t("guide.faq.q2") }),
            /* @__PURE__ */ jsx("p", { children: t("guide.faq.a2") })
          ] }),
          /* @__PURE__ */ jsxs("details", { className: "ir-guide-faq-item", children: [
            /* @__PURE__ */ jsx("summary", { children: t("guide.faq.q3") }),
            /* @__PURE__ */ jsx("p", { children: t("guide.faq.a3") })
          ] }),
          /* @__PURE__ */ jsxs("details", { className: "ir-guide-faq-item", children: [
            /* @__PURE__ */ jsx("summary", { children: t("guide.faq.q4") }),
            /* @__PURE__ */ jsx("p", { children: t("guide.faq.a4") })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "ir-guide-conclusion", children: [
        /* @__PURE__ */ jsx("h3", { children: t("guide.conclusionTitle") }),
        /* @__PURE__ */ jsx("p", { children: t("guide.conclusion") }),
        /* @__PURE__ */ jsx(
          "a",
          {
            href: "/image-resizer",
            className: "ir-guide-cta",
            onClick: (e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
              navigate("/image-resizer");
            },
            children: t("guide.ctaBtn")
          }
        )
      ] })
    ] })
  ] });
}
function ImageResizerPage() {
  const props = useImageResizer();
  return /* @__PURE__ */ jsxs("div", { className: "image-resizer-page", children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsx("main", { className: "main", children: /* @__PURE__ */ jsx("div", { className: "container", children: /* @__PURE__ */ jsx("div", { className: "card", children: /* @__PURE__ */ jsx(ImageResizerView, { ...props }) }) }) }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
const PADDING = 10;
function useImageCollage({
  columns,
  setColumns,
  rows,
  setRows,
  width,
  height,
  images,
  setImages,
  setCollageUrl,
  fileInputRef,
  collageUrl,
  targetWidth,
  targetHeight
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const OUTER_PADDING_X = PADDING;
  const OUTER_PADDING_Y = PADDING;
  const expectedWidth = columns * width + (columns - 1) * PADDING + 2 * OUTER_PADDING_X;
  const expectedHeight = rows * height + (rows - 1) * PADDING + 2 * OUTER_PADDING_Y;
  const canCollage = images.length > 0;
  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    const raw = await normalizeImageFiles(e.dataTransfer.files);
    const files = raw.filter(isImageFile);
    if (!files.length) return;
    let newImages = images.concat(files);
    let total = newImages.length;
    let newCols = columns;
    let newRows = rows;
    while (newCols * newRows < total) {
      if (newCols <= newRows) newCols++;
      else newRows++;
    }
    setImages(newImages);
    if (setColumns && newCols !== columns) setColumns(newCols);
    if (setRows && newRows !== rows) setRows(newRows);
  };
  const handleFileChange = async (e) => {
    if (fileInputRef.current) fileInputRef.current.blur();
    const raw = await normalizeImageFiles(e.target.files);
    const files = raw.filter(isImageFile);
    if (!files.length) return;
    let newImages = images.concat(files);
    let total = newImages.length;
    let newCols = columns;
    let newRows = rows;
    while (newCols * newRows < total) {
      if (newCols <= newRows) newCols++;
      else newRows++;
    }
    setImages(newImages);
    if (setColumns && newCols !== columns) setColumns(newCols);
    if (setRows && newRows !== rows) setRows(newRows);
  };
  const handleCollage = async (targetWidth2, targetHeight2, offsets = [], scales = [], bgColor = "#ffffff") => {
    if (!canCollage) return;
    const canvas2 = document.createElement("canvas");
    canvas2.width = expectedWidth;
    canvas2.height = expectedHeight;
    const ctx = canvas2.getContext("2d");
    ctx.fillStyle = bgColor || "#fff";
    ctx.fillRect(0, 0, canvas2.width, canvas2.height);
    let idx = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < columns; c++) {
        if (idx >= images.length) {
          idx++;
          continue;
        }
        const file = images[idx];
        const img = await loadImage(file);
        try {
          const cellX = OUTER_PADDING_X + c * (width + PADDING);
          const cellY = OUTER_PADDING_Y + r * (height + PADDING);
          const cellW = width;
          const cellH = height;
          const imgRatio = img.width / img.height;
          const cellRatio = cellW / cellH;
          let drawW0, drawH0;
          if (imgRatio > cellRatio) {
            drawH0 = cellH;
            drawW0 = cellH * imgRatio;
          } else {
            drawW0 = cellW;
            drawH0 = cellW / imgRatio;
          }
          const scale = scales && scales[idx] || 1;
          const drawW = Math.round(drawW0 * scale);
          const drawH = Math.round(drawH0 * scale);
          const baseOffsetX = cellX - (drawW - cellW) / 2;
          const baseOffsetY = cellY - (drawH - cellH) / 2;
          const extra = offsets[idx] || { x: 0, y: 0 };
          const offsetX = baseOffsetX + extra.x;
          const offsetY = baseOffsetY + extra.y;
          ctx.save();
          ctx.beginPath();
          ctx.rect(cellX, cellY, cellW, cellH);
          ctx.clip();
          ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
          ctx.restore();
        } finally {
          try {
            if (img && typeof img.src === "string" && img.src.startsWith("blob:")) {
              URL.revokeObjectURL(img.src);
            }
          } catch (e) {
          }
        }
        idx++;
      }
    }
    const baseDataUrl = canvas2.toDataURL("image/png");
    if (targetWidth2 && targetHeight2 && (targetWidth2 !== canvas2.width || targetHeight2 !== canvas2.height)) {
      const out = document.createElement("canvas");
      out.width = targetWidth2;
      out.height = targetHeight2;
      const outCtx = out.getContext("2d");
      outCtx.fillStyle = bgColor || "#fff";
      outCtx.fillRect(0, 0, out.width, out.height);
      const scale = Math.min(targetWidth2 / canvas2.width, targetHeight2 / canvas2.height);
      const newW = Math.round(canvas2.width * scale);
      const newH = Math.round(canvas2.height * scale);
      const offsetXOut = Math.round((targetWidth2 - newW) / 2);
      const offsetYOut = Math.round((targetHeight2 - newH) / 2);
      outCtx.drawImage(canvas2, 0, 0, canvas2.width, canvas2.height, offsetXOut, offsetYOut, newW, newH);
      setCollageUrl(out.toDataURL("image/png"));
    } else {
      setCollageUrl(baseDataUrl);
    }
  };
  const handleDownload = () => {
    if (!collageUrl) return;
    setDownloading(true);
    const a = document.createElement("a");
    a.href = collageUrl;
    a.download = "collage.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => setDownloading(false), 500);
  };
  return {
    handleDrop,
    handleFileChange,
    handleCollage,
    isDragging,
    expectedWidth,
    expectedHeight,
    canCollage,
    downloading,
    handleDownload
  };
}
function loadImage(file) {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}
function ImageFileList({ images, onMove, onRemove, onReset }) {
  const [urls, setUrls] = useState([]);
  const [errors2, setErrors] = useState([]);
  const dataUrlAttempted = useRef([]);
  useEffect(() => {
    urls.forEach((url) => {
      try {
        if (url && typeof url === "string" && url.startsWith("blob:")) URL.revokeObjectURL(url);
      } catch (e) {
      }
    });
    const newUrls = images.map((file) => URL.createObjectURL(file));
    setUrls(newUrls);
    setErrors(images.map(() => false));
    dataUrlAttempted.current = images.map(() => false);
    return () => {
      newUrls.forEach((url) => {
        try {
          if (url && typeof url === "string" && url.startsWith("blob:")) URL.revokeObjectURL(url);
        } catch (e) {
        }
      });
    };
  }, [images]);
  const tryDataUrl = (idx, currentUrls, currentErrors) => {
    if (dataUrlAttempted.current[idx]) {
      const a = currentErrors.slice();
      a[idx] = true;
      setErrors(a);
      return;
    }
    dataUrlAttempted.current[idx] = true;
    const file = images[idx];
    if (!file) {
      const a = currentErrors.slice();
      a[idx] = true;
      setErrors(a);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const newUrls = currentUrls.slice();
      newUrls[idx] = reader.result;
      setUrls(newUrls);
      const a = currentErrors.slice();
      a[idx] = false;
      setErrors(a);
    };
    reader.onerror = () => {
      const a = currentErrors.slice();
      a[idx] = true;
      setErrors(a);
    };
    reader.readAsDataURL(file);
  };
  return /* @__PURE__ */ jsx("div", { className: "image-file-list", children: images.map((file, idx) => /* @__PURE__ */ jsxs("div", { className: "image-file-item", children: [
    errors2[idx] ? /* @__PURE__ */ jsx("div", { className: "image-thumb", style: { display: "flex", alignItems: "center", justifyContent: "center", background: "#f4f6f8", color: "#666", fontSize: 12, padding: 6 }, children: "Unsupported" }) : /* @__PURE__ */ jsx(
      "img",
      {
        src: urls[idx],
        alt: file.name,
        className: "image-thumb",
        draggable: false,
        onError: () => tryDataUrl(idx, urls, errors2)
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "image-file-actions", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          disabled: idx === 0,
          onClick: (e) => {
            e.stopPropagation();
            onMove(idx, idx - 1);
          },
          title: "Move Left",
          children: "◀"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          disabled: idx === images.length - 1,
          onClick: (e) => {
            e.stopPropagation();
            onMove(idx, idx + 1);
          },
          title: "Move Right",
          children: "▶"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: (e) => {
            e.stopPropagation();
            onReset && onReset(idx);
          },
          title: "Reset Position",
          children: "Reset"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: (e) => {
            e.stopPropagation();
            onRemove(idx);
          },
          title: "Remove",
          children: "✕"
        }
      )
    ] })
  ] }, file.name + file.size)) });
}
const ImageCollageView = ({
  columns,
  setColumns,
  rows,
  setRows,
  width,
  setWidth,
  height,
  setHeight,
  images,
  setImages,
  collageUrl,
  setCollageUrl
}) => {
  const { t } = useTranslation("imageCollage");
  const fileInputRef = useRef(null);
  const [totalWidth, setTotalWidth] = useState(1200);
  const [totalHeight, setTotalHeight] = useState(1200);
  const [lockRatio, setLockRatio] = useState(false);
  const ratioRef = useRef(1);
  const navigate = useNavigate();
  const [sendStatus, setSendStatus] = useState("idle");
  const handleSendToWatermark = async () => {
    setSendStatus("processing");
    try {
      const response = await fetch(collageUrl);
      const blob = await response.blob();
      const file = new File([blob], "collage.png", { type: "image/png" });
      navigate("/image-watermarker", { state: { mainImage: file } });
    } catch (e) {
      setSendStatus("error");
    }
  };
  const {
    handleDrop,
    handleFileChange,
    handleCollage,
    isDragging,
    expectedWidth,
    expectedHeight,
    canCollage,
    downloading,
    handleDownload
  } = useImageCollage({
    columns,
    setColumns,
    rows,
    setRows,
    width,
    height,
    images,
    setImages,
    setCollageUrl,
    fileInputRef,
    collageUrl
  });
  useEffect(() => {
    if (images.length > 0) {
      setTotalWidth(expectedWidth);
      setTotalHeight(expectedHeight);
      if (expectedHeight > 0) ratioRef.current = expectedWidth / expectedHeight;
    }
  }, [expectedWidth, expectedHeight]);
  const handleTotalWidthChange = (val) => {
    if (!Number.isFinite(val) || val <= 0) return;
    if (lockRatio && ratioRef.current > 0) {
      setTotalWidth(val);
      setTotalHeight(Math.max(1, Math.round(val / ratioRef.current)));
    } else {
      setTotalWidth(val);
    }
  };
  const handleTotalHeightChange = (val) => {
    if (!Number.isFinite(val) || val <= 0) return;
    if (lockRatio && ratioRef.current > 0) {
      setTotalHeight(val);
      setTotalWidth(Math.max(1, Math.round(val * ratioRef.current)));
    } else {
      setTotalHeight(val);
    }
  };
  const handleMove = (from, to) => {
    if (to < 0 || to >= images.length) return;
    const newImages = images.slice();
    const [moved] = newImages.splice(from, 1);
    newImages.splice(to, 0, moved);
    setImages(newImages);
  };
  const handleRemove = (idx) => {
    const newImages = images.slice();
    newImages.splice(idx, 1);
    setImages(newImages);
  };
  const [showDialog, setShowDialog] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [openPanel, setOpenPanel] = useState("");
  const [previewUrls, setPreviewUrls] = useState([]);
  const [previewMeta, setPreviewMeta] = useState([]);
  const [previewErrors, setPreviewErrors] = useState([]);
  const previewDataUrlAttempted = useRef([]);
  const [offsets, setOffsets] = useState([]);
  const [scales, setScales] = useState([]);
  const previewRef = useRef(null);
  const [previewScale, setPreviewScale] = useState(1);
  const [previewScaledSize, setPreviewScaledSize] = useState({ w: 0, h: 0 });
  const [previewContentSize, setPreviewContentSize] = useState({ w: 0, h: 0 });
  const [previewGap, setPreviewGap] = useState(10);
  const previewWrapperRef = useRef(null);
  const previewOverlayRef = useRef(null);
  const [previewBtnStyle, setPreviewBtnStyle] = useState({ padding: "0.55rem 0.9rem", fontSize: "1rem", minWidth: 64 });
  const previewHeaderRef = useRef(null);
  const previewInfoRef = useRef(null);
  const [bgColor, setBgColor] = useState("#ffffff");
  useEffect(() => {
    previewUrls.forEach((u) => {
      try {
        if (u && typeof u === "string" && u.startsWith("blob:")) URL.revokeObjectURL(u);
      } catch (e) {
      }
    });
    const urls = images.map((f) => URL.createObjectURL(f));
    setPreviewUrls(urls);
    setPreviewErrors(images.map(() => false));
    previewDataUrlAttempted.current = images.map(() => false);
    setOffsets(images.map(() => ({ x: 0, y: 0 })));
    setScales(images.map(() => 1));
    Promise.all(
      urls.map(
        (u) => new Promise((resolve) => {
          const img = new window.Image();
          img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight });
          img.onerror = () => resolve({ w: 1, h: 1 });
          img.src = u;
        })
      )
    ).then((meta2) => setPreviewMeta(meta2));
    return () => urls.forEach((u) => {
      try {
        if (u && typeof u === "string" && u.startsWith("blob:")) URL.revokeObjectURL(u);
      } catch (e) {
      }
    });
  }, [images]);
  const tryPreviewDataUrl = (idx, currentUrls, currentErrors) => {
    if (previewDataUrlAttempted.current[idx]) {
      const errs = currentErrors.slice();
      errs[idx] = true;
      setPreviewErrors(errs);
      return;
    }
    previewDataUrlAttempted.current[idx] = true;
    const file = images[idx];
    if (!file) {
      const arr = currentErrors.slice();
      arr[idx] = true;
      setPreviewErrors(arr);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const arr = currentUrls.slice();
      arr[idx] = reader.result;
      setPreviewUrls(arr);
      const errs = currentErrors.slice();
      errs[idx] = false;
      setPreviewErrors(errs);
    };
    reader.onerror = () => {
      const errs = currentErrors.slice();
      errs[idx] = true;
      setPreviewErrors(errs);
    };
    reader.readAsDataURL(file);
  };
  useEffect(() => {
    if (!showPreview) return;
    const compute = () => {
      const ref = previewRef.current;
      if (!ref) return;
      const rect = ref.getBoundingClientRect();
      if (rect.width < 10 || rect.height < 10) return;
      const availW = Math.max(1, rect.width - 2);
      const availH = Math.max(1, rect.height - 2);
      const gap = previewGap ?? 10;
      const contentW = columns * width + (columns + 1) * gap;
      const contentH = rows * height + (rows + 1) * gap;
      const scaleFit = Math.min(availW / Math.max(1, contentW), availH / Math.max(1, contentH), 1);
      setPreviewScale(scaleFit);
      setPreviewContentSize({ w: contentW, h: contentH });
      setPreviewScaledSize({ w: Math.max(1, contentW * scaleFit), h: Math.max(1, contentH * scaleFit) });
      const wrapEl = previewWrapperRef.current;
      const wrapW = wrapEl ? wrapEl.getBoundingClientRect().width : availW;
      if (wrapW < 360) {
        setPreviewBtnStyle({ padding: "0.3rem 0.45rem", fontSize: "0.78rem", minWidth: 44 });
      } else if (wrapW < 500) {
        setPreviewBtnStyle({ padding: "0.4rem 0.6rem", fontSize: "0.88rem", minWidth: 54 });
      } else {
        setPreviewBtnStyle({ padding: "0.55rem 0.9rem", fontSize: "1rem", minWidth: 64 });
      }
    };
    compute();
    let rafId = requestAnimationFrame(compute);
    let ro = null;
    if (typeof window !== "undefined" && "ResizeObserver" in window && previewRef.current) {
      try {
        ro = new ResizeObserver(compute);
        ro.observe(previewRef.current);
      } catch (e) {
        ro = null;
      }
    }
    window.addEventListener("resize", compute);
    return () => {
      window.removeEventListener("resize", compute);
      if (ro) try {
        ro.disconnect();
      } catch (e) {
      }
      try {
        cancelAnimationFrame(rafId);
      } catch (e) {
      }
    };
  }, [showPreview, expectedWidth, expectedHeight, rows, columns, width, height, previewGap]);
  const cellPointersRef = useRef(/* @__PURE__ */ new Map());
  const cellGestureRef = useRef(/* @__PURE__ */ new Map());
  const onCellPointerDown = (e, idx, cellW, cellH, cellLeft, cellTop, meta2) => {
    e.preventDefault();
    e.stopPropagation();
    if (!cellPointersRef.current.has(idx)) cellPointersRef.current.set(idx, /* @__PURE__ */ new Map());
    const pmap = cellPointersRef.current.get(idx);
    pmap.set(e.pointerId, { x: e.clientX, y: e.clientY });
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (err) {
    }
    if (pmap.size === 1) {
      const curOff = offsets[idx] || { x: 0, y: 0 };
      cellGestureRef.current.set(idx, {
        type: "drag",
        startX: e.clientX,
        startY: e.clientY,
        startOff: { x: curOff.x, y: curOff.y }
      });
    } else if (pmap.size === 2) {
      const pts = Array.from(pmap.values());
      const dist = Math.hypot(pts[1].x - pts[0].x, pts[1].y - pts[0].y) || 1;
      const curOff = offsets[idx] || { x: 0, y: 0 };
      cellGestureRef.current.set(idx, {
        type: "pinch",
        startDist: dist,
        startScale: scales[idx] || 1,
        startOff: { x: curOff.x, y: curOff.y },
        cellW,
        cellH,
        cellLeft,
        cellTop,
        meta: meta2
      });
    }
  };
  const onCellPointerMove = (e, idx) => {
    const pmap = cellPointersRef.current.get(idx);
    if (!pmap || !pmap.has(e.pointerId)) return;
    pmap.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const state = cellGestureRef.current.get(idx);
    if (!state) return;
    if (state.type === "pinch" && pmap.size >= 2) {
      const pts = Array.from(pmap.values());
      const dist = Math.hypot(pts[1].x - pts[0].x, pts[1].y - pts[0].y) || 1;
      const scaleFactor = dist / (state.startDist || 1);
      const newScale = Math.max(0.5, Math.min(4, state.startScale * scaleFactor));
      const r = newScale / state.startScale;
      setOffsets((prev) => {
        const n = prev.slice();
        n[idx] = { x: Math.round(state.startOff.x * r), y: Math.round(state.startOff.y * r) };
        return n;
      });
      setScales((prev) => {
        const n = prev.slice();
        n[idx] = newScale;
        return n;
      });
    } else if (state.type === "drag" && pmap.size === 1) {
      const dX = e.clientX - state.startX;
      const dY = e.clientY - state.startY;
      setOffsets((prev) => {
        const n = prev.slice();
        n[idx] = { x: Math.round(state.startOff.x + dX / previewScale), y: Math.round(state.startOff.y + dY / previewScale) };
        return n;
      });
    }
  };
  const onCellPointerUp = (e, idx) => {
    const pmap = cellPointersRef.current.get(idx);
    if (!pmap) return;
    pmap.delete(e.pointerId);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch (err) {
    }
    if (pmap.size === 0) {
      cellPointersRef.current.delete(idx);
      cellGestureRef.current.delete(idx);
    } else if (pmap.size === 1) {
      const remaining = Array.from(pmap.values())[0];
      const curOff = offsets[idx] || { x: 0, y: 0 };
      cellGestureRef.current.set(idx, {
        type: "drag",
        startX: remaining.x,
        startY: remaining.y,
        startOff: { x: curOff.x, y: curOff.y }
      });
    }
  };
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const onImageWheel = (e, idx, meta2, off, cellW, cellH, cellLeft, cellTop) => {
    if (!e.altKey) return;
    e.preventDefault();
    const prevScale = scales[idx] || 1;
    const factor = e.deltaY < 0 ? 1.06 : 0.94;
    let newScale = clamp(prevScale * factor, 0.5, 4);
    if (Math.abs(newScale - prevScale) < 1e-4) return;
    const imgRatio = meta2 && meta2.w && meta2.h ? meta2.w / meta2.h : 1;
    const cellRatio = cellW / cellH;
    let drawW0, drawH0;
    if (imgRatio > cellRatio) {
      drawH0 = cellH;
      drawW0 = cellH * imgRatio;
    } else {
      drawW0 = cellW;
      drawH0 = cellW / imgRatio;
    }
    const drawW_old = drawW0 * prevScale;
    const drawH_old = drawH0 * prevScale;
    const drawW_new = drawW0 * newScale;
    const drawH_new = drawH0 * newScale;
    const offX = off ? off.x || 0 : 0;
    const offY = off ? off.y || 0 : 0;
    const cellRect = e.currentTarget.getBoundingClientRect();
    const pxInCell = (e.clientX - cellRect.left) / previewScale;
    const pyInCell = (e.clientY - cellRect.top) / previewScale;
    const px = pxInCell - offX - (cellW - drawW_old) / 2;
    const py = pyInCell - offY - (cellH - drawH_old) / 2;
    const baseOffsetX_old = cellLeft - (drawW_old - cellW) / 2;
    const baseOffsetY_old = cellTop - (drawH_old - cellH) / 2;
    const baseOffsetX_new = cellLeft - (drawW_new - cellW) / 2;
    const baseOffsetY_new = cellTop - (drawH_new - cellH) / 2;
    const focal_canvas = baseOffsetX_old + offX + px;
    const focal_canvas_y = baseOffsetY_old + offY + py;
    const uX = drawW_old !== 0 ? px / drawW_old : 0.5;
    const uY = drawH_old !== 0 ? py / drawH_old : 0.5;
    const f_new_x = uX * drawW_new;
    const f_new_y = uY * drawH_new;
    const newOffX = Math.round(focal_canvas - baseOffsetX_new - f_new_x);
    const newOffY = Math.round(focal_canvas_y - baseOffsetY_new - f_new_y);
    const nextOffsets = offsets.slice();
    nextOffsets[idx] = { x: newOffX, y: newOffY };
    const nextScales = scales.slice();
    nextScales[idx] = newScale;
    setOffsets(nextOffsets);
    setScales(nextScales);
  };
  const handlePreviewWheel = (e) => {
    if (e.altKey) e.preventDefault();
  };
  useEffect(() => {
    const el = previewRef.current;
    if (!el) return;
    const handler = (e) => {
      if (e.altKey) e.preventDefault();
    };
    el.addEventListener("wheel", handler, { passive: false });
    return () => el.removeEventListener("wheel", handler);
  }, []);
  useEffect(() => {
    const el = previewOverlayRef.current;
    if (!el) return;
    const handler = (e) => {
      if (e.altKey) e.preventDefault();
    };
    el.addEventListener("wheel", handler, { passive: false, capture: true });
    return () => el.removeEventListener("wheel", handler, { capture: true });
  }, []);
  useEffect(() => {
    const docHandler = (e) => {
      if (!showPreview || !e.altKey) return;
      e.preventDefault();
    };
    document.addEventListener("wheel", docHandler, { passive: false, capture: true });
    return () => document.removeEventListener("wheel", docHandler, { capture: true });
  }, [showPreview]);
  const handleResetOffset = (idx) => {
    const n = offsets.slice();
    n[idx] = { x: 0, y: 0 };
    setOffsets(n);
    const s = scales.slice();
    s[idx] = 1;
    setScales(s);
  };
  const onCollageAndPreview = async () => {
    if (!canCollage) return;
    if (!showPreview) {
      setShowPreview(true);
      return;
    }
    await handleCollage(totalWidth, totalHeight, offsets, scales);
    setShowPreview(false);
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("h2", { className: "hero-title", children: t("hero.title") }),
    /* @__PURE__ */ jsxs("p", { className: "hero-tagline", children: [
      t("hero.tagline"),
      " ",
      /* @__PURE__ */ jsx(Link, { to: "/blogs/image-collage-guide", children: t("hero.blogLink") })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "details-row", "data-open": openPanel, children: [
      /* @__PURE__ */ jsxs("div", { className: "details-controls", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            className: `tab-btn ${openPanel === "details" ? "active" : ""}`,
            onClick: () => setOpenPanel((prev) => prev === "details" ? "" : "details"),
            "aria-expanded": openPanel === "details",
            type: "button",
            children: t("tabs.details")
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            className: `tab-btn ${openPanel === "howitworks" ? "active" : ""}`,
            onClick: () => setOpenPanel((prev) => prev === "howitworks" ? "" : "howitworks"),
            "aria-expanded": openPanel === "howitworks",
            type: "button",
            children: t("tabs.howItWorks")
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: `shared-collapse${!openPanel ? " panel-hidden" : ""}`, children: [
        /* @__PURE__ */ jsxs("div", { className: openPanel !== "details" ? "details-content panel-hidden" : "details-content", children: [
          /* @__PURE__ */ jsx("h3", { children: t("details.whatIs.heading") }),
          /* @__PURE__ */ jsx("p", { children: t("details.whatIs.body") }),
          /* @__PURE__ */ jsx("h3", { children: t("details.howWorks.heading") }),
          /* @__PURE__ */ jsx("p", { children: t("details.howWorks.body") }),
          /* @__PURE__ */ jsx("h3", { children: t("details.design.heading") }),
          /* @__PURE__ */ jsxs("ul", { children: [
            /* @__PURE__ */ jsx("li", { children: t("details.design.item1") }),
            /* @__PURE__ */ jsx("li", { children: t("details.design.item2") }),
            /* @__PURE__ */ jsx("li", { children: t("details.design.item3") })
          ] }),
          /* @__PURE__ */ jsx("h3", { children: t("details.practical.heading") }),
          /* @__PURE__ */ jsxs("ul", { children: [
            /* @__PURE__ */ jsx("li", { children: t("details.practical.item1") }),
            /* @__PURE__ */ jsx("li", { children: t("details.practical.item2") }),
            /* @__PURE__ */ jsx("li", { children: t("details.practical.item3") }),
            /* @__PURE__ */ jsx("li", { children: t("details.practical.item4") })
          ] }),
          /* @__PURE__ */ jsx("h3", { children: t("details.accessibility.heading") }),
          /* @__PURE__ */ jsx("p", { children: t("details.accessibility.body") }),
          /* @__PURE__ */ jsx("h3", { children: t("details.whenToUse.heading") }),
          /* @__PURE__ */ jsxs("ul", { children: [
            /* @__PURE__ */ jsx("li", { children: t("details.whenToUse.item1") }),
            /* @__PURE__ */ jsx("li", { children: t("details.whenToUse.item2") }),
            /* @__PURE__ */ jsx("li", { children: t("details.whenToUse.item3") })
          ] }),
          /* @__PURE__ */ jsx("h3", { children: t("details.export.heading") }),
          /* @__PURE__ */ jsx("p", { children: t("details.export.body") }),
          /* @__PURE__ */ jsx("h3", { children: t("details.privacy.heading") }),
          /* @__PURE__ */ jsx("p", { children: t("details.privacy.body") }),
          /* @__PURE__ */ jsx("h3", { children: t("details.limitations.heading") }),
          /* @__PURE__ */ jsxs("ul", { children: [
            /* @__PURE__ */ jsx("li", { children: t("details.limitations.item1") }),
            /* @__PURE__ */ jsx("li", { children: t("details.limitations.item2") }),
            /* @__PURE__ */ jsx("li", { children: t("details.limitations.item3") })
          ] }),
          /* @__PURE__ */ jsx("h3", { children: t("details.faq.heading") }),
          /* @__PURE__ */ jsxs("ul", { children: [
            /* @__PURE__ */ jsxs("li", { children: [
              /* @__PURE__ */ jsx("strong", { children: t("details.faq.q1") }),
              " ",
              t("details.faq.a1")
            ] }),
            /* @__PURE__ */ jsxs("li", { children: [
              /* @__PURE__ */ jsx("strong", { children: t("details.faq.q2") }),
              " ",
              t("details.faq.a2")
            ] }),
            /* @__PURE__ */ jsxs("li", { children: [
              /* @__PURE__ */ jsx("strong", { children: t("details.faq.q3") }),
              " ",
              t("details.faq.a3")
            ] }),
            /* @__PURE__ */ jsxs("li", { children: [
              /* @__PURE__ */ jsx("strong", { children: t("details.faq.q4") }),
              " ",
              t("details.faq.a4")
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: openPanel !== "howitworks" ? "howitworks-content panel-hidden" : "howitworks-content", children: /* @__PURE__ */ jsxs("ol", { style: { margin: 0, paddingLeft: "1rem" }, children: [
          /* @__PURE__ */ jsxs("li", { style: { marginBottom: "0.75rem" }, children: [
            /* @__PURE__ */ jsx("img", { src: "/screenshots/collage/image-collage001.png", alt: "Step 1", className: "how-img" }),
            /* @__PURE__ */ jsx("p", { children: t("howItWorks.step1") })
          ] }),
          /* @__PURE__ */ jsxs("li", { style: { marginBottom: "0.75rem" }, children: [
            /* @__PURE__ */ jsx("img", { src: "/screenshots/collage/image-collage002.png", alt: "Step 2", className: "how-img" }),
            /* @__PURE__ */ jsx("p", { children: t("howItWorks.step2") })
          ] }),
          /* @__PURE__ */ jsxs("li", { style: { marginBottom: "0.75rem" }, children: [
            /* @__PURE__ */ jsx("img", { src: "/screenshots/collage/image-collage003.png", alt: "Step 3", className: "how-img" }),
            /* @__PURE__ */ jsx("p", { children: t("howItWorks.step3") })
          ] }),
          /* @__PURE__ */ jsxs("li", { children: [
            /* @__PURE__ */ jsx("img", { src: "/screenshots/collage/image-collage004.png", alt: "Step 4", className: "how-img" }),
            /* @__PURE__ */ jsx("p", { children: t("howItWorks.step4") })
          ] })
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: `drop-zone${isDragging ? " dragging" : ""}`,
        onDrop: handleDrop,
        onDragOver: (e) => e.preventDefault(),
        onDragEnter: (e) => e.preventDefault(),
        onDragLeave: (e) => e.preventDefault(),
        onClick: () => fileInputRef.current && fileInputRef.current.click(),
        children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              ref: fileInputRef,
              type: "file",
              accept: "image/*,.heic,.heif",
              multiple: true,
              style: { display: "none" },
              onChange: handleFileChange
            }
          ),
          /* @__PURE__ */ jsx("span", { className: "hero-tagline", children: t("dropZone.text") }),
          images.length > 0 && /* @__PURE__ */ jsx(ImageFileList, { images, onMove: handleMove, onRemove: handleRemove, onReset: handleResetOffset })
        ]
      }
    ),
    images.length > 0 && /* @__PURE__ */ jsxs("div", { className: "ic-file-row", children: [
      /* @__PURE__ */ jsx("span", { className: "ic-file-name", children: images.length === 1 ? images[0].name : t("fileRow.count", { count: images.length }) }),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          className: "ic-change-btn",
          onClick: () => fileInputRef.current && fileInputRef.current.click(),
          children: images.length === 1 ? t("fileRow.changeOne") : t("fileRow.changeMany")
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          className: "ic-clear-btn",
          onClick: () => {
            setImages([]);
            setCollageUrl(null);
          },
          children: t("fileRow.clear")
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "collage-options", children: [
      /* @__PURE__ */ jsxs("div", { className: "collage-controls-row", children: [
        /* @__PURE__ */ jsx("label", { className: "collage-inline-label", children: t("controls.columns") }),
        /* @__PURE__ */ jsx("input", { type: "number", min: 1, max: 10, value: columns, onChange: (e) => setColumns(Number(e.target.value)) }),
        /* @__PURE__ */ jsx("label", { className: "collage-inline-label", children: t("controls.rows") }),
        /* @__PURE__ */ jsx("input", { type: "number", min: 1, max: 10, value: rows, onChange: (e) => setRows(Number(e.target.value)) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "collage-controls-row", children: [
        /* @__PURE__ */ jsx("label", { className: "collage-inline-label", children: t("controls.widthHeight") }),
        /* @__PURE__ */ jsxs("div", { className: "px-input", children: [
          /* @__PURE__ */ jsx("input", { type: "number", placeholder: t("controls.widthPlaceholder"), min: 50, value: totalWidth, onChange: (e) => handleTotalWidthChange(Number(e.target.value)) }),
          /* @__PURE__ */ jsx("span", { className: "px-suffix", children: "px" })
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            "aria-label": lockRatio ? t("controls.unlinkAria") : t("controls.linkAria"),
            onClick: () => {
              const newLock = !lockRatio;
              setLockRatio(newLock);
              if (newLock && totalHeight > 0) ratioRef.current = totalWidth / totalHeight;
            },
            className: "ratio-lock-btn",
            title: lockRatio ? t("controls.unlinkAria") : t("controls.linkAria"),
            children: lockRatio ? /* @__PURE__ */ jsxs("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
              /* @__PURE__ */ jsx("path", { d: "M10 13a5 5 0 0 1 7 0l1 1a5 5 0 0 1 0 7 5 5 0 0 1-7 0l-1-1" }),
              /* @__PURE__ */ jsx("path", { d: "M14 11a5 5 0 0 0-7 0l-1 1a5 5 0 0 0 0 7 5 5 0 0 0 7 0l1-1" })
            ] }) : /* @__PURE__ */ jsxs("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
              /* @__PURE__ */ jsx("path", { d: "M17 7a5 5 0 0 0-7 0l-1 1a5 5 0 0 0 0 7 5 5 0 0 0 7 0l1-1" }),
              /* @__PURE__ */ jsx("line", { x1: "2", y1: "2", x2: "22", y2: "22" })
            ] })
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "px-input", children: [
          /* @__PURE__ */ jsx("input", { type: "number", placeholder: t("controls.heightPlaceholder"), min: 50, value: totalHeight, onChange: (e) => handleTotalHeightChange(Number(e.target.value)) }),
          /* @__PURE__ */ jsx("span", { className: "px-suffix", children: "px" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "flex-start", gap: 8, background: "#eef4ff", border: "1px solid #b8d0f7", borderRadius: 8, padding: "0.55rem 0.85rem", marginBottom: 8, fontSize: "0.92rem", color: "#2d5fa6" }, children: [
      /* @__PURE__ */ jsx("span", { style: { fontSize: "1rem", flexShrink: 0 }, children: "ℹ️" }),
      /* @__PURE__ */ jsx("span", { children: t("infoBanner") })
    ] }),
    /* @__PURE__ */ jsx("button", { className: "collage-btn", onClick: onCollageAndPreview, disabled: !canCollage, children: t("collageBtn") }),
    collageUrl && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("div", { className: "collage-preview-outer", children: /* @__PURE__ */ jsx("div", { className: "collage-preview", children: /* @__PURE__ */ jsx("img", { src: collageUrl, alt: "Collage Preview", style: { cursor: "pointer" }, onClick: () => setShowDialog(true) }) }) }),
      /* @__PURE__ */ jsx("div", { style: { textAlign: "center", marginTop: "0.5rem", fontSize: "1rem", color: "#444" }, children: t("finalSize", { width: totalWidth, height: totalHeight }) }),
      /* @__PURE__ */ jsx("button", { className: "download-btn", onClick: handleDownload, disabled: downloading, style: { margin: "1.2rem auto 0 auto", display: "block" }, children: downloading ? t("downloadingBtn") : t("downloadBtn") }),
      /* @__PURE__ */ jsxs("div", { style: { marginTop: "1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, border: "1.5px solid #e2e6f0", borderRadius: 10, background: "#f7f8fa", padding: "1rem 1.2rem", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", minHeight: 64 }, children: [
        /* @__PURE__ */ jsx("span", { style: { fontWeight: 600, color: "#222", fontSize: "1.08rem", flex: 1, display: "block", alignSelf: "center" }, children: t("watermarkPrompt.text") }),
        /* @__PURE__ */ jsx("button", { className: "collage-btn", style: { minWidth: 64, padding: "0.35rem 1.1rem", fontSize: "0.98rem", marginLeft: 12, alignSelf: "center" }, onClick: handleSendToWatermark, disabled: sendStatus === "processing", children: sendStatus === "processing" ? t("watermarkPrompt.preparing") : t("watermarkPrompt.yes") })
      ] }),
      sendStatus === "error" && /* @__PURE__ */ jsx("div", { className: "error-msg", style: { marginTop: 8 }, children: t("watermarkPrompt.error") }),
      showDialog && /* @__PURE__ */ jsxs("div", { style: { position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1e3 }, onClick: () => setShowDialog(false), children: [
        /* @__PURE__ */ jsx("img", { src: collageUrl, alt: "Collage Full Preview", style: { maxWidth: "90vw", maxHeight: "90vh", boxShadow: "0 0 24px #000", background: "#fff", borderRadius: "8px" }, onClick: (e) => e.stopPropagation() }),
        /* @__PURE__ */ jsx("button", { style: { position: "fixed", top: 24, right: 32, fontSize: "2rem", background: "none", color: "#fff", border: "none", cursor: "pointer", zIndex: 1001 }, onClick: () => setShowDialog(false), "aria-label": t("preview.closeAria"), children: "×" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "ic-guide", children: [
      /* @__PURE__ */ jsxs("div", { className: "ic-guide-header", children: [
        /* @__PURE__ */ jsx("h2", { className: "ic-guide-title", children: t("guide.title", { defaultValue: "How to Create Stunning Image Collages That Tell a Story" }) }),
        /* @__PURE__ */ jsx("h3", { children: t("guide.introHeading", { defaultValue: "Introduction" }) }),
        /* @__PURE__ */ jsx("p", { className: "ic-guide-lead", children: t("guide.lead", { defaultValue: "Sometimes one photo isn’t enough. Whether you’re capturing a trip, showcasing products, or sharing moments on social media, a single image can feel limiting. That’s where image collages come in." }) }),
        /* @__PURE__ */ jsx("p", { children: t("guide.byCombining", { defaultValue: "By combining multiple images into one, you can:" }) }),
        /* @__PURE__ */ jsxs("ul", { className: "ic-list", children: [
          /* @__PURE__ */ jsx("li", { children: t("guide.intro.items.item1", { defaultValue: "Tell a richer story" }) }),
          /* @__PURE__ */ jsx("li", { children: t("guide.intro.items.item2", { defaultValue: "Show variety in a single frame" }) }),
          /* @__PURE__ */ jsx("li", { children: t("guide.intro.items.item3", { defaultValue: "Create eye-catching visuals" }) })
        ] }),
        /* @__PURE__ */ jsx("p", { children: t("guide.introConclusion", { defaultValue: "In this guide, you’ll learn how to design effective image collages, when to use them, and how to make them look professional (not messy)." }) })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "ic-section", children: [
        /* @__PURE__ */ jsx("h3", { children: t("guide.whatIs.heading", { defaultValue: "What Is an Image Collage?" }) }),
        /* @__PURE__ */ jsx("p", { children: t("guide.whatIs.body", { defaultValue: "An image collage is a collection of multiple images arranged into one unified composition. Instead of viewing photos individually, a collage lets you present them together, create meaning through arrangement, and highlight connections between images." }) })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "ic-section", children: [
        /* @__PURE__ */ jsx("h3", { children: t("guide.why.heading", { defaultValue: "Why Use Image Collages?" }) }),
        /* @__PURE__ */ jsxs("ol", { className: "ic-list", children: [
          /* @__PURE__ */ jsx("li", { children: t("guide.why.item1", { defaultValue: "Tell a Complete Story — A single image shows one moment. A collage shows before and after, different angles, or a sequence of events." }) }),
          /* @__PURE__ */ jsx("li", { children: t("guide.why.item2", { defaultValue: "Maximize Limited Space — On social media, websites, or thumbnails you often have limited space. A collage allows you to show multiple visuals in one post." }) }),
          /* @__PURE__ */ jsx("li", { children: t("guide.why.item3", { defaultValue: "Create Strong Visual Impact — Collages stand out because they contain more information and naturally attract attention." }) }),
          /* @__PURE__ */ jsx("li", { children: t("guide.why.item4", { defaultValue: "Showcase Variety — Perfect for product galleries, portfolio previews, and feature comparisons." }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "ic-section", children: [
        /* @__PURE__ */ jsx("h3", { children: t("guide.types.heading", { defaultValue: "Types of Image Collage Layouts" }) }),
        /* @__PURE__ */ jsxs("div", { className: "ic-layouts", children: [
          /* @__PURE__ */ jsx("div", { className: "ic-layout", children: /* @__PURE__ */ jsx("p", { children: t("guide.types.grid", { defaultValue: "🔲 Grid Layout — Clean and structured — equal-sized images, great for portfolios." }) }) }),
          /* @__PURE__ */ jsx("div", { className: "ic-layout", children: /* @__PURE__ */ jsx("p", { children: t("guide.types.freeform", { defaultValue: "🧩 Freeform Layout — Different sizes and positions — more creative and dynamic." }) }) }),
          /* @__PURE__ */ jsx("div", { className: "ic-layout", children: /* @__PURE__ */ jsx("p", { children: t("guide.types.themed", { defaultValue: "🎯 Themed Collage — Focused on a single concept — consistent colors or subject." }) }) }),
          /* @__PURE__ */ jsx("div", { className: "ic-layout", children: /* @__PURE__ */ jsx("p", { children: t("guide.types.beforeAfter", { defaultValue: "🔍 Before & After Collage — Shows transformation — common in tutorials and comparisons." }) }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "ic-section", children: [
        /* @__PURE__ */ jsx("h3", { children: t("guide.bestPractices.heading", { defaultValue: "Best Practices for Creating a Great Collage" }) }),
        /* @__PURE__ */ jsxs("ol", { className: "ic-best", children: [
          /* @__PURE__ */ jsx("li", { children: t("guide.bestPractices.item1", { defaultValue: "Start With a Clear Purpose — Ask yourself: What story am I telling?" }) }),
          /* @__PURE__ */ jsx("li", { children: t("guide.bestPractices.item2", { defaultValue: "Choose Related Images — Images should share a theme and similar tone or subject." }) }),
          /* @__PURE__ */ jsx("li", { children: t("guide.bestPractices.item3", { defaultValue: "Keep It Simple — Too many images can overwhelm viewers — 3–6 images is often ideal." }) }),
          /* @__PURE__ */ jsx("li", { children: t("guide.bestPractices.item4", { defaultValue: "Use Consistent Spacing — Spacing creates balance and readability." }) }),
          /* @__PURE__ */ jsx("li", { children: t("guide.bestPractices.item5", { defaultValue: "Maintain Visual Balance — Avoid one side being too heavy." }) }),
          /* @__PURE__ */ jsx("li", { children: t("guide.bestPractices.item6", { defaultValue: "Pay Attention to Background — A good background supports the images and doesn't distract." }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "ic-section", children: [
        /* @__PURE__ */ jsx("h3", { children: t("guide.mistakes.heading", { defaultValue: "Common Mistakes to Avoid" }) }),
        /* @__PURE__ */ jsxs("ul", { className: "ic-list", children: [
          /* @__PURE__ */ jsx("li", { children: t("guide.mistakes.item1", { defaultValue: "Mixing unrelated images" }) }),
          /* @__PURE__ */ jsx("li", { children: t("guide.mistakes.item2", { defaultValue: "Using too many photos" }) }),
          /* @__PURE__ */ jsx("li", { children: t("guide.mistakes.item3", { defaultValue: "Poor alignment" }) }),
          /* @__PURE__ */ jsx("li", { children: t("guide.mistakes.item4", { defaultValue: "Inconsistent image quality" }) }),
          /* @__PURE__ */ jsx("li", { children: t("guide.mistakes.item5", { defaultValue: "Overcomplicated layouts" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "ic-section", children: [
        /* @__PURE__ */ jsx("h3", { children: t("guide.stepByStep.heading", { defaultValue: "Step-by-Step: How to Create an Image Collage" }) }),
        /* @__PURE__ */ jsxs("ol", { className: "ic-steps", children: [
          /* @__PURE__ */ jsx("li", { children: t("guide.stepByStep.step1", { defaultValue: "Upload your images" }) }),
          /* @__PURE__ */ jsx("li", { children: t("guide.stepByStep.step2", { defaultValue: "Select a layout (grid or custom)" }) }),
          /* @__PURE__ */ jsx("li", { children: t("guide.stepByStep.step3", { defaultValue: "Arrange images in desired order" }) }),
          /* @__PURE__ */ jsx("li", { children: t("guide.stepByStep.step4", { defaultValue: "Adjust spacing and alignment" }) }),
          /* @__PURE__ */ jsx("li", { children: t("guide.stepByStep.step5", { defaultValue: "Preview the final composition" }) }),
          /* @__PURE__ */ jsx("li", { children: t("guide.stepByStep.step6", { defaultValue: "Download your collage" }) })
        ] }),
        /* @__PURE__ */ jsx("p", { children: t("guide.tryIt", { defaultValue: "Try it here:" }) }),
        /* @__PURE__ */ jsx("div", { className: "ic-cta-wrap", children: /* @__PURE__ */ jsx("a", { href: "/image-collage", className: "ic-cta", onClick: (e) => {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: "smooth" });
          navigate("/image-collage");
        }, children: t("guide.ctaBtn", { defaultValue: "Image Collage Tool →" }) }) })
      ] })
    ] }),
    showPreview && /* @__PURE__ */ jsx("div", { style: { position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1e3, padding: 20 }, onClick: () => setShowPreview(false), ref: previewOverlayRef, children: /* @__PURE__ */ jsxs("div", { ref: previewWrapperRef, style: { background: "#fff", borderRadius: 8, padding: 12, width: "min(95vw, 880px)", maxWidth: "95vw", height: "90vh", maxHeight: "90vh", overflow: "hidden", display: "flex", flexDirection: "column", boxSizing: "border-box" }, onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxs("div", { ref: previewHeaderRef, style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8, zIndex: 2 }, children: [
        /* @__PURE__ */ jsx("div", { style: { color: "#222", fontWeight: 600 }, children: t("preview.header") }),
        /* @__PURE__ */ jsxs("div", { style: { marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }, children: [
          /* @__PURE__ */ jsx("button", { onClick: () => {
            setOffsets(images.map(() => ({ x: 0, y: 0 })));
            setScales(images.map(() => 1));
            setBgColor("#ffffff");
            setPreviewGap(10);
          }, className: "collage-btn", style: { ...previewBtnStyle }, children: t("preview.reset") }),
          /* @__PURE__ */ jsx("button", { onClick: async () => {
            await handleCollage(totalWidth, totalHeight, offsets, scales, bgColor);
            setShowPreview(false);
          }, className: "collage-btn", style: { ...previewBtnStyle }, children: t("preview.finalize") }),
          /* @__PURE__ */ jsx("button", { onClick: () => setShowPreview(false), className: "collage-btn", style: { ...previewBtnStyle, marginLeft: 8, background: "#ff6b6b", borderColor: "#ff6b6b", color: "#fff" }, children: t("preview.close") })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { ref: previewInfoRef, style: { color: "#444", fontSize: "0.95rem", lineHeight: "1.35", marginBottom: 8 }, children: [
        /* @__PURE__ */ jsx("div", { children: t("preview.hint1") }),
        /* @__PURE__ */ jsx("div", { children: t("preview.hint2") }),
        /* @__PURE__ */ jsxs("label", { style: { display: "flex", alignItems: "center", gap: 8, color: "#333", fontWeight: 500 }, children: [
          t("preview.borderColor"),
          /* @__PURE__ */ jsx("input", { type: "color", value: bgColor, onChange: (e) => setBgColor(e.target.value), style: { width: 42, height: 28, padding: 0, border: "none", background: "none" } })
        ] }),
        /* @__PURE__ */ jsxs("label", { style: { display: "flex", alignItems: "center", gap: 6, color: "#333", fontWeight: 500 }, children: [
          t("preview.borderThickness"),
          /* @__PURE__ */ jsx("input", { type: "range", min: 0, max: 100, value: previewGap, onChange: (e) => setPreviewGap(Number(e.target.value)), style: { width: 90, cursor: "pointer", accentColor: "#4f8ef7" } }),
          /* @__PURE__ */ jsx("span", { style: { minWidth: 24, textAlign: "right", fontSize: "0.9rem" }, children: previewGap })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { ref: previewRef, onWheel: handlePreviewWheel, style: { flex: 1, minHeight: 0, width: "100%", overflow: "auto", position: "relative", background: "#e8eaf2", border: "1px solid #d8dbe8", display: "flex", alignItems: "center", justifyContent: "center" }, children: /* @__PURE__ */ jsx("div", { style: { padding: 6, flexShrink: 0, lineHeight: 0 }, children: /* @__PURE__ */ jsx("div", { style: { width: Math.floor(previewScaledSize.w), height: Math.floor(previewScaledSize.h), overflow: "hidden", position: "relative" }, children: /* @__PURE__ */ jsx("div", { style: { width: previewContentSize.w || expectedWidth, height: previewContentSize.h || expectedHeight, transform: `scale(${previewScale})`, transformOrigin: "top left", position: "absolute", left: 0, top: 0, boxSizing: "border-box", background: bgColor }, children: Array.from({ length: rows * columns }).map((_, idx) => {
        const col = idx % columns;
        const row = Math.floor(idx / columns);
        const cellW = width;
        const cellH = height;
        const gap = typeof previewGap === "number" ? previewGap : 10;
        const left = col * (cellW + gap) + gap;
        const top = row * (cellH + gap) + gap;
        const file = images[idx];
        const url = previewUrls[idx];
        const meta2 = previewMeta[idx] || { w: 1, h: 1 };
        const off = offsets[idx] || { x: 0, y: 0 };
        const imgRatio = meta2.w / meta2.h;
        const cellRatio = cellW / cellH;
        let drawW0, drawH0;
        if (imgRatio > cellRatio) {
          drawH0 = cellH;
          drawW0 = cellH * imgRatio;
        } else {
          drawW0 = cellW;
          drawH0 = cellW / imgRatio;
        }
        const scale = scales && scales[idx] || 1;
        const drawW = Math.round(drawW0 * scale);
        const drawH = Math.round(drawH0 * scale);
        return /* @__PURE__ */ jsx("div", { style: { position: "absolute", left, top, width: cellW, height: cellH, overflow: "hidden", background: bgColor, display: "flex", alignItems: "center", justifyContent: "center", touchAction: "none" }, onPointerDown: (e) => onCellPointerDown(e, idx, cellW, cellH, left, top, meta2), onPointerMove: (e) => onCellPointerMove(e, idx), onPointerUp: (e) => onCellPointerUp(e, idx), onPointerCancel: (e) => onCellPointerUp(e, idx), onWheel: (e) => onImageWheel(e, idx, meta2, off, cellW, cellH, left, top), children: file && url && !previewErrors[idx] ? /* @__PURE__ */ jsx("img", { src: url, "data-idx": idx, alt: file.name, draggable: false, onError: () => tryPreviewDataUrl(idx, previewUrls, previewErrors), style: { position: "absolute", left: off.x + (cellW - drawW) / 2, top: off.y + (cellH - drawH) / 2, width: drawW, height: drawH, userSelect: "none", pointerEvents: "none" } }) : file ? /* @__PURE__ */ jsx("div", { style: { width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#666", fontSize: 12, padding: 6, textAlign: "center" }, children: t("preview.noPreview") }) : null }, idx);
      }) }) }) }) })
    ] }) })
  ] });
};
function ImageCollagePage() {
  const [columns, setColumns] = useState(2);
  const [rows, setRows] = useState(2);
  const [width, setWidth] = useState(400);
  const [height, setHeight] = useState(400);
  const [images, setImages] = useState([]);
  const [collageUrl, setCollageUrl] = useState(null);
  useEffect(() => {
    if (images.length === 0) return;
    const n = images.length;
    let bestCols = Math.ceil(Math.sqrt(n));
    let bestRows = Math.ceil(n / bestCols);
    if (bestCols - 1 > 0) {
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
  return /* @__PURE__ */ jsxs("div", { className: "image-collage-page", children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsx("main", { className: "main", children: /* @__PURE__ */ jsx("div", { className: "container", children: /* @__PURE__ */ jsx("div", { className: "card", children: /* @__PURE__ */ jsx(
      ImageCollageView,
      {
        columns,
        setColumns,
        rows,
        setRows,
        width,
        setWidth,
        height,
        setHeight,
        images,
        setImages,
        collageUrl,
        setCollageUrl
      }
    ) }) }) }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
const ImageCollage = () => /* @__PURE__ */ jsx(ImageCollagePage, {});
function MemeGeneratorView({ initialFile }) {
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const previewRef = useRef(null);
  const navigate = useNavigate();
  const { t } = useTranslation("imageMemeGenerator");
  const [imageSrc, setImageSrc] = useState(null);
  const [imageObj, setImageObj] = useState(null);
  const initialLayers = (() => {
    const defaultFont = 30;
    const defaultRatio = defaultFont / 600;
    return [
      { id: "layer-1", text: "", placeholder: "Top Text", x: 0.05, y: 0.08, fontSize: defaultFont, fontRatio: defaultRatio, color: "#ffffff" },
      { id: "layer-2", text: "", placeholder: "Bottom Text", x: 0.05, y: 0.92, fontSize: defaultFont, fontRatio: defaultRatio, color: "#ffffff" }
    ];
  })();
  const [layers2, setLayers] = useState(initialLayers);
  const [selectedLayerId, setSelectedLayerId] = useState(null);
  const initialStateRef = useRef({ layers: initialLayers, imgTransform: { offsetX: 0, offsetY: 0, scale: 1 }, imageSrc: null, selectedLayerId: null });
  const selectedLayerIdRef = useRef(selectedLayerId);
  const [imgTransform, setImgTransform] = useState({ offsetX: 0, offsetY: 0, scale: 1 });
  const imgTransformRef = useRef({ offsetX: 0, offsetY: 0, scale: 1 });
  const imageObjRef = useRef(null);
  const imgPanning = useRef(null);
  const dragging = useRef(null);
  const wasDraggingRef = useRef(false);
  const [isFileDragging, setIsFileDragging] = useState(false);
  const [imageFileName, setImageFileName] = useState(null);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [openPanel, setOpenPanel] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  useEffect(() => {
    imageObjRef.current = imageObj;
  }, [imageObj]);
  useEffect(() => {
    imgTransformRef.current = imgTransform;
  }, [imgTransform]);
  useEffect(() => {
    selectedLayerIdRef.current = selectedLayerId;
  }, [selectedLayerId]);
  useEffect(() => {
    if (selectedLayerId) {
      setAdvancedOpen(true);
    }
  }, [selectedLayerId]);
  const hasChanges = () => {
    try {
      const curr = JSON.stringify({ layers: layers2, imgTransform, imageSrc, selectedLayerId });
      const initial = JSON.stringify(initialStateRef.current);
      return curr !== initial;
    } catch (err) {
      return false;
    }
  };
  function handleReset() {
    const init = initialStateRef.current;
    setLayers((prev) => prev.map((curr) => {
      const orig = (init.layers || []).find((l) => l.id === curr.id);
      if (!orig) return curr;
      return { ...curr, x: orig.x ?? curr.x, y: orig.y ?? curr.y, fontSize: orig.fontSize ?? curr.fontSize, fontRatio: orig.fontRatio ?? curr.fontRatio };
    }));
    setImgTransform({ ...init.imgTransform });
    imgTransformRef.current = { ...init.imgTransform };
  }
  function preventTouchScroll(e) {
    e.preventDefault();
  }
  useEffect(() => {
    if (!imageSrc) return;
    const img = new Image();
    img.onload = () => {
      setImageObj(img);
      const reset = { offsetX: 0, offsetY: 0, scale: 1 };
      setImgTransform(reset);
      imgTransformRef.current = reset;
      requestAnimationFrame(() => {
        try {
          const desiredCss = 30;
          let actualRatio = img.height ? desiredCss / img.height : desiredCss / 600;
          try {
            const previewRect = previewRef.current && previewRef.current.getBoundingClientRect && previewRef.current.getBoundingClientRect();
            if (previewRect && img.width && img.height) {
              const baseScale = Math.min(previewRect.width / img.width, previewRect.height / img.height) || 1;
              const drawH = Math.max(1, Math.round(img.height * baseScale));
              actualRatio = desiredCss / drawH;
            }
          } catch (err) {
          }
          setLayers((prev) => prev.map((l) => {
            const placeholderRatio = 30 / 600;
            if (Math.abs((l.fontRatio || 0) - placeholderRatio) < 1e-9) {
              return { ...l, fontRatio: actualRatio };
            }
            return l;
          }));
          initialStateRef.current.layers = (initialStateRef.current.layers || []).map((l) => {
            const placeholderRatio = 30 / 600;
            if (Math.abs((l.fontRatio || 0) - placeholderRatio) < 1e-9) {
              return { ...l, fontRatio: actualRatio };
            }
            return l;
          });
        } catch (err) {
        }
      });
    };
    img.src = imageSrc;
  }, [imageSrc]);
  useEffect(() => {
    if (!initialFile) return;
    try {
      const reader = new FileReader();
      reader.onload = (ev) => setImageSrc(ev.target.result);
      reader.readAsDataURL(initialFile);
    } catch (err) {
    }
  }, [initialFile]);
  useEffect(() => {
    const onGlobalPointerDown = (ev) => {
      try {
        const tgt = ev.target;
        if (!previewRef.current) return;
        if (!previewRef.current.contains(tgt)) {
          window.removeEventListener("touchmove", preventTouchScroll, { passive: false });
        }
      } catch (err) {
      }
    };
    window.addEventListener("pointerdown", onGlobalPointerDown);
    return () => window.removeEventListener("pointerdown", onGlobalPointerDown);
  }, []);
  useEffect(() => {
    drawCanvas();
  }, [imageObj, layers2, imgTransform]);
  function getImageDrawMetrics() {
    const preview2 = previewRef.current;
    if (!preview2 || !imageObj) return null;
    const rect = preview2.getBoundingClientRect();
    const imgW = imageObj.width;
    const imgH = imageObj.height;
    const baseScale = Math.min(rect.width / imgW, rect.height / imgH);
    const baseDrawW = Math.round(imgW * baseScale);
    const baseDrawH = Math.round(imgH * baseScale);
    const totalScale = Math.max(0.01, baseScale * imgTransformRef.current.scale);
    const drawW = Math.round(imgW * totalScale);
    const drawH = Math.round(imgH * totalScale);
    const centerX = rect.width / 2 + imgTransformRef.current.offsetX;
    const centerY = rect.height / 2 + imgTransformRef.current.offsetY;
    const imgLeft = centerX - drawW / 2;
    const imgTop = centerY - drawH / 2;
    return { rect, imgW, imgH, baseScale, baseDrawW, baseDrawH, totalScale, drawW, drawH, centerX, centerY, imgLeft, imgTop };
  }
  function computeFontSizes(layer) {
    if (!layer) return { cssPx: 0, canvasPx: 0, lineHeightCss: 0 };
    const metrics = getImageDrawMetrics();
    if (metrics && layer.fontRatio && metrics.imgH) {
      const canvasPx = Math.max(10, Math.min(240, Math.round(layer.fontRatio * metrics.imgH)));
      const cssPx2 = Math.max(10, Math.round(layer.fontRatio * metrics.baseDrawH));
      const lineHeightCss2 = Math.round((cssPx2 + 6) * 0.82);
      const lineHeightCanvas2 = Math.round((canvasPx + 6) * 0.82);
      return { cssPx: cssPx2, canvasPx, lineHeightCss: lineHeightCss2, lineHeightCanvas: lineHeightCanvas2 };
    }
    const cssPx = layer.fontSize || 30;
    const lineHeightCss = Math.round((cssPx + 6) * 0.82);
    const lineHeightCanvas = lineHeightCss;
    return { cssPx, canvasPx: cssPx, lineHeightCss, lineHeightCanvas };
  }
  useEffect(() => {
    const preview2 = previewRef.current;
    if (!preview2) return;
    const getLiveMetrics = () => {
      const previewEl = previewRef.current;
      const img = imageObjRef.current;
      if (!previewEl || !img) return null;
      const rect = previewEl.getBoundingClientRect();
      const imgW = img.width;
      const imgH = img.height;
      const baseScale = Math.min(rect.width / imgW, rect.height / imgH);
      const baseDrawH = Math.round(imgH * baseScale);
      return { rect, imgW, imgH, baseScale, baseDrawH };
    };
    const getLayerCssPxLive = (layer, metrics) => {
      if (!layer) return 30;
      if (metrics && layer.fontRatio) {
        return Math.max(10, Math.round(layer.fontRatio * metrics.baseDrawH));
      }
      return layer.fontSize || 30;
    };
    const isOverDraggable = (x, y) => {
      try {
        const el = document.elementFromPoint(x, y);
        return el && el.closest && el.closest(".draggable-text");
      } catch (err) {
        return false;
      }
    };
    const getLayerIdAtPoint = (x, y) => {
      try {
        const el = document.elementFromPoint(x, y);
        const layerEl = el && el.closest ? el.closest(".draggable-text") : null;
        return layerEl && layerEl.dataset ? layerEl.dataset.layerId : null;
      } catch (err) {
        return null;
      }
    };
    const onWheel = (e) => {
      if (!e.altKey) return;
      e.preventDefault();
      const fontFactor = e.deltaY < 0 ? 1.05 : 0.95;
      const imgFactor = e.deltaY < 0 ? 1.1 : 0.9;
      const overDraggable = isOverDraggable(e.clientX, e.clientY);
      if (overDraggable) {
        const el = document.elementFromPoint(e.clientX, e.clientY);
        const layerEl = el && el.closest ? el.closest(".draggable-text") : null;
        const selId = layerEl ? layerEl.dataset && layerEl.dataset.layerId || selectedLayerIdRef.current : selectedLayerIdRef.current;
        const targetId = selId || selectedLayerIdRef.current;
        if (targetId) {
          const metrics = getLiveMetrics();
          setLayers((prev) => prev.map((l) => {
            if (l.id !== targetId) return l;
            if (metrics && metrics.baseDrawH) {
              const currentCssPx = getLayerCssPxLive(l, metrics);
              const nextCssPx = Math.round(Math.max(10, Math.min(240, currentCssPx * fontFactor)));
              const nextRatio = nextCssPx / metrics.baseDrawH;
              return { ...l, fontRatio: nextRatio };
            }
            const nextSize = Math.round(Math.max(10, Math.min(240, l.fontSize * fontFactor)));
            return { ...l, fontSize: nextSize };
          }));
          return;
        }
      }
      if (!imageObjRef.current) return;
      setImgTransform((prev) => {
        const next = { ...prev, scale: Math.max(0.1, Math.min(10, prev.scale * imgFactor)) };
        imgTransformRef.current = next;
        return next;
      });
    };
    let lastDist = null;
    const pinchModeRef = { current: null };
    const pinchLayerIdRef = { current: null };
    const onTouchStart = (e) => {
      if (e.touches.length === 2) {
        lastDist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
        const t1 = e.touches[0];
        const t2 = e.touches[1];
        const layer1 = getLayerIdAtPoint(t1.clientX, t1.clientY);
        const layer2 = getLayerIdAtPoint(t2.clientX, t2.clientY);
        if (layer1 && layer2 && layer1 === layer2) {
          pinchModeRef.current = "font";
          pinchLayerIdRef.current = layer1;
        } else {
          pinchModeRef.current = "image";
          pinchLayerIdRef.current = null;
        }
      }
    };
    const onTouchMove = (e) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        if (lastDist === null) return;
        const dist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
        const ratio = dist / lastDist;
        if (pinchModeRef.current === "font") {
          const targetId = pinchLayerIdRef.current || selectedLayerIdRef.current;
          if (targetId) {
            const metrics = getLiveMetrics();
            setLayers((prev) => prev.map((l) => {
              if (l.id !== targetId) return l;
              if (metrics && metrics.baseDrawH) {
                const currentCssPx = getLayerCssPxLive(l, metrics);
                const nextCssPx = Math.round(Math.max(10, Math.min(240, currentCssPx * ratio)));
                const nextRatio = nextCssPx / metrics.baseDrawH;
                return { ...l, fontRatio: nextRatio };
              }
              const nextSize = Math.round(Math.max(10, Math.min(240, l.fontSize * ratio)));
              return { ...l, fontSize: nextSize };
            }));
          }
        } else {
          setImgTransform((prev) => {
            const next = { ...prev, scale: Math.max(0.1, Math.min(10, prev.scale * ratio)) };
            imgTransformRef.current = next;
            return next;
          });
        }
        lastDist = dist;
      }
    };
    const onTouchEnd = (e) => {
      if (e.touches.length < 2) {
        lastDist = null;
        pinchModeRef.current = null;
        pinchLayerIdRef.current = null;
      }
    };
    preview2.addEventListener("wheel", onWheel, { passive: false });
    preview2.addEventListener("touchstart", onTouchStart, { passive: false });
    preview2.addEventListener("touchmove", onTouchMove, { passive: false });
    preview2.addEventListener("touchend", onTouchEnd);
    return () => {
      preview2.removeEventListener("wheel", onWheel);
      preview2.removeEventListener("touchstart", onTouchStart);
      preview2.removeEventListener("touchmove", onTouchMove);
      preview2.removeEventListener("touchend", onTouchEnd);
    };
  }, []);
  async function handleFile(e) {
    const raw = e.target.files && e.target.files[0];
    if (!raw) return;
    const file = await normalizeImageFile(raw);
    setImageFileName(file.name || null);
    const reader = new FileReader();
    reader.onload = (ev) => setImageSrc(ev.target.result);
    reader.readAsDataURL(file);
  }
  function handleClearImage() {
    setImageSrc(null);
    setImageObj(null);
    setImageFileName(null);
    setImgTransform({ offsetX: 0, offsetY: 0, scale: 1 });
    imgTransformRef.current = { offsetX: 0, offsetY: 0, scale: 1 };
    if (fileInputRef.current) fileInputRef.current.value = "";
  }
  function handlePreviewClick() {
    if (wasDraggingRef.current) return;
    if (imageObj) return;
    if (fileInputRef.current) fileInputRef.current.click();
  }
  function handlePreviewPointerDown(e) {
    if (!imageObj) return;
    try {
      if (e.target && e.target.closest && e.target.closest(".draggable-text")) return;
    } catch (err) {
    }
    if (e.button !== 0) return;
    e.preventDefault();
    window.addEventListener("touchmove", preventTouchScroll, { passive: false });
    imgPanning.current = {
      startX: e.clientX,
      startY: e.clientY,
      origOffsetX: imgTransformRef.current.offsetX,
      origOffsetY: imgTransformRef.current.offsetY
    };
    window.addEventListener("pointermove", onImgPanMove);
    window.addEventListener("pointerup", onImgPanUp, { once: true });
  }
  function onImgPanMove(ev) {
    if (!imgPanning.current) return;
    const dx = ev.clientX - imgPanning.current.startX;
    const dy = ev.clientY - imgPanning.current.startY;
    const next = { ...imgTransformRef.current, offsetX: imgPanning.current.origOffsetX + dx, offsetY: imgPanning.current.origOffsetY + dy };
    imgTransformRef.current = next;
    setImgTransform({ ...next });
  }
  function onImgPanUp(ev) {
    if (!imgPanning.current) return;
    const moved = Math.abs(ev.clientX - imgPanning.current.startX) > 3 || Math.abs(ev.clientY - imgPanning.current.startY) > 3;
    if (moved) {
      wasDraggingRef.current = true;
      setTimeout(() => {
        wasDraggingRef.current = false;
      }, 0);
    }
    imgPanning.current = null;
    window.removeEventListener("pointermove", onImgPanMove);
    window.removeEventListener("touchmove", preventTouchScroll, { passive: false });
  }
  function handleDragOver(e) {
    e.preventDefault();
    setIsFileDragging(true);
  }
  function handleDragLeave(e) {
    e.preventDefault();
    setIsFileDragging(false);
  }
  async function handleDrop(e) {
    e.preventDefault();
    setIsFileDragging(false);
    const raw = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0] || null;
    if (!raw) return;
    const file = await normalizeImageFile(raw);
    setImageFileName(file.name || null);
    const reader = new FileReader();
    reader.onload = (ev) => setImageSrc(ev.target.result);
    reader.readAsDataURL(file);
  }
  function drawCanvas() {
    const canvas2 = canvasRef.current;
    const preview2 = previewRef.current;
    if (!canvas2 || !preview2) return;
    if (imageObj) {
      const availableWidth = Math.max(1, preview2.clientWidth);
      const aspect = imageObj.height / imageObj.width || 1;
      const desiredHeight = Math.max(1, Math.round(availableWidth * aspect));
      preview2.style.height = desiredHeight + "px";
    } else {
      preview2.style.height = "";
    }
    const rect = preview2.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas2.style.width = rect.width + "px";
    canvas2.style.height = rect.height + "px";
    canvas2.width = Math.max(1, Math.round(rect.width * dpr));
    canvas2.height = Math.max(1, Math.round(rect.height * dpr));
    const ctx = canvas2.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (!imageObj) {
      ctx.clearRect(0, 0, rect.width, rect.height);
      return;
    }
    const imgW = imageObj.width;
    const imgH = imageObj.height;
    const baseScale = Math.min(rect.width / imgW, rect.height / imgH);
    const totalScale = Math.max(0.01, baseScale * imgTransform.scale);
    const drawW = Math.round(imgW * totalScale);
    const drawH = Math.round(imgH * totalScale);
    const centerX = rect.width / 2 + imgTransform.offsetX;
    const centerY = rect.height / 2 + imgTransform.offsetY;
    ctx.clearRect(0, 0, rect.width, rect.height);
    ctx.drawImage(imageObj, centerX - drawW / 2, centerY - drawH / 2, drawW, drawH);
  }
  function renderOutputCanvas(hiRes = false) {
    if (!imageObj) return null;
    const metrics = getImageDrawMetrics();
    if (!metrics) return null;
    const viewW = metrics.rect.width;
    const viewH = metrics.rect.height;
    const cropLeft = Math.max(0, metrics.imgLeft);
    const cropTop = Math.max(0, metrics.imgTop);
    const cropRight = Math.min(viewW, metrics.imgLeft + metrics.drawW);
    const cropBottom = Math.min(viewH, metrics.imgTop + metrics.drawH);
    const visCssW = Math.max(1, cropRight - cropLeft);
    const visCssH = Math.max(1, cropBottom - cropTop);
    if (visCssW <= 1 || visCssH <= 1) return null;
    const scaleX = hiRes ? metrics.imgW / metrics.drawW : 1;
    const scaleY = hiRes ? metrics.imgH / metrics.drawH : 1;
    const outW = Math.round(visCssW * scaleX);
    const outH = Math.round(visCssH * scaleY);
    const offscreen = document.createElement("canvas");
    offscreen.width = outW;
    offscreen.height = outH;
    const ctx = offscreen.getContext("2d");
    ctx.clearRect(0, 0, outW, outH);
    if (hiRes) {
      const srcX = Math.round((cropLeft - metrics.imgLeft) / metrics.drawW * metrics.imgW);
      const srcY = Math.round((cropTop - metrics.imgTop) / metrics.drawH * metrics.imgH);
      const srcW = Math.round(visCssW / metrics.drawW * metrics.imgW);
      const srcH = Math.round(visCssH / metrics.drawH * metrics.imgH);
      ctx.drawImage(imageObj, srcX, srcY, srcW, srcH, 0, 0, outW, outH);
    } else {
      ctx.drawImage(
        imageObj,
        metrics.imgLeft - cropLeft,
        metrics.imgTop - cropTop,
        metrics.drawW,
        metrics.drawH
      );
    }
    layers2.forEach((layer) => {
      if (!layer.text) return;
      const { cssPx, lineHeightCss } = computeFontSizes(layer);
      const screenFontPx = cssPx || layer.fontSize || 30;
      const fontPx = Math.max(4, Math.round(screenFontPx * scaleX));
      const lineHeight = Math.round(screenFontPx * scaleY * ((lineHeightCss || screenFontPx) / screenFontPx));
      ctx.textAlign = "left";
      ctx.textBaseline = "top";
      ctx.font = `${fontPx}px Impact, Arial, sans-serif`;
      ctx.lineWidth = Math.max(2, Math.floor(fontPx / 12));
      ctx.fillStyle = layer.color;
      ctx.strokeStyle = "black";
      const x = Math.round((layer.x * viewW - cropLeft) * scaleX);
      const y = Math.round((layer.y * viewH - cropTop) * scaleY);
      const lines = layer.text.toUpperCase().split("\n");
      const totalHeight = lines.length * lineHeight;
      const startY = Math.round(y - totalHeight / 2);
      lines.forEach((line, i) => {
        ctx.strokeText(line, x, startY + i * lineHeight);
        ctx.fillText(line, x, startY + i * lineHeight);
      });
    });
    return offscreen;
  }
  function handlePreview() {
    const offscreen = renderOutputCanvas(false);
    if (!offscreen) return;
    setPreviewUrl(offscreen.toDataURL("image/png"));
    setPreviewOpen(true);
  }
  function handleDownload() {
    const offscreen = renderOutputCanvas(true);
    if (!offscreen) return;
    const url = offscreen.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = "meme.png";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }
  function startDrag(e, layerId) {
    e.stopPropagation();
    setSelectedLayerId(layerId);
    const rect = previewRef.current.getBoundingClientRect();
    const layer = layers2.find((l) => l.id === layerId);
    const origX = layer ? layer.x : 0;
    const origY = layer ? layer.y : 0;
    dragging.current = {
      layerId,
      rect,
      startX: e.clientX,
      startY: e.clientY,
      origX,
      origY,
      active: false
    };
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp, { once: true });
    window.addEventListener("touchmove", preventTouchScroll, { passive: false });
  }
  function onPointerMove(ev) {
    if (!dragging.current) return;
    const d = dragging.current;
    const dx = ev.clientX - d.startX;
    const dy = ev.clientY - d.startY;
    if (!d.active) {
      if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
      d.active = true;
      wasDraggingRef.current = true;
    }
    const { layerId, rect, origX, origY } = d;
    const x = origX + dx / Math.max(1, rect.width);
    const y = origY + dy / Math.max(1, rect.height);
    const clamp = (v) => Math.max(0, Math.min(1, v));
    setLayers((prev) => prev.map((l) => l.id === layerId ? { ...l, x: clamp(x), y: clamp(y) } : l));
  }
  function onPointerUp() {
    const didDrag = dragging.current && dragging.current.active;
    dragging.current = null;
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("touchmove", preventTouchScroll, { passive: false });
    if (didDrag) {
      setTimeout(() => {
        wasDraggingRef.current = false;
      }, 0);
    } else {
      wasDraggingRef.current = false;
    }
  }
  function addLayer() {
    const id = `layer-${Date.now()}-${Math.floor(Math.random() * 1e3)}`;
    const defaultFont = 30;
    const defaultRatio = defaultFont / 600;
    const newLayer = { id, text: "", placeholder: "New Text", x: 0.05, y: 0.5, fontSize: defaultFont, fontRatio: defaultRatio, color: "#ffffff" };
    setLayers((prev) => [...prev, newLayer]);
    setSelectedLayerId(id);
  }
  function removeLayer(id) {
    setLayers((prev) => {
      const next = prev.filter((l) => l.id !== id);
      if (selectedLayerId === id) {
        setSelectedLayerId(next[0] ? next[0].id : null);
      }
      return next;
    });
  }
  function updateSelectedLayer(changes2) {
    if (!selectedLayerId) return;
    setLayers((prev) => prev.map((l) => l.id === selectedLayerId ? { ...l, ...changes2 } : l));
  }
  function updateLayer(id, changes2) {
    setLayers((prev) => prev.map((l) => l.id === id ? { ...l, ...changes2 } : l));
  }
  function handleFontSliderChange(e) {
    const value = Number(e.target.value || 0);
    const sel = layers2.find((l) => l.id === selectedLayerId);
    if (!sel) return;
    const metrics = getImageDrawMetrics();
    if (metrics && metrics.baseDrawH) {
      const ratio = value / metrics.baseDrawH;
      updateSelectedLayer({ fontRatio: ratio });
    } else {
      updateSelectedLayer({ fontSize: value });
    }
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("h2", { className: "hero-title", children: t("hero.title") }),
    /* @__PURE__ */ jsxs("p", { className: "hero-tagline", children: [
      t("hero.tagline"),
      " ",
      /* @__PURE__ */ jsx(Link, { to: "/blogs/meme-generator-guide", children: t("hero.blogLink") })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "ir-tip-banner", children: [
      /* @__PURE__ */ jsx("span", { className: "ir-tip-text", children: t("hint.text") }),
      /* @__PURE__ */ jsx("button", { className: "ir-tip-btn", onClick: () => navigate("/image-resizer"), children: t("hint.btn") })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "details-row", "data-open": openPanel, children: [
      /* @__PURE__ */ jsxs("div", { className: "details-controls", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            className: `tab-btn ${openPanel === "details" ? "active" : ""}`,
            onClick: () => setOpenPanel((prev) => prev === "details" ? "" : "details"),
            "aria-expanded": openPanel === "details",
            type: "button",
            children: t("tabs.details")
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            className: `tab-btn ${openPanel === "howitworks" ? "active" : ""}`,
            onClick: () => setOpenPanel((prev) => prev === "howitworks" ? "" : "howitworks"),
            "aria-expanded": openPanel === "howitworks",
            type: "button",
            children: t("tabs.howItWorks")
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: `shared-collapse${!openPanel ? " panel-hidden" : ""}`, children: [
        /* @__PURE__ */ jsxs("div", { className: openPanel !== "details" ? "details-content panel-hidden" : "details-content", children: [
          /* @__PURE__ */ jsx("h3", { children: t("details.whatIs.heading", { defaultValue: "What is a Meme Generator" }) }),
          /* @__PURE__ */ jsx("p", { children: t("details.whatIs.body", { defaultValue: "A meme generator is a lightweight creative editor that lets you place text overlays on images to produce humorous, informative, or expressive graphics quickly. It supports multiple text layers, free positioning, font sizing, color selection, and simple export controls so you can craft a share-ready image in seconds." }) }),
          /* @__PURE__ */ jsx("h3", { children: t("details.howWorks.heading", { defaultValue: "How the generator works" }) }),
          /* @__PURE__ */ jsx("p", { children: t("details.howWorks.body", { defaultValue: "Upload or drop an image into the canvas area, then add one or more text layers using the controls. Each layer can be positioned by dragging, resized via the advanced controls, and styled with a color picker. The preview area reflects changes in real time." }) }),
          /* @__PURE__ */ jsx("h3", { children: t("details.whyBrowser.heading", { defaultValue: "Why use a browser-based tool" }) }),
          /* @__PURE__ */ jsx("p", { children: t("details.whyBrowser.body", { defaultValue: "Browser-based meme editors are instant and accessible: they don't require installations, run offline once loaded, and keep your images local to your device." }) }),
          /* @__PURE__ */ jsx("h3", { children: t("details.tips.heading", { defaultValue: "Tips for better memes" }) }),
          /* @__PURE__ */ jsxs("ul", { children: [
            /* @__PURE__ */ jsx("li", { children: t("details.tips.item1", { defaultValue: "Use short, punchy captions and capitalize text for classic meme styles." }) }),
            /* @__PURE__ */ jsx("li", { children: t("details.tips.item2", { defaultValue: "Keep good contrast between text and background; add stroke or shadow if needed for readability." }) }),
            /* @__PURE__ */ jsx("li", { children: t("details.tips.item3", { defaultValue: "Use multiple layers for complex layouts—title, subtitle, or small annotations all work well." }) })
          ] }),
          /* @__PURE__ */ jsx("h3", { children: t("details.accessibility.heading", { defaultValue: "Accessibility & privacy" }) }),
          /* @__PURE__ */ jsx("p", { children: t("details.accessibility.body", { defaultValue: "Controls are designed with accessibility in mind (large targets, keyboard support). Since composition occurs locally, your images are not transmitted off your device by default — they only leave the browser if you choose to upload or share them." }) }),
          /* @__PURE__ */ jsx("h3", { children: t("details.faq.heading", { defaultValue: "FAQs" }) }),
          /* @__PURE__ */ jsxs("ul", { children: [
            /* @__PURE__ */ jsxs("li", { children: [
              /* @__PURE__ */ jsx("strong", { children: t("details.faq.q1", { defaultValue: "Q: Will my image be uploaded anywhere?" }) }),
              " ",
              /* @__PURE__ */ jsx("strong", { children: t("details.faq.a1", { defaultValue: "A: No — everything runs client-side in your browser." }) })
            ] }),
            /* @__PURE__ */ jsxs("li", { children: [
              /* @__PURE__ */ jsx("strong", { children: t("details.faq.q2", { defaultValue: "Q: Can I add more than two text lines?" }) }),
              " ",
              /* @__PURE__ */ jsx("strong", { children: t("details.faq.a2", { defaultValue: "A: Yes — use the ＋ button to add as many text layers as you need." }) })
            ] }),
            /* @__PURE__ */ jsxs("li", { children: [
              /* @__PURE__ */ jsx("strong", { children: t("details.faq.q3", { defaultValue: "Q: What image formats are supported?" }) }),
              " ",
              /* @__PURE__ */ jsx("strong", { children: t("details.faq.a3", { defaultValue: "A: Any image format your browser supports (JPEG, PNG, WebP, GIF, etc.)." }) })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: openPanel !== "howitworks" ? "howitworks-content panel-hidden" : "howitworks-content", children: /* @__PURE__ */ jsxs("ol", { style: { margin: 0, paddingLeft: "1rem" }, children: [
          /* @__PURE__ */ jsxs("li", { style: { marginBottom: "0.75rem" }, children: [
            /* @__PURE__ */ jsx("img", { src: "/screenshots/meme-generator/meme-generator001.png", alt: "Step 1", className: "how-img" }),
            /* @__PURE__ */ jsx("p", { children: t("howItWorks.step1") })
          ] }),
          /* @__PURE__ */ jsxs("li", { style: { marginBottom: "0.75rem" }, children: [
            /* @__PURE__ */ jsx("img", { src: "/screenshots/meme-generator/meme-generator002.png", alt: "Step 2", className: "how-img" }),
            /* @__PURE__ */ jsx("p", { children: t("howItWorks.step2") })
          ] }),
          /* @__PURE__ */ jsxs("li", { style: { marginBottom: "0.75rem" }, children: [
            /* @__PURE__ */ jsx("img", { src: "/screenshots/meme-generator/meme-generator003.png", alt: "Step 3", className: "how-img" }),
            /* @__PURE__ */ jsx("p", { children: t("howItWorks.step3") })
          ] }),
          /* @__PURE__ */ jsxs("li", { style: { marginBottom: "0.75rem" }, children: [
            /* @__PURE__ */ jsx("img", { src: "/screenshots/meme-generator/meme-generator004.png", alt: "Step 4", className: "how-img" }),
            /* @__PURE__ */ jsx("p", { children: t("howItWorks.step4") })
          ] })
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: `meme-preview${isFileDragging ? " dragging drop-zone" : ""}${!imageObj ? " drop-zone-empty" : ""}${imageObj ? " has-image" : ""}`,
        ref: previewRef,
        onClick: handlePreviewClick,
        onPointerDown: handlePreviewPointerDown,
        onDragOver: handleDragOver,
        onDragLeave: handleDragLeave,
        onDrop: handleDrop,
        children: [
          /* @__PURE__ */ jsx("canvas", { ref: canvasRef, className: "meme-canvas" }),
          !imageObj && /* @__PURE__ */ jsx("div", { className: "preview-placeholder", children: t("canvas.placeholder") }),
          imageObj && /* @__PURE__ */ jsx("div", { className: "preview-interact-hint", children: t("canvas.interactionHint", { defaultValue: "Alt+Scroll on text → resize text  ·  Alt+Scroll elsewhere → zoom image" }) }),
          /* @__PURE__ */ jsx("input", { ref: fileInputRef, type: "file", accept: "image/*,.heic,.heif", onChange: handleFile, style: { display: "none" } }),
          layers2.map((layer) => {
            const { cssPx, lineHeightCss } = computeFontSizes(layer);
            return /* @__PURE__ */ jsx(
              "div",
              {
                "data-layer-id": layer.id,
                className: `draggable-text layer-overlay ${layer.id === selectedLayerId ? "selected" : ""}`,
                style: { left: `${layer.x * 100}%`, top: `${layer.y * 100}%`, fontSize: `${cssPx}px`, lineHeight: `${lineHeightCss}px`, color: layer.color, whiteSpace: "pre" },
                onPointerDown: (e) => startDrag(e, layer.id),
                children: layer.text || (layer.placeholder || "").toUpperCase()
              },
              layer.id
            );
          })
        ]
      }
    ),
    imageObj && /* @__PURE__ */ jsx("div", { className: "preview-hint-below", children: t("canvas.previewHint") }),
    imageObj && /* @__PURE__ */ jsxs("div", { className: "mg-file-row", children: [
      /* @__PURE__ */ jsx("span", { className: "mg-file-name", children: imageFileName || "Image loaded" }),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          className: "mg-change-btn",
          onClick: () => fileInputRef.current && fileInputRef.current.click(),
          children: t("fileRow.change")
        }
      ),
      /* @__PURE__ */ jsx("button", { type: "button", className: "mg-clear-btn", onClick: handleClearImage, children: t("fileRow.clear") })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "meme-generator", children: /* @__PURE__ */ jsxs("div", { className: "meme-controls", children: [
      /* @__PURE__ */ jsxs("div", { className: "control-row layers-header", children: [
        /* @__PURE__ */ jsx("label", { children: t("layers.label") }),
        /* @__PURE__ */ jsx("div", { style: { display: "flex", gap: 8 }, children: /* @__PURE__ */ jsx("button", { className: "btn", onClick: addLayer, "aria-label": t("layers.addAria"), children: "＋" }) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "layers-list", children: layers2.map((layer) => /* @__PURE__ */ jsxs("div", { className: `layer-item${layer.id === selectedLayerId ? " selected" : ""}`, onClick: () => setSelectedLayerId(layer.id), children: [
        /* @__PURE__ */ jsx(
          "textarea",
          {
            className: "layer-textarea",
            value: layer.text,
            placeholder: layer.placeholder || "",
            onFocus: (e) => {
              const ph = layer.placeholder || "";
              if (layer.text && (layer.text === ph || layer.text === ph.toUpperCase() || layer.text === ph.toLowerCase())) {
                updateLayer(layer.id, { text: "" });
              }
            },
            onChange: (e) => updateLayer(layer.id, { text: e.target.value }),
            onKeyDown: (e) => {
              e.stopPropagation();
              if (e.key === "Enter") {
                e.preventDefault();
                const el = e.target;
                const start = el.selectionStart;
                const end = el.selectionEnd;
                const newText = layer.text.substring(0, start) + "\n" + layer.text.substring(end);
                updateLayer(layer.id, { text: newText });
                requestAnimationFrame(() => {
                  el.selectionStart = el.selectionEnd = start + 1;
                });
              }
            },
            onInput: (e) => {
              e.target.style.height = "auto";
              e.target.style.height = e.target.scrollHeight + "px";
            }
          }
        ),
        /* @__PURE__ */ jsx("button", { className: "btn", onClick: (e) => {
          e.stopPropagation();
          removeLayer(layer.id);
        }, "aria-label": t("layers.removeAria"), children: "✕" })
      ] }, layer.id)) }),
      /* @__PURE__ */ jsxs(
        "div",
        {
          className: "advanced-toggle",
          role: "button",
          tabIndex: 0,
          onClick: () => setAdvancedOpen((s) => !s),
          onKeyDown: (e) => {
            if (e.key === "Enter" || e.key === " ") setAdvancedOpen((s) => !s);
          },
          "aria-expanded": advancedOpen,
          children: [
            /* @__PURE__ */ jsx("span", { className: `arrow ${advancedOpen ? "open" : ""}`, children: advancedOpen ? "▾" : "▸" }),
            /* @__PURE__ */ jsx("span", { className: "advanced-text", children: t("advanced.label") })
          ]
        }
      ),
      advancedOpen && /* @__PURE__ */ jsxs("div", { className: "advanced-section", children: [
        /* @__PURE__ */ jsxs("div", { className: `control-row${selectedLayerId ? " font-size-selected" : ""}`, children: [
          /* @__PURE__ */ jsx("label", { children: t("advanced.fontSize") }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "range",
              min: "18",
              max: "120",
              value: (() => {
                const sel = layers2.find((l) => l.id === selectedLayerId) || {};
                const { cssPx } = computeFontSizes(sel);
                return cssPx || sel.fontSize || 30;
              })(),
              onChange: handleFontSliderChange
            }
          ),
          /* @__PURE__ */ jsx("label", { children: (() => {
            const sel = layers2.find((l) => l.id === selectedLayerId) || {};
            const { cssPx } = computeFontSizes(sel);
            return (cssPx || sel.fontSize || 30) + "px";
          })() })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "control-row", children: [
          /* @__PURE__ */ jsx("label", { children: t("advanced.textColor") }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "color",
              value: (layers2.find((l) => l.id === selectedLayerId) || {}).color || "#ffffff",
              onChange: (e) => updateSelectedLayer({ color: e.target.value })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "control-row buttons", children: [
        hasChanges() && /* @__PURE__ */ jsx("button", { className: "btn", onClick: handleReset, children: t("actions.reset") }),
        imageObj && /* @__PURE__ */ jsx("button", { className: "btn", onClick: handlePreview, children: t("actions.preview") }),
        /* @__PURE__ */ jsx("button", { className: "btn primary", onClick: handleDownload, children: t("actions.download") })
      ] })
    ] }) }),
    previewOpen && previewUrl && /* @__PURE__ */ jsx("div", { className: "meme-popup-overlay", onClick: () => setPreviewOpen(false), children: /* @__PURE__ */ jsxs("div", { className: "meme-popup-dialog", onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsx("img", { src: previewUrl, alt: "Meme preview", className: "meme-popup-img" }),
      /* @__PURE__ */ jsx("button", { className: "meme-popup-close", onClick: () => setPreviewOpen(false), children: "×" })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "mg-guide", children: [
      /* @__PURE__ */ jsx("h2", { className: "mg-title", children: t("guide.title", { defaultValue: "How to Create Memes That Actually Go Viral (Simple Guide for Beginners)" }) }),
      /* @__PURE__ */ jsx("p", { children: t("guide.intro", { defaultValue: "Memes are everywhere. From social media feeds to group chats, memes have become one of the fastest ways to communicate ideas, humor, and opinions." }) }),
      /* @__PURE__ */ jsx("p", { children: t("guide.lead2", { defaultValue: "But creating a meme that people actually share? That’s a different story." }) }),
      /* @__PURE__ */ jsx("p", { children: t("guide.learnIntro", { defaultValue: "In this guide, you’ll learn:" }) }),
      /* @__PURE__ */ jsxs("ul", { className: "mg-list", children: [
        /* @__PURE__ */ jsx("li", { children: t("guide.learnItems.item1", { defaultValue: "What makes a meme work" }) }),
        /* @__PURE__ */ jsx("li", { children: t("guide.learnItems.item2", { defaultValue: "How to create one from scratch" }) }),
        /* @__PURE__ */ jsx("li", { children: t("guide.learnItems.item3", { defaultValue: "Common mistakes to avoid" }) }),
        /* @__PURE__ */ jsx("li", { children: t("guide.learnItems.item4", { defaultValue: "Tips to make your memes more engaging" }) })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "mg-section", children: [
        /* @__PURE__ */ jsx("h3", { children: t("guide.whatIs.heading", { defaultValue: "What Is a Meme (Really)?" }) }),
        /* @__PURE__ */ jsx("p", { children: t("guide.whatIs.body", { defaultValue: "A meme is a piece of content — usually an image with text — designed to be shared and adapted by others. Unlike regular images, memes are relatable, quick to understand, and easy to share." }) })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "mg-section", children: [
        /* @__PURE__ */ jsx("h3", { children: t("guide.why.heading", { defaultValue: "Why Memes Are So Popular" }) }),
        /* @__PURE__ */ jsxs("ol", { className: "mg-list", children: [
          /* @__PURE__ */ jsx("li", { children: t("guide.why.item1", { defaultValue: "Instant Communication — Memes compress ideas into one image and a few words, faster than paragraphs." }) }),
          /* @__PURE__ */ jsx("li", { children: t("guide.why.item2", { defaultValue: `Relatability — The best memes make people think "That's exactly me."` }) }),
          /* @__PURE__ */ jsx("li", { children: t("guide.why.item3", { defaultValue: "Shareability — Memes are designed to be reposted and modified." }) }),
          /* @__PURE__ */ jsx("li", { children: t("guide.why.item4", { defaultValue: "Low Effort, High Impact — You don't need design skills or expensive tools; just a good idea." }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "mg-section", children: [
        /* @__PURE__ */ jsx("h3", { children: t("guide.anatomy.heading", { defaultValue: "Anatomy of a Good Meme" }) }),
        /* @__PURE__ */ jsxs("ul", { className: "mg-list", children: [
          /* @__PURE__ */ jsx("li", { children: t("guide.anatomy.image", { defaultValue: "Image: Recognizable or expressive, supports the message." }) }),
          /* @__PURE__ */ jsx("li", { children: t("guide.anatomy.text", { defaultValue: "Text: Short and clear, easy to read." }) }),
          /* @__PURE__ */ jsx("li", { children: t("guide.anatomy.punchline", { defaultValue: "Punchline: The twist or humor that makes people share." }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "mg-section", children: [
        /* @__PURE__ */ jsx("h3", { children: t("guide.types.heading", { defaultValue: "Types of Memes You Can Create" }) }),
        /* @__PURE__ */ jsxs("ul", { className: "mg-list", children: [
          /* @__PURE__ */ jsx("li", { children: t("guide.types.item1", { defaultValue: "😂 Relatable Memes — everyday situations" }) }),
          /* @__PURE__ */ jsx("li", { children: t("guide.types.item2", { defaultValue: "🔥 Trend-Based Memes — use current formats" }) }),
          /* @__PURE__ */ jsx("li", { children: t("guide.types.item3", { defaultValue: "💼 Niche Memes — target specific audiences" }) }),
          /* @__PURE__ */ jsx("li", { children: t("guide.types.item4", { defaultValue: "🧠 Informational Memes — mix humor with useful info" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "mg-section", children: [
        /* @__PURE__ */ jsx("h3", { children: t("guide.bestPractices.heading", { defaultValue: "Best Practices" }) }),
        /* @__PURE__ */ jsxs("ol", { className: "mg-list", children: [
          /* @__PURE__ */ jsx("li", { children: t("guide.bestPractices.item1", { defaultValue: "Keep text short — 2–3 seconds to read." }) }),
          /* @__PURE__ */ jsx("li", { children: t("guide.bestPractices.item2", { defaultValue: "Use clear, bold fonts with high contrast." }) }),
          /* @__PURE__ */ jsx("li", { children: t("guide.bestPractices.item3", { defaultValue: "Match text to image so it reinforces the message." }) }),
          /* @__PURE__ */ jsx("li", { children: t("guide.bestPractices.item4", { defaultValue: "Stay relevant — trending formats perform better." }) }),
          /* @__PURE__ */ jsx("li", { children: t("guide.bestPractices.item5", { defaultValue: "Know your audience and tailor the humor." }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "mg-section", children: [
        /* @__PURE__ */ jsx("h3", { children: t("guide.mistakes.heading", { defaultValue: "Common Mistakes to Avoid" }) }),
        /* @__PURE__ */ jsxs("ul", { className: "mg-list", children: [
          /* @__PURE__ */ jsx("li", { children: t("guide.mistakes.item1", { defaultValue: "Too much text" }) }),
          /* @__PURE__ */ jsx("li", { children: t("guide.mistakes.item2", { defaultValue: "Unclear message" }) }),
          /* @__PURE__ */ jsx("li", { children: t("guide.mistakes.item3", { defaultValue: "Using outdated formats" }) }),
          /* @__PURE__ */ jsx("li", { children: t("guide.mistakes.item4", { defaultValue: "Low-quality images" }) }),
          /* @__PURE__ */ jsx("li", { children: t("guide.mistakes.item5", { defaultValue: "Trying too hard to be funny" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "mg-section", children: [
        /* @__PURE__ */ jsx("h3", { children: t("guide.stepByStep.heading", { defaultValue: "Step-by-Step: How to Create a Meme" }) }),
        /* @__PURE__ */ jsxs("ol", { className: "mg-list", children: [
          /* @__PURE__ */ jsx("li", { children: t("guide.stepByStep.step1", { defaultValue: "Upload or choose an image" }) }),
          /* @__PURE__ */ jsx("li", { children: t("guide.stepByStep.step2", { defaultValue: "Add top and/or bottom text" }) }),
          /* @__PURE__ */ jsx("li", { children: t("guide.stepByStep.step3", { defaultValue: "Adjust font size and position" }) }),
          /* @__PURE__ */ jsx("li", { children: t("guide.stepByStep.step4", { defaultValue: "Preview your meme" }) }),
          /* @__PURE__ */ jsx("li", { children: t("guide.stepByStep.step5", { defaultValue: "Download and share" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "mg-section", children: [
        /* @__PURE__ */ jsx("h3", { children: t("guide.useCases.heading", { defaultValue: "Real-World Use Cases" }) }),
        /* @__PURE__ */ jsxs("ul", { className: "mg-list", children: [
          /* @__PURE__ */ jsx("li", { children: t("guide.useCases.item1", { defaultValue: "📱 Social Media Content — boost engagement" }) }),
          /* @__PURE__ */ jsx("li", { children: t("guide.useCases.item2", { defaultValue: "💼 Marketing — make brands feel human" }) }),
          /* @__PURE__ */ jsx("li", { children: t("guide.useCases.item3", { defaultValue: "🧑‍💻 Developer Humor — build community" }) }),
          /* @__PURE__ */ jsx("li", { children: t("guide.useCases.item4", { defaultValue: "👥 Group Chats — react faster than typing" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "mg-section", children: [
        /* @__PURE__ */ jsx("h3", { children: t("guide.tips.heading", { defaultValue: "Tips to Make Your Memes Stand Out" }) }),
        /* @__PURE__ */ jsxs("ul", { className: "mg-list", children: [
          /* @__PURE__ */ jsx("li", { children: t("guide.tips.item1", { defaultValue: "Use unexpected twists" }) }),
          /* @__PURE__ */ jsx("li", { children: t("guide.tips.item2", { defaultValue: "Combine two ideas creatively" }) }),
          /* @__PURE__ */ jsx("li", { children: t("guide.tips.item3", { defaultValue: "Keep it simple but clever" }) }),
          /* @__PURE__ */ jsx("li", { children: t("guide.tips.item4", { defaultValue: "Test different variations" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "mg-section", children: [
        /* @__PURE__ */ jsx("h3", { children: t("guide.comparison.heading", { defaultValue: "Meme Generator vs Image Editor" }) }),
        /* @__PURE__ */ jsxs("table", { className: "mg-table", children: [
          /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("th", { children: t("guide.comparison.col1", { defaultValue: "Feature" }) }),
            /* @__PURE__ */ jsx("th", { children: t("guide.comparison.col2", { defaultValue: "Meme Generator" }) }),
            /* @__PURE__ */ jsx("th", { children: t("guide.comparison.col3", { defaultValue: "Image Editor" }) })
          ] }) }),
          /* @__PURE__ */ jsxs("tbody", { children: [
            /* @__PURE__ */ jsxs("tr", { children: [
              /* @__PURE__ */ jsx("td", { children: t("guide.comparison.row1col1", { defaultValue: "Purpose" }) }),
              /* @__PURE__ */ jsx("td", { children: t("guide.comparison.row1col2", { defaultValue: "Quick meme creation" }) }),
              /* @__PURE__ */ jsx("td", { children: t("guide.comparison.row1col3", { defaultValue: "General editing" }) })
            ] }),
            /* @__PURE__ */ jsxs("tr", { children: [
              /* @__PURE__ */ jsx("td", { children: t("guide.comparison.row2col1", { defaultValue: "Speed" }) }),
              /* @__PURE__ */ jsx("td", { children: t("guide.comparison.row2col2", { defaultValue: "Fast" }) }),
              /* @__PURE__ */ jsx("td", { children: t("guide.comparison.row2col3", { defaultValue: "Slower" }) })
            ] }),
            /* @__PURE__ */ jsxs("tr", { children: [
              /* @__PURE__ */ jsx("td", { children: t("guide.comparison.row3col1", { defaultValue: "Ease of use" }) }),
              /* @__PURE__ */ jsx("td", { children: t("guide.comparison.row3col2", { defaultValue: "Very easy" }) }),
              /* @__PURE__ */ jsx("td", { children: t("guide.comparison.row3col3", { defaultValue: "Moderate" }) })
            ] }),
            /* @__PURE__ */ jsxs("tr", { children: [
              /* @__PURE__ */ jsx("td", { children: t("guide.comparison.row4col1", { defaultValue: "Focus" }) }),
              /* @__PURE__ */ jsx("td", { children: t("guide.comparison.row4col2", { defaultValue: "Text + image" }) }),
              /* @__PURE__ */ jsx("td", { children: t("guide.comparison.row4col3", { defaultValue: "Full customization" }) })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "mg-section", children: [
        /* @__PURE__ */ jsx("h3", { children: t("guide.faq.heading", { defaultValue: "FAQ" }) }),
        /* @__PURE__ */ jsxs("p", { children: [
          /* @__PURE__ */ jsx("strong", { children: t("guide.faq.q1", { defaultValue: "Do I need design skills?" }) }),
          " ",
          t("guide.faq.a1", { defaultValue: "No — just a good idea and clear message." })
        ] }),
        /* @__PURE__ */ jsxs("p", { children: [
          /* @__PURE__ */ jsx("strong", { children: t("guide.faq.q2", { defaultValue: "Can I use any image?" }) }),
          " ",
          t("guide.faq.a2", { defaultValue: "You can, but be mindful of copyright and prefer common meme formats when possible." })
        ] }),
        /* @__PURE__ */ jsxs("p", { children: [
          /* @__PURE__ */ jsx("strong", { children: t("guide.faq.q3", { defaultValue: "Why are my memes not getting engagement?" }) }),
          " ",
          t("guide.faq.a3", { defaultValue: "Possible reasons: too much text, not relatable, outdated format." })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "mg-section", children: [
        /* @__PURE__ */ jsx("h3", { children: t("guide.conclusionTitle", { defaultValue: "Conclusion" }) }),
        /* @__PURE__ */ jsx("p", { children: t("guide.conclusion", { defaultValue: "Creating memes isn’t about complex design — it’s about communication and timing. Focus on clear ideas, simple text, and relatability." }) }),
        /* @__PURE__ */ jsx("p", { children: t("guide.tryIt", { defaultValue: "Try making your own here:" }) }),
        /* @__PURE__ */ jsx("div", { className: "mg-cta-wrap", children: /* @__PURE__ */ jsx("a", { href: "/image-meme-generator", className: "mg-cta", onClick: (e) => {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: "smooth" });
          navigate("/image-meme-generator");
        }, children: t("guide.ctaBtn", { defaultValue: "Image Meme Generator →" }) }) })
      ] })
    ] })
  ] });
}
function MemeGeneratorPage() {
  const location = useLocation();
  const stateImage = location.state && location.state.mainImage;
  return /* @__PURE__ */ jsxs("div", { className: "meme-generator-page", children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsx("main", { className: "main", children: /* @__PURE__ */ jsx("div", { className: "container", children: /* @__PURE__ */ jsx("div", { className: "card", children: /* @__PURE__ */ jsx(MemeGeneratorView, { initialFile: stateImage }) }) }) }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
const ImageMemeGenerator = () => /* @__PURE__ */ jsx(MemeGeneratorPage, {});
function createImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error2) => reject(error2));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });
}
function getRadianAngle(degreeValue) {
  return degreeValue * Math.PI / 180;
}
async function getCroppedImg(imageSrc, pixelCrop, rotation = 0, { flipH = false, flipV = false } = {}) {
  const image = await createImage(imageSrc);
  const canvas2 = document.createElement("canvas");
  const ctx = canvas2.getContext("2d");
  const maxSize = Math.max(image.width, image.height);
  const safeArea = 2 * (maxSize / 2 * Math.sqrt(2));
  canvas2.width = safeArea;
  canvas2.height = safeArea;
  ctx.translate(safeArea / 2, safeArea / 2);
  ctx.rotate(getRadianAngle(rotation));
  ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
  ctx.translate(-image.width / 2, -image.height / 2);
  ctx.drawImage(image, 0, 0);
  const data = ctx.getImageData(0, 0, safeArea, safeArea);
  const outCanvas = document.createElement("canvas");
  outCanvas.width = pixelCrop.width;
  outCanvas.height = pixelCrop.height;
  const outCtx = outCanvas.getContext("2d");
  const offsetX = Math.round(safeArea / 2 - image.width / 2 + pixelCrop.x);
  const offsetY = Math.round(safeArea / 2 - image.height / 2 + pixelCrop.y);
  outCtx.putImageData(data, -offsetX, -offsetY);
  return new Promise((resolve) => {
    outCanvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      resolve({ blob, url });
    }, "image/png");
  });
}
function applyFlipToSrc(src, flipH, flipV) {
  if (!flipH && !flipV) return Promise.resolve(src);
  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () => {
      const canvas2 = document.createElement("canvas");
      canvas2.width = img.width;
      canvas2.height = img.height;
      const ctx = canvas2.getContext("2d");
      ctx.save();
      if (flipH) {
        ctx.translate(img.width, 0);
        ctx.scale(-1, 1);
      }
      if (flipV) {
        ctx.translate(0, img.height);
        ctx.scale(1, -1);
      }
      ctx.drawImage(img, 0, 0);
      ctx.restore();
      resolve(canvas2.toDataURL());
    };
    img.src = src;
  });
}
function useImageCrop() {
  const [mainImage, setMainImage] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [originalSrc, setOriginalSrc] = useState(null);
  const [imageFileName, setImageFileName] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [aspect, setAspect] = useState(1);
  const [naturalAspect, setNaturalAspect] = useState(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [outputUrl, setOutputUrl] = useState(null);
  const fileInputRef = useRef(null);
  const handleFileInput = async (e) => {
    const raw = e.target.files ? e.target.files[0] : e;
    if (!raw) return;
    const file = await normalizeImageFile(raw);
    setMainImage(file);
    setImageFileName(file.name || null);
    const url = URL.createObjectURL(file);
    setOriginalSrc(url);
    setImageSrc(url);
    setFlipH(false);
    setFlipV(false);
    setOutputUrl(null);
  };
  const handleClear = () => {
    setMainImage(null);
    setImageSrc(null);
    setOriginalSrc(null);
    setImageFileName(null);
    setFlipH(false);
    setFlipV(false);
    setRotation(0);
    setZoom(1);
    setCrop({ x: 0, y: 0 });
    setOutputUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  useEffect(() => {
    if (!originalSrc) return;
    const img = new window.Image();
    img.onload = () => {
      if (img.width && img.height) {
        const ratio = img.width / img.height;
        setNaturalAspect(ratio);
        setAspect(ratio);
        setZoom(1);
        setCrop({ x: 0, y: 0 });
      }
    };
    img.src = originalSrc;
  }, [originalSrc]);
  const handleDrop = async (e) => {
    e.preventDefault();
    const raw = e.dataTransfer.files && e.dataTransfer.files[0];
    if (raw) handleFileInput(raw);
  };
  const handleDragOver = (e) => {
    e.preventDefault();
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
  };
  const onCropComplete = (_croppedArea, pixels) => {
    setCroppedAreaPixels(pixels);
  };
  const handleFlipH = async () => {
    const newFlipH = !flipH;
    setFlipH(newFlipH);
    if (!originalSrc) return;
    const src = await applyFlipToSrc(originalSrc, newFlipH, flipV);
    setImageSrc(src);
    setOutputUrl(null);
  };
  const handleFlipV = async () => {
    const newFlipV = !flipV;
    setFlipV(newFlipV);
    if (!originalSrc) return;
    const src = await applyFlipToSrc(originalSrc, flipH, newFlipV);
    setImageSrc(src);
    setOutputUrl(null);
  };
  const handleDownload = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    try {
      const { blob, url } = await getCroppedImg(imageSrc, croppedAreaPixels, rotation);
      setOutputUrl(url);
      return { blob, url };
    } catch (e) {
      console.error(e);
      return null;
    }
  };
  const handleReset = () => {
    if (!originalSrc) return;
    setImageSrc(originalSrc);
    setFlipH(false);
    setFlipV(false);
    setRotation(0);
    setZoom(1);
    setCrop({ x: 0, y: 0 });
    setOutputUrl(null);
  };
  const setPreset = (preset) => {
    if (preset === "instagram") setAspect(4 / 5);
    else if (preset === "youtube") setAspect(16 / 9);
    else if (preset === "profile") setAspect(1);
    setZoom(1);
    setCrop({ x: 0, y: 0 });
  };
  return {
    mainImage,
    imageSrc,
    imageFileName,
    naturalAspect,
    crop,
    setCrop,
    zoom,
    setZoom,
    rotation,
    setRotation,
    flipH,
    handleFlipH,
    flipV,
    handleFlipV,
    aspect,
    setAspect,
    onCropComplete,
    outputUrl,
    handleDownload,
    fileInputRef,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    handleFileInput,
    setPreset,
    handleReset,
    handleClear
  };
}
function ImageCropView(props) {
  const {
    imageSrc,
    crop,
    setCrop,
    zoom,
    setZoom,
    rotation,
    setRotation,
    flipH,
    handleFlipH,
    flipV,
    handleFlipV,
    aspect,
    setAspect,
    onCropComplete,
    naturalAspect,
    outputUrl,
    handleDownload,
    fileInputRef,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    handleFileInput,
    imageFileName,
    handleClear,
    setPreset,
    handleReset
  } = props;
  const navigate = useNavigate();
  const { t } = useTranslation("imageCrop");
  const [selectValue, setSelectValue] = useState(() => aspect ? String(aspect) : String(4 / 3));
  const [customW, setCustomW] = useState(4);
  const [customH, setCustomH] = useState(3);
  const normalizePositiveInt = (v) => {
    const n = Number(v);
    if (!isFinite(n) || n <= 0) return 1;
    return Math.max(1, Math.round(n));
  };
  useEffect(() => {
    try {
      const val = Number(selectValue);
      if (selectValue !== "" && isFinite(val) && val > 0) {
        const map = {
          [String(1)]: [1, 1],
          [String(4 / 3)]: [4, 3],
          [String(16 / 9)]: [16, 9],
          [String(9 / 16)]: [9, 16],
          [String(4 / 5)]: [4, 5],
          [String(2 / 3)]: [2, 3],
          [String(3 / 1)]: [3, 1],
          [String(1.91)]: [191, 100]
        };
        const pair = map[String(selectValue)];
        if (pair) {
          setCustomW(pair[0]);
          setCustomH(pair[1]);
        }
      }
    } catch (err) {
    }
  }, []);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [hasCropEdited, setHasCropEdited] = useState(false);
  const [openPanel, setOpenPanel] = useState("");
  const cropContainerRef = useRef(null);
  const [cropperHeight, setCropperHeight] = useState(520);
  const onCropCompleteInternal = useCallback((croppedArea, croppedAreaPixels) => {
    setHasCropEdited(true);
    onCropComplete(croppedArea, croppedAreaPixels);
  }, [onCropComplete]);
  useEffect(() => {
    if (!imageSrc) return;
    if (!hasCropEdited) setHasCropEdited(true);
  }, [crop, zoom, rotation, flipH, flipV, selectValue, customW, customH]);
  const isPreset = selectValue !== "";
  const cropperAspect = isPreset ? Number(selectValue) : customH > 0 ? customW / customH : void 0;
  useEffect(() => {
    try {
      setAspect(cropperAspect);
    } catch (err) {
    }
  }, [selectValue, customW, customH]);
  const download = async () => {
    setProcessing(true);
    await handleDownload();
    setProcessing(false);
  };
  const triggerDownload = async () => {
    setProcessing(true);
    try {
      let url = outputUrl;
      if (!url) {
        const res = await handleDownload();
        url = res && res.url ? res.url : outputUrl;
      }
      if (!url) return;
      const link = document.createElement("a");
      link.href = url;
      link.download = imageSrc ? "cropped.png" : "cropped.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
    }
    setProcessing(false);
  };
  const handleSendToMeme = async () => {
    setProcessing(true);
    try {
      let url = outputUrl;
      if (!url) {
        const res = await handleDownload();
        url = res && res.url ? res.url : outputUrl;
      }
      if (!url) return;
      const resp = await fetch(url);
      const blob = await resp.blob();
      const file = new File([blob], "cropped.png", { type: blob.type || "image/png" });
      navigate("/image-meme-generator", { state: { mainImage: file } });
    } catch (err) {
    }
    setProcessing(false);
  };
  const handleWheel = (e) => {
    if (!e.altKey) return;
    e.preventDefault();
    const delta = -e.deltaY / 300;
    setZoom((z) => {
      const next = z + delta;
      const rounded = Math.round(next * 100) / 100;
      return Math.min(3, Math.max(0.5, rounded));
    });
  };
  useEffect(() => {
    const el = cropContainerRef.current;
    if (!el) return;
    function recalc() {
      const width = el.clientWidth || el.offsetWidth || 600;
      const a = naturalAspect ?? 4 / 3;
      const h = Math.max(200, Math.min(600, Math.round(width / a)));
      setCropperHeight(h);
    }
    recalc();
    const ro = new ResizeObserver(recalc);
    ro.observe(el);
    return () => ro.disconnect();
  }, [naturalAspect]);
  useEffect(() => {
    const el = cropContainerRef.current;
    if (!el) return;
    const listener = (e) => {
      try {
        handleWheel(e);
      } catch (err) {
      }
    };
    el.addEventListener("wheel", listener, { passive: false, capture: true });
    return () => el.removeEventListener("wheel", listener, { capture: true });
  }, [cropContainerRef.current]);
  return /* @__PURE__ */ jsxs("div", { className: "image-crop-view", children: [
    /* @__PURE__ */ jsx("h2", { className: "hero-title", children: t("hero.title") }),
    /* @__PURE__ */ jsxs("p", { className: "hero-tagline", children: [
      t("hero.tagline"),
      " ",
      /* @__PURE__ */ jsx(Link, { to: "/blogs/image-crop-guide", children: t("hero.blogLink") })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "ir-tip-banner", children: [
      /* @__PURE__ */ jsx("span", { className: "ir-tip-text", children: t("hint.text") }),
      /* @__PURE__ */ jsx("button", { className: "ir-tip-btn", onClick: () => navigate("/image-meme-generator"), children: t("hint.btn") })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "details-row", "data-open": openPanel, children: [
      /* @__PURE__ */ jsxs("div", { className: "details-controls", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            className: `tab-btn ${openPanel === "details" ? "active" : ""}`,
            onClick: () => setOpenPanel((prev) => prev === "details" ? "" : "details"),
            "aria-expanded": openPanel === "details",
            type: "button",
            children: t("tabs.details")
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            className: `tab-btn ${openPanel === "howitworks" ? "active" : ""}`,
            onClick: () => setOpenPanel((prev) => prev === "howitworks" ? "" : "howitworks"),
            "aria-expanded": openPanel === "howitworks",
            type: "button",
            children: t("tabs.howItWorks")
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: `shared-collapse${!openPanel ? " panel-hidden" : ""}`, children: [
        /* @__PURE__ */ jsxs("div", { className: openPanel !== "details" ? "details-content panel-hidden" : "details-content", children: [
          /* @__PURE__ */ jsx("h3", { children: t("details.whatIs.heading", { defaultValue: "What is Image Crop" }) }),
          /* @__PURE__ */ jsx("p", { children: t("details.whatIs.body", { defaultValue: "The Image Crop tool provides an interactive way to select and export a rectangular portion of an image. It offers zoom, rotation, and flip controls, aspect ratio presets for common targets (social, profile, banners), and a preview step so you can confirm the crop before downloading. All transformation and export operations are performed in your browser using an offscreen canvas; your original file does not leave your device unless you explicitly share or upload it." }) }),
          /* @__PURE__ */ jsx("h3", { children: t("details.howWorks.heading", { defaultValue: "How cropping works" }) }),
          /* @__PURE__ */ jsx("p", { children: t("details.howWorks.body", { defaultValue: "After loading an image the editor displays a resizable crop overlay. You can drag the overlay to reposition it, resize using handles, or pick one of the provided aspect ratios for exact output dimensions. Zooming and rotation let you refine framing; flips mirror the image horizontally or vertically. When you click Preview or Download the selected region is rendered to an offscreen canvas with any transforms applied, and the result is exported as a PNG file for immediate download." }) }),
          /* @__PURE__ */ jsx("h3", { children: t("details.presets.heading", { defaultValue: "Presets and precision" }) }),
          /* @__PURE__ */ jsxs("ul", { children: [
            /* @__PURE__ */ jsxs("li", { children: [
              /* @__PURE__ */ jsx("strong", { children: t("details.presets.item1.title", { defaultValue: "1:1 (Profile)" }) }),
              " — ",
              t("details.presets.item1.body", { defaultValue: "Ideal for avatars and profile photos." })
            ] }),
            /* @__PURE__ */ jsxs("li", { children: [
              /* @__PURE__ */ jsx("strong", { children: t("details.presets.item2.title", { defaultValue: "16:9 (Widescreen)" }) }),
              " — ",
              t("details.presets.item2.body", { defaultValue: "Useful for video thumbnails, banners, and widescreen presentations." })
            ] }),
            /* @__PURE__ */ jsxs("li", { children: [
              /* @__PURE__ */ jsx("strong", { children: t("details.presets.item3.title", { defaultValue: "4:5 (Portrait)" }) }),
              " — ",
              t("details.presets.item3.body", { defaultValue: "A common format for social feeds and portrait-oriented content." })
            ] }),
            /* @__PURE__ */ jsxs("li", { children: [
              /* @__PURE__ */ jsx("strong", { children: t("details.presets.item4.title", { defaultValue: "Free" }) }),
              " — ",
              t("details.presets.item4.body", { defaultValue: "No constraints; crop to any dimensions you need." })
            ] })
          ] }),
          /* @__PURE__ */ jsx("h3", { children: t("details.practical.heading", { defaultValue: "Practical tips" }) }),
          /* @__PURE__ */ jsxs("ul", { children: [
            /* @__PURE__ */ jsx("li", { children: t("details.practical.item1", { defaultValue: "Use the aspect-lock to keep exact proportions when resizing the crop area." }) }),
            /* @__PURE__ */ jsx("li", { children: t("details.practical.item2", { defaultValue: "For pixel-perfect exports, set the desired output resolution after choosing the crop area, then preview at 100% if possible." }) }),
            /* @__PURE__ */ jsx("li", { children: t("details.practical.item3", { defaultValue: "If you need to crop many images the same way, note the preset values so you can repeat the process consistently." }) })
          ] }),
          /* @__PURE__ */ jsx("h3", { children: t("details.useful.heading", { defaultValue: "Useful when" }) }),
          /* @__PURE__ */ jsxs("ul", { children: [
            /* @__PURE__ */ jsx("li", { children: t("details.useful.item1", { defaultValue: "preparing profile pictures or social media assets to exact dimensions." }) }),
            /* @__PURE__ */ jsx("li", { children: t("details.useful.item2", { defaultValue: "removing unwanted borders, background, or distracting elements from a photo." }) }),
            /* @__PURE__ */ jsx("li", { children: t("details.useful.item3", { defaultValue: "cropping a screenshot to a specific region for docs or presentations." }) }),
            /* @__PURE__ */ jsx("li", { children: t("details.useful.item4", { defaultValue: "quickly re-framing a photo without opening a desktop image editor." }) })
          ] }),
          /* @__PURE__ */ jsx("h3", { children: t("details.accessibility.heading", { defaultValue: "Accessibility & privacy" }) }),
          /* @__PURE__ */ jsx("p", { children: t("details.accessibility.body", { defaultValue: "Controls are keyboard accessible and sized for touch interaction; the preview dialog helps users of all devices confirm changes. Because cropping is performed locally, your images remain private unless you choose to upload them as part of a sharing workflow." }) }),
          /* @__PURE__ */ jsx("h3", { children: t("details.faq.heading", { defaultValue: "FAQs" }) }),
          /* @__PURE__ */ jsxs("ul", { children: [
            /* @__PURE__ */ jsxs("li", { children: [
              /* @__PURE__ */ jsx("strong", { children: t("details.faq.q1", { defaultValue: "Q: Is my image uploaded anywhere?" }) }),
              " ",
              /* @__PURE__ */ jsx("strong", { children: t("details.faq.a1", { defaultValue: "A: No — all cropping runs client-side in your browser. Your image never leaves your device." }) })
            ] }),
            /* @__PURE__ */ jsxs("li", { children: [
              /* @__PURE__ */ jsx("strong", { children: t("details.faq.q2", { defaultValue: "Q: What formats are supported?" }) }),
              " ",
              /* @__PURE__ */ jsx("strong", { children: t("details.faq.a2", { defaultValue: "A: You can load any image format the browser supports (JPEG, PNG, WebP, GIF, etc.). The cropped output is always exported as PNG." }) })
            ] }),
            /* @__PURE__ */ jsxs("li", { children: [
              /* @__PURE__ */ jsx("strong", { children: t("details.faq.q3", { defaultValue: "Q: Can I undo a crop?" }) }),
              " ",
              /* @__PURE__ */ jsx("strong", { children: t("details.faq.a3", { defaultValue: "A: Yes — simply adjust the crop selection and click Preview again to regenerate the output before downloading." }) })
            ] }),
            /* @__PURE__ */ jsxs("li", { children: [
              /* @__PURE__ */ jsx("strong", { children: t("details.faq.q4", { defaultValue: "Q: Why does the download button stay greyed out?" }) }),
              " ",
              /* @__PURE__ */ jsx("strong", { children: t("details.faq.a4", { defaultValue: "A: Click Preview first to generate a cropped image, then the Download button becomes active." }) })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: openPanel !== "howitworks" ? "howitworks-content panel-hidden" : "howitworks-content", children: /* @__PURE__ */ jsxs("ol", { style: { margin: 0, paddingLeft: "1rem" }, children: [
          /* @__PURE__ */ jsxs("li", { style: { marginBottom: "0.75rem" }, children: [
            /* @__PURE__ */ jsx("img", { src: "/screenshots/crop/crop_001.png", alt: t("howItWorks.imgAlt.step1", { defaultValue: "Step 1" }), className: "how-img" }),
            /* @__PURE__ */ jsx("p", { children: t("howItWorks.step1", { defaultValue: "Load an image by dragging and dropping it onto the crop area, or click to browse your files." }) })
          ] }),
          /* @__PURE__ */ jsxs("li", { style: { marginBottom: "0.75rem" }, children: [
            /* @__PURE__ */ jsx("img", { src: "/screenshots/crop/crop_002.png", alt: t("howItWorks.imgAlt.step2", { defaultValue: "Step 2" }), className: "how-img" }),
            /* @__PURE__ */ jsx("p", { children: t("howItWorks.step2", { defaultValue: "Drag and resize the crop overlay to select the region you want to keep. Choose an aspect ratio preset or use Free mode." }) })
          ] }),
          /* @__PURE__ */ jsxs("li", { style: { marginBottom: "0.75rem" }, children: [
            /* @__PURE__ */ jsx("img", { src: "/screenshots/crop/crop_003.png", alt: t("howItWorks.imgAlt.step3", { defaultValue: "Step 3" }), className: "how-img" }),
            /* @__PURE__ */ jsx("p", { children: t("howItWorks.step3", { defaultValue: "Optionally adjust zoom, rotation, and flip to fine-tune the framing before cropping." }) })
          ] }),
          /* @__PURE__ */ jsxs("li", { style: { marginBottom: "0.75rem" }, children: [
            /* @__PURE__ */ jsx("img", { src: "/screenshots/crop/crop_004.png", alt: t("howItWorks.imgAlt.step4", { defaultValue: "Step 4" }), className: "how-img" }),
            /* @__PURE__ */ jsx("p", { children: t("howItWorks.step4", { defaultValue: "Click Preview to generate the cropped image and inspect the result in the preview dialog." }) })
          ] }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("p", { children: t("howItWorks.step5", { defaultValue: "Click Download to save the cropped PNG to your device." }) }) })
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "crop-area", children: [
      /* @__PURE__ */ jsxs("div", { className: "crop-drop-wrapper", children: [
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: "drop-zone crop-drop",
            onDrop: handleDrop,
            onDragOver: handleDragOver,
            onDragLeave: handleDragLeave,
            onClick: () => fileInputRef.current && fileInputRef.current.click(),
            ref: cropContainerRef,
            onWheel: handleWheel,
            children: [
              imageSrc ? /* @__PURE__ */ jsx(
                "div",
                {
                  className: "cropper-wrap",
                  style: { height: cropperHeight },
                  onClick: (e) => e.stopPropagation(),
                  children: /* @__PURE__ */ jsx(
                    Cropper,
                    {
                      image: imageSrc,
                      crop,
                      zoom,
                      rotation,
                      aspect: cropperAspect,
                      onCropChange: setCrop,
                      onZoomChange: setZoom,
                      onRotationChange: setRotation,
                      onCropComplete: onCropCompleteInternal,
                      cropShape: "rect",
                      showGrid: true,
                      minZoom: 0.5,
                      restrictPosition: false
                    }
                  )
                }
              ) : /* @__PURE__ */ jsx("span", { className: "hero-tagline", children: t("dropZone.text") }),
              /* @__PURE__ */ jsx("input", { type: "file", accept: "image/*,.heic,.heif", style: { display: "none" }, ref: fileInputRef, onChange: handleFileInput })
            ]
          }
        ),
        imageSrc && /* @__PURE__ */ jsxs("div", { className: "crop-file-row", children: [
          /* @__PURE__ */ jsx("span", { className: "crop-file-name", children: imageFileName || "Image loaded" }),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              className: "crop-change-btn",
              onClick: () => fileInputRef.current && fileInputRef.current.click(),
              children: t("fileRow.change")
            }
          ),
          /* @__PURE__ */ jsx("button", { type: "button", className: "crop-clear-btn", onClick: handleClear, children: t("fileRow.clear") })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "crop-controls", children: [
        /* @__PURE__ */ jsxs("div", { className: "control-row", children: [
          /* @__PURE__ */ jsx("label", { children: t("controls.zoom") }),
          /* @__PURE__ */ jsx("input", { type: "range", min: "0.5", max: "3", step: "0.01", value: zoom, onChange: (e) => setZoom(Number(e.target.value)) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "control-row", children: [
          /* @__PURE__ */ jsx("label", { children: t("controls.rotation") }),
          /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setRotation((r) => r - 90), "aria-label": "rotate-left", children: "⟲" }),
          /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setRotation((r) => r + 90), "aria-label": "rotate-right", children: "⟳" }),
          /* @__PURE__ */ jsxs("span", { style: { marginLeft: 8 }, children: [
            rotation,
            "°"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "control-row", children: [
          /* @__PURE__ */ jsx("label", { children: t("controls.flip") }),
          /* @__PURE__ */ jsx("button", { type: "button", onClick: handleFlipH, "aria-pressed": flipH, children: t("controls.horizontal") }),
          /* @__PURE__ */ jsx("button", { type: "button", onClick: handleFlipV, "aria-pressed": flipV, children: t("controls.vertical") })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "control-row", children: [
          /* @__PURE__ */ jsx("label", { children: t("controls.aspect") }),
          (() => {
            const aspectOptions2 = [
              { value: "", label: t("aspectOptions.custom"), w: 0, h: 0, id: "custom" },
              { value: String(1), label: t("aspectOptions.profile"), w: 1, h: 1, id: "profile" },
              { value: String(4 / 3), label: t("aspectOptions.standard"), w: 4, h: 3, id: "standard" },
              { value: String(16 / 9), label: t("aspectOptions.widescreen"), w: 16, h: 9, id: "widescreen" },
              { value: String(9 / 16), label: t("aspectOptions.story"), w: 9, h: 16, id: "story" },
              { value: String(4 / 5), label: t("aspectOptions.instagram"), w: 4, h: 5, id: "instagram" },
              { value: String(2 / 3), label: t("aspectOptions.pinterest"), w: 2, h: 3, id: "pinterest" },
              { value: String(3 / 1), label: t("aspectOptions.blog"), w: 3, h: 1, id: "blog" },
              { value: String(1.91), label: t("aspectOptions.facebook"), w: 191, h: 100, id: "facebook" }
            ];
            return /* @__PURE__ */ jsx(
              CustomSelect,
              {
                value: selectValue,
                onChange: (v) => {
                  setSelectValue(v);
                  const opt = aspectOptions2.find((o) => o.value === v);
                  if (!opt || v === "") {
                    setPreset("custom");
                    setCustomW(4);
                    setCustomH(3);
                  } else {
                    setCustomW(opt.w || 1);
                    setCustomH(opt.h || 1);
                    setPreset(opt.id || "preset");
                  }
                },
                options: aspectOptions2.map((o) => ({ value: o.value, label: o.label }))
              }
            );
          })()
        ] }),
        !isPreset && /* @__PURE__ */ jsxs("div", { className: "control-row aspect-inputs", style: { alignItems: "center", gap: 8 }, children: [
          /* @__PURE__ */ jsx("label", { style: { minWidth: 90 }, children: t("controls.ratio") }),
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 8, alignItems: "center" }, children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "number",
                min: 1,
                value: (() => {
                  try {
                    if (isPreset) {
                      const parts = decimalToRatio(Number(selectValue)).split(":");
                      return parts[0] || "";
                    }
                    return customW || "";
                  } catch (err) {
                    return "";
                  }
                })(),
                onChange: (e) => {
                  const w = e.target.value === "" ? "" : Number(e.target.value);
                  setCustomW(w === "" ? "" : w);
                },
                onBlur: () => setCustomW(normalizePositiveInt(customW)),
                disabled: isPreset,
                style: {
                  width: 90,
                  padding: "0.4rem",
                  backgroundColor: isPreset ? "#f3f4f6" : void 0,
                  border: isPreset ? "1px solid #d1d5db" : void 0,
                  color: isPreset ? "#6b7280" : void 0,
                  cursor: isPreset ? "not-allowed" : "text"
                }
              }
            ),
            /* @__PURE__ */ jsx("span", { style: { color: "#6b7280" }, children: ":" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "number",
                min: 1,
                value: (() => {
                  try {
                    if (isPreset) {
                      const parts = decimalToRatio(Number(selectValue)).split(":");
                      return parts[1] || "";
                    }
                    return customH || "";
                  } catch (err) {
                    return "";
                  }
                })(),
                onChange: (e) => {
                  const h = e.target.value === "" ? "" : Number(e.target.value);
                  setCustomH(h === "" ? "" : h);
                },
                onBlur: () => setCustomH(normalizePositiveInt(customH)),
                disabled: isPreset,
                style: {
                  width: 90,
                  padding: "0.4rem",
                  backgroundColor: isPreset ? "#f3f4f6" : void 0,
                  border: isPreset ? "1px solid #d1d5db" : void 0,
                  color: isPreset ? "#6b7280" : void 0,
                  cursor: isPreset ? "not-allowed" : "text"
                }
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 8, alignItems: "center" }, children: [
          /* @__PURE__ */ jsx("button", { className: "resize-btn", onClick: async () => {
            await download();
            setPreviewOpen(true);
          }, disabled: processing || !imageSrc, children: processing ? t("actions.processing") : t("actions.preview") }),
          /* @__PURE__ */ jsx("button", { className: "resize-btn reset-btn", onClick: () => {
            handleReset();
            setPreviewOpen(false);
            setHasCropEdited(false);
          }, disabled: !imageSrc, style: { marginLeft: 8 }, children: t("actions.reset") }),
          /* @__PURE__ */ jsx(
            "button",
            {
              className: `download-btn ${!outputUrl ? "disabled" : ""}`,
              onClick: triggerDownload,
              disabled: !(outputUrl || hasCropEdited),
              children: t("actions.download")
            }
          )
        ] }),
        previewOpen && outputUrl && /* @__PURE__ */ jsx("div", { className: "image-popup-overlay", onClick: () => setPreviewOpen(false), children: /* @__PURE__ */ jsxs("div", { className: "image-popup-dialog", onClick: (e) => e.stopPropagation(), children: [
          /* @__PURE__ */ jsx("img", { src: outputUrl, alt: "Preview", className: "image-popup-img" }),
          /* @__PURE__ */ jsx("button", { className: "close-popup-btn", onClick: () => setPreviewOpen(false), children: "×" })
        ] }) })
      ] })
    ] }),
    (outputUrl || hasCropEdited) && /* @__PURE__ */ jsxs("div", { className: "send-action", children: [
      /* @__PURE__ */ jsx("span", { className: "send-text", children: t("sendToMeme.text") }),
      /* @__PURE__ */ jsx(
        "button",
        {
          className: "send-btn",
          onClick: handleSendToMeme,
          disabled: !(outputUrl || hasCropEdited),
          children: t("sendToMeme.btn")
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "ic-guide", children: [
      /* @__PURE__ */ jsxs("div", { className: "ic-guide-intro", children: [
        /* @__PURE__ */ jsx("h2", { className: "ic-guide-title", children: t("guide.title", { defaultValue: "How to Crop Images Perfectly (Without Losing Quality or Composition)" }) }),
        /* @__PURE__ */ jsx("p", { className: "ic-guide-lead", children: t("guide.lead", { defaultValue: "Cropping an image is one of the simplest edits you can make — but it has a huge impact on how your image looks and communicates." }) }),
        /* @__PURE__ */ jsxs("div", { className: "ic-guide-learn-box", children: [
          /* @__PURE__ */ jsx("span", { className: "ic-guide-learn-label", children: t("guide.learnLabel", { defaultValue: "In this guide, you'll learn:" }) }),
          /* @__PURE__ */ jsxs("ul", { className: "ic-guide-learn-list", children: [
            /* @__PURE__ */ jsx("li", { children: t("guide.learnItems.item1", { defaultValue: "How image cropping works" }) }),
            /* @__PURE__ */ jsx("li", { children: t("guide.learnItems.item2", { defaultValue: "When to use it" }) }),
            /* @__PURE__ */ jsx("li", { children: t("guide.learnItems.item3", { defaultValue: "How to crop properly without ruining quality" }) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "ic-guide-section", children: [
        /* @__PURE__ */ jsx("h3", { className: "ic-guide-h3", children: t("guide.whatIs.heading", { defaultValue: "What Is Image Cropping?" }) }),
        /* @__PURE__ */ jsx("p", { children: t("guide.whatIs.body", { defaultValue: "Image cropping is the process of removing unwanted outer areas of an image to improve composition or adjust size. Instead of resizing the entire image, cropping lets you cut out unnecessary parts, focus on the subject, and change the aspect ratio." }) }),
        /* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsx("em", { children: t("guide.whatIs.analogy", { defaultValue: "Think of it as framing your image after it’s already taken." }) }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "ic-guide-section", children: [
        /* @__PURE__ */ jsx("h3", { className: "ic-guide-h3", children: t("guide.why.heading", { defaultValue: "Why Cropping Matters" }) }),
        /* @__PURE__ */ jsxs("div", { className: "ic-guide-cards", children: [
          /* @__PURE__ */ jsxs("div", { className: "ic-guide-card", children: [
            /* @__PURE__ */ jsx("span", { className: "ic-guide-card-num", children: "1" }),
            /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("p", { children: t("guide.why.focus", { defaultValue: "Focus on the Subject — Cropping removes distractions and highlights the most important part of the image." }) }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "ic-guide-card", children: [
            /* @__PURE__ */ jsx("span", { className: "ic-guide-card-num", children: "2" }),
            /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("p", { children: t("guide.why.composition", { defaultValue: "Improve Composition — Use cropping to balance the image, apply the rule of thirds, and create a cleaner layout." }) }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "ic-guide-card", children: [
            /* @__PURE__ */ jsx("span", { className: "ic-guide-card-num", children: "3" }),
            /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("p", { children: t("guide.why.platform", { defaultValue: "Fit Platform Requirements — Different platforms need different sizes; crop to square, vertical, or landscape to avoid distortion." }) }) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "ic-guide-section", children: [
        /* @__PURE__ */ jsx("h3", { className: "ic-guide-h3", children: t("guide.croppingVsResizing.heading", { defaultValue: "Cropping vs Resizing" }) }),
        /* @__PURE__ */ jsxs("table", { className: "ic-guide-table", children: [
          /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("th", { children: t("guide.croppingVsResizing.col1", { defaultValue: "Feature" }) }),
            /* @__PURE__ */ jsx("th", { children: t("guide.croppingVsResizing.col2", { defaultValue: "Cropping" }) }),
            /* @__PURE__ */ jsx("th", { children: t("guide.croppingVsResizing.col3", { defaultValue: "Resizing" }) })
          ] }) }),
          /* @__PURE__ */ jsxs("tbody", { children: [
            /* @__PURE__ */ jsxs("tr", { children: [
              /* @__PURE__ */ jsx("td", { children: t("guide.croppingVsResizing.row1col1", { defaultValue: "What it does" }) }),
              /* @__PURE__ */ jsx("td", { children: t("guide.croppingVsResizing.row1col2", { defaultValue: "Removes part of image" }) }),
              /* @__PURE__ */ jsx("td", { children: t("guide.croppingVsResizing.row1col3", { defaultValue: "Scales entire image" }) })
            ] }),
            /* @__PURE__ */ jsxs("tr", { children: [
              /* @__PURE__ */ jsx("td", { children: t("guide.croppingVsResizing.row2col1", { defaultValue: "Keeps full content" }) }),
              /* @__PURE__ */ jsx("td", { children: t("guide.croppingVsResizing.row2col2", { defaultValue: "No" }) }),
              /* @__PURE__ */ jsx("td", { children: t("guide.croppingVsResizing.row2col3", { defaultValue: "Yes" }) })
            ] }),
            /* @__PURE__ */ jsxs("tr", { children: [
              /* @__PURE__ */ jsx("td", { children: t("guide.croppingVsResizing.row3col1", { defaultValue: "Changes composition" }) }),
              /* @__PURE__ */ jsx("td", { children: t("guide.croppingVsResizing.row3col2", { defaultValue: "Yes" }) }),
              /* @__PURE__ */ jsx("td", { children: t("guide.croppingVsResizing.row3col3", { defaultValue: "No" }) })
            ] }),
            /* @__PURE__ */ jsxs("tr", { children: [
              /* @__PURE__ */ jsx("td", { children: t("guide.croppingVsResizing.row4col1", { defaultValue: "Use case" }) }),
              /* @__PURE__ */ jsx("td", { children: t("guide.croppingVsResizing.row4col2", { defaultValue: "Focus / framing" }) }),
              /* @__PURE__ */ jsx("td", { children: t("guide.croppingVsResizing.row4col3", { defaultValue: "File size / dimensions" }) })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx("p", { children: t("guide.croppingVsResizing.tip", { defaultValue: "Best practice: Crop first → then resize if needed." }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "ic-guide-section", children: [
        /* @__PURE__ */ jsx("h3", { className: "ic-guide-h3", children: t("guide.bestPractices.heading", { defaultValue: "Best Practices for Cropping" }) }),
        /* @__PURE__ */ jsxs("div", { className: "ic-guide-best-list", children: [
          /* @__PURE__ */ jsxs("div", { className: "ic-guide-best-item", children: [
            /* @__PURE__ */ jsx("span", { className: "ic-guide-best-icon", children: "✅" }),
            /* @__PURE__ */ jsx("p", { children: t("guide.bestPractices.item1", { defaultValue: "Keep the Subject Clear — Ensure the main subject is centered or well-positioned and not cut awkwardly." }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "ic-guide-best-item", children: [
            /* @__PURE__ */ jsx("span", { className: "ic-guide-best-icon", children: "✅" }),
            /* @__PURE__ */ jsx("p", { children: t("guide.bestPractices.item2", { defaultValue: "Maintain Aspect Ratio — Use fixed ratios (1:1, 16:9, 4:5) when targeting specific platforms." }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "ic-guide-best-item", children: [
            /* @__PURE__ */ jsx("span", { className: "ic-guide-best-icon", children: "✅" }),
            /* @__PURE__ */ jsx("p", { children: t("guide.bestPractices.item3", { defaultValue: "Don't Crop Too Much — Excessive cropping reduces resolution and may make images blurry." }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "ic-guide-best-item", children: [
            /* @__PURE__ */ jsx("span", { className: "ic-guide-best-icon", children: "✅" }),
            /* @__PURE__ */ jsx("p", { children: t("guide.bestPractices.item4", { defaultValue: "Leave Breathing Space — Avoid tight crops—leave slight spacing around the subject for a natural look." }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "ic-guide-best-item", children: [
            /* @__PURE__ */ jsx("span", { className: "ic-guide-best-icon", children: "✅" }),
            /* @__PURE__ */ jsx("p", { children: t("guide.bestPractices.item5", { defaultValue: "Keep the Original — Always save the original image; cropped areas cannot be recovered." }) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "ic-guide-section", children: [
        /* @__PURE__ */ jsx("h3", { className: "ic-guide-h3", children: t("guide.mistakes.heading", { defaultValue: "Common Mistakes to Avoid" }) }),
        /* @__PURE__ */ jsxs("div", { className: "ic-guide-mistakes", children: [
          /* @__PURE__ */ jsx("div", { className: "ic-guide-mistake", children: t("guide.mistakes.item1", { defaultValue: "❌ Cutting off important parts (faces, edges, text)" }) }),
          /* @__PURE__ */ jsx("div", { className: "ic-guide-mistake", children: t("guide.mistakes.item2", { defaultValue: "❌ Cropping without purpose" }) }),
          /* @__PURE__ */ jsx("div", { className: "ic-guide-mistake", children: t("guide.mistakes.item3", { defaultValue: "❌ Ignoring aspect ratio" }) }),
          /* @__PURE__ */ jsx("div", { className: "ic-guide-mistake", children: t("guide.mistakes.item4", { defaultValue: "❌ Over-cropping low-resolution images" }) }),
          /* @__PURE__ */ jsx("div", { className: "ic-guide-mistake", children: t("guide.mistakes.item5", { defaultValue: "❌ Using random crop sizes across platforms" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "ic-guide-section", children: [
        /* @__PURE__ */ jsx("h3", { className: "ic-guide-h3", children: t("guide.stepByStep.heading", { defaultValue: "Step-by-Step: How to Crop an Image" }) }),
        /* @__PURE__ */ jsxs("ol", { className: "ic-guide-steps", children: [
          /* @__PURE__ */ jsx("li", { children: t("guide.stepByStep.step1", { defaultValue: "Upload your image" }) }),
          /* @__PURE__ */ jsx("li", { children: t("guide.stepByStep.step2", { defaultValue: "Select the area you want to keep" }) }),
          /* @__PURE__ */ jsx("li", { children: t("guide.stepByStep.step3", { defaultValue: "Adjust the crop box (drag edges)" }) }),
          /* @__PURE__ */ jsx("li", { children: t("guide.stepByStep.step4", { defaultValue: "Choose aspect ratio (optional)" }) }),
          /* @__PURE__ */ jsx("li", { children: t("guide.stepByStep.step5", { defaultValue: "Apply crop" }) }),
          /* @__PURE__ */ jsx("li", { children: t("guide.stepByStep.step6", { defaultValue: "Download the final image" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "ic-guide-section", children: [
        /* @__PURE__ */ jsx("h3", { className: "ic-guide-h3", children: t("guide.useCases.heading", { defaultValue: "Real Use Cases" }) }),
        /* @__PURE__ */ jsxs("div", { className: "ic-guide-usecases", children: [
          /* @__PURE__ */ jsxs("div", { className: "ic-guide-usecase", children: [
            /* @__PURE__ */ jsx("span", { className: "ic-guide-usecase-icon", children: "📱" }),
            /* @__PURE__ */ jsx("p", { children: t("guide.useCases.social", { defaultValue: "📱 Social Media Posts — Crop to square or vertical to improve engagement." }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "ic-guide-usecase", children: [
            /* @__PURE__ */ jsx("span", { className: "ic-guide-usecase-icon", children: "🌐" }),
            /* @__PURE__ */ jsx("p", { children: t("guide.useCases.website", { defaultValue: "🌐 Website Images — Remove unnecessary space and make images consistent across pages." }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "ic-guide-usecase", children: [
            /* @__PURE__ */ jsx("span", { className: "ic-guide-usecase-icon", children: "👤" }),
            /* @__PURE__ */ jsx("p", { children: t("guide.useCases.profile", { defaultValue: "👤 Profile Pictures — Crop tightly around the face and center for better visibility." }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "ic-guide-usecase", children: [
            /* @__PURE__ */ jsx("span", { className: "ic-guide-usecase-icon", children: "🛍️" }),
            /* @__PURE__ */ jsx("p", { children: t("guide.useCases.product", { defaultValue: "🛍️ Product Images — Remove background clutter and highlight the product clearly." }) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "ic-guide-section", children: [
        /* @__PURE__ */ jsx("h3", { className: "ic-guide-h3", children: t("guide.faq.heading", { defaultValue: "FAQ" }) }),
        /* @__PURE__ */ jsxs("div", { className: "ic-guide-faq", children: [
          /* @__PURE__ */ jsxs("details", { className: "ic-guide-faq-item", children: [
            /* @__PURE__ */ jsx("summary", { children: t("guide.faq.q1", { defaultValue: "Does cropping reduce image quality?" }) }),
            /* @__PURE__ */ jsx("p", { children: t("guide.faq.a1", { defaultValue: "Yes — because pixels are removed, but if done carefully the quality loss is usually not noticeable." }) })
          ] }),
          /* @__PURE__ */ jsxs("details", { className: "ic-guide-faq-item", children: [
            /* @__PURE__ */ jsx("summary", { children: t("guide.faq.q2", { defaultValue: "Can I undo cropping?" }) }),
            /* @__PURE__ */ jsx("p", { children: t("guide.faq.a2", { defaultValue: "Only if your tool supports non-destructive editing or you kept the original image." }) })
          ] }),
          /* @__PURE__ */ jsxs("details", { className: "ic-guide-faq-item", children: [
            /* @__PURE__ */ jsx("summary", { children: t("guide.faq.q3", { defaultValue: "What is the best aspect ratio?" }) }),
            /* @__PURE__ */ jsx("p", { children: t("guide.faq.a3", { defaultValue: "Depends on usage: Instagram → 1:1 or 4:5; YouTube → 16:9; Websites → varies." }) })
          ] }),
          /* @__PURE__ */ jsxs("details", { className: "ic-guide-faq-item", children: [
            /* @__PURE__ */ jsx("summary", { children: t("guide.faq.q4", { defaultValue: "Is cropping better than resizing?" }) }),
            /* @__PURE__ */ jsx("p", { children: t("guide.faq.a4", { defaultValue: "They serve different purposes: cropping changes composition, resizing changes dimensions." }) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "ic-guide-conclusion", children: [
        /* @__PURE__ */ jsx("h3", { children: t("guide.conclusionTitle", { defaultValue: "Conclusion" }) }),
        /* @__PURE__ */ jsx("p", { children: t("guide.conclusion", { defaultValue: "Image cropping is a simple but powerful way to improve composition, highlight important content, and make images fit any platform. Use the right techniques to turn an average image into a clean, professional-looking one." }) }),
        /* @__PURE__ */ jsx("a", { href: "/image-crop", className: "ic-guide-cta", onClick: (e) => {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: "smooth" });
          navigate("/image-crop");
        }, children: t("guide.ctaBtn", { defaultValue: "Try the Image Crop Tool →" }) })
      ] })
    ] })
  ] });
}
function ImageCropPage() {
  const props = useImageCrop();
  return /* @__PURE__ */ jsxs("div", { className: "image-crop-page", children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsx("main", { className: "main", children: /* @__PURE__ */ jsx("div", { className: "container", children: /* @__PURE__ */ jsx("div", { className: "card", children: /* @__PURE__ */ jsx(ImageCropView, { ...props }) }) }) }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
const FORMAT_MIME = {
  JPG: "image/jpeg",
  PNG: "image/png",
  WebP: "image/webp",
  AVIF: "image/avif",
  BMP: "image/bmp",
  GIF: "image/gif",
  ICO: "image/x-icon"
};
const EXT = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/bmp": "bmp",
  "image/gif": "gif",
  "image/x-icon": "ico"
};
const OPAQUE_FORMATS = /* @__PURE__ */ new Set(["image/jpeg", "image/bmp", "image/gif"]);
function resolveMime(file) {
  if (file.type === "image/vnd.microsoft.icon" || file.type === "image/ico") return "image/x-icon";
  if (file.type) return file.type;
  if (/\.tiff?$/i.test(file.name)) return "image/tiff";
  if (/\.svg$/i.test(file.name)) return "image/svg+xml";
  if (/\.ico$/i.test(file.name)) return "image/x-icon";
  return "";
}
function isTiff(file) {
  return file.type === "image/tiff" || /\.tiff?$/i.test(file.name);
}
function getAvailableFormats(inputMime) {
  const all = Object.keys(FORMAT_MIME);
  const inputKey = Object.entries(FORMAT_MIME).find(([, v]) => v === inputMime)?.[0];
  return inputKey ? all.filter((f) => f !== inputKey) : all;
}
function getDefaultOutputFormat(inputMime) {
  const map = {
    "image/jpeg": "PNG",
    "image/png": "JPG",
    "image/webp": "JPG",
    "image/avif": "JPG",
    "image/bmp": "PNG",
    "image/gif": "PNG",
    "image/tiff": "PNG",
    "image/svg+xml": "PNG",
    "image/x-icon": "PNG"
  };
  return map[inputMime] ?? "JPG";
}
async function buildIcoBlob(sourceCanvas, sizes) {
  const pngArrays = await Promise.all(
    sizes.map(async (sz) => {
      const c = document.createElement("canvas");
      c.width = sz;
      c.height = sz;
      c.getContext("2d").drawImage(sourceCanvas, 0, 0, sz, sz);
      const blob = await new Promise((res) => c.toBlob(res, "image/png"));
      return new Uint8Array(await blob.arrayBuffer());
    })
  );
  const count = sizes.length;
  const dataOffset = 6 + 16 * count;
  let totalSize = dataOffset;
  for (const p of pngArrays) totalSize += p.length;
  const buf = new ArrayBuffer(totalSize);
  const dv = new DataView(buf);
  dv.setUint16(0, 0, true);
  dv.setUint16(2, 1, true);
  dv.setUint16(4, count, true);
  let imgOffset = dataOffset;
  for (let i = 0; i < count; i++) {
    const sz = sizes[i];
    const png = pngArrays[i];
    const de = 6 + i * 16;
    dv.setUint8(de + 0, sz >= 256 ? 0 : sz);
    dv.setUint8(de + 1, sz >= 256 ? 0 : sz);
    dv.setUint8(de + 2, 0);
    dv.setUint8(de + 3, 0);
    dv.setUint16(de + 4, 1, true);
    dv.setUint16(de + 6, 32, true);
    dv.setUint32(de + 8, png.length, true);
    dv.setUint32(de + 12, imgOffset, true);
    new Uint8Array(buf, imgOffset, png.length).set(png);
    imgOffset += png.length;
  }
  return new Blob([buf], { type: "image/x-icon" });
}
function buildBmpBlob(canvas2) {
  const ctx = canvas2.getContext("2d");
  const { width, height } = canvas2;
  const data = ctx.getImageData(0, 0, width, height).data;
  const rowSize = Math.floor((24 * width + 31) / 32) * 4;
  const pixelBytes = rowSize * height;
  const fileSize = 54 + pixelBytes;
  const buf = new ArrayBuffer(fileSize);
  const v = new DataView(buf);
  v.setUint8(0, 66);
  v.setUint8(1, 77);
  v.setUint32(2, fileSize, true);
  v.setUint32(6, 0, true);
  v.setUint32(10, 54, true);
  v.setUint32(14, 40, true);
  v.setInt32(18, width, true);
  v.setInt32(22, height, true);
  v.setUint16(26, 1, true);
  v.setUint16(28, 24, true);
  v.setUint32(30, 0, true);
  v.setUint32(34, pixelBytes, true);
  v.setInt32(38, 2835, true);
  v.setInt32(42, 2835, true);
  v.setUint32(46, 0, true);
  v.setUint32(50, 0, true);
  for (let y = 0; y < height; y++) {
    const rowOff = 54 + (height - 1 - y) * rowSize;
    for (let x = 0; x < width; x++) {
      const si = (y * width + x) * 4;
      const di = rowOff + x * 3;
      v.setUint8(di, data[si + 2]);
      v.setUint8(di + 1, data[si + 1]);
      v.setUint8(di + 2, data[si + 0]);
    }
  }
  return new Blob([buf], { type: "image/bmp" });
}
async function tiffToCanvas(file) {
  const mod = await import("utif");
  const UTIF = mod.default ?? mod;
  const buffer = await file.arrayBuffer();
  const ifds = UTIF.decode(buffer);
  UTIF.decodeImage(buffer, ifds[0]);
  const rgba = UTIF.toRGBA8(ifds[0]);
  const { width, height } = ifds[0];
  const canvas2 = document.createElement("canvas");
  canvas2.width = width;
  canvas2.height = height;
  canvas2.getContext("2d").putImageData(
    new ImageData(new Uint8ClampedArray(rgba), width, height),
    0,
    0
  );
  return canvas2;
}
async function fileToCanvas(file, fillOpaque) {
  const canvas2 = document.createElement("canvas");
  await new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => {
      canvas2.width = img.naturalWidth || img.width;
      canvas2.height = img.naturalHeight || img.height;
      const ctx = canvas2.getContext("2d");
      if (fillOpaque) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas2.width, canvas2.height);
      }
      ctx.drawImage(img, 0, 0);
      resolve();
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
  return canvas2;
}
async function canvasToGifBlob(canvas2) {
  const { GIFEncoder, quantize, applyPalette } = await import("gifenc");
  const { width, height } = canvas2;
  const data = canvas2.getContext("2d").getImageData(0, 0, width, height).data;
  const palette = quantize(data, 256);
  const index = applyPalette(data, palette);
  const gif = GIFEncoder();
  gif.writeFrame(index, width, height, { palette });
  gif.finish();
  return new Blob([gif.bytes()], { type: "image/gif" });
}
function useImageConverter() {
  const [mainImages, setMainImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputMime, setInputMime] = useState(null);
  const [outputFormat, setOutputFormat] = useState("JPG");
  const [availableFormats, setAvailableFormats] = useState(Object.keys(FORMAT_MIME));
  const [outputUrls, setOutputUrls] = useState([]);
  const [outputNames, setOutputNames] = useState([]);
  const [convertedFormat, setConvertedFormat] = useState(null);
  const [icoSize2, setIcoSize] = useState(256);
  const [status2, setStatus] = useState("idle");
  const [errorMsg2, setErrorMsg] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef();
  const processFiles = async (files) => {
    if (!files) return;
    const { normalizeImageFiles: normalizeImageFiles2 } = await Promise.resolve().then(() => normalizeImageFiles$1);
    const normalized = await normalizeImageFiles2(files instanceof FileList ? files : Array.from(files));
    const arr = normalized.filter((f) => resolveMime(f).startsWith("image/"));
    if (!arr.length) {
      setErrorMsg("Please select valid image files.");
      return;
    }
    const mime = resolveMime(arr[0]);
    setMainImages(arr);
    setCurrentIndex(0);
    setOutputUrls([]);
    setOutputNames([]);
    setErrorMsg("");
    setInputMime(mime);
    setAvailableFormats(arr.length > 1 ? Object.keys(FORMAT_MIME) : getAvailableFormats(mime));
    setOutputFormat(getDefaultOutputFormat(mime));
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  };
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const handleFileInput = (e) => {
    processFiles(e.target.files);
  };
  const handleConvertAll = async () => {
    if (!mainImages.length) return;
    setStatus("processing");
    setErrorMsg("");
    const newUrls = [];
    const newNames = [];
    try {
      const targetMime = FORMAT_MIME[outputFormat];
      const fillOpaque = OPAQUE_FORMATS.has(targetMime);
      for (const file of mainImages) {
        let canvas2;
        if (isTiff(file)) {
          canvas2 = await tiffToCanvas(file);
          if (fillOpaque) {
            const tmp = document.createElement("canvas");
            tmp.width = canvas2.width;
            tmp.height = canvas2.height;
            const ctx = tmp.getContext("2d");
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, tmp.width, tmp.height);
            ctx.drawImage(canvas2, 0, 0);
            canvas2 = tmp;
          }
        } else {
          canvas2 = await fileToCanvas(file, fillOpaque);
        }
        let blob;
        if (targetMime === "image/bmp") {
          blob = buildBmpBlob(canvas2);
        } else if (targetMime === "image/gif") {
          blob = await canvasToGifBlob(canvas2);
        } else if (targetMime === "image/x-icon") {
          blob = await buildIcoBlob(canvas2, [icoSize2]);
        } else {
          blob = await new Promise((resolve) => {
            canvas2.toBlob(
              resolve,
              targetMime,
              targetMime === "image/jpeg" ? 0.92 : void 0
            );
          });
        }
        if (!blob) {
          setErrorMsg(
            `Conversion to ${outputFormat} failed for "${file.name}". Your browser may not support encoding to this format.`
          );
          setStatus("idle");
          return;
        }
        const baseName = file.name.replace(/\.[^.]+$/, "");
        const ext = EXT[targetMime] || outputFormat.toLowerCase();
        newUrls.push(URL.createObjectURL(blob));
        newNames.push(`${baseName}-converted.${ext}`);
      }
      setOutputUrls(newUrls);
      setOutputNames(newNames);
      setConvertedFormat(outputFormat);
      setCurrentIndex(0);
    } catch (err) {
      setErrorMsg("Conversion failed: " + (err?.message ?? "Unknown error"));
    }
    setStatus("idle");
  };
  const handleClear = () => {
    setMainImages([]);
    setCurrentIndex(0);
    setInputMime(null);
    setOutputUrls([]);
    setOutputNames([]);
    setConvertedFormat(null);
    setErrorMsg("");
    setStatus("idle");
    setAvailableFormats(Object.keys(FORMAT_MIME));
    setOutputFormat("JPG");
    setIcoSize(256);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  return {
    mainImages,
    currentIndex,
    setCurrentIndex,
    inputMime,
    outputFormat,
    setOutputFormat,
    availableFormats,
    outputUrls,
    outputNames,
    convertedFormat,
    icoSize: icoSize2,
    setIcoSize,
    status: status2,
    errorMsg: errorMsg2,
    isDragging,
    fileInputRef,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    handleFileInput,
    handleConvertAll,
    handleClear
  };
}
function DraggablePreview({ src, alt }) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [dragging, setDragging] = useState(false);
  const viewportRef = useRef(null);
  const startRef = useRef(null);
  const pinchRef = useRef(null);
  const scaleRef = useRef(1);
  scaleRef.current = scale;
  const prevSrc = useRef(null);
  if (prevSrc.current !== src) {
    prevSrc.current = src;
    Promise.resolve().then(() => {
      setOffset({ x: 0, y: 0 });
      setScale(1);
    });
  }
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const pinchDist = (touches) => Math.hypot(touches[0].clientX - touches[1].clientX, touches[0].clientY - touches[1].clientY);
    const onWheel = (e) => {
      if (!e.altKey) return;
      e.preventDefault();
      setScale((s) => Math.min(8, Math.max(0.25, s * (e.deltaY < 0 ? 1.1 : 0.9))));
    };
    const onTouchMovePinch = (e) => {
      if (e.touches.length === 2 && pinchRef.current) {
        e.preventDefault();
        const ratio = pinchDist(e.touches) / pinchRef.current.startDist;
        setScale(Math.min(8, Math.max(0.25, pinchRef.current.startScale * ratio)));
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("touchmove", onTouchMovePinch, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("touchmove", onTouchMovePinch);
    };
  }, []);
  const onMouseDown = useCallback((e) => {
    e.preventDefault();
    setDragging(true);
    startRef.current = { mx: e.clientX, my: e.clientY, ox: offset.x, oy: offset.y };
  }, [offset]);
  const onMouseMove = useCallback((e) => {
    if (!dragging || !startRef.current) return;
    setOffset({ x: startRef.current.ox + (e.clientX - startRef.current.mx), y: startRef.current.oy + (e.clientY - startRef.current.my) });
  }, [dragging]);
  const onMouseUp = useCallback(() => setDragging(false), []);
  const onTouchStart = useCallback((e) => {
    if (e.touches.length === 2) {
      pinchRef.current = {
        startDist: Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY),
        startScale: scaleRef.current
      };
      setDragging(false);
    } else {
      const t = e.touches[0];
      setDragging(true);
      startRef.current = { mx: t.clientX, my: t.clientY, ox: offset.x, oy: offset.y };
    }
  }, [offset]);
  const onTouchMove = useCallback((e) => {
    if (e.touches.length !== 1 || !dragging || !startRef.current) return;
    e.preventDefault();
    const t = e.touches[0];
    setOffset({ x: startRef.current.ox + (t.clientX - startRef.current.mx), y: startRef.current.oy + (t.clientY - startRef.current.my) });
  }, [dragging]);
  const onTouchEnd = useCallback((e) => {
    if (e.touches.length < 2) pinchRef.current = null;
    if (e.touches.length === 0) setDragging(false);
  }, []);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      ref: viewportRef,
      className: `ic-drag-viewport${dragging ? " dragging" : ""}`,
      onMouseMove,
      onMouseUp,
      onMouseLeave: onMouseUp,
      children: [
        /* @__PURE__ */ jsx(
          "img",
          {
            src,
            alt,
            className: "ic-drag-image",
            style: { transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px)) scale(${scale})` },
            onMouseDown,
            onTouchStart,
            onTouchMove,
            onTouchEnd,
            draggable: false
          }
        ),
        /* @__PURE__ */ jsx("span", { className: "ic-drag-hint", children: "Alt+Scroll to zoom · Drag to pan" })
      ]
    }
  );
}
function ImageConverterView({
  mainImages,
  currentIndex,
  setCurrentIndex,
  inputMime,
  outputFormat,
  setOutputFormat,
  availableFormats,
  outputUrls,
  outputNames,
  convertedFormat,
  status: status2,
  errorMsg: errorMsg2,
  isDragging,
  fileInputRef,
  handleDrop,
  handleDragOver,
  handleDragLeave,
  handleFileInput,
  handleConvertAll,
  handleClear,
  icoSize: icoSize2,
  setIcoSize
}) {
  const [openPanel, setOpenPanel] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation("imageConverter");
  const formatDefaultLabels = {
    JPG: "JPG",
    PNG: "PNG",
    WebP: "WebP",
    AVIF: "AVIF",
    BMP: "BMP",
    GIF: "GIF",
    ICO: "ICO"
  };
  const formatDefaultDesc = {
    JPG: "Best for photos. Smaller file, lossy compression.",
    PNG: "Best for graphics with transparency. Lossless quality.",
    WebP: "Modern format. Smaller than JPG & PNG with great quality.",
    AVIF: "Next-gen format. Best compression. Chrome & Firefox recommended.",
    BMP: "Uncompressed bitmap. Lossless, large file. Max compatibility.",
    GIF: "256-color format. Best for simple graphics, not photos.",
    ICO: "Windows icon format. Choose which sizes to include."
  };
  const fmtLabel = (fmt) => t(`formats.${fmt.toLowerCase()}`, { defaultValue: formatDefaultLabels[fmt] || fmt });
  const fmtDesc = (fmt) => t(`formats.${fmt.toLowerCase()}Desc`, { defaultValue: formatDefaultDesc[fmt] || "" });
  useEffect(() => {
    if (outputUrls && outputUrls[currentIndex]) setPreviewOpen(true);
  }, [outputUrls, currentIndex]);
  return /* @__PURE__ */ jsxs("div", { className: "ic-view", children: [
    /* @__PURE__ */ jsx("h2", { className: "hero-title", children: t("hero.title") }),
    /* @__PURE__ */ jsxs("p", { className: "hero-tagline", children: [
      t("hero.tagline"),
      " ",
      /* @__PURE__ */ jsx(Link, { to: "/blogs/image-converter-guide", children: t("hero.blogLink") })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "ir-tip-banner", children: [
      /* @__PURE__ */ jsx("span", { className: "ir-tip-text", children: t("hint.text") }),
      /* @__PURE__ */ jsx("button", { className: "ir-tip-btn", onClick: () => navigate("/image-resizer"), children: t("hint.btn") })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "details-row", "data-open": openPanel, children: [
      /* @__PURE__ */ jsxs("div", { className: "details-controls", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            className: `tab-btn ${openPanel === "details" ? "active" : ""}`,
            onClick: () => setOpenPanel((p) => p === "details" ? "" : "details"),
            "aria-expanded": openPanel === "details",
            type: "button",
            children: t("tabs.details")
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            className: `tab-btn ${openPanel === "howitworks" ? "active" : ""}`,
            onClick: () => setOpenPanel((p) => p === "howitworks" ? "" : "howitworks"),
            "aria-expanded": openPanel === "howitworks",
            type: "button",
            children: t("tabs.howItWorks")
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: `shared-collapse${!openPanel ? " panel-hidden" : ""}`, children: [
        /* @__PURE__ */ jsxs("div", { className: openPanel !== "details" ? "details-content panel-hidden" : "details-content", children: [
          /* @__PURE__ */ jsx("h3", { children: t("guide.toolTitle", { defaultValue: "What is Image Converter" }) }),
          /* @__PURE__ */ jsx("p", { children: t("guide.toolLead", { defaultValue: "The Image Converter lets you convert images between common web formats — JPG, PNG, and WebP — directly in your browser. No file is ever sent to a server." }) }),
          /* @__PURE__ */ jsx("h3", { children: t("guide.outputFormatsTitle", { defaultValue: "Supported Output Formats" }) }),
          /* @__PURE__ */ jsxs("ul", { children: [
            /* @__PURE__ */ jsxs("li", { children: [
              /* @__PURE__ */ jsx("strong", { children: t("formats.jpg", { defaultValue: "JPG" }) }),
              " — ",
              t("formats.jpgDesc", { defaultValue: "Lossy compression ideal for photographs. Produces smaller files at the cost of some quality." })
            ] }),
            /* @__PURE__ */ jsxs("li", { children: [
              /* @__PURE__ */ jsx("strong", { children: t("formats.png", { defaultValue: "PNG" }) }),
              " — ",
              t("formats.pngDesc", { defaultValue: "Lossless format that preserves every pixel. Supports transparency. Best for logos, screenshots, and graphics." })
            ] }),
            /* @__PURE__ */ jsxs("li", { children: [
              /* @__PURE__ */ jsx("strong", { children: t("formats.webp", { defaultValue: "WebP" }) }),
              " — ",
              t("formats.webpDesc", { defaultValue: "Modern format by Google. Smaller files than JPG & PNG with great quality." })
            ] }),
            /* @__PURE__ */ jsxs("li", { children: [
              /* @__PURE__ */ jsx("strong", { children: t("formats.avif", { defaultValue: "AVIF" }) }),
              " — ",
              t("formats.avifDesc", { defaultValue: "Next-gen format with superior compression. Supported in modern browsers." })
            ] }),
            /* @__PURE__ */ jsxs("li", { children: [
              /* @__PURE__ */ jsx("strong", { children: t("formats.bmp", { defaultValue: "BMP" }) }),
              " — ",
              t("formats.bmpDesc", { defaultValue: "Uncompressed bitmap. Lossless, large file. Max compatibility." })
            ] }),
            /* @__PURE__ */ jsxs("li", { children: [
              /* @__PURE__ */ jsx("strong", { children: t("formats.gif", { defaultValue: "GIF" }) }),
              " — ",
              t("formats.gifDesc", { defaultValue: "256-color format. Best for simple graphics, not photos." })
            ] }),
            /* @__PURE__ */ jsxs("li", { children: [
              /* @__PURE__ */ jsx("strong", { children: t("formats.ico", { defaultValue: "ICO" }) }),
              " — ",
              t("formats.icoDesc", { defaultValue: "Windows icon format. Automatically generates multiple sizes for favicons." })
            ] })
          ] }),
          /* @__PURE__ */ jsx("h3", { children: t("guide.inputFormatsTitle", { defaultValue: "Supported Input Formats" }) }),
          /* @__PURE__ */ jsx("p", { children: t("guide.inputFormatsBody", { defaultValue: "You can upload JPG, PNG, WebP, AVIF, GIF, BMP, ICO, SVG, and TIFF files. Animated GIFs are converted using the first frame only." }) }),
          /* @__PURE__ */ jsx("h3", { children: t("guide.howItWorksTitle", { defaultValue: "How conversion works" }) }),
          /* @__PURE__ */ jsx("p", { children: t("guide.howItWorksBody", { defaultValue: "Your image is decoded in the browser, drawn onto an offscreen canvas, and exported to the target format. TIFF files are decoded using a lightweight JS library. For formats that don’t support transparency (JPG, BMP, GIF), transparent areas are filled with white." }) }),
          /* @__PURE__ */ jsx("h3", { children: t("guide.faqTitle", { defaultValue: "FAQs" }) }),
          /* @__PURE__ */ jsxs("ul", { children: [
            /* @__PURE__ */ jsxs("li", { children: [
              /* @__PURE__ */ jsx("strong", { children: t("guide.faq.q1", { defaultValue: "Does my image leave my browser?" }) }),
              " ",
              t("guide.faq.a1", { defaultValue: "No. All processing is done locally; nothing is uploaded." })
            ] }),
            /* @__PURE__ */ jsxs("li", { children: [
              /* @__PURE__ */ jsx("strong", { children: t("guide.faq.q2", { defaultValue: "Why is AVIF not working?" }) }),
              " ",
              t("guide.faq.a2", { defaultValue: "AVIF encoding requires a modern browser; older browsers may not support it." })
            ] }),
            /* @__PURE__ */ jsxs("li", { children: [
              /* @__PURE__ */ jsx("strong", { children: t("guide.faq.q3", { defaultValue: "What happens to transparency when converting to JPG, BMP, or GIF?" }) }),
              " ",
              t("guide.faq.a3", { defaultValue: "Transparent areas are filled with white." })
            ] }),
            /* @__PURE__ */ jsxs("li", { children: [
              /* @__PURE__ */ jsx("strong", { children: t("guide.faq.q4", { defaultValue: "Why does GIF look bad for photos?" }) }),
              " ",
              t("guide.faq.a4", { defaultValue: "GIF supports only 256 colors; use PNG or WebP for photos." })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: openPanel !== "howitworks" ? "howitworks-content panel-hidden" : "howitworks-content", children: /* @__PURE__ */ jsxs("ol", { style: { margin: 0, paddingLeft: "1rem" }, children: [
          /* @__PURE__ */ jsxs("li", { style: { marginBottom: "0.75rem" }, children: [
            /* @__PURE__ */ jsx("img", { src: "/screenshots/image-converter/image-converter-001.png", alt: t("howItWorks.imgAlt.step1", { defaultValue: "Step 1" }), className: "how-img" }),
            /* @__PURE__ */ jsx("p", { children: t("howItWorks.step1", { defaultValue: "Drag & drop an image onto the upload area, or click it to browse for a file." }) })
          ] }),
          /* @__PURE__ */ jsxs("li", { style: { marginBottom: "0.75rem" }, children: [
            /* @__PURE__ */ jsx("img", { src: "/screenshots/image-converter/image-converter-002.png", alt: t("howItWorks.imgAlt.step2", { defaultValue: "Step 2" }), className: "how-img" }),
            /* @__PURE__ */ jsx("p", { children: t("howItWorks.step2", { defaultValue: "Select your desired output format from the format buttons. The tool auto-selects a sensible default based on your input." }) })
          ] }),
          /* @__PURE__ */ jsxs("li", { style: { marginBottom: "0.75rem" }, children: [
            /* @__PURE__ */ jsx("img", { src: "/screenshots/image-converter/image-converter-003.png", alt: t("howItWorks.imgAlt.step3", { defaultValue: "Step 3" }), className: "how-img" }),
            /* @__PURE__ */ jsx("p", { dangerouslySetInnerHTML: { __html: t("howItWorks.step3a", { defaultValue: "Click <strong>Convert</strong> to process the image instantly in your browser." }) } }),
            /* @__PURE__ */ jsx("p", { dangerouslySetInnerHTML: { __html: t("howItWorks.step3b", { defaultValue: "Download your converted image with the <strong>Download</strong> button." }) } })
          ] }),
          /* @__PURE__ */ jsxs("li", { children: [
            /* @__PURE__ */ jsx("img", { src: "/screenshots/image-converter/image-converter-004.png", alt: t("howItWorks.imgAlt.step4", { defaultValue: "Step 4" }), className: "how-img" }),
            /* @__PURE__ */ jsx("p", { children: t("howItWorks.step4", { defaultValue: "You can also convert multiple images at once by selecting more than one file." }) })
          ] })
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: `ic-drop-zone${isDragging ? " dragging" : ""}`,
        onDrop: handleDrop,
        onDragOver: handleDragOver,
        onDragLeave: handleDragLeave,
        onClick: () => fileInputRef.current && fileInputRef.current.click(),
        children: [
          mainImages && mainImages.length ? (() => {
            const displayCount = Math.min(8, mainImages.length);
            const spacing = 22;
            const thumbW = 200;
            const containerW = (displayCount - 1) * spacing + thumbW + 8;
            return /* @__PURE__ */ jsxs(
              "div",
              {
                className: "ic-overlap-stack",
                onClick: (e) => {
                  e.stopPropagation();
                },
                style: { width: containerW },
                children: [
                  mainImages.slice(0, displayCount).map((f, i) => {
                    const left = i * spacing - (displayCount - 1) * spacing / 2 + (containerW / 2 - thumbW / 2);
                    return /* @__PURE__ */ jsx(
                      "img",
                      {
                        src: URL.createObjectURL(f),
                        alt: `upload-${i}`,
                        className: "ic-stacked-thumb",
                        style: { left: `${left}px`, zIndex: 1 + i },
                        onClick: (ev) => {
                          ev.stopPropagation();
                          setCurrentIndex(i);
                        }
                      },
                      i
                    );
                  }),
                  mainImages.length > 8 && /* @__PURE__ */ jsxs(
                    "div",
                    {
                      className: "ic-stack-more",
                      style: { left: `${displayCount * spacing - (displayCount - 1) * spacing / 2 + (containerW / 2 - thumbW / 2)}px` },
                      children: [
                        "+",
                        mainImages.length - 8
                      ]
                    }
                  )
                ]
              }
            );
          })() : /* @__PURE__ */ jsxs("div", { className: "ic-drop-placeholder", children: [
            /* @__PURE__ */ jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "40", height: "40", viewBox: "0 0 24 24", fill: "none", stroke: "#a0aec0", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: [
              /* @__PURE__ */ jsx("rect", { x: "3", y: "3", width: "18", height: "18", rx: "2", ry: "2" }),
              /* @__PURE__ */ jsx("circle", { cx: "8.5", cy: "8.5", r: "1.5" }),
              /* @__PURE__ */ jsx("polyline", { points: "21 15 16 10 5 21" })
            ] }),
            /* @__PURE__ */ jsx("span", { className: "ic-drop-text", children: t("dropZone.text") }),
            /* @__PURE__ */ jsx("span", { className: "ic-drop-hint", children: t("dropZone.hint") })
          ] }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "file",
              accept: "image/*,.heic,.heif",
              multiple: true,
              style: { display: "none" },
              ref: fileInputRef,
              onChange: handleFileInput
            }
          )
        ]
      }
    ),
    mainImages && mainImages.length > 0 && /* @__PURE__ */ jsxs("div", { className: "ic-file-row", children: [
      /* @__PURE__ */ jsx("span", { className: "ic-file-name", children: mainImages.length === 1 ? mainImages[0].name : t("fileRow.count", { count: mainImages.length }) }),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          className: "ic-change-btn",
          onClick: () => fileInputRef.current && fileInputRef.current.click(),
          children: mainImages.length === 1 ? t("fileRow.changeOne") : t("fileRow.changeMany")
        }
      ),
      /* @__PURE__ */ jsx("button", { type: "button", className: "ic-clear-btn", onClick: handleClear, children: t("fileRow.clear") })
    ] }),
    previewOpen && outputUrls && outputUrls.length > 0 && outputUrls[currentIndex] && /* @__PURE__ */ jsx("div", { className: "ic-popup-overlay", onClick: () => setPreviewOpen(false), children: /* @__PURE__ */ jsxs("div", { className: "ic-popup-dialog", onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsx("button", { className: "ic-popup-close-btn", onClick: () => setPreviewOpen(false), children: "×" }),
      /* @__PURE__ */ jsxs("p", { className: "ic-output-label", style: { margin: "0 0 0.5rem" }, children: [
        "✓ Converted to ",
        convertedFormat,
        outputUrls.length > 1 && ` (${currentIndex + 1} / ${outputUrls.length})`
      ] }),
      /* @__PURE__ */ jsx(DraggablePreview, { src: outputUrls[currentIndex], alt: `Converted output ${currentIndex + 1}` }),
      outputUrls.length > 1 && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            className: "ic-btn ic-popup-nav-btn ic-popup-nav-prev",
            onClick: () => setCurrentIndex((i) => Math.max(0, i - 1)),
            disabled: currentIndex === 0,
            children: t("popup.prev")
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            className: "ic-btn ic-popup-nav-btn ic-popup-nav-next",
            onClick: () => setCurrentIndex((i) => Math.min(outputUrls.length - 1, i + 1)),
            disabled: currentIndex >= outputUrls.length - 1,
            children: t("popup.next")
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "ic-format-section", children: [
      /* @__PURE__ */ jsx("p", { className: "ic-format-label", children: t("format.label") }),
      /* @__PURE__ */ jsx("div", { className: "ic-format-buttons", children: availableFormats.map((fmt) => /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          className: `ic-format-btn${outputFormat === fmt ? " active" : ""}`,
          onClick: () => setOutputFormat(fmt),
          children: [
            /* @__PURE__ */ jsx("span", { className: "ic-fmt-name", children: fmtLabel(fmt) }),
            /* @__PURE__ */ jsx("span", { className: "ic-fmt-desc", children: fmtDesc(fmt) })
          ]
        },
        fmt
      )) })
    ] }),
    outputFormat === "ICO" && /* @__PURE__ */ jsxs("div", { className: "ic-ico-sizes", children: [
      /* @__PURE__ */ jsx("p", { className: "ic-ico-sizes-label", children: t("icoSize.label") }),
      /* @__PURE__ */ jsx("div", { className: "ic-ico-sizes-options", children: [16, 32, 48, 256].map((sz) => /* @__PURE__ */ jsxs("label", { className: "ic-ico-size-check", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "radio",
            name: "ico-size",
            checked: icoSize2 === sz,
            onChange: () => setIcoSize(sz)
          }
        ),
        sz,
        "×",
        sz
      ] }, sz)) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "ic-actions", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          className: "ic-btn ic-btn-primary",
          onClick: handleConvertAll,
          disabled: !mainImages.length || status2 === "processing",
          children: status2 === "processing" ? t("actions.converting") : mainImages.length > 1 ? t("actions.convertAll", { count: mainImages.length }) : t("actions.convert")
        }
      ),
      mainImages.length <= 1 && outputUrls && outputUrls[0] && /* @__PURE__ */ jsx(
        "button",
        {
          className: "ic-btn ic-btn-download",
          onClick: () => {
            const link = document.createElement("a");
            link.href = outputUrls[0];
            link.download = outputNames[0] || "converted-image";
            document.body.appendChild(link);
            link.click();
            link.remove();
          },
          children: t("actions.download")
        }
      ),
      mainImages.length > 1 && outputUrls && outputUrls.some(Boolean) && /* @__PURE__ */ jsx(
        "button",
        {
          className: "ic-btn ic-btn-download",
          onClick: async () => {
            const zip = new JSZip();
            const fetches = outputUrls.map((url, i) => {
              if (!url) return null;
              return fetch(url).then((r) => r.blob()).then((blob2) => {
                zip.file(outputNames[i] || `converted-${i + 1}`, blob2);
              });
            });
            await Promise.all(fetches.filter(Boolean));
            const blob = await zip.generateAsync({ type: "blob" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "converted-images.zip";
            document.body.appendChild(link);
            link.click();
            link.remove();
          },
          children: t("actions.downloadAll")
        }
      )
    ] }),
    errorMsg2 && /* @__PURE__ */ jsx("div", { className: "ic-error", role: "alert", children: errorMsg2 }),
    /* @__PURE__ */ jsxs("section", { className: "ic-guide ic-guide-convert", children: [
      /* @__PURE__ */ jsxs("div", { className: "ic-guide-article", children: [
        /* @__PURE__ */ jsx("h3", { className: "ic-guide-title", children: t("guide.title", { defaultValue: "Why Image Formats Matter (And How to Convert Images the Right Way)" }) }),
        /* @__PURE__ */ jsx("p", { className: "ic-lead", children: t("guide.introLead", { defaultValue: "You try to upload an image… and suddenly:" }) }),
        /* @__PURE__ */ jsxs("ul", { className: "ic-bullet-list", children: [
          /* @__PURE__ */ jsx("li", { children: t("guide.introBullet1", { defaultValue: '"File format not supported"' }) }),
          /* @__PURE__ */ jsx("li", { children: t("guide.introBullet2", { defaultValue: "Image won’t open on another device" }) }),
          /* @__PURE__ */ jsx("li", { children: t("guide.introBullet3", { defaultValue: "File size is too large" }) })
        ] }),
        /* @__PURE__ */ jsx("p", { children: t("guide.introConclusion", { defaultValue: "These issues usually come down to one thing: image format. In this guide you’ll learn why formats exist, when to convert them, which format to choose, and how to convert without losing quality." }) }),
        /* @__PURE__ */ jsxs("section", { className: "ic-section", children: [
          /* @__PURE__ */ jsx("h4", { children: t("guide.why.heading", { defaultValue: "Why Do Image Formats Even Exist?" }) }),
          /* @__PURE__ */ jsx("p", { children: t("guide.why.body", { defaultValue: "Different formats exist because they serve different purposes: performance (smaller file size), quality (more detail), and compatibility (works everywhere). One format rarely fits all situations." }) })
        ] }),
        /* @__PURE__ */ jsxs("section", { className: "ic-section", children: [
          /* @__PURE__ */ jsx("h4", { children: t("guide.whatIs.heading", { defaultValue: "What Is Image Conversion?" }) }),
          /* @__PURE__ */ jsx("p", { children: t("guide.whatIs.body", { defaultValue: "Image conversion means changing an image from one format to another (for example PNG → JPG or HEIC → JPG). The image content stays the same, but file size, quality, and compatibility can change." }) })
        ] }),
        /* @__PURE__ */ jsxs("section", { className: "ic-section", children: [
          /* @__PURE__ */ jsx("h4", { children: t("guide.whenToConvert.heading", { defaultValue: "When Do You Need to Convert Images?" }) }),
          /* @__PURE__ */ jsxs("ol", { className: "ic-quick-steps", children: [
            /* @__PURE__ */ jsx("li", { children: t("guide.whenToConvert.item1", { defaultValue: "Upload Errors: Some platforms accept only specific formats." }) }),
            /* @__PURE__ */ jsx("li", { children: t("guide.whenToConvert.item2", { defaultValue: "File Size Too Large: Convert heavy formats like PNG to JPG/WebP to reduce size." }) }),
            /* @__PURE__ */ jsx("li", { children: t("guide.whenToConvert.item3", { defaultValue: "Device Compatibility: Convert HEIC from iPhones to JPG for wider support." }) }),
            /* @__PURE__ */ jsx("li", { children: t("guide.whenToConvert.item4", { defaultValue: "Web Optimization: Modern sites prefer WebP for smaller files and faster loading." }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("section", { className: "ic-section", children: [
          /* @__PURE__ */ jsx("h4", { children: t("guide.formats.heading", { defaultValue: "Most Common Image Formats (Quick Guide)" }) }),
          /* @__PURE__ */ jsxs("div", { className: "ic-format-grid", children: [
            /* @__PURE__ */ jsx("div", { className: "ic-format-pill ic-pill-jpg", children: t("guide.formats.jpg", { defaultValue: "JPEG (JPG) — Best for photos — small files, no transparency" }) }),
            /* @__PURE__ */ jsx("div", { className: "ic-format-pill ic-pill-png", children: t("guide.formats.png", { defaultValue: "PNG — High quality, supports transparency" }) }),
            /* @__PURE__ */ jsx("div", { className: "ic-format-pill ic-pill-webp", children: t("guide.formats.webp", { defaultValue: "WebP — Modern — smaller size with good quality" }) }),
            /* @__PURE__ */ jsx("div", { className: "ic-format-pill ic-pill-heic", children: t("guide.formats.heic", { defaultValue: "HEIC — Used by iPhones — efficient but limited support" }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("section", { className: "ic-section", children: [
          /* @__PURE__ */ jsx("h4", { children: t("guide.bestPractices.heading", { defaultValue: "Best Practices for Converting Images" }) }),
          /* @__PURE__ */ jsxs("ul", { className: "ic-checklist", children: [
            /* @__PURE__ */ jsx("li", { children: t("guide.bestPractices.item1", { defaultValue: "Choose format by use case — WebP for web, JPG for photos, PNG for graphics." }) }),
            /* @__PURE__ */ jsx("li", { children: t("guide.bestPractices.item2", { defaultValue: "Avoid repeated conversions — always convert from the original." }) }),
            /* @__PURE__ */ jsx("li", { children: t("guide.bestPractices.item3", { defaultValue: "Understand lossy vs lossless: JPG is lossy, PNG is lossless." }) }),
            /* @__PURE__ */ jsx("li", { children: t("guide.bestPractices.item4", { defaultValue: "Balance quality and size — pick a middle ground." }) }),
            /* @__PURE__ */ jsx("li", { children: t("guide.bestPractices.item5", { defaultValue: "Use a reliable tool that preserves quality and supports many formats." }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("section", { className: "ic-section", children: [
          /* @__PURE__ */ jsx("h4", { children: t("guide.mistakes.heading", { defaultValue: "Common Mistakes to Avoid" }) }),
          /* @__PURE__ */ jsxs("ul", { className: "ic-xlist", children: [
            /* @__PURE__ */ jsx("li", { children: t("guide.mistakes.item1", { defaultValue: "Converting PNG → JPG (losing transparency)" }) }),
            /* @__PURE__ */ jsx("li", { children: t("guide.mistakes.item2", { defaultValue: "Repeatedly converting the same file" }) }),
            /* @__PURE__ */ jsx("li", { children: t("guide.mistakes.item3", { defaultValue: "Using the wrong format for the use case" }) }),
            /* @__PURE__ */ jsx("li", { children: t("guide.mistakes.item4", { defaultValue: "Ignoring quality settings" }) }),
            /* @__PURE__ */ jsx("li", { children: t("guide.mistakes.item5", { defaultValue: "Uploading huge images without optimization" }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("section", { className: "ic-section", children: [
          /* @__PURE__ */ jsx("h4", { children: t("guide.stepByStep.heading", { defaultValue: "Step-by-Step: How to Convert an Image" }) }),
          /* @__PURE__ */ jsxs("ol", { className: "ic-steps-compact", children: [
            /* @__PURE__ */ jsx("li", { children: t("guide.stepByStep.step1", { defaultValue: "Upload your image" }) }),
            /* @__PURE__ */ jsx("li", { children: t("guide.stepByStep.step2", { defaultValue: "Select output format" }) }),
            /* @__PURE__ */ jsx("li", { children: t("guide.stepByStep.step3", { defaultValue: "Adjust quality settings (if available)" }) }),
            /* @__PURE__ */ jsx("li", { children: t("guide.stepByStep.step4", { defaultValue: "Convert the image" }) }),
            /* @__PURE__ */ jsx("li", { children: t("guide.stepByStep.step5", { defaultValue: "Download the result" }) })
          ] })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "ic-conclusion", children: t("guide.conclusion", { defaultValue: "Image conversion isn’t just technical — it’s essential for compatibility, performance, and usability. By picking the right format you can avoid upload errors, improve speed, and keep good quality." }) })
      ] }),
      /* @__PURE__ */ jsx("aside", { className: "ic-guide-aside", children: /* @__PURE__ */ jsxs("div", { className: "ic-aside-card", children: [
        /* @__PURE__ */ jsx("h5", { children: t("guide.asideTitle", { defaultValue: "Quick Actions" }) }),
        /* @__PURE__ */ jsx("p", { className: "muted", children: t("guide.asideDesc", { defaultValue: "Ready to convert? Jump straight to the tool." }) }),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            className: "ic-guide-cta",
            onClick: () => {
              window.scrollTo({ top: 0, behavior: "smooth" });
            },
            children: t("guide.ctaBtn", { defaultValue: "Use the Image Converter Tool" })
          }
        ),
        /* @__PURE__ */ jsx("h6", { children: t("guide.useCases.heading", { defaultValue: "Real-World Use Cases" }) }),
        /* @__PURE__ */ jsxs("ul", { className: "ic-mini-list", children: [
          /* @__PURE__ */ jsx("li", { children: t("guide.useCases.item1", { defaultValue: "Website optimization — PNG → WebP" }) }),
          /* @__PURE__ */ jsx("li", { children: t("guide.useCases.item2", { defaultValue: "Social uploads — convert to supported formats" }) }),
          /* @__PURE__ */ jsx("li", { children: t("guide.useCases.item3", { defaultValue: "Business docs — ensure cross-system compatibility" }) }),
          /* @__PURE__ */ jsx("li", { children: t("guide.useCases.item4", { defaultValue: "iPhone photos — HEIC → JPG for sharing" }) })
        ] })
      ] }) })
    ] })
  ] });
}
function ImageConverterPage() {
  const props = useImageConverter();
  return /* @__PURE__ */ jsxs("div", { className: "ic-page", children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsx("main", { className: "main", children: /* @__PURE__ */ jsx("div", { className: "container", children: /* @__PURE__ */ jsx("div", { className: "card", children: /* @__PURE__ */ jsx(ImageConverterView, { ...props }) }) }) }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
async function renderRotated(file, rotation) {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => {
      const swapped = rotation === 90 || rotation === 270;
      const w = swapped ? img.naturalHeight : img.naturalWidth;
      const h = swapped ? img.naturalWidth : img.naturalHeight;
      const canvas2 = document.createElement("canvas");
      canvas2.width = w;
      canvas2.height = h;
      const ctx = canvas2.getContext("2d");
      ctx.translate(w / 2, h / 2);
      ctx.rotate(rotation * Math.PI / 180);
      ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);
      const mime = file.type && file.type !== "image/heic" && file.type !== "image/heif" ? file.type : "image/png";
      canvas2.toBlob((blob) => blob ? resolve(blob) : reject(new Error("Canvas toBlob failed")), mime);
      URL.revokeObjectURL(img.src);
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}
function getOutputName(file, rotation) {
  if (rotation === 0) return file.name;
  const dot = file.name.lastIndexOf(".");
  const base = dot >= 0 ? file.name.slice(0, dot) : file.name;
  const ext = dot >= 0 ? file.name.slice(dot) : "";
  return `${base}-rotated${ext}`;
}
function useImageRotator() {
  const [items, setItems] = useState([]);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [status2, setStatus] = useState("idle");
  const [applyAll, setApplyAll] = useState(false);
  const fileInputRef = useRef();
  const addFiles = async (rawFiles) => {
    const normalized = await normalizeImageFiles(Array.from(rawFiles));
    const valid = normalized.filter(isImageFile);
    if (!valid.length) return;
    const newItems = valid.map((file) => ({
      file,
      rotation: 0,
      previewUrl: URL.createObjectURL(file)
    }));
    setItems((prev) => {
      if (prev.length === 0) {
        setSelectedIdx(0);
        return newItems;
      }
      setSelectedIdx(prev.length);
      return [...prev, ...newItems];
    });
  };
  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    await addFiles(e.dataTransfer.files);
  };
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const handleFileInput = async (e) => {
    if (e.target.files?.length) {
      await addFiles(e.target.files);
      e.target.value = "";
    }
  };
  const rotate = (idx, direction) => {
    const delta = direction === "right" ? 90 : -90;
    setItems((prev) => prev.map((item, i) => {
      if (!applyAll && i !== idx) return item;
      const next = ((item.rotation + delta) % 360 + 360) % 360;
      return { ...item, rotation: next };
    }));
  };
  const removeItem = (idx) => {
    setItems((prev) => {
      URL.revokeObjectURL(prev[idx].previewUrl);
      const next = prev.filter((_, i) => i !== idx);
      return next;
    });
    setSelectedIdx((prev) => Math.max(0, Math.min(prev, items.length - 2)));
  };
  const handleClear = () => {
    setItems((prev) => {
      prev.forEach((it) => URL.revokeObjectURL(it.previewUrl));
      return [];
    });
    setSelectedIdx(0);
  };
  const downloadOne = async (idx) => {
    const item = items[idx];
    if (!item) return;
    setStatus("downloading");
    try {
      const blob = await renderRotated(item.file, item.rotation);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = getOutputName(item.file, item.rotation);
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setStatus("idle");
    }
  };
  const downloadAll = async () => {
    setStatus("downloading");
    try {
      const zip = new JSZip();
      await Promise.all(items.map(async (item) => {
        const blob = await renderRotated(item.file, item.rotation);
        zip.file(getOutputName(item.file, item.rotation), blob);
      }));
      const zipBlob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "rotated-images.zip";
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setStatus("idle");
    }
  };
  return {
    items,
    selectedIdx,
    setSelectedIdx,
    isDragging,
    fileInputRef,
    status: status2,
    applyAll,
    setApplyAll,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    handleFileInput,
    rotate,
    removeItem,
    handleClear,
    downloadOne,
    downloadAll
  };
}
function ImageRotatorView({
  items,
  selectedIdx,
  setSelectedIdx,
  isDragging,
  fileInputRef,
  status: status2,
  applyAll,
  setApplyAll,
  handleDrop,
  handleDragOver,
  handleDragLeave,
  handleFileInput,
  rotate,
  removeItem,
  handleClear,
  downloadOne,
  downloadAll
}) {
  const { t } = useTranslation("imageRotator");
  const [openPanel, setOpenPanel] = useState("");
  const selected = items[selectedIdx];
  const isDownloading = status2 === "downloading";
  return /* @__PURE__ */ jsxs("div", { className: "ir2-view", children: [
    /* @__PURE__ */ jsx("h1", { className: "hero-title", children: t("hero.title") }),
    /* @__PURE__ */ jsx("p", { className: "hero-tagline", children: t("hero.tagline") }),
    /* @__PURE__ */ jsxs("div", { className: "ir2-tip-banner", children: [
      /* @__PURE__ */ jsx("span", { className: "ir2-tip-text", children: t("hint.text") }),
      /* @__PURE__ */ jsx(Link, { to: "/image-resizer", className: "ir2-tip-btn", children: t("hint.btn") })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "details-row", "data-open": openPanel, children: [
      /* @__PURE__ */ jsxs("div", { className: "details-controls", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            className: `tab-btn${openPanel === "details" ? " active" : ""}`,
            onClick: () => setOpenPanel((prev) => prev === "details" ? "" : "details"),
            "aria-expanded": openPanel === "details",
            type: "button",
            children: t("tabs.details")
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            className: `tab-btn${openPanel === "howitworks" ? " active" : ""}`,
            onClick: () => setOpenPanel((prev) => prev === "howitworks" ? "" : "howitworks"),
            "aria-expanded": openPanel === "howitworks",
            type: "button",
            children: t("tabs.howItWorks")
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: `shared-collapse${!openPanel ? " panel-hidden" : ""}`, children: [
        /* @__PURE__ */ jsxs("div", { className: openPanel !== "details" ? "details-content panel-hidden" : "details-content", children: [
          /* @__PURE__ */ jsx("h3", { children: t("details.whatIs.heading") }),
          /* @__PURE__ */ jsx("p", { children: t("details.whatIs.body") }),
          /* @__PURE__ */ jsx("h3", { children: t("details.howWorks.heading") }),
          /* @__PURE__ */ jsx("p", { children: t("details.howWorks.body") }),
          /* @__PURE__ */ jsx("h3", { children: t("details.faq.heading") }),
          /* @__PURE__ */ jsxs("ul", { children: [
            /* @__PURE__ */ jsxs("li", { children: [
              /* @__PURE__ */ jsx("strong", { children: t("details.faq.q1") }),
              " ",
              t("details.faq.a1")
            ] }),
            /* @__PURE__ */ jsxs("li", { children: [
              /* @__PURE__ */ jsx("strong", { children: t("details.faq.q2") }),
              " ",
              t("details.faq.a2")
            ] }),
            /* @__PURE__ */ jsxs("li", { children: [
              /* @__PURE__ */ jsx("strong", { children: t("details.faq.q3") }),
              " ",
              t("details.faq.a3")
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: openPanel !== "howitworks" ? "howitworks-content panel-hidden" : "howitworks-content", children: /* @__PURE__ */ jsxs("ol", { style: { margin: 0, paddingLeft: "1rem" }, children: [
          /* @__PURE__ */ jsxs("li", { style: { marginBottom: "0.75rem" }, children: [
            /* @__PURE__ */ jsx("img", { src: "/screenshots/rotator/image-rotator-001.png", alt: "Step 1", className: "how-img" }),
            /* @__PURE__ */ jsx("p", { children: t("howItWorks.step1") })
          ] }),
          /* @__PURE__ */ jsxs("li", { style: { marginBottom: "0.75rem" }, children: [
            /* @__PURE__ */ jsx("img", { src: "/screenshots/rotator/image-rotator-002.png", alt: "Step 2", className: "how-img" }),
            /* @__PURE__ */ jsx("p", { children: t("howItWorks.step2") })
          ] }),
          /* @__PURE__ */ jsxs("li", { style: { marginBottom: "0.75rem" }, children: [
            /* @__PURE__ */ jsx("img", { src: "/screenshots/rotator/image-rotator-003.png", alt: "Step 3", className: "how-img" }),
            /* @__PURE__ */ jsx("p", { children: t("howItWorks.step3") })
          ] }),
          /* @__PURE__ */ jsxs("li", { children: [
            /* @__PURE__ */ jsx("img", { src: "/screenshots/rotator/image-rotator-004.png", alt: "Step 4", className: "how-img" }),
            /* @__PURE__ */ jsx("p", { children: t("howItWorks.step4") })
          ] })
        ] }) })
      ] })
    ] }),
    items.length === 0 && /* @__PURE__ */ jsxs(
      "div",
      {
        className: `ir2-dropzone${isDragging ? " ir2-dropzone--active" : ""}`,
        onDrop: handleDrop,
        onDragOver: handleDragOver,
        onDragLeave: handleDragLeave,
        onClick: () => fileInputRef.current?.click(),
        children: [
          /* @__PURE__ */ jsx("div", { className: "ir2-dropzone-icon", children: "🔄" }),
          /* @__PURE__ */ jsx("p", { className: "ir2-dropzone-text", children: t("dropzone.text") }),
          /* @__PURE__ */ jsx("p", { className: "ir2-dropzone-sub", children: t("dropzone.sub") }),
          /* @__PURE__ */ jsx(
            "input",
            {
              ref: fileInputRef,
              type: "file",
              accept: "image/*",
              multiple: true,
              style: { display: "none" },
              onChange: handleFileInput
            }
          )
        ]
      }
    ),
    items.length > 0 && /* @__PURE__ */ jsxs("div", { className: "ir2-editor", children: [
      /* @__PURE__ */ jsxs("div", { className: "ir2-workspace", children: [
        /* @__PURE__ */ jsx("div", { className: "ir2-strip", children: items.map((item, idx) => /* @__PURE__ */ jsxs(
          "div",
          {
            className: `ir2-thumb${idx === selectedIdx ? " ir2-thumb--active" : ""}`,
            onClick: () => setSelectedIdx(idx),
            children: [
              /* @__PURE__ */ jsx("div", { className: "ir2-thumb-img-wrap", children: /* @__PURE__ */ jsx(
                "img",
                {
                  src: item.previewUrl,
                  alt: item.file.name,
                  className: "ir2-thumb-img",
                  style: { transform: `rotate(${item.rotation}deg)` }
                }
              ) }),
              /* @__PURE__ */ jsxs("div", { className: "ir2-thumb-controls", children: [
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    className: "ir2-icon-btn",
                    title: t("actions.rotateLeft"),
                    onClick: (e) => {
                      e.stopPropagation();
                      rotate(idx, "left");
                    },
                    children: "↺"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    className: "ir2-icon-btn",
                    title: t("actions.rotateRight"),
                    onClick: (e) => {
                      e.stopPropagation();
                      rotate(idx, "right");
                    },
                    children: "↻"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    className: "ir2-icon-btn ir2-icon-btn--remove",
                    title: t("actions.remove"),
                    onClick: (e) => {
                      e.stopPropagation();
                      removeItem(idx);
                    },
                    children: "✕"
                  }
                )
              ] })
            ]
          },
          idx
        )) }),
        selected && /* @__PURE__ */ jsxs("div", { className: "ir2-preview-panel", children: [
          /* @__PURE__ */ jsx("div", { className: "ir2-preview-frame", children: /* @__PURE__ */ jsx("div", { className: "ir2-preview-img-wrap", children: /* @__PURE__ */ jsx(
            "img",
            {
              src: selected.previewUrl,
              alt: selected.file.name,
              className: "ir2-preview-img",
              style: { transform: `rotate(${selected.rotation}deg)` }
            }
          ) }) }),
          /* @__PURE__ */ jsxs("div", { className: "ir2-rotate-controls", children: [
            items.length > 1 && /* @__PURE__ */ jsxs("label", { className: "ir2-apply-all-label", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "checkbox",
                  checked: applyAll,
                  onChange: (e) => setApplyAll(e.target.checked)
                }
              ),
              t("actions.applyAll")
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "ir2-rotate-btns", children: [
              /* @__PURE__ */ jsxs(
                "button",
                {
                  className: "ir2-btn ir2-btn--rotate",
                  onClick: () => rotate(selectedIdx, "left"),
                  children: [
                    /* @__PURE__ */ jsx("span", { className: "ir2-rotate-icon", children: "↺" }),
                    t("actions.rotateLeft")
                  ]
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "ir2-rotation-badge", children: [
                selected.rotation,
                "°"
              ] }),
              /* @__PURE__ */ jsxs(
                "button",
                {
                  className: "ir2-btn ir2-btn--rotate",
                  onClick: () => rotate(selectedIdx, "right"),
                  children: [
                    t("actions.rotateRight"),
                    /* @__PURE__ */ jsx("span", { className: "ir2-rotate-icon", children: "↻" })
                  ]
                }
              )
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "ir2-action-bar", children: [
        /* @__PURE__ */ jsxs("div", { className: "ir2-action-bar-left", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              className: "ir2-btn ir2-btn--secondary",
              onClick: () => fileInputRef.current?.click(),
              children: t("actions.addMore")
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              className: "ir2-btn ir2-btn--ghost",
              onClick: handleClear,
              children: t("actions.clearAll")
            }
          ),
          /* @__PURE__ */ jsx(
            "input",
            {
              ref: fileInputRef,
              type: "file",
              accept: "image/*",
              multiple: true,
              style: { display: "none" },
              onChange: handleFileInput
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "ir2-action-bar-right", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              className: "ir2-btn ir2-btn--primary",
              disabled: isDownloading,
              onClick: () => downloadOne(selectedIdx),
              children: isDownloading ? t("actions.downloading") : t("actions.download")
            }
          ),
          items.length > 1 && /* @__PURE__ */ jsx(
            "button",
            {
              className: "ir2-btn ir2-btn--secondary",
              disabled: isDownloading,
              onClick: downloadAll,
              children: isDownloading ? t("actions.downloading") : t("actions.downloadAll")
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "ic-guide", children: [
      /* @__PURE__ */ jsxs("div", { className: "ic-guide-intro", children: [
        /* @__PURE__ */ jsx("h2", { className: "ic-guide-title", children: t("guide.title") }),
        /* @__PURE__ */ jsx("p", { className: "ic-guide-lead", children: t("guide.lead") }),
        /* @__PURE__ */ jsx("p", { children: t("guide.intro2") })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "ic-guide-section", children: [
        /* @__PURE__ */ jsx("h3", { className: "ic-guide-h3", children: t("guide.why.heading") }),
        /* @__PURE__ */ jsx("p", { children: t("guide.why.body") }),
        /* @__PURE__ */ jsx("p", { children: t("guide.why.reasons") }),
        /* @__PURE__ */ jsxs("ul", { style: { paddingLeft: "1.5rem" }, children: [
          /* @__PURE__ */ jsx("li", { children: t("guide.why.item1") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.why.item2") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.why.item3") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.why.item4") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.why.item5") })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "ic-guide-section", children: [
        /* @__PURE__ */ jsx("h3", { className: "ic-guide-h3", children: t("guide.how.heading") }),
        /* @__PURE__ */ jsx("p", { children: t("guide.how.intro") }),
        /* @__PURE__ */ jsxs("ol", { style: { paddingLeft: "1.5rem" }, children: [
          /* @__PURE__ */ jsx("li", { children: t("guide.how.step1") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.how.step2") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.how.step3") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.how.step4") })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "ic-guide-section", children: [
        /* @__PURE__ */ jsx("h3", { className: "ic-guide-h3", children: t("guide.formats.heading") }),
        /* @__PURE__ */ jsx("p", { children: t("guide.formats.intro") }),
        /* @__PURE__ */ jsxs("ul", { style: { paddingLeft: "1.5rem" }, children: [
          /* @__PURE__ */ jsx("li", { children: t("guide.formats.item1") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.formats.item2") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.formats.item3") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.formats.item4") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.formats.item5") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.formats.item6") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.formats.item7") })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "ic-guide-section", children: [
        /* @__PURE__ */ jsx("h3", { className: "ic-guide-h3", children: t("guide.benefits.heading") }),
        /* @__PURE__ */ jsxs("div", { className: "ic-guide-cards", children: [
          /* @__PURE__ */ jsxs("div", { className: "ic-guide-card", children: [
            /* @__PURE__ */ jsx("span", { className: "ic-guide-card-num", children: "💻" }),
            /* @__PURE__ */ jsxs("p", { children: [
              /* @__PURE__ */ jsx("strong", { children: t("guide.benefits.card1title") }),
              " — ",
              t("guide.benefits.card1desc")
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "ic-guide-card", children: [
            /* @__PURE__ */ jsx("span", { className: "ic-guide-card-num", children: "⚡" }),
            /* @__PURE__ */ jsxs("p", { children: [
              /* @__PURE__ */ jsx("strong", { children: t("guide.benefits.card2title") }),
              " — ",
              t("guide.benefits.card2desc")
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "ic-guide-card", children: [
            /* @__PURE__ */ jsx("span", { className: "ic-guide-card-num", children: "🔒" }),
            /* @__PURE__ */ jsxs("p", { children: [
              /* @__PURE__ */ jsx("strong", { children: t("guide.benefits.card3title") }),
              " — ",
              t("guide.benefits.card3desc")
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "ic-guide-card", children: [
            /* @__PURE__ */ jsx("span", { className: "ic-guide-card-num", children: "📱" }),
            /* @__PURE__ */ jsxs("p", { children: [
              /* @__PURE__ */ jsx("strong", { children: t("guide.benefits.card4title") }),
              " — ",
              t("guide.benefits.card4desc")
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "ic-guide-card", children: [
            /* @__PURE__ */ jsx("span", { className: "ic-guide-card-num", children: "👤" }),
            /* @__PURE__ */ jsxs("p", { children: [
              /* @__PURE__ */ jsx("strong", { children: t("guide.benefits.card5title") }),
              " — ",
              t("guide.benefits.card5desc")
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "ic-guide-section", children: [
        /* @__PURE__ */ jsx("h3", { className: "ic-guide-h3", children: t("guide.useCases.heading") }),
        /* @__PURE__ */ jsx("p", { children: t("guide.useCases.intro") }),
        /* @__PURE__ */ jsxs("div", { className: "ic-guide-usecases", children: [
          /* @__PURE__ */ jsxs("div", { className: "ic-guide-usecase", children: [
            /* @__PURE__ */ jsx("span", { className: "ic-guide-usecase-icon", children: "🧳" }),
            /* @__PURE__ */ jsx("p", { children: t("guide.useCases.item1") })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "ic-guide-usecase", children: [
            /* @__PURE__ */ jsx("span", { className: "ic-guide-usecase-icon", children: "📸" }),
            /* @__PURE__ */ jsx("p", { children: t("guide.useCases.item2") })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "ic-guide-usecase", children: [
            /* @__PURE__ */ jsx("span", { className: "ic-guide-usecase-icon", children: "📑" }),
            /* @__PURE__ */ jsx("p", { children: t("guide.useCases.item3") })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "ic-guide-usecase", children: [
            /* @__PURE__ */ jsx("span", { className: "ic-guide-usecase-icon", children: "🛒" }),
            /* @__PURE__ */ jsx("p", { children: t("guide.useCases.item4") })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "ic-guide-usecase", children: [
            /* @__PURE__ */ jsx("span", { className: "ic-guide-usecase-icon", children: "📈" }),
            /* @__PURE__ */ jsx("p", { children: t("guide.useCases.item5") })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "ic-guide-usecase", children: [
            /* @__PURE__ */ jsx("span", { className: "ic-guide-usecase-icon", children: "📲" }),
            /* @__PURE__ */ jsx("p", { children: t("guide.useCases.item6") })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "ic-guide-section", children: [
        /* @__PURE__ */ jsx("h3", { className: "ic-guide-h3", children: t("guide.faq.heading") }),
        /* @__PURE__ */ jsxs("div", { className: "ic-guide-faq", children: [
          /* @__PURE__ */ jsxs("details", { className: "ic-guide-faq-item", children: [
            /* @__PURE__ */ jsx("summary", { children: t("guide.faq.q1") }),
            /* @__PURE__ */ jsx("p", { children: t("guide.faq.a1") })
          ] }),
          /* @__PURE__ */ jsxs("details", { className: "ic-guide-faq-item", children: [
            /* @__PURE__ */ jsx("summary", { children: t("guide.faq.q2") }),
            /* @__PURE__ */ jsx("p", { children: t("guide.faq.a2") })
          ] }),
          /* @__PURE__ */ jsxs("details", { className: "ic-guide-faq-item", children: [
            /* @__PURE__ */ jsx("summary", { children: t("guide.faq.q3") }),
            /* @__PURE__ */ jsx("p", { children: t("guide.faq.a3") })
          ] }),
          /* @__PURE__ */ jsxs("details", { className: "ic-guide-faq-item", children: [
            /* @__PURE__ */ jsx("summary", { children: t("guide.faq.q4") }),
            /* @__PURE__ */ jsx("p", { children: t("guide.faq.a4") })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "ic-guide-section", children: [
        /* @__PURE__ */ jsx("h3", { className: "ic-guide-h3", children: t("guide.whyUs.heading") }),
        /* @__PURE__ */ jsx("p", { children: t("guide.whyUs.body") }),
        /* @__PURE__ */ jsx("p", { children: t("guide.whyUs.greatFor") }),
        /* @__PURE__ */ jsxs("ul", { style: { paddingLeft: "1.5rem" }, children: [
          /* @__PURE__ */ jsx("li", { children: t("guide.whyUs.item1") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.whyUs.item2") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.whyUs.item3") }),
          /* @__PURE__ */ jsx("li", { children: t("guide.whyUs.item4") })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "ic-guide-section", children: [
        /* @__PURE__ */ jsx("h3", { className: "ic-guide-h3", children: t("guide.relatedTools.heading") }),
        /* @__PURE__ */ jsxs("ul", { style: { paddingLeft: "1.5rem" }, children: [
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "/image-resizer", onClick: (e) => {
            e.preventDefault();
            window.location.href = "/image-resizer";
          }, children: t("guide.relatedTools.tool1") }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "/image-crop", onClick: (e) => {
            e.preventDefault();
            window.location.href = "/image-crop";
          }, children: t("guide.relatedTools.tool2") }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "/image-compressor", onClick: (e) => {
            e.preventDefault();
            window.location.href = "/image-compressor";
          }, children: t("guide.relatedTools.tool3") }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "/pdf-compressor", onClick: (e) => {
            e.preventDefault();
            window.location.href = "/pdf-compressor";
          }, children: t("guide.relatedTools.tool4") }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "ic-guide-conclusion", children: [
        /* @__PURE__ */ jsx("h3", { children: t("guide.conclusion.heading") }),
        /* @__PURE__ */ jsx("p", { children: t("guide.conclusion.body") }),
        /* @__PURE__ */ jsx(
          "a",
          {
            href: "/image-rotator",
            className: "ic-guide-cta",
            onClick: (e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            },
            children: t("guide.conclusion.ctaBtn")
          }
        )
      ] })
    ] })
  ] });
}
function ImageRotatorPage() {
  const props = useImageRotator();
  return /* @__PURE__ */ jsxs("div", { className: "image-rotator-page", children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsx("main", { className: "main", children: /* @__PURE__ */ jsx("div", { className: "container", children: /* @__PURE__ */ jsx("div", { className: "card", children: /* @__PURE__ */ jsx(ImageRotatorView, { ...props }) }) }) }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
function useScreenRecorder() {
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const [recording, setRecording] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const [error2, setError] = useState(null);
  const isSupported = typeof navigator !== "undefined" && !!(navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia && window.MediaRecorder);
  const startRecording = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: { cursor: "always" }, audio: true });
      const mimeType = window.MediaRecorder && window.MediaRecorder.isTypeSupported && window.MediaRecorder.isTypeSupported("video/webm;codecs=vp9") ? "video/webm;codecs=vp9" : "video/webm";
      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        try {
          const blob = new Blob(chunksRef.current, { type: mimeType });
          const url = URL.createObjectURL(blob);
          setVideoUrl(url);
        } catch (e) {
          setError("Failed to create recording");
        }
        try {
          stream.getTracks().forEach((t) => t.stop());
        } catch (e) {
        }
      };
      recorder.start();
      setRecording(true);
    } catch (err) {
      setError(err && err.message ? err.message : "Permission denied or capture failed");
    }
  };
  const stopRecording = () => {
    try {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") mediaRecorderRef.current.stop();
    } catch (e) {
    }
    setRecording(false);
  };
  useEffect(() => {
    return () => {
      try {
        if (videoUrl) URL.revokeObjectURL(videoUrl);
      } catch (e) {
      }
      try {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") mediaRecorderRef.current.stop();
      } catch (e) {
      }
    };
  }, [videoUrl]);
  return { isSupported, recording, videoUrl, error: error2, startRecording, stopRecording };
}
function ScreenRecorderView({ isSupported, recording, videoUrl, error: error2, startRecording, stopRecording }) {
  return /* @__PURE__ */ jsxs("div", { className: "screen-recorder-view", children: [
    /* @__PURE__ */ jsxs("header", { className: "hero", children: [
      /* @__PURE__ */ jsx("h1", { className: "hero-title", children: "Screen Recorder" }),
      /* @__PURE__ */ jsx("p", { className: "hero-tagline", children: "Record your screen instantly — stays in your browser, private and free." })
    ] }),
    !isSupported && /* @__PURE__ */ jsx("div", { className: "alert alert-warning", children: "Your browser does not support screen capture. Try Chrome, Edge, or Firefox on desktop." }),
    /* @__PURE__ */ jsxs("div", { className: "actions", children: [
      !recording ? /* @__PURE__ */ jsx("button", { className: "btn btn-primary", onClick: startRecording, disabled: !isSupported, children: "Start Recording" }) : /* @__PURE__ */ jsx("button", { className: "btn btn-danger", onClick: stopRecording, children: "Stop Recording" }),
      recording && /* @__PURE__ */ jsx("span", { className: "recording-indicator", children: "● Recording..." })
    ] }),
    error2 && /* @__PURE__ */ jsx("div", { className: "alert alert-error", children: error2 }),
    videoUrl && /* @__PURE__ */ jsxs("div", { className: "preview", children: [
      /* @__PURE__ */ jsx("h3", { children: "Preview" }),
      /* @__PURE__ */ jsx("video", { src: videoUrl, controls: true, className: "preview-video" }),
      /* @__PURE__ */ jsx("div", { className: "preview-actions", children: /* @__PURE__ */ jsx("a", { href: videoUrl, download: "screen-recording.webm", className: "link", children: "Download Recording" }) })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "details shared-collapse", children: [
      /* @__PURE__ */ jsx("h4", { children: "How it works" }),
      /* @__PURE__ */ jsxs("ol", { children: [
        /* @__PURE__ */ jsx("li", { children: 'Click "Start Recording" and pick the screen or window to share.' }),
        /* @__PURE__ */ jsx("li", { children: 'Click "Stop Recording" to finish. A preview and download link will appear.' }),
        /* @__PURE__ */ jsx("li", { children: "The recording is kept in your browser until you download it." })
      ] })
    ] })
  ] });
}
function ScreenRecorderPage() {
  const props = useScreenRecorder();
  return /* @__PURE__ */ jsxs("div", { className: "screen-recorder-page", children: [
    /* @__PURE__ */ jsx(Seo, { title: "Quick Screen Recorder — THRJ", description: "Record your screen instantly in the browser. 100% client-side and private." }),
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsx("main", { className: "main", children: /* @__PURE__ */ jsx("div", { className: "container", children: /* @__PURE__ */ jsx("div", { className: "card", children: /* @__PURE__ */ jsx(ScreenRecorderView, { ...props }) }) }) }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
const DEFAULT_THUMB = "/images/blogs/default-thumb.svg";
function BlogsListPage() {
  const { t, i18n: i18n2 } = useTranslation("blogs");
  const loaderData = useLoaderData() ?? {};
  const [searchParams, setSearchParams] = useSearchParams();
  const [blogs2, setBlogs] = useState(loaderData.items ?? []);
  const [loading2, setLoading] = useState(!loaderData.items);
  const [error2, setError] = useState(null);
  const [page, setPage] = useState(loaderData.page ?? null);
  const [pageSize, setPageSize] = useState(loaderData.page_size ?? null);
  const [totalPages, setTotalPages] = useState(loaderData.total_pages ?? 1);
  const [links2, setLinks] = useState(loaderData.links ?? {});
  const urlPage = parseInt(searchParams.get("page") || "1", 10);
  const urlPageSize = searchParams.get("page_size") ? parseInt(searchParams.get("page_size"), 10) : null;
  const fetchBlogs = (targetPage, targetPageSize) => {
    setLoading(true);
    let url = "/api/blogs";
    if (targetPage) {
      const params = new URLSearchParams({ page: targetPage });
      if (targetPageSize) params.set("page_size", targetPageSize);
      url = `/api/blogs?${params.toString()}`;
    }
    fetch(url).then((res) => {
      if (!res.ok) throw new Error(`Failed to load blogs (${res.status})`);
      return res.json();
    }).then((data) => {
      setBlogs(data.items ?? []);
      setPage(data.page ?? 1);
      setPageSize(data.page_size ?? null);
      setTotalPages(data.total_pages ?? 1);
      setLinks(data.links ?? {});
      setLoading(false);
    }).catch((err) => {
      setError(err.message);
      setLoading(false);
    });
  };
  useEffect(() => {
    if (loaderData.items && urlPage === (loaderData.page ?? 1) && String(urlPageSize) === String(loaderData.page_size ?? "")) return;
    fetchBlogs(urlPage, urlPageSize);
  }, [urlPage, urlPageSize]);
  const goToPage = (n) => {
    if (n === page) return;
    const params = {};
    if (n > 1) params.page = n;
    if (pageSize) params.page_size = pageSize;
    setSearchParams(params);
  };
  const changePageSize = (newSize) => {
    setSearchParams({ page_size: newSize });
  };
  const pageBlogs = blogs2;
  return /* @__PURE__ */ jsxs("div", { className: "page", children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsx("main", { className: "main", children: /* @__PURE__ */ jsxs("div", { className: "container", children: [
      /* @__PURE__ */ jsx("h2", { className: "section-heading", children: t("title") }),
      loading2 && /* @__PURE__ */ jsx("p", { style: { color: "#6b7280" }, children: t("loading") }),
      error2 && /* @__PURE__ */ jsx("p", { style: { color: "#dc2626" }, children: t("error", { error: error2 }) }),
      !loading2 && !error2 && /* @__PURE__ */ jsx("div", { style: { display: "grid", gap: 16 }, children: /* @__PURE__ */ jsxs("div", { style: { border: "1px solid #e5e7eb", borderRadius: 8, overflow: "hidden" }, children: [
        /* @__PURE__ */ jsx("div", { style: { background: "#f9fafb", padding: "12px 16px", borderBottom: "1px solid #e5e7eb", fontWeight: 700, color: "#111827" }, children: t("articlesHeader") }),
        /* @__PURE__ */ jsxs("div", { children: [
          pageBlogs.map((b, idx) => {
            const background = (idx + 1) % 2 === 0 ? "#f8fafc" : "#e6e7eb";
            const lang2 = i18n2.resolvedLanguage || i18n2.language || "en";
            const displayTitle = lang2 !== "en" && b[`title_${lang2}`] || b.title;
            const displayDescription = lang2 !== "en" && b[`description_${lang2}`] || b.description;
            return /* @__PURE__ */ jsxs(
              Link,
              {
                to: `/blogs/${b.slug}`,
                className: "card blog-row",
                style: { display: "flex", alignItems: "center", gap: 16, padding: 16, borderBottom: "1px solid #e5e7eb", background },
                "aria-label": `Read blog: ${displayTitle}`,
                children: [
                  /* @__PURE__ */ jsx(
                    "img",
                    {
                      src: b.thumbnail || DEFAULT_THUMB,
                      onError: (e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = DEFAULT_THUMB;
                      },
                      alt: `Thumbnail for ${displayTitle}`,
                      style: { width: 120, height: 80, objectFit: "cover", borderRadius: 6, flex: "0 0 auto" }
                    }
                  ),
                  /* @__PURE__ */ jsxs("div", { style: { flex: 1 }, children: [
                    /* @__PURE__ */ jsx("h3", { style: { marginTop: 0, color: "#111827", fontWeight: 700 }, children: displayTitle }),
                    /* @__PURE__ */ jsx("p", { style: { color: "#6b7280", marginBottom: 0 }, children: displayDescription })
                  ] })
                ]
              },
              b.slug
            );
          }),
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", background: "#fff" }, children: [
            /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 4, alignItems: "center" }, role: "navigation", "aria-label": "Pagination", children: [
              /* @__PURE__ */ jsx("button", { onClick: () => goToPage(1), disabled: !links2.prev, style: { padding: "6px 8px", borderRadius: 4, border: "1px solid transparent", background: "transparent", color: !links2.prev ? "#9ca3af" : "#111827", cursor: !links2.prev ? "default" : "pointer" }, children: t("first") }),
              Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => goToPage(n),
                  "aria-current": page === n ? "page" : void 0,
                  style: {
                    padding: "6px 8px",
                    borderRadius: 4,
                    border: page === n ? "1px solid #111827" : "1px solid transparent",
                    background: "transparent",
                    color: "#111827",
                    fontWeight: page === n ? 700 : 400,
                    cursor: "pointer"
                  },
                  children: n
                },
                n
              )),
              /* @__PURE__ */ jsx("button", { onClick: () => goToPage(totalPages), disabled: !links2.next, style: { padding: "6px 8px", borderRadius: 4, border: "1px solid transparent", background: "transparent", color: !links2.next ? "#9ca3af" : "#111827", cursor: !links2.next ? "default" : "pointer" }, children: t("last") })
            ] }),
            /* @__PURE__ */ jsxs("label", { style: { fontSize: 14, color: "#6b7280", display: "flex", alignItems: "center", gap: 6 }, children: [
              t("perPage"),
              /* @__PURE__ */ jsx(
                "select",
                {
                  value: pageSize ?? "",
                  onChange: (e) => changePageSize(Number(e.target.value)),
                  style: { padding: "2px 6px", borderRadius: 4, border: "1px solid #d1d5db", fontSize: 14 },
                  children: [5, 10, 20].map((n) => /* @__PURE__ */ jsx("option", { value: n, children: n }, n))
                }
              )
            ] })
          ] })
        ] })
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
function naiveMarkdownToHtml(md) {
  let html = md.replace(/^### (.*$)/gim, "<h3>$1</h3>").replace(/^## (.*$)/gim, "<h2>$1</h2>").replace(/^# (.*$)/gim, "<h1>$1</h1>").replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>").replace(/!\[(.*?)\]\((.*?)\)/gim, '<img alt="$1" src="$2" style="max-width:100%;height:auto;"/>').replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2">$1</a>').replace(/\n\n+/gim, "</p><p>");
  html = "<p>" + html + "</p>";
  html = html.replace(/<p>\s*<\/p>/gim, "");
  return html;
}
function BlogPage() {
  const { t, i18n: i18n2 } = useTranslation("blogs");
  const loaderData = useLoaderData() ?? {};
  const { slug } = useParams();
  const navigate = useNavigate();
  const [createdAt2, setCreatedAt] = useState(loaderData.createdAt ?? null);
  const [blogData, setBlogData] = useState(loaderData.slug ? loaderData : null);
  const [error2, setError] = useState(loaderData.error ?? null);
  const lang2 = i18n2.resolvedLanguage || i18n2.language || "en";
  const title2 = blogData ? lang2 !== "en" && blogData[`title_${lang2}`] || blogData.title : null;
  const content = blogData ? naiveMarkdownToHtml(lang2 !== "en" && blogData[`content_${lang2}`] || blogData.content) : null;
  useEffect(() => {
    if (loaderData.slug && loaderData.slug === slug) return;
    const url = `/api/blogs/${slug}`;
    fetch(url).then((res) => {
      if (!res.ok) throw new Error(`Blog not found (${res.status})`);
      return res.json();
    }).then((data) => {
      setBlogData(data);
      setCreatedAt(data.createdAt);
    }).catch((err) => setError(err.message));
  }, [slug]);
  useEffect(() => {
    const prev = document.title;
    if (title2) document.title = `${title2} | THRJ Blog`;
    return () => {
      document.title = prev;
    };
  }, [title2, lang2]);
  return /* @__PURE__ */ jsxs("div", { className: "page blog-post-page", children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsx("main", { className: "main", children: /* @__PURE__ */ jsxs("div", { className: "container", children: [
      /* @__PURE__ */ jsx("div", { style: { marginBottom: "1rem" }, children: /* @__PURE__ */ jsx("button", { onClick: () => navigate(-1), style: { background: "none", border: "none", padding: 0, color: "inherit", cursor: "pointer", textDecoration: "underline", font: "inherit" }, children: t("back") }) }),
      /* @__PURE__ */ jsxs("article", { className: "card", children: [
        /* @__PURE__ */ jsx("div", { style: { color: "#000000" }, children: t("createdAt", { date: new Date(createdAt2).toLocaleString() }) }),
        error2 ? /* @__PURE__ */ jsx("p", { style: { color: "#dc2626" }, children: t("errorArticle", { error: error2 }) }) : /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx("div", { dangerouslySetInnerHTML: { __html: content || `<p>${t("loadingArticle")}</p>` } }) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
function AboutUsPage() {
  const { t } = useTranslation("about");
  return /* @__PURE__ */ jsxs("div", { className: "about-us-page", children: [
    /* @__PURE__ */ jsx(Seo, { title: "About Us — THRJ", description: "Learn about THRJTech — who we are, our mission, and our commitment to free, privacy-friendly browser tools." }),
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsx("main", { className: "main", children: /* @__PURE__ */ jsx("div", { className: "container", children: /* @__PURE__ */ jsxs("div", { className: "card", children: [
      /* @__PURE__ */ jsx("h2", { children: t("title") }),
      /* @__PURE__ */ jsx("h3", { children: t("whoWeAre.heading") }),
      /* @__PURE__ */ jsx("p", { children: t("whoWeAre.body") }),
      /* @__PURE__ */ jsx("h3", { children: t("ourMission.heading") }),
      /* @__PURE__ */ jsx("p", { children: t("ourMission.body") }),
      /* @__PURE__ */ jsx("h3", { children: t("builtForEveryone.heading") }),
      /* @__PURE__ */ jsx("p", { children: t("builtForEveryone.body") }),
      /* @__PURE__ */ jsx("h3", { children: t("privacyFirst.heading") }),
      /* @__PURE__ */ jsxs("p", { children: [
        t("privacyFirst.body"),
        " ",
        /* @__PURE__ */ jsx(Link, { to: "/about/policy", children: t("privacyFirst.privacyLink") }),
        "."
      ] }),
      /* @__PURE__ */ jsx("h3", { children: t("alwaysFree.heading") }),
      /* @__PURE__ */ jsx("p", { children: t("alwaysFree.body") }),
      /* @__PURE__ */ jsx("h3", { children: t("constantlyImproving.heading") }),
      /* @__PURE__ */ jsx("p", { children: t("constantlyImproving.body") }),
      /* @__PURE__ */ jsx("h3", { children: t("getInTouch.heading") }),
      /* @__PURE__ */ jsx("p", { children: t("getInTouch.body") }),
      /* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsx(Link, { to: "/contact", children: t("getInTouch.contactLink") }) })
    ] }) }) }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
function PrivacyPolicyPage() {
  const { t } = useTranslation("privacy");
  return /* @__PURE__ */ jsxs("div", { className: "about-us-page", children: [
    /* @__PURE__ */ jsx(Seo, { title: "Privacy Policy — THRJ", description: "THRJTech's privacy policy — how we handle your data, cookies, and advertising on our free browser tools." }),
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsx("main", { className: "main", children: /* @__PURE__ */ jsx("div", { className: "container", children: /* @__PURE__ */ jsxs("div", { className: "card", children: [
      /* @__PURE__ */ jsx("h2", { children: t("title") }),
      /* @__PURE__ */ jsx("p", { className: "fl-updated", children: t("lastUpdated") }),
      /* @__PURE__ */ jsx("h3", { children: t("overview.heading") }),
      /* @__PURE__ */ jsx("p", { children: t("overview.body") }),
      /* @__PURE__ */ jsx("h3", { children: t("googleAdsense.heading") }),
      /* @__PURE__ */ jsx("p", { children: t("googleAdsense.body1") }),
      /* @__PURE__ */ jsxs("p", { children: [
        t("googleAdsense.body2Pre"),
        " ",
        /* @__PURE__ */ jsx("a", { href: "https://www.google.com/settings/ads", target: "_blank", rel: "noopener noreferrer", children: t("googleAdsense.googleAdsLink") }),
        t("googleAdsense.body2Mid"),
        " ",
        /* @__PURE__ */ jsx("a", { href: "https://www.aboutads.info/choices/", target: "_blank", rel: "noopener noreferrer", children: t("googleAdsense.aboutadsLink") }),
        t("googleAdsense.body2Post")
      ] }),
      /* @__PURE__ */ jsx("h3", { children: t("cookies.heading") }),
      /* @__PURE__ */ jsx("p", { children: t("cookies.body") }),
      /* @__PURE__ */ jsx("h3", { children: t("userConsent.heading") }),
      /* @__PURE__ */ jsx("p", { children: t("userConsent.body") }),
      /* @__PURE__ */ jsx("h3", { children: t("dataWeCollect.heading") }),
      /* @__PURE__ */ jsx("p", { children: t("dataWeCollect.body") }),
      /* @__PURE__ */ jsx("h3", { children: t("googleAnalytics.heading") }),
      /* @__PURE__ */ jsx("p", { children: t("googleAnalytics.body") }),
      /* @__PURE__ */ jsx("h3", { children: t("thirdPartyLinks.heading") }),
      /* @__PURE__ */ jsx("p", { children: t("thirdPartyLinks.body") }),
      /* @__PURE__ */ jsx("h3", { children: t("californiaRights.heading") }),
      /* @__PURE__ */ jsx("p", { children: t("californiaRights.body") }),
      /* @__PURE__ */ jsx("h3", { children: t("contact.heading") }),
      /* @__PURE__ */ jsx("p", { children: t("contact.body") })
    ] }) }) }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
function TermsOfServicePage() {
  const { t } = useTranslation("terms");
  return /* @__PURE__ */ jsxs("div", { className: "about-us-page", children: [
    /* @__PURE__ */ jsx(Seo, { title: "Terms of Service — THRJ", description: "THRJTech's terms of service — free tools, privacy commitments, acceptable use, and limitations of liability." }),
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsx("main", { className: "main", children: /* @__PURE__ */ jsx("div", { className: "container", children: /* @__PURE__ */ jsxs("div", { className: "card", children: [
      /* @__PURE__ */ jsx("h2", { children: t("title") }),
      /* @__PURE__ */ jsx("p", { className: "fl-updated", children: t("lastUpdated") }),
      /* @__PURE__ */ jsx("h3", { children: t("freeService.heading") }),
      /* @__PURE__ */ jsx("p", { children: t("freeService.body") }),
      /* @__PURE__ */ jsx("h3", { children: t("privacyCore.heading") }),
      /* @__PURE__ */ jsx("p", { children: t("privacyCore.body") }),
      /* @__PURE__ */ jsx("h3", { children: t("acceptableUse.heading") }),
      /* @__PURE__ */ jsx("p", { children: t("acceptableUse.body") }),
      /* @__PURE__ */ jsx("h3", { children: t("noWarranty.heading") }),
      /* @__PURE__ */ jsx("p", { children: t("noWarranty.body") }),
      /* @__PURE__ */ jsx("h3", { children: t("limitedLiability.heading") }),
      /* @__PURE__ */ jsx("p", { children: t("limitedLiability.body") }),
      /* @__PURE__ */ jsx("h3", { children: t("changes.heading") }),
      /* @__PURE__ */ jsx("p", { children: t("changes.body") }),
      /* @__PURE__ */ jsx("h3", { children: t("contact.heading") }),
      /* @__PURE__ */ jsx("p", { children: t("contact.body") })
    ] }) }) }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
function ContactUsPage() {
  const { t } = useTranslation("contact");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [formStartTime] = useState(Date.now());
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (honeypot || Date.now() - formStartTime < 3e3) {
      setSubmitError(true);
      return;
    }
    setSubmitting(true);
    setSubmitSuccess(false);
    setSubmitError(false);
    try {
      const res = await fetch("https://formspree.io/f/mgonpdvz", {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ email, message })
      });
      if (res.ok) {
        setSubmitSuccess(true);
        setEmail("");
        setMessage("");
      } else {
        setSubmitError(true);
      }
    } catch {
      setSubmitError(true);
    } finally {
      setSubmitting(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "about-us-page", children: [
    /* @__PURE__ */ jsx(Seo, { title: "Contact Us — THRJ", description: "Get in touch with the THRJTech team. Send us feedback, bug reports, or feature requests." }),
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsx("main", { className: "main", children: /* @__PURE__ */ jsx("div", { className: "container", children: /* @__PURE__ */ jsxs("div", { className: "card", style: { maxWidth: 540 }, children: [
      /* @__PURE__ */ jsxs("div", { className: "aboutus-section", children: [
        /* @__PURE__ */ jsx("h2", { style: { marginBottom: "0.75rem" }, children: t("title") }),
        /* @__PURE__ */ jsxs("p", { children: [
          t("intro"),
          /* @__PURE__ */ jsxs("span", { style: { display: "block", textAlign: "right", marginTop: "0.5em" }, children: [
            "- ",
            t("signature")
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("hr", { style: { margin: "0.5rem 0 1rem", border: "none", borderTop: "1px solid #e2e6f0" } }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "contactus-form", autoComplete: "off", children: [
        /* @__PURE__ */ jsx("div", { style: { display: "none" }, children: /* @__PURE__ */ jsxs("label", { children: [
          t("honeypotLabel"),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              name: "website",
              value: honeypot,
              onChange: (e) => setHoneypot(e.target.value),
              tabIndex: "-1",
              autoComplete: "off"
            }
          )
        ] }) }),
        /* @__PURE__ */ jsxs("label", { children: [
          t("emailLabel"),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "email",
              value: email,
              onChange: (e) => setEmail(e.target.value),
              required: true,
              placeholder: t("emailPlaceholder"),
              autoComplete: "email"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("label", { children: [
          t("messageLabel"),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              value: message,
              onChange: (e) => setMessage(e.target.value),
              required: true,
              placeholder: t("messagePlaceholder"),
              rows: 4
            }
          )
        ] }),
        /* @__PURE__ */ jsx("button", { type: "submit", className: "btn btn-primary", disabled: submitting, children: submitting ? t("sendingBtn") : t("submitBtn") }),
        submitSuccess && /* @__PURE__ */ jsx("div", { className: "contactus-success", children: t("successMsg") }),
        submitError && /* @__PURE__ */ jsx("div", { className: "contactus-error", children: t("errorMsg") })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
function HomePage() {
  const { t } = useTranslation("home");
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
    }
  }, []);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Seo, { title: "THRJ — Free Online Tools", description: "Free, fast, privacy-friendly online utilities (image, PDF, and JSON tools) that run in your browser." }),
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsxs("main", { style: { flex: 1, display: "flex", flexDirection: "column" }, children: [
      /* @__PURE__ */ jsx("section", { className: "hero", children: /* @__PURE__ */ jsxs("div", { className: "hero-inner", children: [
        /* @__PURE__ */ jsx("h1", { className: "hero-title", children: t("hero.title").split("\n").reduce((acc, line, i) => i === 0 ? [line] : [...acc, /* @__PURE__ */ jsx("br", {}, i), line], []) }),
        /* @__PURE__ */ jsx("p", { className: "hero-subtitle", children: t("hero.subtitle") })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "tools-section", children: /* @__PURE__ */ jsx("div", { className: "container", children: /* @__PURE__ */ jsx(RotatingCards, {}) }) }),
      /* @__PURE__ */ jsx("section", { className: "home-section", children: /* @__PURE__ */ jsxs("div", { className: "container", children: [
        /* @__PURE__ */ jsx("h2", { className: "home-section-title", children: t("popularGuides.heading") }),
        /* @__PURE__ */ jsxs("div", { className: "guide-links", children: [
          /* @__PURE__ */ jsx(Link, { className: "guide-link", to: "/blogs/json-formatter-guide", children: t("popularGuides.jsonFormatter") }),
          /* @__PURE__ */ jsx(Link, { className: "guide-link", to: "/blogs/image-crop-guide", children: t("popularGuides.imageCrop") }),
          /* @__PURE__ */ jsx(Link, { className: "guide-link", to: "/blogs/meme-generator-guide", children: t("popularGuides.memeGenerator") }),
          /* @__PURE__ */ jsx(Link, { className: "guide-link", to: "/blogs/pdf-compressor-guide", children: t("popularGuides.pdfCompressor") }),
          /* @__PURE__ */ jsx(Link, { className: "guide-link", to: "/blogs/image-collage-guide", children: t("popularGuides.imageCollage") }),
          /* @__PURE__ */ jsx(Link, { className: "guide-link", to: "/blogs/pdf-merger-guide", children: t("popularGuides.pdfMerger") })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx("section", { className: "home-section home-section--alt", children: /* @__PURE__ */ jsxs("div", { className: "container", children: [
        /* @__PURE__ */ jsxs("div", { className: "spotlight-group", children: [
          /* @__PURE__ */ jsx("h2", { className: "home-section-title", children: t("developerTools.heading") }),
          /* @__PURE__ */ jsxs("div", { className: "spotlight-cards", children: [
            /* @__PURE__ */ jsxs(Link, { className: "spotlight-card", to: "/json-formatter", children: [
              /* @__PURE__ */ jsx("span", { className: "spotlight-card-name", children: t("developerTools.jsonFormatterName") }),
              /* @__PURE__ */ jsx("p", { className: "spotlight-card-desc", children: t("developerTools.jsonFormatterDesc") })
            ] }),
            /* @__PURE__ */ jsxs(Link, { className: "spotlight-card", to: "/regex-tester", children: [
              /* @__PURE__ */ jsx("span", { className: "spotlight-card-name", children: t("developerTools.regexTesterName") }),
              /* @__PURE__ */ jsx("p", { className: "spotlight-card-desc", children: t("developerTools.regexTesterDesc") })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "spotlight-group", children: [
          /* @__PURE__ */ jsx("h2", { className: "home-section-title", children: t("imageTools.heading") }),
          /* @__PURE__ */ jsxs("div", { className: "spotlight-cards", children: [
            /* @__PURE__ */ jsxs(Link, { className: "spotlight-card", to: "/image-crop", children: [
              /* @__PURE__ */ jsx("span", { className: "spotlight-card-name", children: t("imageTools.imageCropName") }),
              /* @__PURE__ */ jsx("p", { className: "spotlight-card-desc", children: t("imageTools.imageCropDesc") })
            ] }),
            /* @__PURE__ */ jsxs(Link, { className: "spotlight-card", to: "/image-meme-generator", children: [
              /* @__PURE__ */ jsx("span", { className: "spotlight-card-name", children: t("imageTools.memeGeneratorName") }),
              /* @__PURE__ */ jsx("p", { className: "spotlight-card-desc", children: t("imageTools.memeGeneratorDesc") })
            ] })
          ] })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx(
      "ins",
      {
        className: "adsbygoogle",
        style: { display: "block" },
        "data-ad-client": "ca-pub-1683577108258942",
        "data-ad-slot": "9546355200",
        "data-ad-format": "auto",
        "data-full-width-responsive": "true"
      }
    ),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
const meta$k = () => [{
  title: "THRJ — Free Online Tools"
}, {
  name: "description",
  content: "Free, fast, privacy-friendly online utilities (image, PDF, and JSON tools) that run in your browser."
}, {
  name: "robots",
  content: "index, follow"
}];
const _index = UNSAFE_withComponentProps(HomePage);
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _index,
  meta: meta$k
}, Symbol.toStringTag, { value: "Module" }));
const meta$j = () => [{
  title: "PDF Compressor — THRJ"
}, {
  name: "description",
  content: "Compress PDF files online for free with THRJ's fast, in-browser PDF compressor."
}];
const pdfCompressor = UNSAFE_withComponentProps(PdfCompressorPage);
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: pdfCompressor,
  meta: meta$j
}, Symbol.toStringTag, { value: "Module" }));
const meta$i = () => [{
  title: "PDF Merger — THRJ"
}, {
  name: "description",
  content: "Merge multiple PDF files into one quickly and securely in your browser."
}];
const pdfMerger = UNSAFE_withComponentProps(PdfMergerPage);
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: pdfMerger,
  meta: meta$i
}, Symbol.toStringTag, { value: "Module" }));
const meta$h = () => [{
  title: "PDF Converter — THRJ"
}, {
  name: "description",
  content: "Convert PDF documents to image files — fast, free, and private."
}];
const pdfConverter = UNSAFE_withComponentProps(PdfConverterPage);
const route4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: pdfConverter,
  meta: meta$h
}, Symbol.toStringTag, { value: "Module" }));
const meta$g = () => [{
  title: "PDF Splitter — THRJ"
}, {
  name: "description",
  content: "Split PDF files into page ranges or individual pages — free and private."
}];
const pdfSplitter = UNSAFE_withComponentProps(PdfSplitterPage);
const route5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: pdfSplitter,
  meta: meta$g
}, Symbol.toStringTag, { value: "Module" }));
const meta$f = () => [{
  title: "JSON Formatter — THRJ"
}, {
  name: "description",
  content: "Format and beautify JSON online with an easy-to-use JSON formatter and validator."
}];
const jsonFormatter = UNSAFE_withComponentProps(JsonFormatterPage);
const route6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: jsonFormatter,
  meta: meta$f
}, Symbol.toStringTag, { value: "Module" }));
const meta$e = () => [{
  title: "Regex Tester — THRJ"
}, {
  name: "description",
  content: "Regex search and replace tool with live match highlighting — free, fast, in-browser."
}];
const regexTester = UNSAFE_withComponentProps(RegexTesterPage);
const route7 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: regexTester,
  meta: meta$e
}, Symbol.toStringTag, { value: "Module" }));
const meta$d = () => [{
  title: "Image Watermarker — THRJ"
}, {
  name: "description",
  content: "Add text or image watermarks to photos quickly in your browser — no uploads required."
}];
const imageWatermarker = UNSAFE_withComponentProps(WatermarkerPage);
const route8 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: imageWatermarker,
  meta: meta$d
}, Symbol.toStringTag, { value: "Module" }));
const meta$c = () => [{
  title: "Image Resizer — THRJ"
}, {
  name: "description",
  content: "Resize images online for free with a privacy-friendly, in-browser image resizer."
}];
const imageResizer = UNSAFE_withComponentProps(ImageResizerPage);
const route9 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: imageResizer,
  meta: meta$c
}, Symbol.toStringTag, { value: "Module" }));
const meta$b = () => [{
  title: "Image Collage Maker — THRJ"
}, {
  name: "description",
  content: "Create beautiful image collages online with an intuitive, free collage maker."
}];
const imageCollage = UNSAFE_withComponentProps(ImageCollage);
const route10 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: imageCollage,
  meta: meta$b
}, Symbol.toStringTag, { value: "Module" }));
const meta$a = () => [{
  title: "Meme Generator — THRJ"
}, {
  name: "description",
  content: "Create and download custom memes using the free in-browser meme generator."
}];
const imageMemeGenerator = UNSAFE_withComponentProps(ImageMemeGenerator);
const route11 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: imageMemeGenerator,
  meta: meta$a
}, Symbol.toStringTag, { value: "Module" }));
const meta$9 = () => [{
  title: "Image Crop — THRJ"
}, {
  name: "description",
  content: "Crop images online with an intuitive, client-side image cropping tool."
}];
const imageCrop = UNSAFE_withComponentProps(ImageCropPage);
const route12 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: imageCrop,
  meta: meta$9
}, Symbol.toStringTag, { value: "Module" }));
const meta$8 = () => [{
  title: "Image Converter — THRJ"
}, {
  name: "description",
  content: "Convert images between JPG, PNG, WebP, and more formats instantly in your browser."
}];
const imageConverter = UNSAFE_withComponentProps(ImageConverterPage);
const route13 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: imageConverter,
  meta: meta$8
}, Symbol.toStringTag, { value: "Module" }));
const meta$7 = () => [{
  title: "Image Rotator — THRJ"
}, {
  name: "description",
  content: "Rotate images 90°, 180°, or 270° online — free, fast, and private."
}];
const imageRotator = UNSAFE_withComponentProps(ImageRotatorPage);
const route14 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: imageRotator,
  meta: meta$7
}, Symbol.toStringTag, { value: "Module" }));
const meta$6 = () => [{
  title: "Quick Screen Recorder — THRJ"
}, {
  name: "description",
  content: "Record your screen instantly in the browser. 100% client-side and private."
}];
const screenRecorder = UNSAFE_withComponentProps(ScreenRecorderPage);
const route15 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: screenRecorder,
  meta: meta$6
}, Symbol.toStringTag, { value: "Module" }));
const meta$5 = () => [{
  title: "About Us — THRJ"
}, {
  name: "description",
  content: "Learn about THRJ Tech and our mission to provide free, privacy-friendly online tools."
}];
const about_us = UNSAFE_withComponentProps(AboutUsPage);
const route16 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: about_us,
  meta: meta$5
}, Symbol.toStringTag, { value: "Module" }));
const meta$4 = () => [{
  title: "Privacy Policy — THRJ"
}, {
  name: "description",
  content: "THRJ Tech privacy policy — your data stays in your browser."
}];
const about_policy = UNSAFE_withComponentProps(PrivacyPolicyPage);
const route17 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: about_policy,
  meta: meta$4
}, Symbol.toStringTag, { value: "Module" }));
const meta$3 = () => [{
  title: "Terms of Service — THRJ"
}, {
  name: "description",
  content: "Terms of service for THRJ Tech online tools."
}];
const about_terms = UNSAFE_withComponentProps(TermsOfServicePage);
const route18 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: about_terms,
  meta: meta$3
}, Symbol.toStringTag, { value: "Module" }));
const meta$2 = () => [{
  title: "Contact Us — THRJ"
}, {
  name: "description",
  content: "Get in touch with THRJ Tech. We'd love to hear your feedback."
}];
const contact = UNSAFE_withComponentProps(ContactUsPage);
const route19 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: contact,
  meta: meta$2
}, Symbol.toStringTag, { value: "Module" }));
const meta$1 = () => [{
  title: "Blog — THRJ"
}, {
  name: "description",
  content: "Tips, guides, and how-tos for THRJ's free online tools."
}];
async function loader$3({
  request,
  context
}) {
  const url = new URL(request.url);
  const page = url.searchParams.get("page") || "1";
  const pageSize = url.searchParams.get("page_size");
  try {
    const env = context.cloudflare?.env;
    const backendUrl = env?.BLOG_BACKEND_URL;
    if (!backendUrl) return {};
    const params = new URLSearchParams();
    if (page !== "1") params.set("page", page);
    if (pageSize) params.set("page_size", pageSize);
    const fetchUrl = params.toString() ? `${backendUrl}?${params}` : backendUrl;
    const res = await fetch(fetchUrl, {
      headers: {
        "Accept": "application/json"
      }
    });
    if (!res.ok) return {};
    return await res.json();
  } catch {
    return {};
  }
}
const blogs__index = UNSAFE_withComponentProps(BlogsListPage);
const route20 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: blogs__index,
  loader: loader$3,
  meta: meta$1
}, Symbol.toStringTag, { value: "Module" }));
const meta = ({
  data
}) => {
  const title2 = data?.title;
  const description = data?.description;
  return [{
    title: title2 ? `${title2} | THRJ Blog` : "Blog — THRJ"
  }, {
    name: "description",
    content: description || "Read guides and how-tos on THRJ Blog."
  }];
};
async function loader$2({
  params,
  context
}) {
  const slug = params.slug;
  try {
    const env = context.cloudflare?.env;
    const backendUrl = env?.BLOG_BACKEND_URL;
    if (!backendUrl) return {
      slug
    };
    const res = await fetch(`${backendUrl}/${slug}`, {
      headers: {
        "Accept": "application/json"
      }
    });
    if (!res.ok) return {
      slug,
      error: `Blog not found (${res.status})`
    };
    const data = await res.json();
    return {
      ...data,
      slug
    };
  } catch {
    return {
      slug,
      error: "Failed to load blog post."
    };
  }
}
const blogs_$slug = UNSAFE_withComponentProps(BlogPage);
const route21 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: blogs_$slug,
  loader: loader$2,
  meta
}, Symbol.toStringTag, { value: "Module" }));
async function loader$1({
  request,
  context
}) {
  const url = new URL(request.url);
  try {
    const env = context.cloudflare?.env;
    const backendUrl = env?.BLOG_BACKEND_URL;
    if (!backendUrl) return Response.json({
      error: "Blog backend not configured"
    }, {
      status: 503
    });
    const params = new URLSearchParams();
    url.searchParams.forEach((v, k) => params.set(k, v));
    const fetchUrl = params.toString() ? `${backendUrl}?${params}` : backendUrl;
    const upstream = await fetch(fetchUrl, {
      headers: {
        "Accept": "application/json"
      }
    });
    const body = await upstream.text();
    return new Response(body, {
      status: upstream.status,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=300"
      }
    });
  } catch (err) {
    return Response.json({
      error: err.message || "Internal error"
    }, {
      status: 500
    });
  }
}
const route22 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  loader: loader$1
}, Symbol.toStringTag, { value: "Module" }));
async function loader({
  params,
  context
}) {
  const slug = params.slug;
  try {
    const env = context.cloudflare?.env;
    const backendUrl = env?.BLOG_BACKEND_URL;
    if (!backendUrl) return Response.json({
      error: "Blog backend not configured"
    }, {
      status: 503
    });
    const upstream = await fetch(`${backendUrl}/${slug}`, {
      headers: {
        "Accept": "application/json"
      }
    });
    const body = await upstream.text();
    return new Response(body, {
      status: upstream.status,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=300"
      }
    });
  } catch (err) {
    return Response.json({
      error: err.message || "Internal error"
    }, {
      status: 500
    });
  }
}
const route23 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  loader
}, Symbol.toStringTag, { value: "Module" }));
async function action({
  request,
  context
}) {
  try {
    const env = context.cloudflare?.env ?? {};
    const {
      R2_ENDPOINT_URL,
      R2_ACCESS_KEY_ID,
      R2_SECRET_ACCESS_KEY,
      R2_PDF_BUCKET_NAME,
      PDF_COMPRESSOR_BACKEND_URL,
      PDF_MERGER_BACKEND_URL,
      PDF_CONVERTER_BACKEND_URL,
      PDF_SPLITTER_BACKEND_URL
    } = env;
    if (!R2_ENDPOINT_URL || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_PDF_BUCKET_NAME || !PDF_SPLITTER_BACKEND_URL) {
      throw new Error("Missing required R2 environment variables");
    }
    const {
      filename,
      contentType
    } = await request.json();
    if (!filename || !contentType) {
      throw new Error("Missing filename or contentType in request body");
    }
    const key = `${Date.now()}-${filename.replace(/[^a-zA-Z0-9.\-_]/g, "_")}`;
    const s3 = new S3Client({
      region: "auto",
      endpoint: R2_ENDPOINT_URL,
      credentials: {
        accessKeyId: R2_ACCESS_KEY_ID,
        secretAccessKey: R2_SECRET_ACCESS_KEY
      },
      requestChecksumCalculation: "WHEN_REQUIRED",
      responseChecksumValidation: "WHEN_REQUIRED"
    });
    const presignedUrl = await getSignedUrl(s3, new PutObjectCommand({
      Bucket: R2_PDF_BUCKET_NAME,
      Key: key,
      ContentType: contentType
    }), {
      expiresIn: 300
    });
    return Response.json({
      presignedUrl,
      key,
      pdfCompressorBackendUrl: PDF_COMPRESSOR_BACKEND_URL || "",
      pdfMergerBackendUrl: PDF_MERGER_BACKEND_URL || "",
      pdfConverterBackendUrl: PDF_CONVERTER_BACKEND_URL || "",
      pdfSplitterBackendUrl: PDF_SPLITTER_BACKEND_URL || ""
    });
  } catch (err) {
    return Response.json({
      error: err.message || "Internal error"
    }, {
      status: 500
    });
  }
}
const route24 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-HEZdkNkU.js", "imports": ["/assets/chunk-EVOBXE3Y-B7j9GB9p.js", "/assets/preload-helper-BXl3LOEh.js", "/assets/i18nInstance-CVCyxaL8.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/root-CzRt11dY.js", "imports": ["/assets/chunk-EVOBXE3Y-B7j9GB9p.js", "/assets/preload-helper-BXl3LOEh.js", "/assets/i18nInstance-CVCyxaL8.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/_index": { "id": "routes/_index", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/_index-Br7Tlbwc.js", "imports": ["/assets/chunk-EVOBXE3Y-B7j9GB9p.js", "/assets/Footer-D_uoRlQ4.js", "/assets/Seo-Dj5N8W_M.js", "/assets/normalizeImageFiles-CXLNTfhX.js", "/assets/jszip.min-C7HGm_fB.js", "/assets/i18nInstance-CVCyxaL8.js", "/assets/preload-helper-BXl3LOEh.js"], "css": ["/assets/_index-D8mBQNSv.css", "/assets/CustomSelect-BI28etKh.css", "/assets/PdfCompressor-vRVZzLD4.css", "/assets/PdfMerger-CEATY6HP.css", "/assets/PdfConverter-kBEe6jLt.css", "/assets/PdfSplitter-D2_GGeni.css", "/assets/JsonFormatter-BzgkV5dF.css", "/assets/RegexTester-DgxnEV3c.css", "/assets/Watermarker-M59UJojG.css", "/assets/image-tools-shared-xQlKVJGj.css", "/assets/ImageResizer-CF06uz8s.css", "/assets/ImageCollage-DxlrMB-V.css", "/assets/MemeGenerator-K_jKDtmO.css", "/assets/ImageCrop-Bp0d5Owx.css", "/assets/ImageConverter-D63ywdss.css", "/assets/ImageRotator-DWSaPz0e.css", "/assets/ScreenRecorder-BwsvtaAe.css", "/assets/BlogsListPage-DbreybLm.css", "/assets/BlogPage-Cc3sx4W3.css", "/assets/About-Cm4K-jFQ.css", "/assets/ContactUs-BZdRJ1cl.css", "/assets/Footer-Dee9p-3Y.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/pdf-compressor": { "id": "routes/pdf-compressor", "parentId": "root", "path": "pdf-compressor", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/pdf-compressor-DT6eYrno.js", "imports": ["/assets/chunk-EVOBXE3Y-B7j9GB9p.js", "/assets/r2Service-B5nC3M9w.js", "/assets/formatSize-DhH56IlA.js", "/assets/CustomSelect-BLU04gPO.js", "/assets/Footer-D_uoRlQ4.js", "/assets/i18nInstance-CVCyxaL8.js"], "css": ["/assets/PdfCompressor-vRVZzLD4.css", "/assets/CustomSelect-BI28etKh.css", "/assets/Footer-Dee9p-3Y.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/pdf-merger": { "id": "routes/pdf-merger", "parentId": "root", "path": "pdf-merger", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/pdf-merger-BOFWX7L5.js", "imports": ["/assets/chunk-EVOBXE3Y-B7j9GB9p.js", "/assets/preload-helper-BXl3LOEh.js", "/assets/r2Service-B5nC3M9w.js", "/assets/Footer-D_uoRlQ4.js", "/assets/i18nInstance-CVCyxaL8.js"], "css": ["/assets/PdfMerger-CEATY6HP.css", "/assets/Footer-Dee9p-3Y.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/pdf-converter": { "id": "routes/pdf-converter", "parentId": "root", "path": "pdf-converter", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/pdf-converter-D4dgezCN.js", "imports": ["/assets/chunk-EVOBXE3Y-B7j9GB9p.js", "/assets/r2Service-B5nC3M9w.js", "/assets/formatSize-DhH56IlA.js", "/assets/CustomSelect-BLU04gPO.js", "/assets/Footer-D_uoRlQ4.js", "/assets/i18nInstance-CVCyxaL8.js"], "css": ["/assets/PdfConverter-kBEe6jLt.css", "/assets/CustomSelect-BI28etKh.css", "/assets/Footer-Dee9p-3Y.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/pdf-splitter": { "id": "routes/pdf-splitter", "parentId": "root", "path": "pdf-splitter", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/pdf-splitter-RZRZHH6D.js", "imports": ["/assets/chunk-EVOBXE3Y-B7j9GB9p.js", "/assets/preload-helper-BXl3LOEh.js", "/assets/Footer-D_uoRlQ4.js", "/assets/i18nInstance-CVCyxaL8.js"], "css": ["/assets/PdfSplitter-D2_GGeni.css", "/assets/Footer-Dee9p-3Y.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/json-formatter": { "id": "routes/json-formatter", "parentId": "root", "path": "json-formatter", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/json-formatter-UqYbxaHk.js", "imports": ["/assets/chunk-EVOBXE3Y-B7j9GB9p.js", "/assets/Footer-D_uoRlQ4.js", "/assets/i18nInstance-CVCyxaL8.js"], "css": ["/assets/JsonFormatter-BzgkV5dF.css", "/assets/Footer-Dee9p-3Y.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/regex-tester": { "id": "routes/regex-tester", "parentId": "root", "path": "regex-tester", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/regex-tester-Dx0D5Qw6.js", "imports": ["/assets/chunk-EVOBXE3Y-B7j9GB9p.js", "/assets/Footer-D_uoRlQ4.js", "/assets/i18nInstance-CVCyxaL8.js"], "css": ["/assets/RegexTester-DgxnEV3c.css", "/assets/Footer-Dee9p-3Y.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/image-watermarker": { "id": "routes/image-watermarker", "parentId": "root", "path": "image-watermarker", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/image-watermarker-DHSmEE8Q.js", "imports": ["/assets/chunk-EVOBXE3Y-B7j9GB9p.js", "/assets/normalizeImageFiles-CXLNTfhX.js", "/assets/CustomSelect-BLU04gPO.js", "/assets/jszip.min-C7HGm_fB.js", "/assets/Footer-D_uoRlQ4.js", "/assets/preload-helper-BXl3LOEh.js", "/assets/i18nInstance-CVCyxaL8.js"], "css": ["/assets/Watermarker-M59UJojG.css", "/assets/image-tools-shared-xQlKVJGj.css", "/assets/CustomSelect-BI28etKh.css", "/assets/Footer-Dee9p-3Y.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/image-resizer": { "id": "routes/image-resizer", "parentId": "root", "path": "image-resizer", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/image-resizer-m9Vkc2yQ.js", "imports": ["/assets/chunk-EVOBXE3Y-B7j9GB9p.js", "/assets/normalizeImageFiles-CXLNTfhX.js", "/assets/Footer-D_uoRlQ4.js", "/assets/preload-helper-BXl3LOEh.js", "/assets/i18nInstance-CVCyxaL8.js"], "css": ["/assets/image-tools-shared-xQlKVJGj.css", "/assets/ImageResizer-CF06uz8s.css", "/assets/Footer-Dee9p-3Y.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/image-collage": { "id": "routes/image-collage", "parentId": "root", "path": "image-collage", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/image-collage-BgqtTcEG.js", "imports": ["/assets/chunk-EVOBXE3Y-B7j9GB9p.js", "/assets/normalizeImageFiles-CXLNTfhX.js", "/assets/Footer-D_uoRlQ4.js", "/assets/preload-helper-BXl3LOEh.js", "/assets/i18nInstance-CVCyxaL8.js"], "css": ["/assets/ImageCollage-DxlrMB-V.css", "/assets/image-tools-shared-xQlKVJGj.css", "/assets/Footer-Dee9p-3Y.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/image-meme-generator": { "id": "routes/image-meme-generator", "parentId": "root", "path": "image-meme-generator", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/image-meme-generator-BX-gyGCA.js", "imports": ["/assets/chunk-EVOBXE3Y-B7j9GB9p.js", "/assets/Footer-D_uoRlQ4.js", "/assets/normalizeImageFiles-CXLNTfhX.js", "/assets/i18nInstance-CVCyxaL8.js", "/assets/preload-helper-BXl3LOEh.js"], "css": ["/assets/MemeGenerator-K_jKDtmO.css", "/assets/image-tools-shared-xQlKVJGj.css", "/assets/Footer-Dee9p-3Y.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/image-crop": { "id": "routes/image-crop", "parentId": "root", "path": "image-crop", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/image-crop-C-03QtTi.js", "imports": ["/assets/chunk-EVOBXE3Y-B7j9GB9p.js", "/assets/Footer-D_uoRlQ4.js", "/assets/normalizeImageFiles-CXLNTfhX.js", "/assets/CustomSelect-BLU04gPO.js", "/assets/i18nInstance-CVCyxaL8.js", "/assets/preload-helper-BXl3LOEh.js"], "css": ["/assets/image-tools-shared-xQlKVJGj.css", "/assets/ImageCrop-Bp0d5Owx.css", "/assets/CustomSelect-BI28etKh.css", "/assets/Footer-Dee9p-3Y.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/image-converter": { "id": "routes/image-converter", "parentId": "root", "path": "image-converter", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/image-converter-Co9Ki8Ez.js", "imports": ["/assets/chunk-EVOBXE3Y-B7j9GB9p.js", "/assets/preload-helper-BXl3LOEh.js", "/assets/jszip.min-C7HGm_fB.js", "/assets/Footer-D_uoRlQ4.js", "/assets/i18nInstance-CVCyxaL8.js"], "css": ["/assets/ImageConverter-D63ywdss.css", "/assets/image-tools-shared-xQlKVJGj.css", "/assets/Footer-Dee9p-3Y.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/image-rotator": { "id": "routes/image-rotator", "parentId": "root", "path": "image-rotator", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/image-rotator-DzVfEqJz.js", "imports": ["/assets/chunk-EVOBXE3Y-B7j9GB9p.js", "/assets/jszip.min-C7HGm_fB.js", "/assets/normalizeImageFiles-CXLNTfhX.js", "/assets/Footer-D_uoRlQ4.js", "/assets/preload-helper-BXl3LOEh.js", "/assets/i18nInstance-CVCyxaL8.js"], "css": ["/assets/image-tools-shared-xQlKVJGj.css", "/assets/ImageRotator-DWSaPz0e.css", "/assets/Footer-Dee9p-3Y.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/screen-recorder": { "id": "routes/screen-recorder", "parentId": "root", "path": "screen-recorder", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/screen-recorder-Bjp6gJPR.js", "imports": ["/assets/chunk-EVOBXE3Y-B7j9GB9p.js", "/assets/Footer-D_uoRlQ4.js", "/assets/Seo-Dj5N8W_M.js", "/assets/i18nInstance-CVCyxaL8.js"], "css": ["/assets/image-tools-shared-xQlKVJGj.css", "/assets/ScreenRecorder-BwsvtaAe.css", "/assets/Footer-Dee9p-3Y.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/about.us": { "id": "routes/about.us", "parentId": "root", "path": "about/us", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/about.us-Df9FfKx3.js", "imports": ["/assets/chunk-EVOBXE3Y-B7j9GB9p.js", "/assets/Footer-D_uoRlQ4.js", "/assets/Seo-Dj5N8W_M.js", "/assets/i18nInstance-CVCyxaL8.js"], "css": ["/assets/About-Cm4K-jFQ.css", "/assets/Footer-Dee9p-3Y.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/about.policy": { "id": "routes/about.policy", "parentId": "root", "path": "about/policy", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/about.policy-BggNOlx2.js", "imports": ["/assets/chunk-EVOBXE3Y-B7j9GB9p.js", "/assets/Footer-D_uoRlQ4.js", "/assets/Seo-Dj5N8W_M.js", "/assets/i18nInstance-CVCyxaL8.js"], "css": ["/assets/About-Cm4K-jFQ.css", "/assets/Footer-Dee9p-3Y.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/about.terms": { "id": "routes/about.terms", "parentId": "root", "path": "about/terms", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/about.terms-D2TDHqBD.js", "imports": ["/assets/chunk-EVOBXE3Y-B7j9GB9p.js", "/assets/Footer-D_uoRlQ4.js", "/assets/Seo-Dj5N8W_M.js", "/assets/i18nInstance-CVCyxaL8.js"], "css": ["/assets/About-Cm4K-jFQ.css", "/assets/Footer-Dee9p-3Y.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/contact": { "id": "routes/contact", "parentId": "root", "path": "contact", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/contact-CWzpG9zp.js", "imports": ["/assets/chunk-EVOBXE3Y-B7j9GB9p.js", "/assets/Footer-D_uoRlQ4.js", "/assets/Seo-Dj5N8W_M.js", "/assets/i18nInstance-CVCyxaL8.js"], "css": ["/assets/ContactUs-BZdRJ1cl.css", "/assets/Footer-Dee9p-3Y.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/blogs._index": { "id": "routes/blogs._index", "parentId": "root", "path": "blogs", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/blogs._index-BaDQ0BXL.js", "imports": ["/assets/chunk-EVOBXE3Y-B7j9GB9p.js", "/assets/Footer-D_uoRlQ4.js", "/assets/i18nInstance-CVCyxaL8.js"], "css": ["/assets/BlogsListPage-DbreybLm.css", "/assets/Footer-Dee9p-3Y.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/blogs.$slug": { "id": "routes/blogs.$slug", "parentId": "root", "path": "blogs/:slug", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/blogs._slug-CV8lvTJC.js", "imports": ["/assets/chunk-EVOBXE3Y-B7j9GB9p.js", "/assets/Footer-D_uoRlQ4.js", "/assets/i18nInstance-CVCyxaL8.js"], "css": ["/assets/BlogPage-Cc3sx4W3.css", "/assets/Footer-Dee9p-3Y.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/api.blogs": { "id": "routes/api.blogs", "parentId": "root", "path": "api/blogs", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": false, "hasErrorBoundary": false, "module": "/assets/api.blogs-l0sNRNKZ.js", "imports": [], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/api.blogs.$slug": { "id": "routes/api.blogs.$slug", "parentId": "root", "path": "api/blogs/:slug", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": false, "hasErrorBoundary": false, "module": "/assets/api.blogs._slug-l0sNRNKZ.js", "imports": [], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/api.r2-presign": { "id": "routes/api.r2-presign", "parentId": "root", "path": "api/r2-presign", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": false, "hasErrorBoundary": false, "module": "/assets/api.r2-presign-l0sNRNKZ.js", "imports": [], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 } }, "url": "/assets/manifest-b04a360f.js", "version": "b04a360f", "sri": void 0 };
const assetsBuildDirectory = "build\\client";
const basename = "/";
const future = { "unstable_optimizeDeps": false, "unstable_passThroughRequests": false, "unstable_subResourceIntegrity": false, "unstable_trailingSlashAwareDataRequests": false, "unstable_previewServerPrerendering": false, "v8_middleware": false, "v8_splitRouteModules": false, "v8_viteEnvironmentApi": false };
const ssr = true;
const isSpaMode = false;
const prerender = [];
const routeDiscovery = { "mode": "lazy", "manifestPath": "/__manifest" };
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/_index": {
    id: "routes/_index",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route1
  },
  "routes/pdf-compressor": {
    id: "routes/pdf-compressor",
    parentId: "root",
    path: "pdf-compressor",
    index: void 0,
    caseSensitive: void 0,
    module: route2
  },
  "routes/pdf-merger": {
    id: "routes/pdf-merger",
    parentId: "root",
    path: "pdf-merger",
    index: void 0,
    caseSensitive: void 0,
    module: route3
  },
  "routes/pdf-converter": {
    id: "routes/pdf-converter",
    parentId: "root",
    path: "pdf-converter",
    index: void 0,
    caseSensitive: void 0,
    module: route4
  },
  "routes/pdf-splitter": {
    id: "routes/pdf-splitter",
    parentId: "root",
    path: "pdf-splitter",
    index: void 0,
    caseSensitive: void 0,
    module: route5
  },
  "routes/json-formatter": {
    id: "routes/json-formatter",
    parentId: "root",
    path: "json-formatter",
    index: void 0,
    caseSensitive: void 0,
    module: route6
  },
  "routes/regex-tester": {
    id: "routes/regex-tester",
    parentId: "root",
    path: "regex-tester",
    index: void 0,
    caseSensitive: void 0,
    module: route7
  },
  "routes/image-watermarker": {
    id: "routes/image-watermarker",
    parentId: "root",
    path: "image-watermarker",
    index: void 0,
    caseSensitive: void 0,
    module: route8
  },
  "routes/image-resizer": {
    id: "routes/image-resizer",
    parentId: "root",
    path: "image-resizer",
    index: void 0,
    caseSensitive: void 0,
    module: route9
  },
  "routes/image-collage": {
    id: "routes/image-collage",
    parentId: "root",
    path: "image-collage",
    index: void 0,
    caseSensitive: void 0,
    module: route10
  },
  "routes/image-meme-generator": {
    id: "routes/image-meme-generator",
    parentId: "root",
    path: "image-meme-generator",
    index: void 0,
    caseSensitive: void 0,
    module: route11
  },
  "routes/image-crop": {
    id: "routes/image-crop",
    parentId: "root",
    path: "image-crop",
    index: void 0,
    caseSensitive: void 0,
    module: route12
  },
  "routes/image-converter": {
    id: "routes/image-converter",
    parentId: "root",
    path: "image-converter",
    index: void 0,
    caseSensitive: void 0,
    module: route13
  },
  "routes/image-rotator": {
    id: "routes/image-rotator",
    parentId: "root",
    path: "image-rotator",
    index: void 0,
    caseSensitive: void 0,
    module: route14
  },
  "routes/screen-recorder": {
    id: "routes/screen-recorder",
    parentId: "root",
    path: "screen-recorder",
    index: void 0,
    caseSensitive: void 0,
    module: route15
  },
  "routes/about.us": {
    id: "routes/about.us",
    parentId: "root",
    path: "about/us",
    index: void 0,
    caseSensitive: void 0,
    module: route16
  },
  "routes/about.policy": {
    id: "routes/about.policy",
    parentId: "root",
    path: "about/policy",
    index: void 0,
    caseSensitive: void 0,
    module: route17
  },
  "routes/about.terms": {
    id: "routes/about.terms",
    parentId: "root",
    path: "about/terms",
    index: void 0,
    caseSensitive: void 0,
    module: route18
  },
  "routes/contact": {
    id: "routes/contact",
    parentId: "root",
    path: "contact",
    index: void 0,
    caseSensitive: void 0,
    module: route19
  },
  "routes/blogs._index": {
    id: "routes/blogs._index",
    parentId: "root",
    path: "blogs",
    index: void 0,
    caseSensitive: void 0,
    module: route20
  },
  "routes/blogs.$slug": {
    id: "routes/blogs.$slug",
    parentId: "root",
    path: "blogs/:slug",
    index: void 0,
    caseSensitive: void 0,
    module: route21
  },
  "routes/api.blogs": {
    id: "routes/api.blogs",
    parentId: "root",
    path: "api/blogs",
    index: void 0,
    caseSensitive: void 0,
    module: route22
  },
  "routes/api.blogs.$slug": {
    id: "routes/api.blogs.$slug",
    parentId: "root",
    path: "api/blogs/:slug",
    index: void 0,
    caseSensitive: void 0,
    module: route23
  },
  "routes/api.r2-presign": {
    id: "routes/api.r2-presign",
    parentId: "root",
    path: "api/r2-presign",
    index: void 0,
    caseSensitive: void 0,
    module: route24
  }
};
const allowedActionOrigins = false;
export {
  allowedActionOrigins,
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  prerender,
  publicPath,
  routeDiscovery,
  routes,
  ssr
};
