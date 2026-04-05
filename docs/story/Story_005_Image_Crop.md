I want to add a image crop feature to the image editor tool. This feature will allow users to select a portion of the image and crop it to their desired dimensions. I will implement this feature using a cropping library that provides an intuitive interface for users to select the crop area. The cropped image will then be available for download or further editing within the tool.

## Technical Details
- Use react-easy-crop library
- Must have drag crop area
- Should have zoom slider
- Aspect ratio selector ( "1:1 Profile", "16:9 Youtube", "4:5 Instagram")
- Also should provide Image rotator (90 degree clockwise and counterclockwise)
- Also should have Flip image horizontally and vertically
- Should have preset button "Instragram Post", "Youtube Thumbnail", "Profile Picture" that will automatically set the aspect ratio and crop area to fit the selected format.
- Source code should be added to `src/tools/image-crop` directory, and have same design principles as the rest of the site, with a clean and user-friendly interface that encourages users to engage with the cropping feature and create their desired image edits. This includes NavBar and Footer.
- New end point `/image-crop` should be added to the router, and the page should be accessible at this URL path. The page should include the cropping interface and controls as described above, allowing users to easily crop their images to their desired specifications.
- New Navlink "Crop" should be added to the navigation bar under "Image" section, linking to the new cropping page at `/image-crop`. This will allow users to easily access the cropping feature from anywhere on the site and encourage them to utilize this new tool for their image editing needs.
- "Preview" button should be added to the cropping interface, allowing users to see a preview of their cropped image before finalizing the crop. This will help users ensure that they are satisfied with the crop area and aspect ratio before downloading or further editing their image. The preview should update in real-time as users adjust the crop area and aspect ratio, providing immediate feedback on how their changes will affect the final cropped image.
- "Download" button should be added to the cropping interface, allowing users to download their cropped image directly from the tool. This button should become active once the user has made adjustments to the crop area and aspect ratio, and should provide a clear and straightforward way for users to save their edited image to their device. The downloaded image should maintain the quality of the original image while reflecting the changes made through the cropping interface.
- The cropping area should support Alt+Scroll or Pinch to zoom in and out of the image, allowing users to fine-tune their crop area with precision. This feature will enhance the user experience by providing an easy way to adjust the zoom level while selecting the crop area, making it easier for users to achieve their desired crop without needing to manually adjust the zoom slider. The zoom functionality should be smooth and responsive, ensuring that users can easily navigate and adjust their crop area as needed.

## Design Details
- The crop interface should be integrated seamlessly into the existing image editor layout, with clear controls for cropping, zooming, and rotating the image.
- The crop area should be visually distinct, with a shaded overlay to indicate the portion of the image that will be retained after cropping.
- The aspect ratio selector should be easily accessible, allowing users to quickly switch between common formats for social media and other uses.
- The zoom slider should provide smooth control over the zoom level, allowing users to fine-tune their crop area with precision.
- The preset buttons should be prominently displayed, providing a quick way for users to set up their crop area for popular formats without needing to manually adjust the aspect ratio and crop area.
- The image rotator and flip controls should be intuitive and easy to use, allowing users to quickly adjust the orientation of their image as needed before cropping.
- Page should have same design principles as the rest of the site, with a clean and user-friendly interface that encourages users to engage with the cropping feature and create their desired image edits. This includes NavBar and Footer.
