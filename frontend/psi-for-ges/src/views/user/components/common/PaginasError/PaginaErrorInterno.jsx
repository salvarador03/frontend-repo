import React from "react";
import PaginaError from "./PaginaError";

const PaginaErrorInterno = () => (
  <PaginaError 
    estado="500"
    titulo="Error interno del servidor"
    mensaje="Lo sentimos, algo salió mal en nuestro servidor. Por favor, inténtalo de nuevo más tarde."
  />
);

export default PaginaErrorInterno;
