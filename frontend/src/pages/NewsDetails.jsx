// import { useParams, useNavigate } from 'react-router-dom';
// import { ArrowLeft, ExternalLink, Check, Shield, Filter } from 'lucide-react';
// import Header from '../components/Header';
// import Footer from '../components/Footer';
// import { useEffect, useState } from 'react';
// import newsData from '../data/news.json';

// export default function NewsDetailPage() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [newsItem, setNewsItem] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [relatedNews, setRelatedNews] = useState([]);
//   const [filterAuthor, setFilterAuthor] = useState(false);

//   useEffect(() => {
//     try {
//       console.log('Searching for news item with ID:', id);
      
//       // Access the Sheet1 array from the newsData
//       const newsItems = newsData.Sheet1 || [];
//       console.log('News data:', newsItems);

//       // Find the specific news item by ID
//       const foundItem = newsItems.find(item => 
//         item.id === id || 
//         item.id?.toString() === id
//       );

//       if (!foundItem) {
//         throw new Error(`News article with ID ${id} not found`);
//       }

//       // Transform data to consistent format
//       const transformedItem = {
//         id: foundItem.id || id,
//         title: foundItem.title || 'Untitled Article',
//         description: foundItem.content ? foundItem.content.substring(0, 200) + '...' : 'No description available',
//         fullContent: foundItem.content || 'No content available',
//         author: foundItem.author || 'Unknown Author',
//         timestamp: formatDate(foundItem.published_date),
//         isVerified: true,
//         category: 'General',
//         image: `https://picsum.photos/800/400?random=${id}`,
//         link: foundItem.url || '#',
//         keywords: [],
//         source: {
//           name: foundItem.source || 'Unknown Source',
//           url: foundItem.url || '#',
//           icon: null
//         }
//       };

//       console.log('Transformed item:', transformedItem);
//       setNewsItem(transformedItem);

//       // Find related news (same category or same author)
//       const related = newsItems
//         .filter(item => item.id !== id) // Exclude current article
//         .filter(item => 
//           filterAuthor 
//             ? item.author === foundItem.author 
//             : item.category === transformedItem.category || item.author === foundItem.author
//         )
//         .slice(0, 5) // Limit to 5 related articles
//         .map(item => ({
//           id: item.id,
//           title: item.title,
//           author: item.author,
//           timestamp: formatDate(item.published_date),
//           link: item.url
//         }));

//       setRelatedNews(related);
//       setLoading(false);
//     } catch (err) {
//       console.error('Error loading news article:', err);
//       setError(err.message);
//       setLoading(false);
//     }
//   }, [id, filterAuthor]);

//   function formatDate(dateNumber) {
//     if (!dateNumber) return 'Date not available';
    
//     try {
//       // Convert Excel date number to JavaScript Date
//       const date = new Date((dateNumber - 25569) * 86400 * 1000);
//       if (isNaN(date.getTime())) return 'Invalid date';
      
//       const now = new Date();
//       const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
      
//       if (diffInHours < 1) {
//         return 'Less than an hour ago';
//       } else if (diffInHours < 24) {
//         return `${diffInHours} hours ago`;
//       } else {
//         return date.toLocaleDateString('en-US', { 
//           month: 'short', 
//           day: 'numeric', 
//           year: 'numeric' 
//         });
//       }
//     } catch {
//       return 'Date not available';
//     }
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-800">
//         <div className="text-xl animate-pulse">Loading news article...</div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-800 p-4">
//         <div className="text-xl text-red-600 mb-4">{error}</div>
//         <button 
//           onClick={() => navigate('/')}
//           className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//         >
//           Return to Homepage
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col">
//       <Header />
      
//       <main className="flex-grow container mx-auto px-4 py-8">
//         <button 
//           onClick={() => navigate(-1)}
//           className="flex items-center mb-6 text-blue-600 hover:text-blue-800 transition-colors"
//           aria-label="Go back to previous page"
//         >
//           <ArrowLeft className="mr-2" size={20} />
//           Back to News
//         </button>
        
//         <div className="flex flex-col lg:flex-row gap-8">
//           {/* Main Article (70% width) */}
//           <div className="lg:w-7/12">
//             {newsItem && (
//               <article className="bg-white rounded-xl shadow-md overflow-hidden">
//                 {/* Article Image */}
//                 <div className="relative h-64 md:h-96 w-full">
//                   <img 
//                     src={newsItem.image} 
//                     alt={newsItem.title} 
//                     className="w-full h-full object-cover"
//                     onError={(e) => {
//                       e.target.src = `https://picsum.photos/800/400?random=${newsItem.id}`;
//                     }}
//                   />
                  
