export default function Sidebar({ darkMode }) {
    return (
      <aside className={`w-64 ${darkMode ? 'bg-gray-800' : 'bg-white'} p-4 hidden md:block`}>
        <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Categories</h3>
        <ul className="space-y-2">
          {['Technology', 'Business', 'Science', 'Health', 'Entertainment', 'Sports'].map((category) => (
            <li key={category}>
              <a href="#" className={`block px-3 py-2 rounded-lg ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}>
                {category}
              </a>
            </li>
          ))}
        </ul>
      </aside>
    );
  }