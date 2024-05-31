import React, { useState, useEffect, useContext } from 'react';
import { CargarTodasLasPublicaciones } from '../../../../services/PublicacionService';
import { Link } from 'react-router-dom';
import { FaLock } from 'react-icons/fa';
import ReactPaginate from 'react-paginate';
import { useAuth } from '../features/Context/AuthContext';

const UsuarioPublicaciones = () => {
  const [publicaciones, setPublicaciones] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [filteredPublicaciones, setFilteredPublicaciones] = useState([]);
  const { user } = useAuth();

  const publicacionesPerPage = 3;
  const pagesVisited = pageNumber * publicacionesPerPage;

  useEffect(() => {
    const loadPublicaciones = async () => {
      try {
        const data = await CargarTodasLasPublicaciones();
        setPublicaciones(Array.isArray(data) ? data : []);
        setFilteredPublicaciones(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error cargando publicaciones:', error);
        setPublicaciones([]);
      }
    };

    loadPublicaciones();
  }, []);

  const pageCount = Math.ceil(filteredPublicaciones.length / publicacionesPerPage);
  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  const handleFilterChange = (e) => {
    const filter = e.target.value;
    const filtered = publicaciones.filter(pub => pub.categoria === filter || pub.titulo.includes(filter));
    setFilteredPublicaciones(filtered);
    setPageNumber(0); // Reseteamos la página a la primera
  };

  const borrarEtiquetasHtml = (html) => {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  };

  const ultimaPublicacion = publicaciones.length > 0 ? publicaciones[0] : null;
  const publicacionesPremium = publicaciones.filter(pub => pub.categoria === 'premium');

  return (
    <div className="user-publicaciones container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Publicaciones del Blog</h1>

      {ultimaPublicacion && (
        <div className="mb-12">
          <h2 className="text-3xl font-semibold mb-6 text-gray-800">Último Post del Blog</h2>
          <div className="relative p-6 border border-gray-200 rounded-lg bg-white shadow-lg">
            <img src={`data:image/jpeg;base64,${ultimaPublicacion.foto}`} alt={ultimaPublicacion.titulo} className="w-full h-80 object-cover rounded-lg mb-6" />
            <h3 className="text-2xl font-semibold mb-4">{ultimaPublicacion.titulo}</h3>
            <p className="text-gray-600 mb-6">{borrarEtiquetasHtml(ultimaPublicacion.contenido).slice(0, 200)}...</p>
            <Link to={`/publicacion/${ultimaPublicacion.pid}`} className="text-indigo-500 hover:text-indigo-700 font-semibold">Leer más »</Link>
          </div>
        </div>
      )}

      <div className="mb-12">
        <h2 className="text-3xl font-semibold mb-6 text-gray-800">Categoría Premium</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {publicacionesPremium.map(pub => (
            <div key={pub.pid} className="relative p-6 border border-gray-200 rounded-lg bg-white shadow-lg">
              <img src={`data:image/jpeg;base64,${pub.foto}`} alt={pub.titulo} className="w-full h-48 object-cover rounded-lg mb-4" />
              {user && user.role === 'ROLE_PREMIUM' ? (
                <>
                  <h3 className="text-xl font-semibold mb-2">{pub.titulo}</h3>
                  <p className="text-gray-600 mb-4">{borrarEtiquetasHtml(pub.contenido).slice(0, 100)}...</p>
                  <Link to={`/publicacion/${pub.pid}`} className="text-indigo-500 hover:text-indigo-700 font-semibold">Leer más »</Link>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-semibold mb-2 text-gray-500">{pub.titulo}</h3>
                  <p className="text-gray-500 mb-4">{borrarEtiquetasHtml(pub.contenido).slice(0, 50)}... <FaLock className="inline" /></p>
                  <div className="text-center text-gray-500">
                    <FaLock className="inline mr-2" /> Solo accesible para usuarios premium
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-3xl font-semibold mb-6 text-gray-800">Publicaciones Recientes</h2>
        <input
          type="text"
          placeholder="Filtrar por categoría o título"
          onChange={handleFilterChange}
          className="p-2 border border-gray-300 rounded-lg w-full mb-6"
        />
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPublicaciones.slice(pagesVisited, pagesVisited + publicacionesPerPage).map((publicacion) => (
            <li key={publicacion.pid} className="p-6 border border-gray-200 rounded-lg bg-white shadow-lg">
              <img src={`data:image/jpeg;base64,${publicacion.foto}`} alt={publicacion.titulo} className="w-full h-48 object-cover rounded-lg mb-4" />
              <h3 className="text-xl font-semibold mb-2">{publicacion.titulo}</h3>
              <p className="text-gray-600 mb-4">{borrarEtiquetasHtml(publicacion.contenido).slice(0, 100)}...</p>
              <Link to={`/publicacion/${publicacion.pid}`} className="text-indigo-500 hover:text-indigo-700 font-semibold">Leer más »</Link>
            </li>
          ))}
        </ul>
        <ReactPaginate
          previousLabel={"Anterior"}
          nextLabel={"Siguiente"}
          pageCount={pageCount}
          onPageChange={changePage}
          containerClassName={"pagination flex justify-center items-center mt-8 space-x-2"}
          previousLinkClassName={"py-2 px-4 bg-white text-black text-sm rounded-lg border border-gray-300 hover:bg-gray-200 transition"}
          nextLinkClassName={"py-2 px-4 bg-white text-black text-sm rounded-lg border border-gray-300 hover:bg-gray-200 transition"}
          disabledClassName={"paginationDisabled text-gray-400"}
          activeClassName={"paginationActive bg-white text-indigo-900 border border-gray-300"}
          pageClassName={"page-item py-2 px-4 bg-white text-black text-sm rounded-lg border border-gray-300 hover:bg-gray-200 transition"}
          pageLinkClassName={"page-link"}
          breakLabel={"..."}
          breakClassName={"break-item py-2 px-4 bg-white text-black text-sm rounded-lg border border-gray-300 hover:bg-gray-200 transition"}
        />
      </div>
    </div>
  );
};

export default UsuarioPublicaciones;
