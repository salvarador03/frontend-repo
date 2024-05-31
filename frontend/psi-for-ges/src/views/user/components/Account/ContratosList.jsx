import React, { useState, useEffect } from 'react';
import { fetchContratos } from '../../../../services/ContratoService';
import { useAuth } from '../../../user/components/features/Context/AuthContext';

const ContratosList = ({ noServicesMessage }) => {
    const [contratos, setContratos] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            const loadContratos = async () => {
                try {
                    const data = await fetchContratos();
                    setContratos(data);
                } catch (error) {
                    console.error('Error loading contracts:', error);
                }
            };

            loadContratos();
        }
    }, [user]);

    if (contratos.length === 0) {
        return (
            <div className="bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-xl font-bold">{noServicesMessage.title}</h2>
                <div className="text-zinc-600">{noServicesMessage.message}</div>
            </div>
        );
    }

    return (
        <div className="flex flex-wrap justify-center">
            {contratos.map(contrato => (
                <div key={contrato.id} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2">
                    <div className="bg-white p-4 rounded-lg shadow-md flex">
                        <img
                            src={`/src/assets/img/${contrato.servicio.id}.png`}
                            alt={contrato.servicio.nombre}
                            className="w-16 h-16 rounded-full mr-4"
                        />
                        <div>
                            <h2 className="text-xl font-bold">{contrato.servicio.nombre}</h2>
                            <p className={`text-sm font-semibold ${getStatusColor(contrato.estado)}`}>
                                {contrato.estado}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

const getStatusColor = (status) => {
    switch (status) {
        case 'PENDIENTE':
            return 'text-yellow-500';
        case 'ACTIVO':
            return 'text-green-500';
        case 'COMPLETADO':
            return 'text-blue-500';
        case 'CANCELADO':
            return 'text-red-500';
        default:
            return 'text-gray-500';
    }
};

export default ContratosList;
