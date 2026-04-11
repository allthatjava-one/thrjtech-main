I want new end point /image-converter to be added to the app. It will be a new tool called Image Converter. It will allow users to convert images between different formats (e.g., JPG, PNG, GIF). The UI should be similar to the existing image tools, with a drag-and-drop area for uploading images and options for selecting the output format. The converted image should be available for download immediately after processing.

Here is a high-level outline of the steps to implement the new Image Converter tool:
1. Create a new React component for the Image Converter tool (e.g., ImageConverterView.jsx).
2. Add a new route in the app's routing configuration to point to the new Image Converter component.
3. Design the UI for the Image Converter tool, including a drag-and-drop area for uploading images and a dropdown or selection menu for choosing the output format.
4. Implement the logic for handling image uploads, processing the conversion, and providing a download link for the converted image.
5. Style the new component to match the look and feel of the existing image tools.
6. Test the new Image Converter tool to ensure it works correctly and provides a good user experience.

# Tech Details:
- The code should be placed in the src/tools/image-converter directory.
- The main component file should be named ImageConverterView.jsx.
- The CSS file for styling should be named ImageConverter.css.
- WASM should be used for the image conversion processing to ensure fast performance.

# Design Requirements:
- Page look and feel should be consistent with existing image tools (Image Resizer, Image Crop, Image Watermarker, Image Collage).
- The UI should detect uploaded image file types and provide a possible output format based on the input (e.g., if a user uploads a PNG, they should be able to convert it to JPG, GIF, etc.).
- The drag-and-drop area should have a clear call-to-action for users to upload their images
- The output format selection should be intuitive and easy to use, possibly using a dropdown menu or a set of buttons.
- After conversion, the download link for the converted image should be prominently displayed and easy to access.
