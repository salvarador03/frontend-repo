import React from 'react';
import AdminNavbar from '../AdminNavbar/AdminNavbar';

const AdminHeader = () => {
    return (
        <header className="bg-gray-800 text-white shadow-md fixed w-full top-0 z-50">
            <div className='flex justify-center'>
                <AdminNavbar />
            </div>
        </header>
    );
};

export default AdminHeader;
