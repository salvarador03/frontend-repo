import React, { useState, useEffect } from "react";
import { FiTrash, FiEdit, FiEye, FiPlus } from "react-icons/fi";
import { BsFiletypeCsv } from "react-icons/bs";
import { FaFire, FaFilePdf } from "react-icons/fa";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Notification from "../../../user/components/features/Notification/Notification";
import PreviewModal from "./PreviewModal";
import Papa from "papaparse";

const API_URL = import.meta.env.VITE_API_ENDPOINT;

export const CustomKanban = () => {
  const [cards, setCards] = useState([]);
  const [notification, setNotification] = useState({ isOpen: false, message: '', type: '' });

  useEffect(() => {
    fetchCasos();
  }, []);

  const fetchCasos = () => {
    axios.get(`${API_URL}/casos`).then((response) => {
      setCards(response.data);
    });
  };

  const handleCasoSaved = () => {
    fetchCasos();
    setNotification({ isOpen: true, message: 'Caso guardado con éxito', type: 'success' });
  };

  const removeHtmlTags = (html) => {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  };

  const exportToCSV = () => {
    const headers = "ID,Titulo,Descripcion,Estado,FechaCreacion\n";
    const rows = cards.map(card => 
      `${card.id},"${card.titulo}","${removeHtmlTags(card.descripcion)}",${card.estado},${card.fechaCreacion}`
    ).join("\n");

    const csvContent = headers + rows;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'casos.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const importFromCSV = (event) => {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        complete: (results) => {
          const importedData = results.data.map(row => ({
            titulo: row["Titulo"],
            descripcion: row["Descripcion"],
            estado: row["Estado"],
            fechaCreacion: row["FechaCreacion"],
            tipoCasoId: row["TipoCasoId"]
          }));
  
          importedData.forEach(data => {
            axios.post(`${API_URL}/casos`, data)
              .then(() => {
                fetchCasos();
                setNotification({ isOpen: true, message: 'Datos importados con éxito', type: 'success' });
              })
              .catch(error => {
                setNotification({ isOpen: true, message: 'Error importando datos', type: 'error' });
                console.error('Error importando datos:', error);
              });
          });
        },
        header: true // Asegurar que CSV tiene encabezados
      });
    }
  };  

  return (
    <div className="w-full bg-white text-gray-900">
      {notification.isOpen && (
        <Notification
          type={notification.type}
          message={notification.message}
          isOpen={notification.isOpen}
          onClose={() => setNotification({ ...notification, isOpen: false })}
        />
      )}
      <div className="flex justify-end p-4">
        <input 
          type="file" 
          accept=".csv" 
          onChange={importFromCSV} 
          className="hidden" 
          id="csvFileInput"
        />
        <label 
          htmlFor="csvFileInput" 
          className="text-neutral-500 hover:text-neutral-900 px-4 py-2 rounded flex items-center cursor-pointer"
        >
          <BsFiletypeCsv className="mr-2" /> Importar CSV
        </label>
        <button 
          onClick={exportToCSV} 
          className="text-neutral-500 hover:text-neutral-900 px-4 py-2 rounded flex items-center ml-4"
        >
          <BsFiletypeCsv className="mr-2" /> Exportar CSV
        </button>
      </div>
      <Board cards={cards} setCards={setCards} setNotification={setNotification} onCasoSaved={handleCasoSaved} />
    </div>
  );
};

const Board = ({ cards, setCards, setNotification, onCasoSaved }) => {
  const navigate = useNavigate();

  const handleAddNewCaso = (column) => {
    navigate(`/admin/nuevo-caso`, { state: { estado: column } });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 p-4">
      {["NUEVO", "ACTIVO", "COMPLETADO", "ARCHIVADO"].map((column) => (
        <Column key={column} title={column} column={column} cards={cards} setCards={setCards} setNotification={setNotification} onAddNewCaso={handleAddNewCaso} onCasoSaved={onCasoSaved} />
      ))}
      <BurnBarrel setCards={setCards} setNotification={setNotification} onCasoSaved={onCasoSaved} />
    </div>
  );
};

