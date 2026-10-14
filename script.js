// Esperar a que todo el HTML esté listo
document.addEventListener('DOMContentLoaded', () => {
  // Tomar las fotos declaradas en la ventana actual
  const images = (window.pageImages && window.pageImages.length > 0) 
    ? window.pageImages 
    : ['images/foto1.jpg'];

  let currentIndex = 0;
  const imageElement = document.getElementById('current-image');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

// Agregamos esta línea para reconocer la nueva caja que creamos en el HTML
// Variables para controlar la API de YouTube
let youtubePlayer = null;
const mediaContainer = document.getElementById('media-container');

function updateImage(index) {
  if (!mediaContainer || images.length === 0) return;
  
  mediaContainer.style.position = 'relative';
  const item = images[index];
  let nuevoElemento;
  
  if (youtubePlayer && typeof youtubePlayer.destroy === 'function') {
      youtubePlayer.destroy();
      youtubePlayer = null;
  }

  // --- TRATAMIENTO DE VIDEOS DE YOUTUBE ---
  if (item.includes('youtube.com')) {
    const videoId = extraerIdYoutube(item);
    if (!videoId) return; 

    nuevoElemento = document.createElement('div');
    nuevoElemento.id = 'youtube-player-placeholder'; 
    nuevoElemento.style.position = 'absolute';
    nuevoElemento.style.width = '100%';
    nuevoElemento.style.height = '100%';
    nuevoElemento.style.border = 'none';
    nuevoElemento.style.opacity = '0'; 
    nuevoElemento.style.transition = 'opacity 0.6s ease-in-out'; 

    mediaContainer.appendChild(nuevoElemento);

    youtubePlayer = new YT.Player('youtube-player-placeholder', {
        videoId: videoId,
        playerVars: { 'autoplay': 1, 'modestbranding': 1, 'rel': 0 },
        events: {
            'onReady': function(event) {
                const iframeElement = event.target.getIframe();
                iframeElement.style.opacity = '1';
                setTimeout(() => {
                    while (mediaContainer.children.length > 1) {
                        if (mediaContainer.firstChild !== iframeElement) {
                            mediaContainer.removeChild(mediaContainer.firstChild);
                        } else {
                            mediaContainer.removeChild(mediaContainer.lastChild);
                        }
                    }
                }, 650); 
            }
        }
    });

  // --- TRATAMIENTO DE VIDEOS DE VIMEO ---
  } else if (item.includes('vimeo.com')) {
    nuevoElemento = document.createElement('iframe');
    nuevoElemento.src = item;
    nuevoElemento.style.position = 'absolute';
    nuevoElemento.style.width = '100%';
    nuevoElemento.style.height = '100%';
    nuevoElemento.style.border = 'none';
    nuevoElemento.style.opacity = '0'; 
    nuevoElemento.style.transition = 'opacity 0.4s ease-in-out';
    nuevoElemento.allow = "autoplay; fullscreen; picture-in-picture";
    
    mediaContainer.appendChild(nuevoElemento);
    
    setTimeout(() => { nuevoElemento.style.opacity = '1'; }, 50); 
    setTimeout(() => {
      while (mediaContainer.children.length > 1) {
        mediaContainer.removeChild(mediaContainer.firstChild);
      }
    }, 500);

  // --- TRATAMIENTO DE IMÁGENES NORMALES ---
  } else {
    nuevoElemento = document.createElement('img');
    nuevoElemento.src = item;
    nuevoElemento.alt = "Proyecto";
    nuevoElemento.style.objectFit = 'contain';
    nuevoElemento.style.position = 'absolute';
    nuevoElemento.style.width = '100%';
    nuevoElemento.style.height = '100%';
    nuevoElemento.style.border = 'none';
    nuevoElemento.style.opacity = '0'; 
    nuevoElemento.style.transition = 'opacity 0.4s ease-in-out';
    
    mediaContainer.appendChild(nuevoElemento);
    
    setTimeout(() => { nuevoElemento.style.opacity = '1'; }, 50); 
    setTimeout(() => {
      while (mediaContainer.children.length > 1) {
        mediaContainer.removeChild(mediaContainer.firstChild);
      }
    }, 500);
  }
}

// ... de aquí hacia abajo dejas intactos tus eventos de los botones (nextBtn y prevBtn) ...

  // Establecer la primera imagen de la galería de esta página
  if (imageElement && images.length > 0) {
    imageElement.src = images[0];
  }

  // Evento botón Siguiente
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % images.length;
      updateImage(currentIndex);
    });
  }

  // Evento botón Anterior
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      updateImage(currentIndex);
    });
  }
});

// Función auxiliar universal para extraer el ID de video de YouTube
function extraerIdYoutube(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}