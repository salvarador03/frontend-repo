import React from "react";
import { Link } from "react-router-dom";
import logo from "/src/assets/img/logo.svg";

const PaginaError = ({ estado, titulo, mensaje }) => {
  return (
    <main>
      <div className="max-w-screen-xl mx-auto px-4 flex items-center justify-start h-screen md:px-8">
        <div className="max-w-lg mx-auto space-y-3 text-center">
          <img src={logo} alt="Logo" className="mx-auto h-72 w-72 mb-4" />
          <h3 className="text-indigo-600 font-semibold">
            Error {estado}
          </h3>
          <p className="text-gray-800 text-4xl font-semibold sm:text-5xl">
            {titulo}
          </p>
          <p className="text-gray-600">
            {mensaje}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link to="/frontend-repo/" className="block py-2 px-4 text-white font-medium bg-indigo-600 duration-150 hover:bg-indigo-500 active:bg-indigo-700 rounded-lg">
              Regresar
            </Link>
            <Link to="/frontend-repo/contacto" className="block py-2 px-4 text-gray-700 hover:bg-gray-50 font-medium duration-150 active:bg-gray-100 border rounded-lg">
              Contactar soporte
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PaginaError;
