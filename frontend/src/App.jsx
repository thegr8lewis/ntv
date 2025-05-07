import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './pages/Layout';
import Translator from './pages/Translator';
import Verification from './pages/Verification';
import Chatbot from './pages/Chatbot';
import NewsDetailPage from './pages/NewsDetails';

function App() {
  return (
    <Router>
      <Routes>
        {/* Main layout with nested routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Translator />} />
          <Route path="translator" element={<Translator />} />
          <Route path="verification" element={<Verification />} />
          <Route path="chatbot" element={<Chatbot />} />
        </Route>
        
        {/* Standalone news detail page (not nested in Layout) */}
        <Route path="/news/:id" element={<NewsDetailPage />} />
      </Routes>
    </Router>
  );
}

export default App;