import React from "react";
import { FaFilePdf, FaInfoCircle } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import LogoSVG from "../../../../assets/icon/LogoSVG";

const PreviewModal = ({ isOpen, onClose, caso }) => {
  if (!isOpen) return null;

  // Función para borrar etiquetas HTML del contenido de la publicación
  const borrarEtiquetasHtml = (html) => {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  };

  // Obtener contenido multimedia de Jodit
  const getMediaContent = (mediaHtml) => {
    const div = document.createElement('div');
    div.innerHTML = mediaHtml;

    const img = div.querySelector('img');
    const video = div.querySelector('video');
    const iframe = div.querySelector('iframe');

    if (img) {
      return <img src={img.src} alt="Media Content" className="w-full h-auto rounded-lg shadow-lg" />;
    } else if (video) {
      return (
        <video controls className="w-full h-auto rounded-lg shadow-lg">
          <source src={video.src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      );
    } else if (iframe) {
      return (
        <div className="w-full h-auto rounded-lg shadow-lg">
          <iframe
            src={iframe.src}
            title="Video Content"
            className="w-full h-64 md:h-96"
            frameBorder="0"
            allowFullScreen
          />
        </div>
      );
    } else {
      return null;
    }
  };

  const mediaContent = getMediaContent(caso.contenidoMultimedia);

  const getStatusColor = (estado) => {
    switch (estado.toLowerCase()) {
      case 'nuevo':
        return 'text-blue-500';
      case 'en proceso':
        return 'text-yellow-500';
      case 'completado':
        return 'text-green-500';
      case 'archivado':
        return 'text-gray-500';
      default:
        return 'text-gray-700';
    }
  };

  const exportarAPDF = (casoId) => {
    const apiEndpoint = import.meta.env.VITE_API_ENDPOINT;
    const url = `${apiEndpoint}/casos/ver/pdf/${casoId}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-900 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-8 w-3/4 max-w-3xl relative">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <img src="/src/assets/img/logo.svg" className="h-12 w-12 mr-4" />
            <h2 className="text-3xl font-bold text-gray-800">{borrarEtiquetasHtml(caso.titulo)}</h2>
          </div>
          <button onClick={onClose} className="text-gray-600 hover:text-red-600 transition duration-200">
            <MdClose size={28} />
          </button>
        </div>
        <div className="border-t border-gray-300 pt-4">
          <p className="flex items-center text-lg">
            <FaInfoCircle className="mr-2 text-gray-600" />
            <strong className="mr-2">Estado:</strong>
            <span className={getStatusColor(caso.estado)}>{borrarEtiquetasHtml(caso.estado)}</span>
          </p>
          <p className="mt-4 text-gray-700"><strong>Descripción:</strong> {borrarEtiquetasHtml(caso.descripcion)}</p>
          <p className="mt-2 text-gray-700"><strong>Fecha de Creación:</strong> {borrarEtiquetasHtml(caso.fechaCreacion)}</p>
          <p className="mt-2 text-gray-700"><strong>Tipo de Caso:</strong> {borrarEtiquetasHtml(caso.tipoCaso.nombre)}</p>
          {mediaContent && (
            <div className="mt-6">
              {mediaContent}
            </div>
          )}
        </div>
        <div className="flex justify-end mt-6">
          <button 
            className="bg-red-600 text-white px-5 py-2 rounded-lg shadow hover:bg-red-700 transition duration-200 flex items-center"
            onClick={() => exportarAPDF(caso.id)}
          >
            <FaFilePdf className="mr-2" /> Exportar a PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;
