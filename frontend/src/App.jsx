import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './pages/Layout';
import Translator from './pages/Translator';
import Verification from './pages/Verification';
import Chatbot from './pages/Chatbot';
import NewsDetailPage from './pages/NewsDetails';
import Landingpage from './pages/landingpage';
import Settings from "./pages/Settings";
import Adds from './pages/adds';
import ChatbotAds from './pages/ChatbotAds';
import ChatRoom from './pages/ChatRoom';


export default function App() {
  return (
    <Router>
      <Routes>
        {/* Main layout with nested routes */}
        <Route path="/news-home" element={<Layout />}>
          <Route index element={<Translator />} />
          <Route path="translator" element={<Translator />} />
          <Route path="verification" element={<Verification />} />
          <Route path="chatbot" element={<Chatbot />} />
          <Route path="settings" element={<Settings />} />
          <Route path="adds" element={<Adds />} />
          
        </Route>
        
        {/* Standalone routes */}
        <Route path="/chatroom" element={<ChatRoom />} />
        <Route path="/" element={<Landingpage />} />
        <Route path="/settings" element={<Settings />} /> 
        <Route path="/news/:id" element={<NewsDetailPage />} />

        <Route path="/chatbot-ads" element={<ChatbotAds />} />
      </Routes>
    </Router>
  );
}