import React, { useState } from 'react';
import { AiOutlineRobot } from 'react-icons/ai';
import ChatBot from './ChatBot';
import { useAuth } from '../../features/Context/AuthContext';

const BotonIA = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { user } = useAuth();
  const isAdmin = user?.roles.includes('ROLE_ADMIN');

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="fixed right-28 bottom-6 flex flex-col items-end z-50">
      <button onClick={toggleChat} className="bg-indigo-800 text-white p-3 rounded-full shadow-lg flex items-center">
        <AiOutlineRobot size={24} />
        <span className="ml-2">Asistente Personal</span>
      </button>
      {isChatOpen && <ChatBot onClose={toggleChat} />}
    </div>
  );
};

export default BotonIA;
