import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../../../user/components/features/Context/AuthContext';
import { useLanguage } from '../../../user/components/features/Context/LanguageProvider';
import Notification from '../../../user/components/features/Notification/Notification';

const AdminProfileButton = ({ user }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { language } = useLanguage();
  const [messages, setMessages] = useState({});
  const [notification, setNotification] = useState({ isOpen: false, message: '', type: '' });
  const [profilePictureUrl, setProfilePictureUrl] = useState('');

  const apiEndpoint = import.meta.env.VITE_API_ENDPOINT;

  useEffect(() => {
    fetch(`${apiEndpoint}/usuarios/messages?lang=${language}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => setMessages(data))
      .catch(error => console.error('Failed to load i18n messages:', error));
  }, [apiEndpoint, language]);

  useEffect(() => {
    if (user?.id) {
      fetch(`${apiEndpoint}/usuarios/foto/${user.id}`)
        .then(response => {
          if (response.ok) {
            setProfilePictureUrl(`${apiEndpoint}/usuarios/foto/${user.id}`);
          }
        })
        .catch(error => console.error('Failed to load profile picture:', error));
    }
  }, [user]);

  const handleProfileClick = () => {
    navigate('/admin/account-management');
  };

  const handleLogout = () => {
    logout(); // No manejar logout como una promesa
    setNotification({
      isOpen: true,
      message: messages.logout?.success || 'You have successfully logged out!',
      type: 'success'
    });
    setTimeout(() => {
      setNotification({ isOpen: false, message: '', type: '' });
      navigate('/login');
    }, 3000);
  };

  const getUserInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : '';
  };

  return (
    <div className="relative flex items-center space-x-4">
      <button
        className="w-10 h-10 outline-none rounded-full ring-offset-2 ring-gray-200 ring-2 lg:focus:ring-indigo-600"
        onClick={handleProfileClick}
      >
        {user && profilePictureUrl ? (
          <img src={profilePictureUrl} className="w-full h-full rounded-full" alt="Profile" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-300 rounded-full text-white">
            {getUserInitial(user?.nombre)}
          </div>
        )}
      </button>
      <button className="text-red-500 hover:text-red-700 flex items-center space-x-2" onClick={handleLogout}>
        <FaSignOutAlt />
        <span>Logout</span>
      </button>
      <Notification
        type={notification.type}
        message={notification.message}
        isOpen={notification.isOpen}
        onClose={() => setNotification({ isOpen: false, message: '', type: '' })}
      />
    </div>
  );
};

export default AdminProfileButton;
