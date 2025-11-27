import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Bars3Icon, XMarkIcon, UserCircleIcon, BriefcaseIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/');
  };

  // Main navigation links
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Jobs', path: '/jobs' },
    { name: 'Skill Development', path: '/skill-development' },
    { name: 'Counseling', path: '/counseling' },
  ];

  // User-specific links (only shown when logged in)
  const userLinks = [
    { 
      name: 'My Applications', 
      path: '/my-applications',
      icon: ClipboardDocumentListIcon 
    },
    { 
      name: 'Profile', 
      path: '/profile',
      icon: UserCircleIcon 
    },
  ];

  // Check if current path is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center group">
              <BriefcaseIcon className="h-8 w-8 text-primary mr-2 group-hover:scale-110 transition-transform" />
              <span className="text-2xl font-bold text-primary">JobPortal</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {/* Main Nav Links */}
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'text-primary bg-blue-50'
                    : 'text-gray-700 hover:text-primary hover:bg-gray-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            {/* User Section */}
            {user ? (
              <>
                {/* User Links */}
                {userLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.name}
                      to={link.path}
                      className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive(link.path)
                          ? 'text-primary bg-blue-50'
                          : 'text-gray-700 hover:text-primary hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{link.name}</span>
                    </Link>
                  );
                })}

                {/* Admin Panel Button (only for admins) */}
                {user.role === 'admin' && (
                  <Link 
                    to="/admin" 
                    className="ml-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:from-green-600 hover:to-green-700 transition-all shadow-md"
                  >
                    Admin Panel
                  </Link>
                )}

                {/* User Name Badge */}
                <div className="ml-2 px-3 py-2 bg-gray-100 rounded-lg flex items-center space-x-2">
                  <UserCircleIcon className="h-5 w-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">
                    {user.name.split(' ')[0]}
                  </span>
                </div>

                {/* Logout Button */}
                <button 
                  onClick={handleLogout} 
                  className="ml-2 btn-primary text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              /* Auth Buttons for Non-logged Users */
              <div className="flex items-center space-x-3 ml-4">
                <Link 
                  to="/login" 
                  className="text-gray-700 hover:text-primary font-medium transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="btn-primary"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-primary p-2 rounded-md transition-colors"
            >
              {isOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {/* Main Nav Links */}
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive(link.path)
                    ? 'text-primary bg-blue-50'
                    : 'text-gray-700 hover:text-primary hover:bg-gray-50'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}

            {/* Divider */}
            {user && <div className="border-t border-gray-200 my-2"></div>}

            {/* User-specific Links */}
            {user ? (
              <>
                {/* User Info Badge */}
                <div className="px-3 py-2 bg-blue-50 rounded-md mb-2">
                  <div className="flex items-center space-x-2">
                    <UserCircleIcon className="h-6 w-6 text-primary" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-600">{user.email}</p>
                    </div>
                  </div>
                </div>

                {/* User Links */}
                {userLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.name}
                      to={link.path}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                        isActive(link.path)
                          ? 'text-primary bg-blue-50'
                          : 'text-gray-700 hover:text-primary hover:bg-gray-50'
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{link.name}</span>
                    </Link>
                  );
                })}

                {/* Admin Panel (Mobile) */}
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="block px-3 py-2 rounded-md text-base font-medium bg-green-50 text-green-700 hover:bg-green-100"
                    onClick={() => setIsOpen(false)}
                  >
                    🔐 Admin Panel
                  </Link>
                )}

                {/* Logout Button (Mobile) */}
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              /* Auth Buttons for Non-logged Users (Mobile) */
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 rounded-md text-base font-medium bg-primary text-white hover:bg-blue-600"
                  onClick={() => setIsOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;