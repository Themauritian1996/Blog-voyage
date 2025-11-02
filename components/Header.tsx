import React from 'react';
import { Link } from 'react-router-dom';
import { GlobeIcon } from './icons';

const Header: React.FC = () => {
  return (
    <header className="bg-white/80 backdrop-blur-sm sticky top-0 z-40 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 text-xl md:text-2xl font-bold text-slate-700 hover:text-slate-900 transition-colors">
          <GlobeIcon className="w-6 h-6" />
          <span>Wanderlust Journal</span>
        </Link>
        <span className="font-sans text-sm text-slate-500 hidden md:block">Our Adventures Together</span>
      </div>
    </header>
  );
};

export default Header;