import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.jpg';

const Navbar = () => {
  return (
    <nav className="sticky top-0 left-0 right-0 z-50 bg-blue-500 text-white p-4 rounded-lg mx-4 mt-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="text-white no-underline flex items-center">
            {/* Logo */}
            <img src={logo} alt="Elite Speaks Logo" className="h-10 w-auto rounded-md mr-2" />
            <span className="hidden md:inline text-xl font-semibold">Elite Speaks</span>
          </Link>
        </div>
        <div className="space-x-3">
          <Link to="/signin" className="bg-blue-500 text-white px-4 py-1 border border-white rounded-md">Log in</Link>
          <Link to="/signup" className="bg-yellow-400 text-blue-800 px-4 py-1 rounded-md">Sign up</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;