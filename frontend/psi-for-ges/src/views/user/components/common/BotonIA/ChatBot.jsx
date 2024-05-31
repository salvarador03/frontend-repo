import React, { useState } from 'react';
import axios from 'axios';
import { AiOutlineClose, AiOutlineSend, AiOutlineCopy, AiOutlineClear } from 'react-icons/ai';

const ChatBot = ({ onClose }) => {
  const API_URL = import.meta.env.VITE_API_ENDPOINT;
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (input.trim() === '') return;

    const userMessage = { text: input, sender: 'user' };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput('');

    try {
      const response = await axios.post(`${API_URL}/chat`, { message: input }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data && response.data.response) {
        const botMessage = { text: response.data.response, sender: 'bot' };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
      } else {
        const errorMessage = { text: 'La respuesta de la API no contiene los datos esperados.', sender: 'bot' };
        setMessages((prevMessages) => [...prevMessages, errorMessage]);
      }
    } catch (error) {
      const errorMessage = { text: 'Hubo un error al procesar tu solicitud.', sender: 'bot' };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return (
    <div className="fixed bottom-20 right-20 bg-white shadow-lg rounded-lg p-4 w-80 z-50">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Asistente Personal</h2>
        <div className="flex space-x-2">
          <button onClick={clearMessages} className="text-gray-500">
            <AiOutlineClear size={24} />
          </button>
          <button onClick={onClose} className="text-red-500">
            <AiOutlineClose size={24} />
          </button>
        </div>
      </div>
      <div className="h-64 overflow-y-scroll my-2 border p-2">
        {messages.map((msg, index) => (
          <div key={index} className={`my-1 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
            <p className={`inline-block p-2 rounded ${msg.sender === 'user' ? 'bg-blue-200' : 'bg-gray-200'}`}>
              {msg.text}
              {msg.sender === 'bot' && (
                <button 
                  onClick={() => copyToClipboard(msg.text)} 
                  className="ml-2 text-gray-500 hover:text-gray-700"
                >
                  <AiOutlineCopy size={16} />
                </button>
              )}
            </p>
          </div>
        ))}
      </div>
      <div className="flex items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="border rounded w-full p-2"
          placeholder="Escribe tu mensaje..."
        />
        <button onClick={sendMessage} className="bg-blue-500 text-white p-2 rounded ml-2">
          <AiOutlineSend size={24} />
        </button>
      </div>
    </div>
  );
};

export default ChatBot;
