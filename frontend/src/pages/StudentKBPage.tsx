import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import DOMPurify from 'dompurify';
import { API_CONFIG } from '../config/constants';
import {
  MagnifyingGlassIcon,
  HandThumbUpIcon,
  HandThumbDownIcon,
  EyeIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';

interface ProjectBranding {
  projectId: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  logoUrl: string | null;
  welcomeText: string;
}

interface KBArticle {
  _id: string;
  title: string;
  content: string;
  category?: string;
  tags?: string[];
  viewCount: number;
  helpfulCount: number;
  notHelpfulCount: number;
}

interface StudentKBPageProps {
  hideHeader?: boolean;
}

const StudentKBPage: React.FC<StudentKBPageProps> = ({ hideHeader = false }) => {
  const { customUrlPath } = useParams<{ customUrlPath: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [branding, setBranding] = useState<ProjectBranding | null>(null);
  const [articles, setArticles] = useState<KBArticle[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<KBArticle | null>(null);
  const [articleVotes, setArticleVotes] = useState<Record<string, 'helpful' | 'not-helpful' | null>>({});

  // Load votes from localStorage on mount
  useEffect(() => {
    const savedVotes = localStorage.getItem('kb_article_votes');
    if (savedVotes) {
      try {
        setArticleVotes(JSON.parse(savedVotes));
      } catch (error) {
        console.error('Error loading votes:', error);
      }
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [customUrlPath]);

  const fetchData = async () => {
    try {
      // Fetch branding
      const brandingRes = await axios.get(
        `${API_CONFIG.API_URL}/projects/branding/${customUrlPath}`
      );
      const brandingData = brandingRes.data.success ? brandingRes.data.data : brandingRes.data;
      setBranding(brandingData);

      // Fetch KB articles
      const articlesRes = await axios.get(
        `${API_CONFIG.API_URL}/kb/project/${brandingData.projectId}`
      );
      setArticles(articlesRes.data.data || []);

      // Fetch categories
      const categoriesRes = await axios.get(
        `${API_CONFIG.API_URL}/kb/project/${brandingData.projectId}/categories`
      );
      setCategories(categoriesRes.data.data || []);
    } catch (error) {
      console.error('Error fetching KB data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleArticleClick = async (article: KBArticle) => {
    setSelectedArticle(article);
    
    // Increment view count
    try {
      await axios.post(`${API_CONFIG.API_URL}/kb/${article._id}/view`);
      
      // Update local state
      setArticles((prev) =>
        prev.map((a) =>
          a._id === article._id ? { ...a, viewCount: a.viewCount + 1 } : a
        )
      );
    } catch (error) {
      console.error('Error incrementing view count:', error);
    }
  };

  const handleFeedback = async (articleId: string, helpful: boolean) => {
    try {
      await axios.post(`${API_CONFIG.API_URL}/kb/${articleId}/feedback`, { helpful });

      // Update local state
      setArticles((prev) =>
        prev.map((article) =>
          article._id === articleId
            ? {
                ...article,
                helpfulCount: helpful ? article.helpfulCount + 1 : article.helpfulCount,
                notHelpfulCount: !helpful ? article.notHelpfulCount + 1 : article.notHelpfulCount,
              }
            : article
        )
      );

      // Update selected article
      if (selectedArticle && selectedArticle._id === articleId) {
        setSelectedArticle((prev) =>
          prev
            ? {
                ...prev,
                helpfulCount: helpful ? prev.helpfulCount + 1 : prev.helpfulCount,
                notHelpfulCount: !helpful ? prev.notHelpfulCount + 1 : prev.notHelpfulCount,
              }
            : null
        );
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  const getFilteredArticles = () => {
    let filtered = articles;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((article) => article.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(query) ||
          article.content.toLowerCase().includes(query) ||
          article.category?.toLowerCase().includes(query) ||
          article.tags?.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    return filtered;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div
          className="animate-spin rounded-full h-12 w-12 border-b-2"
          style={{ borderColor: branding?.primaryColor || '#2563EB' }}
        ></div>
      </div>
    );
  }

  const primaryColor = branding?.primaryColor || '#2563EB';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header (only shown if not hideHeader) */}
      {!hideHeader && (
        <div
          className="shadow-md"
          style={{
            background: `linear-gradient(135deg, ${primaryColor} 0%, ${branding?.secondaryColor || '#764ba2'} 100%)`,
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate(`/${customUrlPath}/submit-ticket`)}
                  className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
                >
                  <ArrowLeftIcon className="h-6 w-6" />
                </button>
                {branding?.logoUrl && (
                  <img src={branding.logoUrl} alt="Logo" className="h-12 w-auto" />
                )}
                <div>
                  <h1 className="text-2xl font-bold text-white">Knowledge Base</h1>
                  <p className="text-white/80 text-sm">{branding?.name}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${hideHeader ? 'py-0' : 'py-8'}`}>
        {/* Title for authenticated view */}
        {hideHeader && (
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Knowledge Base</h1>
            <p className="text-gray-600">Browse articles and find answers to common questions</p>
          </div>
        )}

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                style={{ ['--tw-ring-color' as any]: primaryColor }}
              />
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                style={{ ['--tw-ring-color' as any]: primaryColor }}
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Articles Grid or Detail View */}
        {!selectedArticle ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getFilteredArticles().length === 0 ? (
              <div className="col-span-full bg-white rounded-xl shadow-sm p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <p className="text-gray-500">
                  {searchQuery || selectedCategory !== 'all'
                    ? 'No articles found matching your search.'
                    : 'No articles available yet.'}
                </p>
              </div>
            ) : (
              getFilteredArticles().map((article) => (
                <div
                  key={article._id}
                  onClick={() => handleArticleClick(article)}
                  className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer hover:-translate-y-1 p-6 border border-gray-100"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
                    {article.title}
                  </h3>

                  {article.category && (
                    <span
                      className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-3"
                      style={{
                        backgroundColor: `${primaryColor}20`,
                        color: primaryColor,
                      }}
                    >
                      {article.category}
                    </span>
                  )}

                  <div className="flex items-center space-x-4 text-sm text-gray-600 mt-4">
                    <span className="flex items-center space-x-1">
                      <EyeIcon className="h-4 w-4" />
                      <span>{article.viewCount}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <HandThumbUpIcon className="h-4 w-4" />
                      <span>{article.helpfulCount}</span>
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          // Article Detail View
          <div>
            <button
              onClick={() => setSelectedArticle(null)}
              className="mb-6 flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              <span>Back to Articles</span>
            </button>

            <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{selectedArticle.title}</h1>

              {selectedArticle.category && (
                <span
                  className="inline-block px-4 py-2 rounded-full text-sm font-medium mb-6"
                  style={{
                    backgroundColor: `${primaryColor}20`,
                    color: primaryColor,
                  }}
                >
                  {selectedArticle.category}
                </span>
              )}

              <div className="flex items-center space-x-6 text-sm text-gray-600 mb-6 pb-6 border-b border-gray-200">
                <span className="flex items-center space-x-2">
                  <EyeIcon className="h-5 w-5" />
                  <span>{selectedArticle.viewCount} views</span>
                </span>
                <span className="flex items-center space-x-2">
                  <HandThumbUpIcon className="h-5 w-5" />
                  <span>{selectedArticle.helpfulCount} helpful</span>
                </span>
              </div>

              <div
                className="prose max-w-none mb-8"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(selectedArticle.content) }}
              />

              {/* Feedback Section */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <p className="text-lg font-semibold text-gray-900 mb-4">Was this article helpful?</p>
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleFeedback(selectedArticle._id, true)}
                    className="flex items-center space-x-2 px-6 py-3 border-2 rounded-lg font-medium transition-all duration-200"
                    style={{
                      borderColor: primaryColor,
                      color: primaryColor,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = primaryColor;
                      e.currentTarget.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = primaryColor;
                    }}
                  >
                    <HandThumbUpIcon className="h-5 w-5" />
                    <span>Yes</span>
                  </button>
                  <button
                    onClick={() => handleFeedback(selectedArticle._id, false)}
                    className="flex items-center space-x-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-all duration-200"
                  >
                    <HandThumbDownIcon className="h-5 w-5" />
                    <span>No</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentKBPage;
