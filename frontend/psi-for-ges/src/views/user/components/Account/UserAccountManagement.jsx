import React, { useState, useEffect } from 'react';
import Breadcrumb from '../../../user/components/common/Breadcrumb/Breadcrumb';
import { useAuth } from '../../../user/components/features/Context/AuthContext';
import { useLanguage } from '../features/Context/LanguageProvider';
import { getMessages } from '../../../../services/FeaturesService';
import { Link } from 'react-router-dom';
import ContratosList from './ContratosList';

const UserAccountManagement = () => {
    const [messages, setMessages] = useState({});
    const { language } = useLanguage();
    const { user: userSession, logout } = useAuth();

    useEffect(() => {
        getMessages(language)
            .then(data => setMessages(data))
            .catch(error => console.error('Failed to load i18n messages:', error));
    }, [language]);

    const noServicesMessage = {
        title: messages['text.micuenta.historial.servicios'],
        message: messages['text.micuenta.noservicios'],
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-zinc-100 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto w-full mt-40">
                <Breadcrumb />
                <div className="flex flex-col items-center mb-10">
                    <h1 className="text-3xl font-bold mb-2">{messages['text.micuenta.titulo']}</h1>
                    <Link to="/frontend-repo/logout">
                        <button className="text-gray-700 hover:text-gray-900" onClick={logout}>
                            {messages['text.micuenta.logout']}
                        </button>
                    </Link>
                </div>
                <div className="flex flex-col md:flex-row justify-between w-full">
                    <div className="w-full md:w-2/3">
                        <ContratosList noServicesMessage={noServicesMessage} />
                    </div>
                    <div className="w-full md:w-1/3 mt-8 md:mt-0 md:ml-10">
                        <h2 className="text-xl font-semibold mb-4">{messages['text.micuenta.detalles.cuenta']}</h2>
                        <p className="mb-4">{userSession?.name + " " + userSession?.lastName}</p>
                        <p className="mb-4">{userSession?.city}</p>
                        <p className="mb-4">{userSession?.country}</p>
                        <p className="mb-4">{userSession?.phone}</p>
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            <Link to="/frontend-repo/account-management/information">
                                {messages['text.micuenta.informacion.personal']}
                            </Link>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserAccountManagement;
