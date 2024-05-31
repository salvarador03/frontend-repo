import React from "react";
import PaginaError from "./PaginaError";

const PaginaProhibida = () => (
  <PaginaError 
    estado="403"
    titulo="Acceso prohibido"
    mensaje="Lo sentimos, no tienes permiso para acceder a esta página."
  />
);

export default PaginaProhibida;
