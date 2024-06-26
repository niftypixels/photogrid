# photogrid

Generate a photography portfolio website with a responsive image gallery. 

## Installing
Clone the repository and install the dependencies:

```bash
git clone https://github.com/niftypixels/photogrid.git
cd photogrid
npm install
```

## Usage
Add images to `public/photos/` and run the darkroom command to generate thumbnails and the gallery manifest: 

```bash
npm run darkroom
```


Run the development server:

```bash
npm run dev
```

Open [http://localhost:5173/](http://localhost:5173/) to view it in the browser.

## Build for Production

```bash
npm run build
```

The build is minified into the `dist/` directory.

Upload the contents of `dist/` to your web server.


