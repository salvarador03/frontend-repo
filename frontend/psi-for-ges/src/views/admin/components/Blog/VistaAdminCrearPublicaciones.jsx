import React, { useState } from "react";
import FormularioPublicacion from "./FormularioPublicacion";
import VistaAdminPublicaciones from "./VistaAdminPublicaciones";
import { usePublicaciones } from "./Hook";

function VistaAdminCrearPublicaciones() {
  const [masrecienteprimero, setMasrecienteprimero] = useState(true);
  const [publicaciones, eliminarPublicacion] = usePublicaciones(masrecienteprimero);

  const handlePostAdded = () => {
    setMasrecienteprimero((prev) => !prev); // Para recargar kas publicaciones
  };

  return (
    <div className="container mx-auto my-8">
      <FormularioPublicacion onPostAdded={handlePostAdded} />
      <div className="mt-2 mb-2 text-center">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold">Publicaciones totales {publicaciones.length}</h2>
        </div>
      </div>
      <div className="container">
        <div className="row justify-content-center">
          {publicaciones.map((post) => (
            <div key={post.pid} className="col-md-4 mb-4">
              <VistaAdminPublicaciones post={post} handlePostDelete={eliminarPublicacion} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default VistaAdminCrearPublicaciones;

