import { useEffect, useState } from 'react'
import PhotoAlbum from 'react-photo-album'
import Lightbox from 'yet-another-react-lightbox'
import { Captions } from 'yet-another-react-lightbox/plugins'
import 'yet-another-react-lightbox/plugins/captions.css'
import 'yet-another-react-lightbox/styles.css'
import gallery from './assets/gallery.json'
import logo from './assets/logo.png'

function App() {
  const {
    VITE_TITLE: title,
    VITE_LOGO_TEXT: logoText,
    VITE_CONTACT_PHONE: phone,
    VITE_PAGE_COPY: copy,
    VITE_PAGE_FOOTER: footer,
    VITE_ROW_HEIGHT: rowHeight
  } = import.meta.env

  const [index, setIndex] = useState(-1)

  useEffect(() => {
    const header = document.getElementsByTagName('header')[0];
    const scrim = document.getElementById('scrim');

    const handleScroll = () => {
      const { height } = header.getBoundingClientRect();
      scrim.style.height = `${Math.ceil(height)}px`;

      if (window.scrollY > height / 2) {
        scrim.classList.add('scroll');
      } else {
        scrim.classList.remove('scroll');
      }
    };

    document.addEventListener('contextmenu', (e) => { e.preventDefault(); });

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, []);

  return (
    <>
      <div id='scrim'></div>
      <header>
        <img width="250" src={logo} alt={logoText} />
        <a href={`tel:${phone}`}>{phone}</a>
      </header>
      <h1>{title}</h1>
      <p className="copy" dangerouslySetInnerHTML={{ __html: copy }} />
      <br />
      <PhotoAlbum
        photos={gallery.thumbs}
        layout="rows"
        targetRowHeight={rowHeight}
        onClick={({ index }) => setIndex(index)}
      />
      <Lightbox
        slides={gallery.photos}
        captions={{
          descriptionTextAlign: 'center',
        }}
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        plugins={[Captions]}
      />
      <footer>&copy; {(new Date().getFullYear())} {footer}</footer>
    </>
  )
}

export default App;
