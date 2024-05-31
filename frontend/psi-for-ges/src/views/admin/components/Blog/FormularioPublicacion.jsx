import React, { useRef, useState, useEffect } from "react";
import JoditEditor from "jodit-react";
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { motion, AnimatePresence } from "framer-motion";
import Notification from "../../../user/components/features/Notification/Notification";
import { AddPublicacionConDatosForm } from "../../../../services/PublicacionService";
import { useAuth } from "../../../user/components/features/Context/AuthContext";
import CustomModal from "../common/CustomModal/CustomModal";
import { CrearCategoria, ActualizarCategoria, EliminarCategoria, CargarCategorias } from '../../../../services/CategoriaService';

function FormularioPublicacion() {
  const { user } = useAuth();
  const [imagedata, setImagedata] = useState(null);
  const [stateData, setStateData] = useState({ titulo: "", contenido: "", nombrecategoria: "" });
  const [notification, setNotification] = useState({ isOpen: false, message: '', type: '' });
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({ nombre: "", descripcion: "" });
  const [currentCategory, setCurrentCategory] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const categoriasPerPage = 5;
  const textAreaEditor = useRef(null);

  useEffect(() => {
    cargarCategorias();
  }, []);

  const cargarCategorias = async () => {
    try {
      const data = await CargarCategorias();
      setCategorias(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleFileChange = (event) => setImagedata(event.target.files[0]);
  const handleChange = (event) => {
    const { name, value } = event.target;
    setStateData({ ...stateData, [name]: value });
  };

  const handleEditorChange = (newContent) => {
    setStateData({ ...stateData, contenido: newContent });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { titulo, contenido, nombrecategoria } = stateData;
  
    if (!user || !user.username) {
      return setNotification({ isOpen: true, message: 'User is not logged in', type: 'error' });
    }
    if (!nombrecategoria.trim()) {
      return setNotification({ isOpen: true, message: '¡¡Selecciona una categoria!!', type: 'error' });
    }
    if (!titulo.trim()) {
      return setNotification({ isOpen: true, message: '¡¡El titulo no puede estar vacío!!', type: 'error' });
    }
    if (!contenido.trim()) {
      return setNotification({ isOpen: true, message: '¡¡El contenido no puede estar vacío!!', type: 'error' });
    }
    if (!imagedata) {
      return setNotification({ isOpen: true, message: '¡¡Selecciona una imagen!!', type: 'error' });
    }
  
    const selectedCategory = categorias.find(categoria => categoria.nombre === nombrecategoria);
  
    if (!selectedCategory) {
      return setNotification({ isOpen: true, message: 'Categoría no válida', type: 'error' });
    }
  
    try {
      await AddPublicacionConDatosForm(stateData, imagedata, selectedCategory.cid, user.username);
      setStateData({ titulo: "", contenido: "", nombrecategoria: "" });
      setImagedata(null);
      document.getElementById("image").value = null;
      setNotification({ isOpen: true, message: '¡¡Publicación añadida exitósamente!!', type: 'success' });
    } catch (error) {
      console.error(error);
      setNotification({ isOpen: true, message: '¡¡Algo fue mal!!', type: 'error' });
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
      setNotification({ isOpen: true, message: '¡Categoría creada exitósamente!', type: 'success' });
      setNewCategory({ nombre: "", descripcion: "" });
      cargarCategorias();
    } catch (error) {
      console.error('Error creating category:', error);
      setNotification({ isOpen: true, message: '¡Error creando la categoría!', type: 'error' });
    }
  };

  const openEditModal = (categoria) => {
    setCurrentCategory(categoria);
    setEditModalIsOpen(true);
  };

  const openDeleteModal = (categoria) => {
    setCurrentCategory(categoria);
    setDeleteModalIsOpen(true);
  };

  const handleEditCategoryChange = (event) => {
    const { name, value } = event.target;
    setCurrentCategory({ ...currentCategory, [name]: value });
  };

  const handleUpdateCategory = async (event) => {
    event.preventDefault();
    try {
      await ActualizarCategoria(currentCategory.cid, currentCategory);
      setEditModalIsOpen(false);
      setNotification({ isOpen: true, message: '¡Categoría actualizada exitósamente!', type: 'success' });
      setCurrentCategory(null);
      cargarCategorias();
    } catch (error) {
      console.error('Error updating category:', error);
      setNotification({ isOpen: true, message: '¡Error actualizando la categoría!', type: 'error' });
    }
  };

  const handleDeleteCategory = async () => {
    try {
      await EliminarCategoria(currentCategory.cid);
      setDeleteModalIsOpen(false);
      setNotification({ isOpen: true, message: '¡Categoría eliminada exitósamente!', type: 'success' });
      setCurrentCategory(null);
      cargarCategorias();
    } catch (error) {
      console.error('Error deleting category:', error);
      setNotification({ isOpen: true, message: '¡Error eliminando la categoría!', type: 'error' });
    }
  };

  const pageCount = Math.ceil(categorias.length / categoriasPerPage);
  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  const displayedCategorias = categorias.slice(pageNumber * categoriasPerPage, (pageNumber + 1) * categoriasPerPage);

  return (
    <div className="container mx-auto my-8">
      {notification.isOpen && <Notification type={notification.type} message={notification.message} isOpen={notification.isOpen} onClose={() => setNotification({ ...notification, isOpen: false })} />}
      <div className="flex justify-center">
        <div className="w-full lg:w-2/3">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-2xl font-semibold text-center mb-6">Añadir nueva publicacion</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4 flex items-center">
                <div className="w-full">
                  <label htmlFor="nombrecategoria" className="block text-gray-700 text-sm font-bold mb-2">Seleccionar Categoria</label>
                  <select id="nombrecategoria" name="nombrecategoria" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" onChange={handleChange} value={stateData.nombrecategoria}>
                    <option value="">--Seleccionar categoria--</option>
                    {displayedCategorias.map((categoria) => (
                      <option key={categoria.cid} value={categoria.nombre}>
                        {categoria.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <button type="button" className="ml-2 p-2" onClick={() => setModalIsOpen(true)}>
                  <FaPlus size={20} className="text-black mt-6" />
                </button>
                {stateData.nombrecategoria && (
                  <>
                    <button type="button" className="ml-2 p-2" onClick={() => openEditModal(selectedCategory)}>
                      <FaEdit size={20} className="text-blue-500 mt-6" />
                    </button>
                    <button type="button" className="ml-2 p-2" onClick={() => openDeleteModal(selectedCategory)}>
                      <FaTrash size={20} className="text-red-500 mt-6" />
                    </button>
                  </>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="titulo" className="block text-gray-700 text-sm font-bold mb-2">Titulo</label>
                <input id="titulo" name="titulo" placeholder="Introducir Título" type="text" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={stateData.titulo} onChange={handleChange} />
              </div>
              <div className="mb-4">
                <label htmlFor="contenido" className="block text-gray-700 text-sm font-bold mb-2">Contenido</label>
                <JoditEditor ref={textAreaEditor} value={stateData.contenido} onChange={handleEditorChange} />
              </div>
              <div className="mb-4">
                <label htmlFor="image" className="block text-gray-700 text-sm font-bold mb-2">Seleccionar banner de la publicación</label>
                <input id="image" name="image" type="file" className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none" onChange={handleFileChange} />
                <small className="text-gray-600">¡¡La imagen seleccionada se convertirá en la imagen principal de tu publicación!!</small>
              </div>
              <div className="flex items-center justify-center">
                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Guardar</button>
                <button type="reset" onClick={() => setStateData({ titulo: "", contenido: "", nombrecategoria: "" })} className="ml-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Limpiar</button>
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
            <label htmlFor="descripcion" className="block text-gray-700 text-sm font-bold mb-2">Descripcion</label>
            <textarea id="descripcion" name="descripcion" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={newCategory.descripcion} onChange={handleNewCategoryChange}></textarea>
          </div>
          <div className="flex items-center justify-center">
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Guardar</button>
            <button type="button" onClick={() => setModalIsOpen(false)} className="ml-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Cancelar</button>
          </div>
        </form>
      </CustomModal>

      <CustomModal isOpen={editModalIsOpen} onClose={() => setEditModalIsOpen(false)}>
        <h3 className="text-xl font-semibold mb-4">Editar Categoria</h3>
        <form onSubmit={handleUpdateCategory}>
          <div className="mb-4">
            <label htmlFor="nombre" className="block text-gray-700 text-sm font-bold mb-2">Nombre</label>
            <input id="nombre" name="nombre" type="text" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={currentCategory?.nombre || ""} onChange={handleEditCategoryChange} />
          </div>
          <div className="mb-4">
            <label htmlFor="descripcion" className="block text-gray-700 text-sm font-bold mb-2">Descripcion</label>
            <textarea id="descripcion" name="descripcion" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={currentCategory?.descripcion || ""} onChange={handleEditCategoryChange}></textarea>
          </div>
          <div className="flex items-center justify-center">
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Guardar</button>
            <button type="button" onClick={() => setEditModalIsOpen(false)} className="ml-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Cancelar</button>
          </div>
        </form>
      </CustomModal>

      <CustomModal isOpen={deleteModalIsOpen} onClose={() => setDeleteModalIsOpen(false)} hideCloseButton={true}>
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-4">¿Estás seguro?</h3>
          <p className="mb-4">¿Realmente deseas eliminar esta categoría? Este proceso no se puede deshacer.</p>
          <button onClick={handleDeleteCategory} className="bg-red-500 text-white p-2 rounded w-full mb-2">Sí, eliminar</button>
          <button type="button" onClick={() => setDeleteModalIsOpen(false)} className="p-2 w-full text-center rounded bg-gray-300 text-gray-700">Cancelar</button>
        </div>
      </CustomModal>
    </div>
  );
}

export default FormularioPublicacion;
