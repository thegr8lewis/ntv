export default function Footer({ darkMode }) {
  return (
    <footer className={`mt-12 ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'} py-8`}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>NewsFlash</h2>
            <p className="mt-1 text-sm">Stay informed with the latest news</p>
          </div>
          <div className="flex flex-col md:flex-row gap-4 md:gap-8">
            <div>
              <h3 className="font-medium mb-2">Categories</h3>
              <ul className="text-sm space-y-1">
                <li>Technology</li>
                <li>Business</li>
                <li>Science</li>
                <li>Health</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2">About</h3>
              <ul className="text-sm space-y-1">
                <li>Our Team</li>
                <li>Contact Us</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2">Follow Us</h3>
              <div className="flex space-x-3 text-sm">
                <a href="#" className={`${darkMode ? 'hover:text-blue-400' : 'hover:text-blue-600'}`}>Twitter</a>
                <a href="#" className={`${darkMode ? 'hover:text-blue-400' : 'hover:text-blue-600'}`}>Facebook</a>
                <a href="#" className={`${darkMode ? 'hover:text-blue-400' : 'hover:text-blue-600'}`}>Instagram</a>
              </div>
            </div>
          </div>
        </div>
        <div className={`mt-8 pt-6 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} text-center text-sm`}>
          <p>© 2025 NewsFlash. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}