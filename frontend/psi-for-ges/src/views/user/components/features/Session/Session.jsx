import React from "react";
import { useAuth } from '../../features/Context/AuthContext';

const loadJwt = async () => {
    try {
        const jwtModule = await import('jsonwebtoken');
        console.log('jsonwebtoken loaded:', jwtModule);
        if (!jwtModule.default) {
            throw new Error('Invalid jwt module');
        }
        return jwtModule.default;
    } catch (error) {
        console.error('Error loading jwt module:', error);
        throw error;
    }
};

const setSession = async (token) => {
    try {
        const jwt = await loadJwt();
        const decoded = jwt.decode(token);
        console.log('Decoded token:', decoded);
        localStorage.setItem('userSession', token);
        // Mueve la llamada a useAuth fuera de esta función
        return decoded;
    } catch (error) {
        console.error('Error setting session:', error);
    }
};

export default setSession;
