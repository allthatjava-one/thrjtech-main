[DONE] I want to add a meme generator to my site using React + Canvas API. It will allow users to create custom memes by uploading images, adding text, and customizing the layout. The generated memes can be downloaded or shared on social media. This tool will be a fun and engaging addition to my site, attracting a wider audience and increasing user interaction.

To implement the meme generator, I will follow these steps:
1. Set up a new React component for the meme generator.
2. Use the Canvas API to allow users to upload images and add text.
3. Provide options for customizing the layout, such as font size, color, and text positioning.
4. Implement functionality to download the generated meme as an image file.
5. Add social media sharing options for users to easily share their creations.
Here is a basic outline of the React component for the meme generator:

## Technical Implementation
- Have a new end point for the meme generator, e.g., `/image-meme-generator`
- Add a new tool menu in Navbar for the meme generator under "Image" section as "Meme Generator"
- Place a code in `src/tools/image-meme-generator/MemeGenerator.js`
- Have a design principal same as the other tools like the code under `src/tools/image-collage`

## User Interface
- The UI will consist of an image upload section, a text input area for adding captions,and a preview area where users can see their meme in real-time.
- Users will have options to customize the font size, color, and position of the text on the image.
- A download button will allow users to save their created memes

