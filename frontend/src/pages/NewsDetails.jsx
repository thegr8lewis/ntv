import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Check, Shield, Filter } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useEffect, useState } from 'react';
import newsData from '../data/news.json';

export default function NewsDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [newsItem, setNewsItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedNews, setRelatedNews] = useState([]);
  const [filterType, setFilterType] = useState('category'); // 'category' or 'author'

  useEffect(() => {
    const fetchNewsData = async () => {
      try {
        setLoading(true);
        
        // Access the news data
        const allNewsItems = newsData.Sheet1 || [];
        
        // Find the current news item
        const currentItem = allNewsItems.find(item => 
          item.id === id || 
          item.id?.toString() === id
        );

        if (!currentItem) {
          throw new Error(`News article with ID ${id} not found`);
        }

        // Transform the current item
        const transformedItem = {
          id: currentItem.id || id,
          title: currentItem.title || 'Untitled Article',
          description: currentItem.content ? 
            currentItem.content.substring(0, 200) + '...' : 
            'No description available',
          fullContent: currentItem.content || 'No content available',
          author: currentItem.author || 'Unknown Author',
          timestamp: formatDate(currentItem.published_date),
          isVerified: true,
          category: currentItem.category || 'General',
          image: `https://picsum.photos/800/400?random=${id}`,
          link: currentItem.url || '#',
          keywords: [],
          source: {
            name: currentItem.source || 'Unknown Source',
            url: currentItem.url || '#',
            icon: null
          }
        };

        setNewsItem(transformedItem);

        // Get related news
        const related = allNewsItems
          .filter(item => item.id !== id) // Exclude current item
          .filter(item => {
            if (filterType === 'author') {
              return item.author === transformedItem.author;
            } else {
              return (item.category || 'General') === transformedItem.category;
            }
          })
          .slice(0, 5) // Limit to 5 items
          .map(item => ({
            id: item.id,
            title: item.title,
            author: item.author,
            timestamp: formatDate(item.published_date),
            link: item.url
          }));

        setRelatedNews(related);
        setLoading(false);
      } catch (err) {
        console.error('Error loading news:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchNewsData();
  }, [id, filterType]);

  const toggleFilterType = () => {
    setFilterType(prev => prev === 'category' ? 'author' : 'category');
  };

  function formatDate(dateNumber) {
    if (!dateNumber) return 'Date not available';
    
    try {
      const date = new Date((dateNumber - 25569) * 86400 * 1000);
      if (isNaN(date.getTime())) return 'Invalid date';
      
      const now = new Date();
      const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
      
      if (diffInHours < 1) {
        return 'Less than an hour ago';
      } else if (diffInHours < 24) {
        return `${diffInHours} hours ago`;
      } else {
        return date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric' 
        });
      }
    } catch {
      return 'Date not available';
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-800">
        <div className="text-xl animate-pulse">Loading news article...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-800 p-4">
        <div className="text-xl text-red-600 mb-4">{error}</div>
        <button 
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Return to Homepage
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center mb-6 text-blue-600 hover:text-blue-800 transition-colors"
          aria-label="Go back to previous page"
        >
          <ArrowLeft className="mr-2" size={20} />
          Back to News
        </button>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Article (70% width) */}
          <div className="lg:w-7/12">
            {newsItem && (
              <article className="bg-white rounded-xl shadow-md overflow-hidden">
                {/* Article Image */}
                <div className="relative h-64 md:h-96 w-full">
                  <img 
                    src={newsItem.image} 
                    alt={newsItem.title} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = `https://picsum.photos/800/400?random=${newsItem.id}`;
                    }}
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-4 right-4 flex flex-wrap gap-2 justify-end">
                    <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-white text-gray-800 flex items-center shadow-sm">
                      {newsItem.category}
                    </span>
                    {newsItem.isVerified ? (
                      <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-green-100 text-green-800 flex items-center gap-1 shadow-sm">
                        <Check size={12} />
                        Verified
                      </span>
                    ) : (
                      <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-yellow-100 text-yellow-800 flex items-center gap-1 shadow-sm">
                        <Shield size={12} />
                        Unverified
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Article Content */}
                <div className="p-6 md:p-8">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4 gap-4">
                    <div>
                      <h1 className="text-2xl md:text-3xl font-bold mb-2">{newsItem.title}</h1>
                      <div className="text-sm text-gray-500">
                        <span className="font-medium">{newsItem.author}</span> • {newsItem.timestamp}
                      </div>
                    </div>
                    <a 
                      href={newsItem.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center md:justify-start px-4 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors whitespace-nowrap"
                      title="View original article"
                    >
                      <ExternalLink size={16} className="mr-2" />
                      Original Source
                    </a>
                  </div>
                  
                  {/* Article Body */}
                  <div className="prose max-w-none">
                    {newsItem.description && (
                      <p className="text-lg text-gray-700 mb-4">{newsItem.description}</p>
                    )}
                    <div className="text-gray-700 whitespace-pre-line">
                      {newsItem.fullContent}
                    </div>
                  </div>
                  
                  {/* Source Information */}
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Source Information</h3>
                    <div className="text-sm text-gray-700 space-y-1">
                      {newsItem.source.name && (
                        <p>Source: {newsItem.source.name}</p>
                      )}
                      {newsItem.source.url && (
                        <p>
                          URL:{' '}
                          <a 
                            href={newsItem.source.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-blue-600 hover:underline break-all"
                          >
                            {newsItem.source.url}
                          </a>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            )}
          </div>

          {/* Related News (30% width) */}
          <div className="lg:w-5/12">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Related News</h2>
                <button 
                  onClick={toggleFilterType}
                  className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm ${
                    filterType === 'author' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <Filter size={16} />
                  {filterType === 'author' ? 'Same Author' : 'Same Category'}
                </button>
              </div>

              {relatedNews.length > 0 ? (
                <ul className="space-y-4">
                  {relatedNews.map(item => (
                    <li key={item.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                      <a 
                        href={`/news/${item.id}`} 
                        className="block hover:bg-gray-50 p-2 rounded-lg transition-colors"
                      >
                        <h3 className="font-medium text-gray-800 line-clamp-2">{item.title}</h3>
                        <div className="text-xs text-gray-500 mt-1">
                          <span>{item.author}</span> • <span>{item.timestamp}</span>
                        </div>
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">
                  No {filterType === 'author' ? 'articles by this author' : 'articles in this category'} found
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}