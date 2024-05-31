import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, getUserFromToken } from '../../../user/components/features/Context/AuthContext';
import { FaEdit, FaTrash, FaSave, FaUser, FaFlag, FaPhone, FaEnvelope, FaCalendarAlt, FaCamera, FaExclamationTriangle } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useLanguage } from '../../../user/components/features/Context/LanguageProvider';
import { getUserMessages, getAllCountries, updateUser, deleteUser, getProfilePictureUrl } from '../../../../services/UsuarioService';
import Notification from '../../../user/components/features/Notification/Notification';
import CustomModal from '../../../admin/components/common/CustomModal/CustomModal';
import Breadcrumb from '../../../user/components/common/Breadcrumb/Breadcrumb';

const AdminInformation = () => {
    const { user: userSession, login, logout, updateUser: updateUserContext } = useAuth();
    const { language } = useLanguage();
    const [editMode, setEditMode] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState('');
    const [notification, setNotification] = useState({ isOpen: false, message: '', type: '' });
    const [messages, setMessages] = useState({});
    const [userData, setUserData] = useState({
        nombre: userSession?.name || '',
        apellidos: userSession?.lastName || '',
        usuario: userSession?.username || '',
        pais: userSession?.country || '',
        telefono: userSession?.phone || '',
        email: userSession?.email || '',
        birthday: userSession?.birthday ? new Date(userSession.birthday) : null,
        profilePicture: userSession?.profilePicture || '',
    });
    const [photoFile, setPhotoFile] = useState(null);
    const [countries, setCountries] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        getUserMessages(language)
            .then(data => setMessages(data))
            .catch(error => console.error('Failed to load i18n messages:', error));
    }, [language]);

    useEffect(() => {
        getAllCountries()
            .then(setCountries)
            .catch(error => console.error('Error fetching countries:', error));
    }, []);

    const handleEditToggle = () => setEditMode(!editMode);

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'foto' && files.length > 0) {
            setPhotoFile(files[0]);
            const reader = new FileReader();
            reader.onloadend = () => {
                setUserData({ ...userData, foto: reader.result });
            };
            reader.readAsDataURL(files[0]);
        } else {
            setUserData({ ...userData, [name]: value });
        }
    };

    const handleDateChange = (date) => {
        setUserData({ ...userData, birthday: date });
    };

    const handleSave = () => {
        if (!userSession?.id) {
            handleNotification('error', 'Usuario no autenticado');
            return;
        }

        if (userData.birthday && userData.birthday > new Date()) {
            handleNotification('error', 'La fecha de nacimiento no puede estar en el futuro');
            return;
        }

        const updatedUserData = { ...userData, birthday: userData.birthday ? userData.birthday.toISOString().split('T')[0] : null };

        updateUser(userSession.id, updatedUserData, photoFile)
            .then(responseData => {
                setEditMode(false);
                handleNotification('success', 'Usuario actualizado exitosamente');
                localStorage.setItem('authToken', responseData.token);
                login(responseData.token);
                updateUserContext(getUserFromToken(responseData.token));
            })
            .catch(error => {
                console.error('Error updating user:', error);
                handleNotification('error', 'Error actualizando usuario');
            });
    };

    const handleDelete = () => {
        if (!userSession?.id) {
            handleNotification('error', 'Usuario no autenticado');
            return;
        }

        if (deleteConfirmation === 'DELETE') {
            deleteUser(userSession.id)
                .then(() => {
                    logout();
                    navigate('/login');
                })
                .catch(error => {
                    console.error('Error deleting user:', error);
                    handleNotification('error', 'Error eliminando usuario');
                });
        }
    };

    const handleNotification = (type, message) => {
        setNotification({ isOpen: true, message, type });
        setTimeout(() => {
            setNotification({ isOpen: false });
        }, 3000);
    };

    const renderInitial = (name) => {
        return name ? name.charAt(0).toUpperCase() : '';
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-100 px-4 pt-44 sm:px-6 lg:px-8">
            <div className="w-full max-w-4xl">
                <Breadcrumb />
            </div>
            <div className="max-w-4xl w-full mt-10 bg-white p-8 rounded-lg shadow-lg">
                <div className="flex justify-between items-center border-b pb-4 mb-4">
                    <h1 className="text-3xl font-semibold text-gray-800">Información de Usuario</h1>
                    <Link to="/admin/account-management">
                        <button className="text-blue-600 hover:text-blue-800">
                            {messages["text.informacion.volver"]}
                        </button>
                    </Link>
                </div>
                <div className="mb-4 text-center">
                    {userData.foto ? (
                        <img src={getProfilePictureUrl(userData.foto)} alt="Foto del usuario" className="w-24 h-24 rounded-full mx-auto mb-4" />
                    ) : (
                        <div className="w-24 h-24 rounded-full bg-gray-300 text-gray-700 flex items-center justify-center mx-auto mb-4 text-4xl">
                            {renderInitial(userData.nombre)}
                        </div>
                    )}
                </div>
                <div className="mb-4">
                    {editMode ? (
                        <div className="mb-4">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        <FaUser className="inline-block mr-1" /> Nombre
                                    </label>
                                    <input
                                        type="text"
                                        name="nombre"
                                        value={userData.nombre}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        <FaUser className="inline-block mr-1" /> Apellidos
                                    </label>
                                    <input
                                        type="text"
                                        name="apellidos"
                                        value={userData.apellidos}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        <FaFlag className="inline-block mr-1" /> País
                                    </label>
                                    <select
                                        name="pais"
                                        value={userData.pais}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border rounded"
                                    >
                                        <option value="">Selecciona un país</option>
                                        {countries.map(country => (
                                            <option key={country} value={country}>{country}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        <FaPhone className="inline-block mr-1" /> Teléfono
                                    </label>
                                    <input
                                        type="text"
                                        name="telefono"
                                        value={userData.telefono}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        <FaEnvelope className="inline-block mr-1" /> Email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={userData.email}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        <FaCalendarAlt className="inline-block mr-1" /> Fecha de Nacimiento
                                    </label>
                                    <DatePicker
                                        selected={userData.birthday}
                                        onChange={handleDateChange}
                                        dateFormat="yyyy-MM-dd"
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        <FaCamera className="inline-block mr-1" /> Foto
                                    </label>
                                    <input
                                        type="file"
                                        name="foto"
                                        accept="image/*"
                                        onChange={handleInputChange}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end mt-4">
                                <button
                                    onClick={handleSave}
                                    className="flex items-center text-white bg-blue-500 hover:bg-blue-600 font-medium rounded-lg text-sm px-5 py-2.5 mr-4">
                                    <FaSave className="mr-2" /> Guardar
                                </button>
                                <button
                                    onClick={() => setEditMode(false)}
                                    className="flex items-center text-gray-700 bg-white border border-gray-500 hover:bg-gray-100 font-medium rounded-lg text-sm px-5 py-2.5">
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="mb-4 text-center">
                                <h2 className="text-lg font-semibold text-zinc-900"><FaUser className="inline-block mr-2" /> {userData.nombre} {userData.apellidos}</h2>
                                {userData.pais && <p className="text-zinc-700"><FaFlag className="inline-block mr-2" /> {userData.pais}</p>}
                                {userData.email && <p className="text-zinc-700"><FaEnvelope className="inline-block mr-2" /> {userData.email}</p>}
                                {userData.telefono && <p className="text-zinc-700"><FaPhone className="inline-block mr-2" /> {userData.telefono}</p>}
                                {userData.birthday && (
                                    <p className="text-zinc-700">
                                        <FaCalendarAlt className="inline-block mr-2" /> {userData.birthday.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                    </p>
                                )}
                            </div>
                            <button
                                onClick={handleEditToggle}
                                className="flex items-center text-white bg-yellow-500 hover:bg-yellow-600 font-medium rounded-lg text-sm px-5 py-2.5 mb-4 mx-auto">
                                <FaEdit className="mr-2" /> Editar
                            </button>
                        </>
                    )}
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center text-white bg-red-500 hover:bg-red-600 font-medium rounded-lg text-sm px-5 py-2.5 mt-4 mx-auto">
                    <FaTrash className="mr-2" /> Borrar
                </button>
            </div>
            <CustomModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} hideCloseButton={true}>
                <div className="text-center">
                    <FaExclamationTriangle className="text-red-500 text-3xl mx-auto mb-4" />
                    <h2 className="text-2xl mb-4">¿Estás seguro?</h2>
                    <p className="mb-4">¿Realmente deseas eliminar esta cuenta? <br /> <b>Este proceso no se puede revertir.</b></p>
                    <input
                        type="text"
                        value={deleteConfirmation}
                        onChange={(e) => setDeleteConfirmation(e.target.value)}
                        placeholder="Escribe DELETE para confirmar...."
                        className="mb-4 p-2 border rounded w-full"
                    />
                    <div className="flex justify-end gap-4">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="text-gray-700 bg-white border border-gray-500 hover:bg-gray-100 font-medium rounded-lg text-sm px-5 py-2.5">
                            Cancelar
                        </button>
                        <button
                            onClick={handleDelete}
                            className="text-white bg-red-500 hover:bg-red-600 font-medium rounded-lg text-sm px-5 py-2.5">
                            Confirmar
                        </button>
                    </div>
                </div>
            </CustomModal>
            {notification.isOpen && (
                <Notification
                    type={notification.type}
                    message={notification.message}
                    isOpen={notification.isOpen}
                    onClose={() => setNotification({ isOpen: false })}
                />
            )}
        </div>
    );
};

export default AdminInformation;
