import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  BookOpenIcon,
  ArrowLeftIcon,
  HandThumbUpIcon,
  HandThumbDownIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

interface KBArticle {
  _id: string;
  projectId: string;
  title: string;
  content: string;
  category?: string;
  tags?: string[];
  viewCount: number;
  helpfulCount: number;
  notHelpfulCount: number;
  publishedAt?: string;
}

interface ProjectBranding {
  name: string;
  primaryColor: string;
  secondaryColor: string;
  logoUrl: string | null;
}

const KBArticleView: React.FC = () => {
  const { articleId } = useParams<{ articleId: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<KBArticle | null>(null);
  const [project, setProject] = useState<ProjectBranding | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  useEffect(() => {
    fetchArticle();
  }, [articleId]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:3003/api/kb/${articleId}`);
      
      if (response.data.success) {
        setArticle(response.data.data);
        
        // Fetch project branding for styling
        if (response.data.data.projectId) {
          try {
            const projectResponse = await axios.get(
              `http://localhost:3003/api/projects/${response.data.data.projectId}`
            );
            if (projectResponse.data.success) {
              const proj = projectResponse.data.data;
              setProject({
                name: proj.name,
                primaryColor: proj.primaryColor || '#3b82f6',
                secondaryColor: proj.secondaryColor || '#8b5cf6',
                logoUrl: proj.logoUrl || null,
              });
            }
          } catch (projErr) {
            console.error('Error fetching project:', projErr);
          }
        }
      }
    } catch (err: any) {
      console.error('Error fetching article:', err);
      setError(err.response?.data?.message || 'Article not found');
    } finally {
      setLoading(false);
    }
  };

  const handleFeedback = async (isHelpful: boolean) => {
    if (!article || feedbackSubmitted) return;

    try {
      await axios.post(`http://localhost:3003/api/kb/${article._id}/feedback`, {
        isHelpful,
      });
      
      setArticle({
        ...article,
        helpfulCount: article.helpfulCount + (isHelpful ? 1 : 0),
        notHelpfulCount: article.notHelpfulCount + (isHelpful ? 0 : 1),
      });
      
      setFeedbackSubmitted(true);
    } catch (err) {
      console.error('Error submitting feedback:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading article...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <BookOpenIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Article Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The article you are looking for does not exist.'}</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const primaryColor = project?.primaryColor || '#3b82f6';
  const secondaryColor = project?.secondaryColor || '#8b5cf6';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header
        className="shadow-md"
        style={{
          background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
        }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {project?.logoUrl && (
                <img
                  src={project.logoUrl}
                  alt={project.name}
                  className="h-10 w-auto"
                />
              )}
              <div>
                <h1 className="text-xl font-bold text-white">{project?.name || 'Knowledge Base'}</h1>
                <p className="text-white/80 text-sm">Help Article</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          <span>Back</span>
        </button>

        {/* Article Content */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Article Header */}
          <div className="p-8 border-b border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-3">{article.title}</h1>
                
                {article.category && (
                  <span
                    className="inline-block px-3 py-1 text-sm font-medium rounded-full text-white"
                    style={{ backgroundColor: secondaryColor }}
                  >
                    {article.category}
                  </span>
                )}
              </div>
            </div>

            {/* Meta Info */}
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <ClockIcon className="w-4 h-4" />
                <span>
                  {article.publishedAt
                    ? new Date(article.publishedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    : 'Recently published'}
                </span>
              </div>
              <span>👁️ {article.viewCount} views</span>
              <span>👍 {article.helpfulCount}</span>
              <span>👎 {article.notHelpfulCount}</span>
            </div>
          </div>

          {/* Article Body */}
          <div className="p-8">
            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: article.content }}
              style={{
                fontSize: '16px',
                lineHeight: '1.75',
                color: '#374151',
              }}
            />
          </div>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="px-8 pb-6">
              <div className="flex flex-wrap gap-2">
                <span className="text-sm font-medium text-gray-700 mr-2">Tags:</span>
                {article.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Feedback Section */}
          <div className="px-8 pb-8 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Was this article helpful?
            </h3>
            
            {feedbackSubmitted ? (
              <div className="text-green-600 font-medium">
                Thank you for your feedback!
              </div>
            ) : (
              <div className="flex space-x-3">
                <button
                  onClick={() => handleFeedback(true)}
                  className="flex items-center space-x-2 px-6 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors font-medium"
                >
                  <HandThumbUpIcon className="w-5 h-5" />
                  <span>Yes, it was helpful</span>
                </button>
                <button
                  onClick={() => handleFeedback(false)}
                  className="flex items-center space-x-2 px-6 py-3 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors font-medium"
                >
                  <HandThumbDownIcon className="w-5 h-5" />
                  <span>No, it wasn't helpful</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default KBArticleView;
