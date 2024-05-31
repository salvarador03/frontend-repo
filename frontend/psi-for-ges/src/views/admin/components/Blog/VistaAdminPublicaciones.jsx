import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../user/components/features/Context/AuthContext";
import { FormatearFechaPersonalizada, TextoPersonalizado } from "../../../../services/Helper";
import Paginador from "../../../user/components/common/Paginador/Paginador";
import { FaTrash, FaPencilAlt } from 'react-icons/fa';

const VistaAdminPublicaciones = ({ post, handlePostDelete }) => {
  const { user } = useAuth();
  const apiEndpoint = import.meta.env.VITE_API_ENDPOINT;
  const isAdmin = user && user.roles ? user.roles.includes('ROLE_ADMIN') : false;

  if (!post) return null;

  return (
    <div className="mb-3">
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="mb-4">
          <h5 className="text-xl font-bold">{post.titulo}</h5>
          <h6 className="text-sm text-gray-600">
            Category: {post.categoria ? post.categoria.nombre : "Uncategorized"}
          </h6>
        </div>
        <div className="mb-4">
          <div
            dangerouslySetInnerHTML={{ __html: post.contenido.substring(0, 70) + "..." }}
            className="text-gray-700"
          ></div>
        </div>
        <div className="mb-4">
          <p className="text-gray-700">
            Por <TextoPersonalizado><b>Pablo Alvarado Ramos</b></TextoPersonalizado> el día <TextoPersonalizado><b>{FormatearFechaPersonalizada(post.fechaCreacion)}</b></TextoPersonalizado>
          </p>
          <p className="text-gray-700"><b>Comentarios totales: {post.comentarios ? post.comentarios.length : 0}</b></p>
        </div>
        <div className="flex items-center">
          <Link
            className="btn btn-sm btn-primary bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            to={`/posts/${post.pid}`}
          >
            Leer más
          </Link>
          {isAdmin && (
            <>
              <button
                className="btn btn-sm btn-danger bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 ml-2"
                onClick={() => handlePostDelete(post.pid)}
              >
                <FaTrash />
              </button>
              <Link
                to={`/user/${user.username}/editpost/${post.pid}`}
                className="btn btn-sm btn-warning bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 ml-2"
              >
                <FaPencilAlt />
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VistaAdminPublicaciones;
