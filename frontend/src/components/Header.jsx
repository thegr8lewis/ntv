// import { useState, useEffect } from 'react';
// import { Search, Bell, User, Settings, LogOut } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';

// export default function Header({ darkMode, toggleDarkMode, refreshImages }) {
//   const [userEmail, setUserEmail] = useState('');
//   const [showDropdown, setShowDropdown] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     // Get user email from localStorage
//     const email = localStorage.getItem('newsAppUserEmail');
//     if (email && email !== 'guest') {
//       setUserEmail(email);
//     }

//     // Close dropdown when clicking outside
//     const handleClickOutside = (event) => {
//       if (showDropdown && !event.target.closest('.user-dropdown-container')) {
//         setShowDropdown(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, [showDropdown]);

//   const handleLogout = () => {
//     localStorage.removeItem('newsAppUserEmail');
//     localStorage.removeItem('newsAppIsGuest');
//     localStorage.removeItem('newsAppUserTopics');
//     navigate('/');
//     window.location.reload();
//   };

//   const handleSettings = () => {
//     setShowDropdown(false);
//     navigate('/settings');
//   };

//   return (
//     <header className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} shadow-lg sticky top-0 z-40 transition-colors duration-300`}>
//       <div className="container mx-auto px-4 py-4">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center space-x-4">
//             {/* <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">NewsFlash</h1> */}
//             <div className="flex items-center">
//               <span className={`text-2xl font-serif font-bold ${darkMode ? 'text-blue-300' : 'text-blue-600'}`}>
//                 NewsFlash
//               </span>
//             </div>
//           </div>
          
//           <div className="hidden md:flex items-center space-x-4">            
//             {/* <button 
//               onClick={toggleDarkMode}
//               className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition`}
//             >
//               {darkMode ? '☀️' : '🌙'}
//             </button> */}
//           </div>
          
//           <div className="flex items-center space-x-4">
//             {userEmail && (
//               <div className="relative user-dropdown-container">
//                 <button 
//                   onClick={() => setShowDropdown(!showDropdown)}
//                   className={`flex items-center space-x-2 px-3 py-2 rounded-full transition ${
//                     darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
//                   } ${showDropdown ? (darkMode ? 'bg-gray-700' : 'bg-gray-100') : ''}`}
//                 >
//                   <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
//                     darkMode ? 'bg-blue-600' : 'bg-blue-100 text-blue-800'
//                   }`}>
//                     <User size={16} />
//                   </div>
//                   <span className="hidden md:inline font-medium truncate max-w-[120px]">
//                     {userEmail.split('@')[0]}
//                   </span>
//                 </button>
                
//                 {showDropdown && (
//                   <div className={`absolute right-0 mt-2 w-56 rounded-lg shadow-xl z-50 ${
//                     darkMode ? 'bg-gray-700' : 'bg-white'
//                   } transition-all duration-200 origin-top-right`}
//                   style={{
//                     boxShadow: darkMode 
//                       ? '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
//                       : '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
//                   }}>
//                     <div className="p-1">
//                       <div className={`px-4 py-3 border-b ${
//                         darkMode ? 'border-gray-600' : 'border-gray-200'
//                       }`}>
//                         <p className="text-sm font-medium truncate">{userEmail}</p>
//                       </div>
                      
//                       <button 
//                         onClick={handleSettings}
//                         className={`flex items-center w-full px-4 py-3 text-sm rounded-md transition ${
//                           darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'
//                         }`}
//                       >
//                         <Settings size={18} className="mr-3" />
//                         <span>Settings</span>
//                       </button>
                      
//                       <button 
//                         onClick={handleLogout}
//                         className={`flex items-center w-full px-4 py-3 text-sm rounded-md transition ${
//                           darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'
//                         }`}
//                       >
//                         <LogOut size={18} className="mr-3" />
//                         <span>Log out</span>
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             )}
          
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// }

import { useState, useEffect } from 'react';
import { Search, Bell, User, Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Header({ darkMode, toggleDarkMode, refreshImages }) {
  const [userEmail, setUserEmail] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const email = localStorage.getItem('newsAppUserEmail');
    if (email && email !== 'guest') {
      setUserEmail(email);
    }

    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest('.user-dropdown-container')) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDropdown]);

  const handleLogout = () => {
    localStorage.removeItem('newsAppUserEmail');
    localStorage.removeItem('newsAppIsGuest');
    localStorage.removeItem('newsAppUserTopics');
    navigate('/');
    window.location.reload();
  };

  const handleSettings = () => {
    setShowDropdown(false);
    navigate('/settings');
  };

  const goToChatroom = () => {
    navigate('/chatroom');
  };

  return (
    <header
      className={`${
        darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
      } shadow-lg sticky top-0 z-40 transition-colors duration-300`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <span
                className={`text-2xl font-serif font-bold ${
                  darkMode ? 'text-blue-300' : 'text-blue-600'
                }`}
              >
                NewsFlash
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Rooms Button */}
            <button
              onClick={goToChatroom}
              className={`px-4 py-2 rounded-full text-sm font-medium transition duration-200 shadow ${
                darkMode
                  ? 'bg-blue-600 text-white hover:bg-blue-500'
                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              }`}
            >
              Rooms
            </button>

            {userEmail && (
              <div className="relative user-dropdown-container">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-full transition ${
                    darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  } ${showDropdown ? (darkMode ? 'bg-gray-700' : 'bg-gray-100') : ''}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      darkMode ? 'bg-blue-600' : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    <User size={16} />
                  </div>
                  <span className="hidden md:inline font-medium truncate max-w-[120px]">
                    {userEmail.split('@')[0]}
                  </span>
                </button>

                {showDropdown && (
                  <div
                    className={`absolute right-0 mt-2 w-56 rounded-lg shadow-xl z-50 ${
                      darkMode ? 'bg-gray-700' : 'bg-white'
                    } transition-all duration-200 origin-top-right`}
                    style={{
                      boxShadow: darkMode
                        ? '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
                        : '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    <div className="p-1">
                      <div
                        className={`px-4 py-3 border-b ${
                          darkMode ? 'border-gray-600' : 'border-gray-200'
                        }`}
                      >
                        <p className="text-sm font-medium truncate">{userEmail}</p>
                      </div>

                      <button
                        onClick={handleSettings}
                        className={`flex items-center w-full px-4 py-3 text-sm rounded-md transition ${
                          darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'
                        }`}
                      >
                        <Settings size={18} className="mr-3" />
                        <span>Settings</span>
                      </button>

                      <button
                        onClick={handleLogout}
                        className={`flex items-center w-full px-4 py-3 text-sm rounded-md transition ${
                          darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'
                        }`}
                      >
                        <LogOut size={18} className="mr-3" />
                        <span>Log out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
