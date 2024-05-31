import { useEffect, useState } from 'react';
const Dashboard = () => {

    const [clientes, setClientes] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8080/listar')
            .then(response => response.json())
            .then(data => setClientes(data))
            .catch(error => console.error('Error:', error));
    }, []);

    return (
        <>
        {clientes.length === 0 && <p className="text-center">No hay clientes registrados</p>}        
        {clientes.length > 0 && <p className="text-center text-3xl border"><b>Clientes registrados</b></p>}
        <div>
            <table className="min-w-full table-auto">
                <thead>
                    <tr>
                        <th className="px-4 py-2">Nombre</th>
                        <th className="px-4 py-2">Apellido</th>
                        <th className="px-4 py-2">Correo</th>
                        <th className="px-4 py-2">País</th>
                    </tr>
                </thead>
                <tbody>
                    {clientes.map(cliente => (
                        <tr key={cliente.id}>
                            <td className="border px-4 py-2">{cliente.nombre}</td>
                            <td className="border px-4 py-2">{cliente.apellido}</td>
                            <td className="border px-4 py-2">{cliente.email}</td>
                            <td className="border px-4 py-2">{cliente.pais}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        </>
    );
};

export default Dashboard;