//                   {/* Badges */}
//                   <div className="absolute top-4 right-4 flex flex-wrap gap-2 justify-end">
//                     <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-white text-gray-800 flex items-center shadow-sm">
//                       {newsItem.category}
//                     </span>
//                     {newsItem.isVerified ? (
//                       <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-green-100 text-green-800 flex items-center gap-1 shadow-sm">
//                         <Check size={12} />
//                         Verified
//                       </span>
//                     ) : (
//                       <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-yellow-100 text-yellow-800 flex items-center gap-1 shadow-sm">
//                         <Shield size={12} />
//                         Unverified
//                       </span>
//                     )}
//                   </div>
//                 </div>
                
//                 {/* Article Content */}
//                 <div className="p-6 md:p-8">
//                   <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4 gap-4">
//                     <div>
//                       <h1 className="text-2xl md:text-3xl font-bold mb-2">{newsItem.title}</h1>
//                       <div className="text-sm text-gray-500">
//                         <span className="font-medium">{newsItem.author}</span> • {newsItem.timestamp}
//                       </div>
//                     </div>
//                     <a 
//                       href={newsItem.link} 
//                       target="_blank" 
//                       rel="noopener noreferrer"
//                       className="flex items-center justify-center md:justify-start px-4 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors whitespace-nowrap"
//                       title="View original article"
//                     >
//                       <ExternalLink size={16} className="mr-2" />
//                       Original Source
//                     </a>
//                   </div>
                  
//                   {/* Article Body */}
//                   <div className="prose max-w-none">
//                     {newsItem.description && (
//                       <p className="text-lg text-gray-700 mb-4">{newsItem.description}</p>
//                     )}
//                     <div className="text-gray-700 whitespace-pre-line">
//                       {newsItem.fullContent}
//                     </div>
//                   </div>
                  
//                   {/* Source Information */}
//                   <div className="mt-8 pt-6 border-t border-gray-200">
//                     <h3 className="text-sm font-medium text-gray-500 mb-2">Source Information</h3>
//                     <div className="text-sm text-gray-700 space-y-1">
//                       {newsItem.source.name && (
//                         <p>Source: {newsItem.source.name}</p>
//                       )}
//                       {newsItem.source.url && (
//                         <p>
//                           URL:{' '}
//                           <a 
//                             href={newsItem.source.url} 
//                             target="_blank" 
//                             rel="noopener noreferrer" 
//                             className="text-blue-600 hover:underline break-all"
//                           >
//                             {newsItem.source.url}
//                           </a>
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </article>
//             )}
//           </div>

//           {/* Related News (30% width) */}
//           <div className="lg:w-5/12">
//             <div className="bg-white rounded-xl shadow-md p-6 sticky top-4">
//               <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-xl font-bold">Related News</h2>
//                 <button 
//                   onClick={() => setFilterAuthor(!filterAuthor)}
//                   className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm ${
//                     filterAuthor 
//                       ? 'bg-blue-100 text-blue-800' 
//                       : 'bg-gray-100 text-gray-800'
//                   }`}
//                 >
//                   <Filter size={16} />
//                   {filterAuthor ? 'Same Author' : 'Same Category'}
//                 </button>
//               </div>

//               {relatedNews.length > 0 ? (
//                 <ul className="space-y-4">
//                   {relatedNews.map(item => (
//                     <li key={item.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
//                       <a 
//                         href={`/news/${item.id}`} 
//                         className="block hover:bg-gray-50 p-2 rounded-lg transition-colors"
//                       >
//                         <h3 className="font-medium text-gray-800 line-clamp-2">{item.title}</h3>
//                         <div className="text-xs text-gray-500 mt-1">
//                           <span>{item.author}</span> • <span>{item.timestamp}</span>
//                         </div>
//                       </a>
//                     </li>
//                   ))}
//                 </ul>
//               ) : (
//                 <p className="text-gray-500">No related news found</p>
//               )}
//             </div>
//           </div>
//         </div>
//       </main>
      
//       <Footer />
//     </div>
//   );
// }