const Column = ({ title, column, cards, setCards, setNotification, onAddNewCaso, onCasoSaved }) => {
  const [active, setActive] = useState(false);

  const handleDragStart = (e, card) => {
    e.dataTransfer.setData("cardId", card.id);
  };

  const handleDragEnd = (e) => {
    const cardId = e.dataTransfer.getData("cardId");
    const newCards = cards.map((card) =>
      card.id === cardId ? { ...card, estado: column } : card
    );
    setCards(newCards);

    axios.put(`${API_URL}/casos/${cardId}`, { estado: column })
      .then(() => {
        setNotification({ isOpen: true, message: 'Caso actualizado con éxito', type: 'success' });
        onCasoSaved();
      })
      .catch(() => setNotification({ isOpen: true, message: 'Error al actualizar el caso', type: 'error' }));

    setActive(false);
    clearHighlights();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    highlightIndicator(e);
    setActive(true);
  };

  const clearHighlights = () => {
    const indicators = document.querySelectorAll(`[data-column="${column}"]`);
    indicators.forEach((i) => {
      i.style.opacity = "0";
    });
  };

  const highlightIndicator = (e) => {
    const indicators = document.querySelectorAll(`[data-column="${column}"]`);
    clearHighlights();
    const el = getNearestIndicator(e, indicators);
    el.style.opacity = "1";
  };

  const getNearestIndicator = (e, indicators) => {
    const DISTANCE_OFFSET = 50;
    return Array.from(indicators).reduce((closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = e.clientY - (box.top + DISTANCE_OFFSET);
      return offset < 0 && offset > closest.offset ? child : closest;
    }, indicators[indicators.length - 1]);
  };

  const filteredCards = cards.filter((c) => c.estado === column);

  return (
    <div className="w-full p-2 flex-shrink-0">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-medium text-neutral-500">{title}</h3>
        <span className="rounded text-sm text-neutral-400">{filteredCards.length}</span>
      </div>
      <div
        onDrop={handleDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={() => setActive(false)}
        className={`h-full w-full transition-colors ${active ? "bg-neutral-800/50" : "bg-neutral-800/0"}`}
      >
        {filteredCards.map((c) => (
          <Card key={c.id} {...c} handleDragStart={handleDragStart} setCards={setCards} setNotification={setNotification} onCasoSaved={onCasoSaved} />
        ))}
        <DropIndicator beforeId={null} column={column} />
        <div className="flex justify-center mt-2">
          <button onClick={() => onAddNewCaso(column)} className="text-neutral-400 px-4 py-2 rounded flex items-center hover:text-neutral-900">
            <span>Añadir nuevo caso</span>
            <FiPlus className="ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

const Card = ({ titulo, id, estado, descripcion, tipoCaso, fechaCreacion, videoUrl, handleDragStart, setCards, setNotification, onCasoSaved }) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEdit = () => {
    navigate(`/admin/caso/${id}`, { state: { titulo } });
  };

  const handleView = () => {
    setIsModalOpen(true);
  };

  const exportarAPDF = () => {
    const url = `${API_URL}/casos/ver/pdf/${id}`;
    window.open(url, '_blank');
  };

  return (
    <>
      <PreviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        caso={{ titulo, id, estado, descripcion, tipoCaso, fechaCreacion, videoUrl }}
      />
      <DropIndicator beforeId={id} column={estado} />
      <motion.div
        layout
        layoutId={id}
        draggable="true"
        onDragStart={(e) => handleDragStart(e, { titulo, id, estado })}
        className="cursor-grab rounded border border-neutral-700 bg-neutral-200 p-3 active:cursor-grabbing"
      >
        <div className="flex justify-between items-center">
          <p className="text-sm text-neutral-900">{titulo}</p>
          <div className="flex items-center space-x-2">
            <FiEdit onClick={handleEdit} className="cursor-pointer text-neutral-500 hover:text-neutral-900" />
            <FiEye onClick={handleView} className="cursor-pointer text-neutral-500 hover:text-neutral-900" />
            <FaFilePdf onClick={exportarAPDF} className="cursor-pointer text-neutral-500 hover:text-neutral-900" />
          </div>
        </div>
      </motion.div>
    </>
  );
};

const DropIndicator = ({ beforeId, column }) => {
  return (
    <div
      data-before={beforeId || "-1"}
      data-column={column}
      className="my-0.5 h-0.5 w-full bg-violet-400 opacity-0"
    />
  );
};

const BurnBarrel = ({ setCards, setNotification, onCasoSaved }) => {
  const [active, setActive] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setActive(true);
  };

  const handleDragEnd = (e) => {
    const cardId = e.dataTransfer.getData("cardId");
    setCards((pv) => pv.filter((c) => c.id !== cardId));
    axios.delete(`${API_URL}/casos/${cardId}`)
      .then(() => {
        setNotification({ isOpen: true, message: 'Caso eliminado con éxito', type: 'success' });
        onCasoSaved();
      })
      .catch(() => setNotification({ isOpen: true, message: 'Error al eliminar el caso', type: 'error' }));
    setActive(false);
  };

  return (
    <div
      onDrop={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={() => setActive(false)}
      className={`mt-10 lg:mt-0 lg:ml-4 grid h-56 w-56 shrink-0 place-content-center rounded border text-3xl ${
        active ? "border-red-800 bg-red-800/20 text-red-500" : "border-neutral-500 bg-neutral-500/20 text-neutral-500"
      }`}
    >
      {active ? <FaFire className="animate-bounce" /> : <FiTrash />}
    </div>
  );
};

export default CustomKanban;
