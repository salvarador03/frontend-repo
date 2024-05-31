import { useState, useEffect } from "react";
import { CargarTodasLasPublicaciones, BorrarPublicacionPorId } from "../../../../services/PublicacionService";
import { CargarCategorias } from "../../../../services/CategoriaService";

export const useCategorias = () => {
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const data = await CargarCategorias();
        setCategorias(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategorias();
  }, []);

  return categorias;
};

export const usePublicaciones = (masrecienteprimero = true) => {
  const [publicaciones, setPublicaciones] = useState([]);

  useEffect(() => {
    const fetchPublicaciones = async () => {
      try {
        const data = await CargarTodasLasPublicaciones(masrecienteprimero);
        setPublicaciones(data);
      } catch (error) {
        console.error('Error loading publications:', error);
      }
    };
    fetchPublicaciones();
  }, [masrecienteprimero]);

  const eliminarPublicacion = async (publicacionid) => {
    try {
      await BorrarPublicacionPorId(publicacionid);
      setPublicaciones((prev) => prev.filter((post) => post.pid !== publicacionid));
    } catch (error) {
      console.error('Error deleting publication:', error);
    }
  };

  return [publicaciones, eliminarPublicacion];
};


