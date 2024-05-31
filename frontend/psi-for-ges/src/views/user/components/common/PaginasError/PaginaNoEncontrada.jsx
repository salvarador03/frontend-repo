import React from "react";
import PaginaError from "./PaginaError";

const PaginaNoEncontrada = () => (
  <PaginaError 
    estado="404"
    titulo="Página no encontrada"
    mensaje="Lo sentimos, la página que buscas no se pudo encontrar o ha sido eliminada."
  />
);

export default PaginaNoEncontrada;
