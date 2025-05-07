import { useState } from 'react';
import { Search, Bell, User } from 'lucide-react';

export default function Header({ darkMode, toggleDarkMode, refreshImages }) {
  return (
    <header className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} shadow-lg sticky top-0 z-40 transition-colors duration-300`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">NewsFlash</h1>
            <span className={`text-xs px-2 py-1 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-blue-100 text-blue-800'}`}>Live</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <div className={`flex items-center rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} px-4 py-2`}>
              <Search size={16} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
              <input 
                type="text" 
                placeholder="Search news..." 
                className={`ml-2 bg-transparent outline-none ${darkMode ? 'placeholder-gray-500' : 'placeholder-gray-400'} w-40`} 
              />
            </div>
          
            
            <button 
              onClick={toggleDarkMode}
              className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition`}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition md:hidden`}>
              <Search size={20} />
            </button>
            <button 
              onClick={toggleDarkMode}
              className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition md:hidden`}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </div>

      </div>
    </header>
  );
}