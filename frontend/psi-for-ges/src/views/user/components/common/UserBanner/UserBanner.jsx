import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';

const UserBanner = () => {
    return (
        <div className="bg-indigo-600">
            <div className="max-w-screen-xl mx-auto px-4 py-3 text-white sm:text-center md:px-8">
                <p className="font-medium">
                    Pablo Alvarado, Psicólogo Forense, ofrezco servicios profesionales. &nbsp;&nbsp;&nbsp;
                    <Link to="/frontend-repo/servicios" className="font-semibold underline duration-150 hover:text-indigo-100 inline-flex items-center gap-x-1">
                        Conocer más
                        <FaArrowRight className="w-5 h-5" />
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default UserBanner;
