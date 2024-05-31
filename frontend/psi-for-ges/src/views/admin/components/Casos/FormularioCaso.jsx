import React, { useRef, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaPlus, FaSave, FaTrash, FaEdit } from "react-icons/fa";
import JoditEditor from "jodit-react";
import CustomModal from "../common/CustomModal/CustomModal";
import DeleteModal from "./DeleteModal";
import Notification from "../../../user/components/features/Notification/Notification";
import {
  getTiposCaso,
  createTipoCaso,
  updateTipoCaso,
  deleteTipoCaso
} from "../../../../services/TipoCasoService";

const API_URL = import.meta.env.VITE_API_ENDPOINT;

const FormularioCaso = ({ onCasoSaved, estadoInicial }) => {
  const { id: casoId } = useParams();
  const navigate = useNavigate();
  const [casoData, setCasoData] = useState({ titulo: "", descripcion: "", tipoCasoId: "", estado: estadoInicial.replace(" ", "_").toUpperCase() });
  const [tiposCaso, setTiposCaso] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [editTipoCaso, setEditTipoCaso] = useState(null);
  const [newTipoCaso, setNewTipoCaso] = useState({ nombre: "", descripcion: "" });
  const [notification, setNotification] = useState({ isOpen: false, message: '', type: '' });
  const editor = useRef(null);

  useEffect(() => {
    if (casoId) {
      axios.get(`${API_URL}/casos/${casoId}`).then((response) => {
        setCasoData({
          ...response.data,
          tipoCasoId: response.data.tipoCaso?.id || ""
        });
      });
    }
    cargarTiposCaso();
  }, [casoId]);

  const cargarTiposCaso = async () => {
    try {
      const data = await getTiposCaso();
      setTiposCaso(data);
    } catch (error) {
      console.error('Error fetching tipos de caso:', error);
      setNotification({ isOpen: true, message: 'Error cargando tipos de caso', type: 'error' });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCasoData({ ...casoData, [name]: value });
  };

  const handleEditorChange = (newContent) => {
    setCasoData({ ...casoData, descripcion: newContent });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!casoData.tipoCasoId) {
      setNotification({ isOpen: true, message: 'Por favor selecciona un Tipo de Caso', type: 'error' });
      return;
    }

    const casoToSend = {
      ...casoData,
      tipoCaso: tiposCaso.find(tipo => tipo.id === parseInt(casoData.tipoCasoId))
    };
    if (casoId) {
      axios.put(`${API_URL}/casos/${casoId}`, casoToSend).then(() => {
        onCasoSaved();
        setNotification({ isOpen: true, message: 'Caso actualizado con éxito', type: 'success' });
        navigate("/admin/kanban/casos");
      }).catch((error) => {
        setNotification({ isOpen: true, message: 'Error actualizando el caso', type: 'error' });
        console.error('Error actualizando el caso:', error);
      });
    } else {
      axios.post(`${API_URL}/casos`, casoToSend).then(() => {
        onCasoSaved();
        setNotification({ isOpen: true, message: 'Caso creado con éxito', type: 'success' });
        navigate("/admin/kanban/casos");
      }).catch((error) => {
        setNotification({ isOpen: true, message: 'Error creando el caso', type: 'error' });
        console.error('Error creando el caso:', error);
      });
    }
  };

  const handleDelete = () => {
    axios.delete(`${API_URL}/casos/${casoId}`).then(() => {
      onCasoSaved();
      setNotification({ isOpen: true, message: 'Caso eliminado con éxito', type: 'success' });
      navigate("/admin/kanban/casos");
    }).catch((error) => {
      setNotification({ isOpen: true, message: 'Error eliminando el caso', type: 'error' });
      console.error('Error eliminando el caso:', error);
    });
  };

  const handleNewTipoCasoChange = (e) => {
    const { name, value } = e.target;
    setNewTipoCaso({ ...newTipoCaso, [name]: value });
  };

  const handleCreateTipoCaso = async (e) => {
    e.preventDefault();
    try {
      if (editTipoCaso) {
        await updateTipoCaso(editTipoCaso.id, newTipoCaso);
        setNotification({ isOpen: true, message: 'Tipo de Caso actualizado exitosamente', type: 'success' });
      } else {
        await createTipoCaso(newTipoCaso);
        setNotification({ isOpen: true, message: 'Tipo de Caso creado exitosamente', type: 'success' });
      }
      setModalIsOpen(false);
      setNewTipoCaso({ nombre: "", descripcion: "" });
      setEditTipoCaso(null);
      cargarTiposCaso();
    } catch (error) {
      console.error('Error guardando el tipo de caso:', error);
      setNotification({ isOpen: true, message: 'Error guardando el tipo de caso', type: 'error' });
    }
  };

  const handleEditTipoCaso = (tipoCaso) => {
    setEditTipoCaso(tipoCaso);
    setNewTipoCaso(tipoCaso);
    setModalIsOpen(true);
  };

  const handleDeleteTipoCaso = async () => {
    if (!editTipoCaso) {
      return;
    }

    try {
      // Actualizar casos asociados antes de eliminar el tipo de caso
      const casosAsociados = await axios.get(`${API_URL}/casos?tipoCasoId=${editTipoCaso.id}`);
      for (const caso of casosAsociados.data) {
        await axios.put(`${API_URL}/casos/${caso.id}`, { ...caso, tipoCaso: null });
      }
      await deleteTipoCaso(editTipoCaso.id);
      setNotification({ isOpen: true, message: 'Tipo de Caso eliminado exitosamente', type: 'success' });
      cargarTiposCaso();
      setDeleteModalIsOpen(false);
      setEditTipoCaso(null);
    } catch (error) {
      console.error('Error eliminando el tipo de caso:', error);
      setNotification({ isOpen: true, message: 'Error eliminando el tipo de caso', type: 'error' });
      setDeleteModalIsOpen(false);
    }
  };

  const handleReset = () => {
    setCasoData({ titulo: "", descripcion: "", tipoCasoId: "", estado: estadoInicial.replace(" ", "_").toUpperCase() });
    editor.current && editor.current.value("");
  };

  return (
    <div className="container mx-auto my-8">
      {notification.isOpen && <Notification type={notification.type} message={notification.message} isOpen={notification.isOpen} onClose={() => setNotification({ ...notification, isOpen: false })} />}
      <div className="flex justify-center">
        <div className="w-full lg:w-2/3">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-2xl font-semibold text-center mb-6">{casoId ? "Editar Caso" : "Añadir Caso"}</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="titulo" className="block text-gray-700 text-sm font-bold mb-2">
                  Título del Caso
                </label>
                <input
                  id="titulo"
                  name="titulo"
                  type="text"
                  value={casoData.titulo}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Introducir título del caso"
                />
              </div>
              <div className="mb-4 flex items-center">
                <div className="w-full">
                  <label htmlFor="tipoCasoId" className="block text-gray-700 text-sm font-bold mb-2">Seleccionar Tipo de Caso</label>
                  <select id="tipoCasoId" name="tipoCasoId" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" onChange={handleChange} value={casoData.tipoCasoId}>
                    <option value="">--Seleccionar Tipo de Caso--</option>
                    {tiposCaso.map((tipo) => (
                      <option key={tipo.id} value={tipo.id}>
                        {tipo.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="ml-2 mt-7 flex items-center">
                  <button type="button" className="p-2" onClick={() => setModalIsOpen(true)}>
                    <FaPlus size={20} className="text-black" />
                  </button>
                  {casoData.tipoCasoId && (
                    <>
                      <button type="button" className="p-2" onClick={() => handleEditTipoCaso(tiposCaso.find(tipo => tipo.id === parseInt(casoData.tipoCasoId)))}>
                        <FaEdit size={20} className="text-black" />
                      </button>
                      <button type="button" className="p-2" onClick={() => setDeleteModalIsOpen(true)}>
                        <FaTrash size={20} className="text-black" />
                      </button>
                    </>
                  )}
                </div>
              </div>
              <div className="mb-4">
                <label htmlFor="descripcion" className="block text-gray-700 text-sm font-bold mb-2">
                  Descripción
                </label>
                <JoditEditor ref={editor} value={casoData.descripcion} onChange={handleEditorChange} />
              </div>
              <div className="flex items-center justify-center">
                <button
                  type="submit"
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
                >
                  <FaSave className="mr-2" /> Guardar
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="ml-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
                >
                  <FaTrash className="mr-2" /> Limpiar
                </button>
                {casoId && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="ml-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
                  >
                    <FaTrash className="mr-2" /> Eliminar
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>

      <CustomModal isOpen={modalIsOpen} onClose={() => setModalIsOpen(false)}>
        <h3 className="text-xl font-semibold mb-4">{editTipoCaso ? "Editar Tipo de Caso" : "Crear Nuevo Tipo de Caso"}</h3>
        <form onSubmit={handleCreateTipoCaso}>
          <div className="mb-4">
            <label htmlFor="nombre" className="block text-gray-700 text-sm font-bold mb-2">Nombre</label>
            <input id="nombre" name="nombre" type="text" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={newTipoCaso.nombre} onChange={handleNewTipoCasoChange} />
          </div>
          <div className="mb-4">
            <label htmlFor="descripcion" className="block text-gray-700 text-sm font-bold mb-2">Descripción</label>
            <textarea id="descripcion" name="descripcion" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={newTipoCaso.descripcion} onChange={handleNewTipoCasoChange}></textarea>
          </div>
          <div className="flex items-center justify-center">
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Guardar</button>
            <button type="button" onClick={() => setModalIsOpen(false)} className="ml-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Cancelar</button>
          </div>
        </form>
      </CustomModal>

      <DeleteModal isOpen={deleteModalIsOpen} onClose={() => setDeleteModalIsOpen(false)} onConfirm={handleDeleteTipoCaso} />
    </div>
  );
};

export default FormularioCaso;
