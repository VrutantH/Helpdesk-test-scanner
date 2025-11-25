import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
  DocumentArrowUpIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  BookOpenIcon,
} from '@heroicons/react/24/outline';
import { StudentLoginModal } from '../components/StudentLoginModal';

interface ProjectBranding {
  projectId: string;
  name: string;
  customUrlPath: string;
  primaryColor: string;
  secondaryColor: string;
  logoUrl: string | null;
  welcomeText: string;
  footerText: string;
  knowledgeBase?: boolean;
  branding?: {
    colorTheme?: {
      primary: string;
      secondary: string;
      accent?: string;
      background?: string;
    };
    logo?: string;
    headerText?: string;
  };
}

interface OnlineFormField {
  fieldName: string;
  fieldType: 'text' | 'number' | 'date' | 'email' | 'phone' | 'url' | 'textarea' | 'dropdown' | 'multiselect' | 'radio' | 'checkbox' | 'file';
  required: boolean;
  placeholder: string;
  options?: string[];
  // file-specific
  allowedFileTypes?: string[];
  maxFileSizeMB?: number;
  allowMultiple?: boolean;
}

interface OfflineCenter {
  _id?: string;
  centerName: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  email: string;
  workingHours: string;
  latitude?: number;
  longitude?: number;
  features?: string[];
  mapLink?: string;
  googleMapLink?: string;
}

interface TicketSubmissionSettings {
  mode: 'online' | 'offline' | 'both';
  enableOnlineForm: boolean;
  enableOfflineCenter: boolean;
  onlineFormFields: OnlineFormField[];
  offlineCenters: OfflineCenter[];
  welcomeMessage?: string;
  successMessage?: string;
  announcement?: string;
}

interface StudentPortalProps {
  hideHeader?: boolean;
}