import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Check, Shield, User } from 'lucide-react';
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
  const [byAuthorNews, setByAuthorNews] = useState([]);

  // Fetch news item and related news
  useEffect(() => {
    try {
      console.log('Searching for news item with ID:', id);
      
      // Access the Sheet1 array from the newsData
      const newsItems = newsData.Sheet1 || [];
      console.log('News data:', newsItems);

      // Find the specific news item by ID
      const foundItem = newsItems.find(item => 
        item.id === id || 
        item.id?.toString() === id
      );

      if (!foundItem) {
        throw new Error(`News article with ID ${id} not found`);
      }

      // Transform data to consistent format
      const transformedItem = {
        id: foundItem.id || id,
        title: foundItem.title || 'Untitled Article',
        description: foundItem.content ? foundItem.content.substring(0, 200) + '...' : 'No description available',
        fullContent: foundItem.content || 'No content available',
        author: foundItem.author || 'Unknown Author',
        timestamp: formatDate(foundItem.published_date),
        isVerified: true,
        category: foundItem.category || 'General',
        image: `https://picsum.photos/800/400?random=${id}`,
        link: foundItem.url || '#',
        keywords: [],
        source: {
          name: foundItem.source || 'Unknown Source',
          url: foundItem.url || '#',
          icon: null
        }
      };

      console.log('Transformed item:', transformedItem);
      setNewsItem(transformedItem);

      // Find news by the same author
      const sameAuthorNews = newsItems
        .filter(item => item.id !== id) // Exclude current article
        .filter(item => item.author === foundItem.author)
        .slice(0, 5) // Limit to 5 articles
        .map(item => ({
          id: item.id,
          title: item.title,
          author: item.author,
          category: item.category || 'General',
          timestamp: formatDate(item.published_date),
          link: item.url
        }));

      setByAuthorNews(sameAuthorNews);

      // Find related news (same category, not by the same author)
      const related = newsItems
        .filter(item => item.id !== id) // Exclude current article
        .filter(item => 
          item.category === transformedItem.category && 
          item.author !== foundItem.author
        )
        .slice(0, 5) // Limit to 5 related articles
        .map(item => ({
          id: item.id,
          title: item.title,
          author: item.author,
          category: item.category || 'General',
          timestamp: formatDate(item.published_date),
          link: item.url
        }));

      setRelatedNews(related);
      setLoading(false);
    } catch (err) {
      console.error('Error loading news article:', err);
      setError(err.message);
      setLoading(false);
    }
  }, [id]);

  function formatDate(dateNumber) {
    if (!dateNumber) return 'Date not available';
    
    try {
      // Convert Excel date number to JavaScript Date
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

          {/* Sidebar (30% width) with Author's News and Related News */}
          <div className="lg:w-5/12">
            {/* Author's Other Articles */}
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-4 mb-6">
              <div className="flex items-center mb-4">
                <User size={20} className="text-blue-600 mr-2" />
                <h2 className="text-xl font-bold">More from {newsItem?.author}</h2>
              </div>

              {byAuthorNews.length > 0 ? (
                <ul className="space-y-4">
                  {byAuthorNews.map(item => (
                    <li key={item.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                      <a 
                        href={`/news/${item.id}`} 
                        className="block hover:bg-gray-50 p-2 rounded-lg transition-colors"
                      >
                        <h3 className="font-medium text-gray-800 line-clamp-2">{item.title}</h3>
                        <div className="text-xs text-gray-500 mt-1 flex items-center justify-between">
                          <span className="bg-gray-100 px-2 py-0.5 rounded-full">{item.category}</span>
                          <span>{item.timestamp}</span>
                        </div>
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No other articles by this author</p>
                </div>
              )}
            </div>

            {/* Related News by Category */}
            {relatedNews.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-6 sticky top-4">
                <h2 className="text-xl font-bold mb-4">Related in {newsItem?.category}</h2>

                <ul className="space-y-4">
                  {relatedNews.map(item => (
                    <li key={item.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                      <a 
                        href={`/news/${item.id}`} 
                        className="block hover:bg-gray-50 p-2 rounded-lg transition-colors"
                      >
                        <h3 className="font-medium text-gray-800 line-clamp-2">{item.title}</h3>
                        <div className="text-xs text-gray-500 mt-1 flex items-center justify-between">
                          <span>{item.author}</span>
                          <span>{item.timestamp}</span>
                        </div>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}