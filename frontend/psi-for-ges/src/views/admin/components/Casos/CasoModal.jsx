import React from "react";
import FormularioCaso from "./FormularioCaso";

const CasoModal = ({ isOpen, onClose, onCasoSaved, casoId }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-2xl">
        <h2 className="text-2xl mb-4">{casoId ? "Editar Caso" : "Añadir Nuevo Caso"}</h2>
        <FormularioCaso onCasoSaved={onCasoSaved} casoId={casoId} />
        <button onClick={onClose} className="p-2 w-full text-center rounded bg-gray-300 text-gray-700 mt-4">
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default CasoModal;