const StudentPortal: React.FC<StudentPortalProps> = ({ hideHeader = false }) => {
  const { customUrlPath } = useParams<{ customUrlPath: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [projectBranding, setProjectBranding] = useState<ProjectBranding | null>(null);
  const [ticketSettings, setTicketSettings] = useState<TicketSubmissionSettings | null>(null);
  const [activeTab, setActiveTab] = useState<'online' | 'offline'>('online');
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [fieldFiles, setFieldFiles] = useState<Record<string, File[]>>({}); // per-field file storage
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'state' | 'city' | 'pincode'>('all');
  const [filteredCenters, setFilteredCenters] = useState<OfflineCenter[]>([]);
  const [uniqueStates, setUniqueStates] = useState<string[]>([]);
  const [uniqueCities, setUniqueCities] = useState<string[]>([]);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch project branding
        const brandingResponse = await axios.get(
          `http://localhost:3003/api/projects/branding/${customUrlPath}`
        );
        
        // Extract branding data from response
        const brandingData = brandingResponse.data.success 
          ? brandingResponse.data.data 
          : brandingResponse.data;
        
        // Parse colorTheme if it's a string
        let colorTheme = brandingData.branding?.colorTheme;
        if (typeof colorTheme === 'string') {
          // Parse string like "@{primary=#49bc8f; secondary=#64748b; accent=#3b82f6; background=#ffffff}"
          const parsed: any = {};
          const matches = colorTheme.match(/(\w+)=#([a-zA-Z0-9]+)/g);
          if (matches) {
            matches.forEach((match: string) => {
              const [key, value] = match.split('=');
              parsed[key] = '#' + value;
            });
            colorTheme = parsed;
          }
        }
        
        // Map the branding colors from nested structure
        const branding: ProjectBranding = {
          projectId: brandingData.projectId,
          name: brandingData.name,
          customUrlPath: brandingData.customUrlPath,
          logoUrl: brandingData.branding?.logo || null,
          welcomeText: brandingData.branding?.headerText || 'Welcome!',
          footerText: brandingData.branding?.footerText || '© 2025. All rights reserved.',
          knowledgeBase: brandingData.knowledgeBase,
          primaryColor: colorTheme?.primary || '#49bc8f',
          secondaryColor: colorTheme?.secondary || '#64748b',
          branding: { ...brandingData.branding, colorTheme },
        };
        
        setProjectBranding(branding);

        // Fetch ticket submission settings
        const settingsResponse = await axios.get(
          `http://localhost:3003/api/projects/${branding.projectId}/ticket-settings`
        );
        const ticketSettings = settingsResponse.data.success 
          ? settingsResponse.data.data 
          : settingsResponse.data;
        setTicketSettings(ticketSettings);

        // Set default tab based on mode
        if (ticketSettings.mode === 'online') {
          setActiveTab('online');
        } else if (ticketSettings.mode === 'offline') {
          setActiveTab('offline');
        }

        // Initialize filtered centers
        setFilteredCenters(ticketSettings.offlineCenters || []);

        // Extract unique states and cities for filters
        if (ticketSettings.offlineCenters) {
          const states = [...new Set(ticketSettings.offlineCenters.map((c: OfflineCenter) => c.state))] as string[];
          const cities = [...new Set(ticketSettings.offlineCenters.map((c: OfflineCenter) => c.city))] as string[];
          setUniqueStates(states.sort());
          setUniqueCities(cities.sort());
        }
      } catch (err: any) {
        console.error('Error fetching project data:', err);
        setError(err.response?.data?.message || 'Project not found');
      } finally {
        setLoading(false);
      }
    };

    if (customUrlPath) {
      fetchProjectData();
    }
  }, [customUrlPath]);

  useEffect(() => {
    // Filter centers based on search query and filter type
    if (ticketSettings?.offlineCenters) {
      let filtered = ticketSettings.offlineCenters;

      // Apply search query filter
      if (searchQuery.trim()) {
        const searchLower = searchQuery.toLowerCase();
        filtered = filtered.filter((center) => {
          if (filterType === 'state') {
            return center.state.toLowerCase().includes(searchLower);
          } else if (filterType === 'city') {
            return center.city.toLowerCase().includes(searchLower);
          } else if (filterType === 'pincode') {
            return center.pincode.includes(searchQuery);
          } else {
            // 'all' - search across all fields
            return (
              center.centerName.toLowerCase().includes(searchLower) ||
              center.city.toLowerCase().includes(searchLower) ||
              center.state.toLowerCase().includes(searchLower) ||
              center.pincode.includes(searchQuery)
            );
          }
        });
      }

      setFilteredCenters(filtered);
    }
  }, [searchQuery, filterType, ticketSettings]);

  const handleInputChange = (fieldName: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handleFieldFileChange = (fieldName: string, files: FileList | null, field: OnlineFormField) => {
    if (!files || files.length === 0) return;

    const filesArray = Array.from(files);
    const maxSize = (field.maxFileSizeMB || 10) * 1024 * 1024;
    const allowedTypes = field.allowedFileTypes || [];

    // Validate file size
    const oversizedFiles = filesArray.filter((file) => file.size > maxSize);
    if (oversizedFiles.length > 0) {
      setSubmitError(
        `Some files for "${fieldName}" exceed the maximum size of ${field.maxFileSizeMB || 10} MB`
      );
      return;
    }

    // Validate file types
    if (allowedTypes.length > 0) {
      const invalidFiles = filesArray.filter((file) => {
        const fileExt = '.' + file.name.split('.').pop()?.toLowerCase();
        return !allowedTypes.includes(fileExt);
      });
      if (invalidFiles.length > 0) {
        setSubmitError(
          `Invalid file type for "${fieldName}". Allowed: ${allowedTypes.join(', ')}`
        );
        return;
      }
    }

    // Store files keyed by field name
    if (field.allowMultiple) {
      setFieldFiles((prev) => ({ ...prev, [fieldName]: [...(prev[fieldName] || []), ...filesArray] }));
    } else {
      setFieldFiles((prev) => ({ ...prev, [fieldName]: [filesArray[0]] }));
    }
    setSubmitError(null);
  };

  const removeFieldFile = (fieldName: string, fileIndex: number) => {
    setFieldFiles((prev) => {
      const updated = { ...prev };
      updated[fieldName] = (updated[fieldName] || []).filter((_, i) => i !== fileIndex);
      if (updated[fieldName].length === 0) delete updated[fieldName];
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);

    try {
      // Validate required fields
      const requiredFields = ticketSettings?.onlineFormFields.filter((f) => f.required) || [];
      const missingFields = requiredFields.filter((field) => !formData[field.fieldName]);

      if (missingFields.length > 0) {
        setSubmitError('Please fill in all required fields');
        setSubmitting(false);
        return;
      }

      // Prepare form data
      const submitData = new FormData();
      submitData.append('projectId', projectBranding?.projectId || '');
      submitData.append('formData', JSON.stringify(formData));

      // Attach per-field files (keyed by field name so backend can map them)
      Object.keys(fieldFiles).forEach((fieldName) => {
        fieldFiles[fieldName].forEach((file) => {
          submitData.append(fieldName, file);
        });
      });

      // Submit ticket
      await axios.post('http://localhost:3003/api/tickets/submit', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSubmitSuccess(true);
      setFormData({});
      setFieldFiles({});

      // Reset form after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    } catch (err: any) {
      console.error('Error submitting ticket:', err);
      setSubmitError(err.response?.data?.message || 'Failed to submit ticket');
    } finally {
      setSubmitting(false);
    }
  };

  const renderOnlineFormField = (field: OnlineFormField) => {
    const value = formData[field.fieldName] || '';

    const commonClasses = `block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-offset-0 focus:outline-none transition-colors`;

    switch (field.fieldType) {
      case 'text':
      case 'email':
      case 'phone':
      case 'number':
      case 'date':
      case 'url':
        return (
          <input
            key={field.fieldName}
            type={field.fieldType === 'url' ? 'url' : field.fieldType}
            placeholder={field.placeholder}
            value={value}
            onChange={(e) => handleInputChange(field.fieldName, e.target.value)}
            required={field.required}
            className={`${commonClasses} focus:ring-2`}
            style={{
              borderColor: '#e5e7eb',
              ['--tw-ring-color' as any]: projectBranding?.primaryColor,
            }}
          />
        );
      case 'textarea':
        return (
          <textarea
            key={field.fieldName}
            placeholder={field.placeholder}
            value={value}
            onChange={(e) => handleInputChange(field.fieldName, e.target.value)}
            required={field.required}
            rows={4}
            className={`${commonClasses} focus:ring-2`}
            style={{
              borderColor: '#e5e7eb',
              ['--tw-ring-color' as any]: projectBranding?.primaryColor,
            }}
          />
        );
      case 'dropdown':
        return (
          <select
            key={field.fieldName}
            value={value}
            onChange={(e) => handleInputChange(field.fieldName, e.target.value)}
            required={field.required}
            className={`${commonClasses} focus:ring-2`}
            style={{
              borderColor: '#e5e7eb',
              ['--tw-ring-color' as any]: projectBranding?.primaryColor,
            }}
          >
            <option value="">{field.placeholder}</option>
            {field.options?.map((option, idx) => (
              <option key={idx} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      case 'multiselect':
        return (
          <select
            key={field.fieldName}
            multiple
            value={Array.isArray(value) ? value : []}
            onChange={(e) => {
              const selected = Array.from(e.target.selectedOptions, (opt) => opt.value);
              handleInputChange(field.fieldName, selected);
            }}
            required={field.required}
            className={`${commonClasses} focus:ring-2`}
            style={{
              borderColor: '#e5e7eb',
              ['--tw-ring-color' as any]: projectBranding?.primaryColor,
              minHeight: '120px',
            }}
          >
            {field.options?.map((option, idx) => (
              <option key={idx} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      case 'radio':
        return (
          <div key={field.fieldName} className="flex flex-col gap-2">
            {field.options?.map((option, idx) => (
              <label key={idx} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name={field.fieldName}
                  value={option}
                  checked={value === option}
                  onChange={(e) => handleInputChange(field.fieldName, e.target.value)}
                  required={field.required && idx === 0}
                  className="w-4 h-4 cursor-pointer"
                  style={{ accentColor: projectBranding?.primaryColor }}
                />
                <span className="text-sm text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        );
      case 'checkbox':
        return (
          <div key={field.fieldName} className="flex flex-col gap-2">
            {field.options?.map((option, idx) => (
              <label key={idx} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  value={option}
                  checked={Array.isArray(value) && value.includes(option)}
                  onChange={(e) => {
                    const current = Array.isArray(value) ? value : [];
                    if (e.target.checked) {
                      handleInputChange(field.fieldName, [...current, option]);
                    } else {
                      handleInputChange(field.fieldName, current.filter((v) => v !== option));
                    }
                  }}
                  className="w-4 h-4 cursor-pointer"
                  style={{ accentColor: projectBranding?.primaryColor }}
                />
                <span className="text-sm text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        );
      case 'file':
        return (
          <div key={field.fieldName}>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <DocumentArrowUpIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <label className="cursor-pointer">
                <span
                  className="text-sm font-medium hover:underline"
                  style={{ color: projectBranding?.primaryColor }}
                >
                  Choose files
                </span>
                <input
                  type="file"
                  multiple={field.allowMultiple}
                  onChange={(e) => handleFieldFileChange(field.fieldName, e.target.files, field)}
                  className="hidden"
                />
              </label>
              <p className="text-xs text-gray-500 mt-1">
                Max size: {field.maxFileSizeMB || 10} MB
                {(field.allowedFileTypes || []).length > 0 &&
                  ` | Allowed: ${field.allowedFileTypes?.join(', ')}`}
              </p>
            </div>
            {fieldFiles[field.fieldName] && fieldFiles[field.fieldName].length > 0 && (
              <ul className="mt-4 space-y-2">
                {fieldFiles[field.fieldName].map((file, idx) => (
                  <li
                    key={idx}
                    className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                  >
                    <span className="text-sm text-gray-700">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => removeFieldFile(field.fieldName, idx)}
                      className="text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading portal...</p>
        </div>
      </div>
    );
  }

  if (error || !projectBranding || !ticketSettings) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <ExclamationCircleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Portal Not Found</h2>
          <p className="text-gray-600 mb-6">
            {error || 'The requested portal could not be found.'}
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const showOnline = ticketSettings.mode === 'online' || ticketSettings.mode === 'both';
  const showOffline = ticketSettings.mode === 'offline' || ticketSettings.mode === 'both';

  return (
    <div
      className="min-h-screen"
      style={{
        background: hideHeader ? 'transparent' : `linear-gradient(135deg, ${projectBranding.primaryColor}15 0%, ${projectBranding.secondaryColor}15 100%)`,
      }}
    >
      {/* Header */}
      {!hideHeader && (
        <header
          className="shadow-md"
          style={{
            background: `linear-gradient(135deg, ${projectBranding.primaryColor} 0%, ${projectBranding.secondaryColor} 100%)`,
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {projectBranding.logoUrl && (
                  <img
                    src={projectBranding.logoUrl}
                    alt={projectBranding.name}
                    className="h-12 w-auto"
                  />
                )}
                <div>
                  <h1 className="text-2xl font-bold text-white">{projectBranding.name}</h1>
                  <p className="text-white/80 text-sm">{projectBranding.welcomeText}</p>
                </div>
              </div>
              {/* Action Buttons */}
              <div className="flex items-center space-x-3">
                {/* Knowledge Base Button */}
                {projectBranding.knowledgeBase && (
                  <button
                    onClick={() => navigate(`/${customUrlPath}/kb`)}
                    className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors duration-200 backdrop-blur-sm"
                  >
                    <BookOpenIcon className="h-5 w-5" />
                    <span className="font-medium">Knowledge Base</span>
                  </button>
                )}
                {/* Login Button */}
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors duration-200 backdrop-blur-sm"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="font-medium">Login</span>
                </button>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${hideHeader ? 'py-0' : 'py-12'}`}>
        {/* Announcement Banner */}
        {ticketSettings.announcement && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-r-xl p-6 mb-8 flex items-start space-x-4">
            <ExclamationCircleIcon className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-yellow-900 mb-1">
                Important Announcement
              </h3>
              <p className="text-yellow-800 whitespace-pre-wrap">{ticketSettings.announcement}</p>
            </div>
          </div>
        )}

        {/* Welcome Message */}
        {ticketSettings.welcomeMessage && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <p className="text-gray-700 text-lg">{ticketSettings.welcomeMessage}</p>
          </div>
        )}

        {/* Success Message */}
        {submitSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8 flex items-start space-x-4">
            <CheckCircleIcon className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold text-green-900 mb-1">
                Ticket Submitted Successfully!
              </h3>
              <p className="text-green-700">
                {ticketSettings.successMessage ||
                  'Your ticket has been submitted. Our team will get back to you soon.'}
              </p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {submitError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8 flex items-start space-x-4">
            <ExclamationCircleIcon className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold text-red-900 mb-1">Submission Error</h3>
              <p className="text-red-700">{submitError}</p>
            </div>
          </div>
        )}

        {/* Tabs */}
        {ticketSettings.mode === 'both' && (
          <div className="flex space-x-2 mb-8 bg-white rounded-xl shadow-sm p-2">
            <button
              onClick={() => setActiveTab('online')}
              className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all ${
                activeTab === 'online'
                  ? 'text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
              style={{
                backgroundColor: activeTab === 'online' ? projectBranding.primaryColor : 'transparent',
              }}
            >
              Submit Online
            </button>
            <button
              onClick={() => setActiveTab('offline')}
              className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all ${
                activeTab === 'offline'
                  ? 'text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
              style={{
                backgroundColor: activeTab === 'offline' ? projectBranding.primaryColor : 'transparent',
              }}
            >
              Visit Center
            </button>
          </div>
        )}


        {/* Online Form */}
        {showOnline && (ticketSettings.mode !== 'both' || activeTab === 'online') && (
          <div className="bg-white rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Submit Your Ticket</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {ticketSettings.onlineFormFields.map((field) => (
                <div key={field.fieldName}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {field.fieldName}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  {renderOnlineFormField(field)}
                </div>
              ))}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 px-6 rounded-lg text-white font-semibold shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: `linear-gradient(135deg, ${projectBranding.primaryColor} 0%, ${projectBranding.secondaryColor} 100%)`,
                }}
              >
                {submitting ? 'Submitting...' : 'Submit Ticket'}
              </button>
            </form>
          </div>
        )}

        {/* Offline Centers */}
        {showOffline && (ticketSettings.mode !== 'both' || activeTab === 'offline') && (
          <div className="bg-white rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Find Nearest Center</h2>

            {/* Filter Buttons */}
            <div className="mb-4 flex flex-wrap gap-2">
              <button
                onClick={() => {
                  setFilterType('all');
                  setSearchQuery('');
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterType === 'all'
                    ? 'text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                style={{
                  backgroundColor: filterType === 'all' ? projectBranding.primaryColor : undefined,
                }}
              >
                All Centers
              </button>
              <button
                onClick={() => {
                  setFilterType('state');
                  setSearchQuery('');
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterType === 'state'
                    ? 'text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                style={{
                  backgroundColor: filterType === 'state' ? projectBranding.primaryColor : undefined,
                }}
              >
                By State
              </button>
              <button
                onClick={() => {
                  setFilterType('city');
                  setSearchQuery('');
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterType === 'city'
                    ? 'text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                style={{
                  backgroundColor: filterType === 'city' ? projectBranding.primaryColor : undefined,
                }}
              >
                By City
              </button>
              <button
                onClick={() => {
                  setFilterType('pincode');
                  setSearchQuery('');
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterType === 'pincode'
                    ? 'text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                style={{
                  backgroundColor: filterType === 'pincode' ? projectBranding.primaryColor : undefined,
                }}
              >
                By Pincode
              </button>
            </div>

            {/* Search */}
            <div className="mb-6">
              <input
                type="text"
                placeholder={
                  filterType === 'state'
                    ? 'Search by state...'
                    : filterType === 'city'
                    ? 'Search by city...'
                    : filterType === 'pincode'
                    ? 'Search by pincode...'
                    : 'Search by city, state, or pincode...'
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:outline-none"
                style={{ ['--tw-ring-color' as any]: projectBranding.primaryColor }}
              />
            </div>

            {/* Centers List */}
            <div className="space-y-6">
              {filteredCenters.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No centers found</p>
              ) : (
                filteredCenters.map((center, idx) => (
                  <div
                    key={idx}
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      {center.centerName}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-start space-x-3">
                        <MapPinIcon className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">Address</p>
                          <p className="text-sm text-gray-600">
                            {center.address}, {center.city}, {center.state} - {center.pincode}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <PhoneIcon className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">Phone</p>
                          <p className="text-sm text-gray-600">{center.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <EnvelopeIcon className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">Email</p>
                          <p className="text-sm text-gray-600">{center.email}</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <ClockIcon className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">Working Hours</p>
                          <p className="text-sm text-gray-600">{center.workingHours}</p>
                        </div>
                      </div>
                    </div>

                    {/* Features Section */}
                    {center.features && center.features.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-sm font-medium text-gray-700 mb-2">Available Features</p>
                        <div className="flex flex-wrap gap-2">
                          {center.features.map((feature, featureIdx) => (
                            <span
                              key={featureIdx}
                              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Get Directions Button */}
                    <div className="mt-4">
                      <button
                        onClick={() => {
                          let mapUrl = center.mapLink || center.googleMapLink;
                          if (!mapUrl && center.latitude && center.longitude) {
                            mapUrl = `https://www.google.com/maps?q=${center.latitude},${center.longitude}`;
                          } else if (!mapUrl) {
                            mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                              `${center.address}, ${center.city}, ${center.state} ${center.pincode}`
                            )}`;
                          }
                          window.open(mapUrl, '_blank');
                        }}
                        className="w-full py-3 px-4 rounded-lg text-white font-semibold shadow hover:shadow-lg transition-all"
                        style={{
                          background: `linear-gradient(135deg, ${projectBranding?.primaryColor} 0%, ${projectBranding?.secondaryColor} 100%)`,
                        }}
                      >
                        🗺️ Get Directions
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-600 text-sm">{projectBranding.footerText}</p>
        </div>
      </footer>

      {/* Login Modal */}
      {projectBranding && (
        <StudentLoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          primaryColor={projectBranding.primaryColor}
          customUrlPath={customUrlPath || ''}
        />
      )}
    </div>
  );
};

export default StudentPortal;
