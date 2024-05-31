import React from "react";
import FormularioCaso from "./FormularioCaso";
import { useLocation, useNavigate } from "react-router-dom";

const FormularioCasoParent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const estadoInicial = location.state?.estado?.replace(" ", "_").toUpperCase() || "NUEVO";

  const handleCasoSaved = () => {
    navigate("/admin/kanban/casos");
  };

  return (
    <div>
      <FormularioCaso onCasoSaved={handleCasoSaved} estadoInicial={estadoInicial} />
    </div>
  );
};

export default FormularioCasoParent;
