import React, { useRef, useState, useEffect } from "react";
import JoditEditor from "jodit-react";
import { FaPlus, FaSave, FaTrash, FaEdit } from 'react-icons/fa';
import Notification from "../../../user/components/features/Notification/Notification";
import { updatePublicacion, fetchPublicacionPorId } from "../../../../services/PublicacionService";
import { useAuth } from "../../../user/components/features/Context/AuthContext";
import { CrearCategoria, CargarCategorias } from '../../../../services/CategoriaService';
import CustomModal from "../common/CustomModal/CustomModal";
import { useNavigate, useParams } from "react-router-dom";

function EditarPublicacion() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const [imagedata, setImagedata] = useState(null);
  const [stateData, setStateData] = useState({ titulo: "", contenido: "", categoriaId: "", secciones: [] });
  const [notification, setNotification] = useState({ isOpen: false, message: '', type: '' });
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({ nombre: "", descripcion: "" });
  const [categorias, setCategorias] = useState([]);
  const editor = useRef(null);
  const seccionEditor = useRef(null);
  const [nuevaSeccion, setNuevaSeccion] = useState({ titulo: "", contenido: "" });
  const [editandoSeccion, setEditandoSeccion] = useState(null);

  useEffect(() => {
    cargarCategorias();
    if (id) {
      cargarPublicacion(id);
    }
  }, [id]);

  const cargarCategorias = async () => {
    try {
      const data = await CargarCategorias();
      setCategorias(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const cargarPublicacion = async (id) => {
    try {
      const publicacion = await fetchPublicacionPorId(id);
      const secciones = publicacion.contenido.split('\n\n').map((section, index) => {
        const titleMatch = section.match(/<h2>(.*?)<\/h2>/);
        const title = titleMatch ? titleMatch[1] : `Sección ${index + 1}`;
        const sectionContent = section.replace(/<h2>.*?<\/h2>/, '').trim();
        return { titulo: title, contenido: sectionContent };
      });
      setStateData({
        titulo: publicacion.titulo,
        contenido: publicacion.contenido,
        categoriaId: publicacion.categoriaId,
        secciones: secciones
      });
    } catch (error) {
      console.error('Error fetching publication:', error);
    }
  };

  const handleFileChange = (event) => setImagedata(event.target.files[0]);
  const handleChange = (event) => {
    const { name, value } = event.target;
    setStateData({ ...stateData, [name]: name === 'categoriaId' ? Number(value) : value });
  };

  const handleEditorChange = (newContent) => {
    setStateData({ ...stateData, contenido: newContent });
  };

  const handleSeccionEditorChange = (newContent) => {
    setNuevaSeccion({ ...nuevaSeccion, contenido: newContent });
  };

  const handleAddSection = () => {
    if (nuevaSeccion.titulo.trim() && nuevaSeccion.contenido.trim()) {
      const nuevasSecciones = [...stateData.secciones];
      if (editandoSeccion !== null) {
        nuevasSecciones[editandoSeccion] = nuevaSeccion;
        setEditandoSeccion(null);
      } else {
        nuevasSecciones.push(nuevaSeccion);
      }
      setStateData({ ...stateData, secciones: nuevasSecciones });
      setNuevaSeccion({ titulo: "", contenido: "" });
    } else {
      setNotification({ isOpen: true, message: 'El título y contenido de la sección no pueden estar vacíos', type: 'error' });
    }
  };

  const handleEditSection = (index) => {
    setNuevaSeccion(stateData.secciones[index]);
    setEditandoSeccion(index);
  };

  const handleDeleteSection = (index) => {
    const nuevasSecciones = stateData.secciones.filter((_, secIndex) => secIndex !== index);
    setStateData({ ...stateData, secciones: nuevasSecciones });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { titulo, categoriaId, secciones } = stateData;
    if (!user || !user.username) return setNotification({ isOpen: true, message: 'User is not logged in', type: 'error' });
    if (!categoriaId) return setNotification({ isOpen: true, message: 'Selecciona una categoria', type: 'error' });
    if (!titulo.trim()) return setNotification({ isOpen: true, message: 'El titulo no puede estar vacío', type: 'error' });
    if (secciones.length === 0) return setNotification({ isOpen: true, message: 'Debe añadir al menos una sección', type: 'error' });

    try {
      const contenidoCompleto = secciones.map(sec => `<h2>${sec.titulo}</h2>\n${sec.contenido}`).join('\n\n');
      await updatePublicacion(id, { ...stateData, contenido: contenidoCompleto });
      setStateData({ titulo: "", contenido: "", categoriaId: "", secciones: [] });
      setImagedata(null);
      document.getElementById("image").value = null;
      setNotification({ isOpen: true, message: 'Publicación actualizada exitósamente', type: 'success' });
      navigate('/admin/publicaciones');
    } catch (error) {
      console.error(error);
      setNotification({ isOpen: true, message: 'Algo fue mal', type: 'error' });
    }
  };

  const handleNewCategoryChange = (event) => {
    const { name, value } = event.target;
    setNewCategory({ ...newCategory, [name]: value });
  };

  const handleCreateCategory = async (event) => {
    event.preventDefault();
    try {
      await CrearCategoria(newCategory);
      setModalIsOpen(false);
      setNotification({ isOpen: true, message: 'Categoría creada exitósamente', type: 'success' });
      setNewCategory({ nombre: "", descripcion: "" });
      cargarCategorias();
    } catch (error) {
      console.error('Error creando la categoría:', error);
      setNotification({ isOpen: true, message: 'Error creando la categoría', type: 'error' });
    }
  };

  // Funcion para borrar etiquetas HTML del contenido de la publicación
  const borrarEtiquetasHtml = (html) => {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  };

  return (
    <div className="container mx-auto my-8">
      {notification.isOpen && <Notification type={notification.type} message={notification.message} isOpen={notification.isOpen} onClose={() => setNotification({ ...notification, isOpen: false })} />}
      <div className="flex justify-center">
        <div className="w-full lg:w-2/3">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-2xl font-semibold text-center mb-6">Editar Publicación</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4 flex items-center">
                <div className="w-full">
                  <label htmlFor="categoriaId" className="block text-gray-700 text-sm font-bold mb-2">Seleccionar Categoria</label>
                  <select id="categoriaId" name="categoriaId" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" onChange={handleChange} value={stateData.categoriaId}>
                    <option value="">--Seleccionar categoria--</option>
                    {categorias.map((categoria) => (
                      <option key={categoria.cid} value={categoria.cid}>
                        {categoria.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <button type="button" className="ml-2 p-2" onClick={() => setModalIsOpen(true)}>
                  <FaPlus size={20} className="text-black mt-6" />
                </button>
              </div>
              <div className="mb-4">
                <label htmlFor="image" className="block text-gray-700 text-sm font-bold mb-2">Seleccionar banner de la publicación</label>
                <input id="image" name="image" type="file" className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none" onChange={handleFileChange} />
                <small className="text-gray-600">La imagen seleccionada se convertirá en la imagen principal de tu publicación</small>
              </div>
              <div className="mb-4">
                <label htmlFor="titulo" className="block text-gray-700 text-sm font-bold mb-2">Título de la publicacion</label>
                <input id="titulo" name="titulo" placeholder="Introducir Título" type="text" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={stateData.titulo} onChange={handleChange} />
              </div>
              <div className="mb-4">
                <h3 className="text-xl font-semibold mb-4">{editandoSeccion !== null ? 'Editar Sección' : 'Añadir Nueva Sección'}</h3>
                <input
                  type="text"
                  placeholder="Título de la Sección"
                  className="w-full p-2 mb-2 border rounded"
                  value={nuevaSeccion.titulo}
                  onChange={(e) => setNuevaSeccion({ ...nuevaSeccion, titulo: e.target.value })}
                />
                <JoditEditor
                  ref={seccionEditor}
                  value={nuevaSeccion.contenido}
                  onChange={handleSeccionEditorChange}
                />
                <button
                  type="button"
                  className="bg-blue-500 text-white px-4 py-2 rounded mt-4 flex items-center"
                  onClick={handleAddSection}
                >
                  <FaPlus className="mr-2" /> {editandoSeccion !== null ? 'Guardar Sección' : 'Agregar Sección'}
                </button>
              </div>
              <div className="mb-4">
                <h3 className="text-xl font-semibold mb-4">Resultado:</h3>
                {stateData.secciones.map((sec, index) => (
                  <div key={index} className="mb-2 p-4 border rounded bg-gray-100">
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold text-lg mb-2">{sec.titulo}</h4>
                      <div>
                        <button
                          type="button"
                          className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 flex items-center"
                          onClick={() => handleEditSection(index)}
                        >
                          <FaEdit className="mr-1" /> Editar
                        </button>
                        <button
                          type="button"
                          className="bg-red-500 text-white px-2 py-1 rounded flex items-center"
                          onClick={() => handleDeleteSection(index)}
                        >
                          <FaTrash className="mr-1" /> Eliminar
                        </button>
                      </div>
                    </div>
                    <p>{borrarEtiquetasHtml(sec.contenido).substring(0, 100)}...</p>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-center">
                <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center">
                  <FaSave className="mr-2" /> Actualizar
                </button>
                <button type="reset" onClick={() => setStateData({ titulo: "", contenido: "", categoriaId: "", secciones: [] })} className="ml-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center">
                  <FaTrash className="mr-2" /> Limpiar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <CustomModal isOpen={modalIsOpen} onClose={() => setModalIsOpen(false)}>
        <h3 className="text-xl font-semibold mb-4">Crear Nueva Categoria</h3>
        <form onSubmit={handleCreateCategory}>
          <div className="mb-4">
            <label htmlFor="nombre" className="block text-gray-700 text-sm font-bold mb-2">Nombre</label>
            <input id="nombre" name="nombre" type="text" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={newCategory.nombre} onChange={handleNewCategoryChange} />
          </div>
          <div className="mb-4">
            <label htmlFor="descripcion" className="block text-gray-700 text-sm font-bold mb-2">Descripción</label>
            <textarea id="descripcion" name="descripcion" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={newCategory.descripcion} onChange={handleNewCategoryChange}></textarea>
          </div>
          <div className="flex items-center justify-center">
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Guardar</button>
            <button type="button" onClick={() => setModalIsOpen(false)} className="ml-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Cancelar</button>
          </div>
        </form>
      </CustomModal>
    </div>
  );
}

export default EditarPublicacion;
