import React, { useState, useEffect } from 'react';
import { CargarTodasLasPublicaciones, BorrarPublicacionPorId } from '../../../../services/PublicacionService';
import { FaEdit, FaTrash, FaPlus, FaExclamationTriangle } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import ReactPaginate from 'react-paginate';
import CustomModal from '../common/CustomModal/CustomModal';
import { Link, useNavigate } from 'react-router-dom';

const AdminPublicaciones = () => {
  const [publicaciones, setPublicaciones] = useState([]);
  const [currentPublicacion, setCurrentPublicacion] = useState(null);
  const [pageNumber, setPageNumber] = useState(0);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const navigate = useNavigate();

  const publicacionesPerPage = 3;
  const pagesVisited = pageNumber * publicacionesPerPage;

  useEffect(() => {
    const loadPublicaciones = async () => {
      try {
        const data = await CargarTodasLasPublicaciones();
        setPublicaciones(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error cargando publicaciones:', error);
        setPublicaciones([]);
      }
    };

    loadPublicaciones();
  }, []);

  const handleEdit = (publicacion) => {
    navigate(`/admin/editar-publicacion/${publicacion.pid}`);
  };

  const openDeleteModal = (publicacion) => {
    setCurrentPublicacion(publicacion);
    setDeleteModalIsOpen(true);
  };

  const handleDelete = async () => {
    try {
      await BorrarPublicacionPorId(currentPublicacion.pid);
      const data = await CargarTodasLasPublicaciones();
      setPublicaciones(Array.isArray(data) ? data : []);
      setDeleteModalIsOpen(false);
      setCurrentPublicacion(null);
    } catch (error) {
      console.error('Error eliminando publicación:', error);
    }
  };

  const pageCount = Math.ceil(publicaciones.length / publicacionesPerPage);
  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  const closeDeleteModal = () => {
    setDeleteModalIsOpen(false);
    setCurrentPublicacion(null);
  };

  // Funcion para borrar etiquetas HTML del contenido de la publicación
  const borrarEtiquetasHtml = (html) => {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  };

  return (
    <div className="admin-publicaciones container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">Administración de Publicaciones</h1>
      <div className="relative inline-block text-left mb-6">
        <div>
          <Link to="/admin/crear-publicaciones" className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-green-500 text-sm font-medium text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-green-500">
            <FaPlus className="mr-2" /> Añadir Publicación
          </Link>
        </div>
      </div>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {publicaciones.slice(pagesVisited, pagesVisited + publicacionesPerPage).map((publicacion) => (
            <motion.li
              key={publicacion.pid}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="p-4 border border-gray-200 rounded-lg flex flex-col bg-white shadow-sm"
            >
              <div className="relative">
                <img src={`data:image/jpeg;base64,${publicacion.foto}`} alt={publicacion.titulo} className="w-full h-48 object-cover rounded-t-lg" />
                <span className="absolute top-2 right-2 bg-black text-white text-xs px-2 py-1 rounded">{publicacion.categoria}</span>
              </div>
              <div className="flex items-center mt-4">
                {publicacion.usuarioFoto ? (
                  <img src={`data:image/jpeg;base64,${publicacion.usuarioFoto}`} alt={publicacion.username} className="w-10 h-10 rounded-full mr-4" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-300 text-gray-700 flex items-center justify-center mr-4">
                    {publicacion.username.charAt(0)}
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-semibold">{publicacion.titulo}</h3>
                  <p className="text-sm text-gray-600">{borrarEtiquetasHtml(publicacion.contenido).slice(0, 100)}...</p>
                  <Link to={`/publicacion/${publicacion.pid}`} className="text-purple-500 hover:text-purple-700">Leer más »</Link>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4">
                <span className="text-sm text-gray-500">{new Date(publicacion.fechaCreacion).toLocaleDateString()}</span>
                <span className="text-sm text-gray-500">{publicacion.comentarios ? publicacion.comentarios.length : 0} comentarios</span>
              </div>
              <div className="flex flex-row-reverse mt-4">
                <button onClick={() => handleEdit(publicacion)} className="p-2 text-blue-500 hover:text-blue-700">
                  <FaEdit />
                </button>
                <button onClick={() => openDeleteModal(publicacion)} className="p-2 text-red-500 hover:text-red-700">
                  <FaTrash />
                </button>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
      <ReactPaginate
        previousLabel={"Anterior"}
        nextLabel={"Siguiente"}
        pageCount={pageCount}
        onPageChange={changePage}
        containerClassName={"pagination flex justify-center items-center mt-4 space-x-2"}
        previousLinkClassName={"py-2 px-4 bg-white text-black text-sm rounded-lg border border-gray-300 hover:bg-gray-200 transition"}
        nextLinkClassName={"py-2 px-4 bg-white text-black text-sm rounded-lg border border-gray-300 hover:bg-gray-200 transition"}
        disabledClassName={"paginationDisabled text-gray-400"}
        activeClassName={"paginationActive bg-blue-500 text-black border border-gray-300"}
        pageClassName={"page-item py-2 px-4 bg-white text-black text-sm rounded-lg border border-gray-300 hover:bg-gray-200 transition"}
        pageLinkClassName={"page-link"}
        breakLabel={"..."}
        breakClassName={"break-item py-2 px-4 bg-white text-black text-sm rounded-lg border border-gray-300 hover:bg-gray-200 transition"}
      />
      <CustomModal isOpen={deleteModalIsOpen} onClose={closeDeleteModal} hideCloseButton={true}>
        <div className="text-center">
          <FaExclamationTriangle className="text-red-500 text-3xl mx-auto mb-4" />
          <h2 className="text-2xl mb-4">¿Estás seguro?</h2>
          <p className="mb-4">¿Realmente deseas eliminar esta publicación? Este proceso no se puede deshacer.</p>
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white p-2 rounded w-full mb-2"
          >
            Sí, eliminar
          </button>
          <button
            type="button"
            onClick={closeDeleteModal}
            className="p-2 w-full text-center rounded bg-gray-300 text-gray-700"
          >
            Cancelar
          </button>
        </div>
      </CustomModal>
    </div>
  );
};

export default AdminPublicaciones;
