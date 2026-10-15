import "../styles/ImagePlaceholder.css";

// Recuadro con cruz que representa una foto a incluir en el futuro.
// Cuando tengas la imagen real, pasá la prop `src` y se mostrará la foto.
function ImagePlaceholder({ src, alt = "", className = "", style }) {
  return (
    <div className={`image-placeholder ${className}`} style={style}>
      {src ? (
        <img src={src} alt={alt} />
      ) : (
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <line x1="0" y1="0" x2="100" y2="100" vectorEffect="non-scaling-stroke" />
          <line x1="100" y1="0" x2="0" y2="100" vectorEffect="non-scaling-stroke" />
        </svg>
      )}
    </div>
  );
}

export default ImagePlaceholder;
