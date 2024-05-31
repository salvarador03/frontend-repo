import React from 'react';
import Navbar from '../Navbar/Navbar';
import { useLanguage } from '../../features/Context/LanguageProvider';
import UserBanner from '../UserBanner/UserBanner';

const Header = () => {
  const { language } = useLanguage();
  return (
    <header className="bg-white text-gray-700 shadow-md fixed w-full top-0 z-50">
      <UserBanner />
      <div className="flex justify-center p-5">
        <Navbar />
      </div>
    </header>
  );
};

export default Header;
