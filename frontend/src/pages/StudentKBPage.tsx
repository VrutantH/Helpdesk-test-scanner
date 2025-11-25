import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  BookOpenIcon,
  MagnifyingGlassIcon,
  ArrowLeftIcon,
  HandThumbUpIcon,
  HandThumbDownIcon,
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
  const [expandedArticles, setExpandedArticles] = useState<Set<string>>(new Set());
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

  // Handle browser back button
  useEffect(() => {
    const handlePopState = () => {
      navigate(`/${customUrlPath}/submit-ticket`, { replace: true });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [customUrlPath, navigate]);

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

  const handleFeedback = async (articleId: string, helpful: boolean) => {
    try {
      const currentVote = articleVotes[articleId];
      const newVoteType: 'helpful' | 'not-helpful' = helpful ? 'helpful' : 'not-helpful';

      // If clicking the same vote, remove it (toggle off)
      if (currentVote === newVoteType) {
        // User is removing their vote
        const updatedVotes: Record<string, 'helpful' | 'not-helpful' | null> = { ...articleVotes };
        delete updatedVotes[articleId];
        setArticleVotes(updatedVotes);
        localStorage.setItem('kb_article_votes', JSON.stringify(updatedVotes));

        // Update counts (decrement the vote)
        setArticles((prev) =>
          prev.map((article) =>
            article._id === articleId
              ? {
                  ...article,
                  helpfulCount: helpful ? Math.max(0, article.helpfulCount - 1) : article.helpfulCount,
                  notHelpfulCount: !helpful ? Math.max(0, article.notHelpfulCount - 1) : article.notHelpfulCount,
                }
              : article
          )
        );
        return;
      }

      // If user already voted differently, prevent changing vote
      if (currentVote && currentVote !== newVoteType) {
        alert('You have already voted on this article. You can only remove your vote by clicking the same button again.');
        return;
      }

      // Submit new vote
      await axios.post(`${API_CONFIG.API_URL}/kb/${articleId}/feedback`, {
        helpful,
      });

      // Save vote to localStorage
      const updatedVotes: Record<string, 'helpful' | 'not-helpful' | null> = { ...articleVotes, [articleId]: newVoteType };
      setArticleVotes(updatedVotes);
      localStorage.setItem('kb_article_votes', JSON.stringify(updatedVotes));

      // Update counts
      setArticles((prev) =>
        prev.map((article) =>
          article._id === articleId
            ? {
                ...article,
                helpfulCount: helpful
                  ? article.helpfulCount + 1
                  : article.helpfulCount,
                notHelpfulCount: !helpful
                  ? article.notHelpfulCount + 1
                  : article.notHelpfulCount,
              }
            : article
        )
      );
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  const toggleArticle = (articleId: string) => {
    setExpandedArticles((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(articleId)) {
        newSet.delete(articleId);
      } else {
        newSet.add(articleId);
      }
      return newSet;
    });
  };

  const getFilteredArticles = () => {
    let filtered = articles;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(
        (article) => article.category === selectedCategory
      );
    }

    // Filter by search query
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const primaryColor = branding?.primaryColor || '#2563EB';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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
                  <img
                    src={branding.logoUrl}
                    alt="Logo"
                    className="h-12 w-auto"
                  />
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
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

        {/* Articles */}
        <div className="space-y-4">
          {getFilteredArticles().length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <BookOpenIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
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
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Article Header */}
                <button
                  onClick={() => toggleArticle(article._id)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {article.title}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      {article.category && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                          {article.category}
                        </span>
                      )}
                      <span>{article.viewCount} views</span>
                    </div>
                  </div>
                  <div className="text-gray-400">
                    {expandedArticles.has(article._id) ? '−' : '+'}
                  </div>
                </button>

                {/* Article Content (Expanded) */}
                {expandedArticles.has(article._id) && (
                  <div className="px-6 pb-6 border-t border-gray-100">
                    <div
                      className="kb-content mt-4"
                      dangerouslySetInnerHTML={{ __html: article.content }}
                    />

                    {/* Feedback */}
                    <div className="mt-6 pt-4 border-t border-gray-200 flex items-center justify-between">
                      <p className="text-sm text-gray-600">Was this helpful?</p>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleFeedback(article._id, true)}
                          className={`flex items-center space-x-1 px-3 py-1 text-sm rounded-lg transition-colors ${
                            articleVotes[article._id] === 'helpful'
                              ? 'bg-green-100 text-green-700 font-semibold'
                              : 'text-green-600 hover:bg-green-50'
                          }`}
                          title={articleVotes[article._id] === 'helpful' ? 'Click to remove your vote' : 'Mark as helpful'}
                        >
                          <HandThumbUpIcon className="h-4 w-4" />
                          <span>Yes ({article.helpfulCount})</span>
                        </button>
                        <button
                          onClick={() => handleFeedback(article._id, false)}
                          className={`flex items-center space-x-1 px-3 py-1 text-sm rounded-lg transition-colors ${
                            articleVotes[article._id] === 'not-helpful'
                              ? 'bg-red-100 text-red-700 font-semibold'
                              : 'text-red-600 hover:bg-red-50'
                          }`}
                          title={articleVotes[article._id] === 'not-helpful' ? 'Click to remove your vote' : 'Mark as not helpful'}
                        >
                          <HandThumbDownIcon className="h-4 w-4" />
                          <span>No ({article.notHelpfulCount})</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentKBPage;
