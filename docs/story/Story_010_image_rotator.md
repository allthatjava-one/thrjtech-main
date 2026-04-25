I want to add a new feature that rotates the images. I will create a new component called ImageRotator that allows users to rotate their images by 90 degrees clockwise or counterclockwise. This component will be integrated into the existing image editing tools in the application.

# Image Rotator Component
- The ImageRotator component will have two buttons: "Rotate Left" and "Rotate Right". When a user clicks on either button, the image will rotate accordingly.
- The component will use CSS transforms to rotate the image on the screen, and it will also update the underlying image data so that the rotation is preserved when the user saves or exports the image.
- It should take multiple image formats into account, ensuring that the rotation works correctly regardless of the file type (e.g., JPEG, PNG, GIF).
- Preview functionality will be included so users can see the rotated image before applying the changes permanently.
- The component will be designed to be responsive and work well on both desktop and mobile devices, allowing users to easily rotate images on any platform.

# Design Principles
- The UI should be similiar to other image features, with clear and intuitive buttons for rotating images.
- There should be a "Download" button when the user uploade a single image, and a "Download All" button when the user uploads multiple images. These buttons will allow users to download the rotated images directly from the interface.
- "Download All" buttuon should zip all the rotated images together and provide a single download link for the zip file, making it convenient for users to obtain all their edited images at once.

# New end point
- `/image-rotator` : This end point should be added in NavBar.jsx and link to the new ImageRotator component, allowing users to easily access the image rotation feature from the main navigation menu.
- Code should be placed in /src/tools/image-rotator/ImageRotator.jsx and /src/tools/image-rotator/ImageRotator.css for the component's logic and styling, respectively.