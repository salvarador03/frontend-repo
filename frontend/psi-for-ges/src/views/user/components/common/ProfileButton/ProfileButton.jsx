import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../../features/Context/AuthContext';
import { useLanguage } from '../../features/Context/LanguageProvider';
import Notification from '../../features/Notification/Notification';

const ProfileButton = ({ user }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { language } = useLanguage();
  const [messages, setMessages] = useState({});
  const [notification, setNotification] = useState({ isOpen: false, message: '', type: '' });
  const [profilePictureUrl, setProfilePictureUrl] = useState('');

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/usuarios/messages?lang=${language}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error('Failed to load i18n messages:', error);
      }
    };
    fetchMessages();
  }, [language]);

  useEffect(() => {
    if (user?.id) {
      fetch(`${import.meta.env.VITE_API_ENDPOINT}/usuarios/foto/${user.id}`)
        .then(response => {
          if (response.ok) {
            setProfilePictureUrl(`${import.meta.env.VITE_API_ENDPOINT}/usuarios/foto/${user.id}`);
          }
        })
        .catch(error => console.error('Failed to load profile picture:', error));
    }
  }, [user]);

  const handleProfileClick = () => {
    navigate('/account-management');
  };

  const handleLogout = () => {
    logout();
    setNotification({
      isOpen: true,
      message: messages['text.logout.success'] || 'You have successfully logged out!',
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

export default ProfileButton;
