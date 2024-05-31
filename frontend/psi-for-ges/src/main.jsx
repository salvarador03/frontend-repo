import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { LanguageProvider } from './views/user/components/features/Context/LanguageProvider';
import App from './App';
import { AuthProvider } from './views/user/components/features/Context/AuthContext';
import { Buffer } from 'buffer';
import { util } from 'util';
import './index.css';

window.Buffer = Buffer;
window.util = util;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <LanguageProvider>
          <App />
        </LanguageProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
