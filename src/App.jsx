import { useState } from 'react'

import PhotoAlbum from 'react-photo-album' 
import Lightbox from 'yet-another-react-lightbox'

import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen'
import Slideshow from 'yet-another-react-lightbox/plugins/slideshow'
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'

import 'yet-another-react-lightbox/plugins/thumbnails.css'
import 'yet-another-react-lightbox/styles.css'

import photos from './photos'

function App() {
  const {
    VITE_TITLE: title,
    VITE_PAGE_COPY: copy,
    VITE_PAGE_FOOTER: footer
  } = import.meta.env

  const [index, setIndex] = useState(-1)

  return (
    <>
      <h1>{title}</h1>
      <p className="copy">{copy}</p>
      <br />
      <PhotoAlbum
        photos={photos}
        layout="rows"
        targetRowHeight={150}
        onClick={({ index }) => setIndex(index)}
      />
      <Lightbox
        slides={photos}
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        // enable optional lightbox plugins
        plugins={[Fullscreen, Slideshow, Thumbnails, Zoom]}
      />
      <footer>&copy; {(new Date().getFullYear())} &nbsp; {footer}</footer>
    </>
  )
}

export default App;
