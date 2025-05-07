import { Check, X, XCircle } from 'lucide-react';

export default function Verification({ news, darkMode, setActiveFeature }) {
  return (
    <div className={`mb-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4 shadow-md`}>
      <div className={`flex justify-between items-center mb-4 border-b ${darkMode ? 'border-gray-600' : 'border-gray-200'} pb-2`}>
        <h3 className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Verification Status</h3>
        <button 
          onClick={() => setActiveFeature(null)}
          className={`${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}
          aria-label="Close verification"
        >
          <XCircle size={20} />
        </button>
      </div>
      <div className={`flex items-center ${news.isVerified ? 'text-green-500' : 'text-amber-500'}`}>
        {news.isVerified ? (
          <>
            <div className={`${darkMode ? 'bg-green-900' : 'bg-green-100'} p-2 rounded-full mr-3`}>
              <Check size={20} />
            </div>
            <div>
              <p className="font-medium">Verified Information</p>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>This article has been fact-checked by our team.</p>
            </div>
          </>
        ) : (
          <>
            <div className={`${darkMode ? 'bg-amber-900' : 'bg-amber-100'} p-2 rounded-full mr-3`}>
              <X size={20} />
            </div>
            <div>
              <p className="font-medium">Unverified Content</p>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>This story is still being verified by our fact-checkers.</p>
            </div>
          </>
        )}
      </div>
      <div className={`mt-6 ${darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'} p-3 rounded-md border`}>
        <h4 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Source Information</h4>
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Published by: {news.author}</p>
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Published: {news.timestamp}</p>
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-2`}>
          {news.isVerified ? 
            "Our fact-checking team has confirmed the accuracy of this report using multiple reliable sources." : 
            "This article is currently being reviewed by our fact-checking team. Check back soon for verification status."}
        </p>
      </div>
    </div>
  );
}