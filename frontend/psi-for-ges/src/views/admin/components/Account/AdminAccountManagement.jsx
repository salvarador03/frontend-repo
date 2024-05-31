import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEllipsisV, FaEye, FaEdit, FaTrash, FaCheck } from 'react-icons/fa';
import axios from 'axios';
import Notification from '../../../user/components/features/Notification/Notification';
import { useAuth } from '../../../user/components/features/Context/AuthContext';
import Breadcrumb from '../../../user/components/common/Breadcrumb/Breadcrumb';

const AdminAccountManagement = () => {
  const { user: userSession, logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState({
    "text.micuenta.titulo": "Mi cuenta",
    "text.micuenta.logout": "Cerrar sesión",
    "text.micuenta.detalles.cuenta": "DETALLES DE LA CUENTA",
    "text.micuenta.informacion.personal": "INFORMACIÓN PERSONAL",
  });
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [notification, setNotification] = useState({ isOpen: false, message: '', type: '' });
  const apiEndpoint = import.meta.env.VITE_API_ENDPOINT;
  const navigate = useNavigate();
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    if (!token) {
      setNotification({ isOpen: true, message: 'Authorization token is missing. Please log in.', type: 'error' });
      navigate('/login');
      return;
    }

    axios.get(`${apiEndpoint}/usuarios/listar`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(response => {
        const usersWithRoles = response.data.map(user => ({
          ...user,
          roles: Array.isArray(user.roles) ? user.roles.map(role => role.authority) : []
        }));
        setUsers(usersWithRoles);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
        setNotification({ isOpen: true, message: 'Error fetching users: ' + error.message, type: 'error' });
      });
  }, [apiEndpoint, token, navigate]);

  useEffect(() => {
    if (!token) return;

    axios.get(`${apiEndpoint}/roles/listar`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(response => setRoles(response.data))
      .catch(error => {
        setNotification({ isOpen: true, message: 'Error fetching roles: ' + error.message, type: 'error' });
      });
  }, [apiEndpoint, token]);

  const handleView = (user) => {
    setSelectedUser(user);
    setNotification({ isOpen: true, message: `Ver detalles de: ${user.nombre}`, type: 'success' });
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setNotification({ isOpen: true, message: `Editar detalles de: ${user.nombre}`, type: 'success' });
  };

  const handleDelete = (userId) => {
    axios.delete(`${apiEndpoint}/usuarios/eliminar/${userId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(response => {
        setUsers(users.filter(user => user.id !== userId));
        setNotification({ isOpen: true, message: 'Usuario eliminado correctamente', type: 'success' });
      })
      .catch(error => {
        console.error('Error deleting user:', error);
        setNotification({ isOpen: true, message: 'Error deleting user: ' + error.message, type: 'error' });
      });
  };

  const handleUpdateRoles = (userId, newRoles) => {
    axios.put(`${apiEndpoint}/usuarios/roles/${userId}`, newRoles, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(response => {
        setUsers(users.map(user => user.id === userId ? { ...user, roles: newRoles } : user));
        setNotification({ isOpen: true, message: 'Roles actualizados', type: 'success' });
      })
      .catch(error => {
        console.error('Error updating roles:', error);
        setNotification({ isOpen: true, message: 'Error updating roles: ' + error.message, type: 'error' });
      });
  };

  const handleUpdateEstado = (userId, estado) => {
    axios.put(`${apiEndpoint}/usuarios/estado/${userId}`, { estado: estado }, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(response => {
        setUsers(users.map(user => user.id === userId ? { ...user, enabled: estado === 'enabled', bloqueado: estado === 'bloqueado' } : user));
        setNotification({ isOpen: true, message: 'Estado actualizado', type: 'success' });
      })
      .catch(error => {
        console.error('Error updating estado:', error);
        setNotification({ isOpen: true, message: 'Error updating estado: ' + error.message, type: 'error' });
      });
  };

  const toggleDropdown = (userId) => {
    setDropdownOpen(dropdownOpen === userId ? null : userId);
  };

  const handleRoleClick = (user, role) => {
    const userRoles = user.roles || [];
    const hasRole = userRoles.includes(role.authority);
    const newRoles = hasRole ? userRoles.filter(r => r !== role.authority) : [...userRoles, role.authority];

    axios.put(`${apiEndpoint}/usuarios/roles/${user.id}`, newRoles, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(response => {
        setUsers(users.map(u => u.id === user.id ? { ...u, roles: newRoles } : u));
        setNotification({ isOpen: true, message: 'Roles actualizados', type: 'success' });
      })
      .catch(error => {
        console.error('Error updating roles:', error);
        setNotification({ isOpen: true, message: 'Error updating roles: ' + error.message, type: 'error' });
      });
  };

  const closeNotification = () => {
    setNotification({ isOpen: false, message: '', type: '' });
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-zinc-100 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto w-full mt-40">
        <Breadcrumb />
        <div className="flex flex-col items-center mb-10">
          <h1 className="text-3xl font-bold mb-2">{messages['text.micuenta.titulo']}</h1>
          <Link to="/logout">
            <button className="text-gray-700 hover:text-gray-900" onClick={logout}>
              {messages['text.micuenta.logout']}
            </button>
          </Link>
        </div>
        <div className="flex flex-col md:flex-row justify-between w-full">
          <div className="w-full md:w-2/3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.map(user => (
              <div key={user.id} className="bg-white p-4 rounded-lg shadow-md relative">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">{user.nombre}</h2>
                  <button onClick={() => toggleDropdown(user.id)} className="text-gray-600 hover:text-gray-900">
                    <FaEllipsisV />
                  </button>
                </div>
                <p className="mb-2"><strong>ID:</strong> {user.id}</p>
                <p className="mb-2"><strong>Email:</strong> {user.email}</p>
                <div className="mb-2">
                  <strong>Roles:</strong>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {roles.map(role => {
                      const userRoles = user.roles || [];
                      const hasRole = userRoles.includes(role.authority);
                      return (
                        <div
                          key={role.id}
                          className={`flex items-center px-3 py-1 border rounded-full cursor-pointer ${hasRole ? 'bg-gray-200' : 'bg-white'} hover:bg-gray-100`}
                          onClick={() => handleRoleClick(user, role)}
                        >
                          {role.authority}
                          {hasRole && <FaCheck className="ml-2 text-green-500" />}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="mb-4">
                  <strong>Estado:</strong>
                  <div className="flex mt-2">
                    <button
                      onClick={() => handleUpdateEstado(user.id, 'enabled')}
                      className={`px-2 py-1 rounded-l ${user.enabled ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                      Habilitado
                    </button>
                    <button
                      onClick={() => handleUpdateEstado(user.id, 'bloqueado')}
                      className={`px-2 py-1 rounded-r ${user.bloqueado ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                      Bloqueado
                    </button>
                  </div>
                </div>
                {dropdownOpen === user.id && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      <button onClick={() => handleView(user)} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full">
                        <FaEye className="mr-2" /> Ver
                      </button>
                      <button onClick={() => handleEdit(user)} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full">
                        <FaEdit className="mr-2" /> Editar
                      </button>
                      <button onClick={() => handleDelete(user.id)} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full">
                        <FaTrash className="mr-2" /> Borrar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="w-full md:w-1/3 mt-8 md:mt-0 md:ml-10">
            <h2 className="text-xl font-semibold mb-4">{messages['text.micuenta.detalles.cuenta']}</h2>
            <p className="mb-4">{userSession?.name + " " + userSession?.lastName}</p>
            <p className="mb-4">{userSession?.city}</p>
            <p className="mb-4">{userSession?.country}</p>
            <p className="mb-4">{userSession?.phone}</p>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              <Link to="/admin/account-management/information">
                {messages['text.micuenta.informacion.personal']}
              </Link>
            </button>
          </div>
        </div>
        <Notification
          type={notification.type}
          message={notification.message}
          isOpen={notification.isOpen}
          onClose={closeNotification}
        />
      </div>
    </div>
  );
};

export default AdminAccountManagement;
