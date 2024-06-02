import { useEffect, useState } from 'react'
import PhotoAlbum from 'react-photo-album' 
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'

function App() {
  const {
    VITE_TITLE: title,
    VITE_PAGE_COPY: copy,
    VITE_PAGE_FOOTER: footer,
    VITE_ROW_HEIGHT: rowHeight
  } = import.meta.env

  const [index, setIndex] = useState(-1)
  const [gallery, setGallery] = useState(0);

  useEffect(() => {
    fetch('/gallery.json')
      .then(response => response.json())
      .then(data => setGallery(data))
      .catch(error => console.error('Unable to fetch gallery.json:', error));
  }, [])

  return (
    <>
      <h1>{title}</h1>
      <p className="copy">{copy}</p>
      <br />
      <PhotoAlbum
        photos={gallery.thumbs}
        layout="rows"
        targetRowHeight={rowHeight}
        onClick={({ index }) => setIndex(index)}
      />
      <Lightbox
        slides={gallery.photos}
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
      />
      <footer>&copy; {(new Date().getFullYear())} &nbsp; {footer}</footer>
    </>
  )
}

export default App;
