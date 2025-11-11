import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MdSettings, MdLock, MdShield, MdMenuBook, MdPalette } from 'react-icons/md';

interface AddProjectFormProps {
  project?: any | null;
  onClose: () => void;
  onSave: () => void;
}

const AddProjectForm = ({ project, onClose, onSave }: AddProjectFormProps) => {
  const { i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState('general');
  const [saving, setSaving] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);
  
  // Toast notification state
  const [toast, setToast] = useState<{
    show: boolean;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
  }>({ show: false, type: 'success', message: '' });

  // Form validation errors
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  // Knowledge Base expandable sections
  const [kbHomeExpanded, setKbHomeExpanded] = useState(true);
  const [articleConfigExpanded, setArticleConfigExpanded] = useState(false);
  const [seoExpanded, setSeoExpanded] = useState(false);

  // Customization modals
  const [showCustomCSSModal, setShowCustomCSSModal] = useState(false);
  const [showCustomJSModal, setShowCustomJSModal] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    // General Tab - Portal Settings
    portalName: project?.name || project?.branding?.headerText || '',
    portalUrl: project?.branding?.domainUrl || '',
    displayPortalNameInNav: true,
    
    // Logo and Favicon
    logo: project?.branding?.logo || '',
    favicon: project?.branding?.favicon || '',
    logoFile: null as File | null,
    faviconFile: null as File | null,
    
    // Logo Linkback URL
    logoLinkbackUrl: project?.branding?.logoLinkbackUrl || '',
    
    // Footer Links
    copyrightUrl: '',
    termsOfUseUrl: '',
    privacyPolicyUrl: '',
    cookiePolicyUrl: '',
    
    // Announcement Banner
    announcementBannerMessage: '',
    announcementBannerType: 'plain' as 'plain' | 'rich',
    
    // Auto Suggest Articles
    autoSuggestArticles: true,
    
    // Ticket Settings
    restrictTicketEditing: false,
    restrictCcUsersFromUpdating: false,
    allowUnauthenticatedTickets: false,
    allowEndUsersToCloseTickets: true,
    
    // File Download Settings
    fileDownloadPermission: 'logged-in-permission' as 'logged-in-permission' | 'logged-in' | 'anyone',
    inlineImageAttachment: false,
    
    // Email Attachment Settings
    attachFilesToEmails: false,
    
    // Google Tag Manager
    googleTagManagerId: '',

    // Login Tab Settings
    enableFormLogin: true,
    enableGoogleRecaptcha: false,
    socialLogins: {
      google: false,
      facebook: false,
      microsoft: false
    },
    ssoSettings: {
      oauth20: false,
      openIdConnect: false,
      jwt: false
    },

    // Security Tab Settings
    allowUserSignup: true,
    restrictSignupViaSocial: false,
    enforceTwoFactorAuth: false,
    passwordPolicy: 'default' as 'default' | 'custom',
    requireLowerCase: false,
    requireUpperCase: false,
    requireNumber: false,
    requireSpecialChar: false,
    minimumPasswordLength: 8,
    passwordExpiration: 'never' as 'never' | '30' | '60' | '90' | '180',

    // Knowledge Base Tab Settings
    enableKB: true,
    kbHomeConfiguration: {
      bannerHeading: 'How can we help you?',
      bannerDescription: '',
      bannerTextColor: '#008000',
      bannerBackgroundType: 'color' as 'color' | 'image',
      bannerBackgroundColor: '#4B0082',
      bannerBackgroundImage: null as File | null,
      showPopularArticles: true,
      popularArticlesCount: 10,
      portalViewableBy: 'all' as 'all' | 'loggedin'
    },
    articleConfiguration: {
      showAuthorName: false,
      showPublishedDate: true,
      showLastUpdatedDate: false,
      enableTableOfContents: false,
      showRelatedArticles: true,
      relatedArticlesCount: 5,
      showRecentArticles: true,
      recentArticlesCount: 5,
      showSameCategoryArticles: true,
      excludeAgentViewCount: false,
      showArticleTags: true,
      enableStatusIndicator: true,
      showShareOption: true,
      shareOnFacebook: true,
      shareOnTwitter: true,
      shareOnLinkedIn: true,
      shareViaEmail: true,
      showEstimatedReadTime: false,
      showComments: false,
      showPreviousNextNavigation: false
    },
    enableAIAssistance: false,
    enableSatisfactionFeedback: true,
    satisfactionFeedback: {
      infoMessage: 'Was this article useful?',
      voteType: 'like' as 'like' | 'upvote' | 'yesno',
      voteLabels: {
        positive: 'Like',
        negative: 'Dislike'
      },
      feedbackMessages: [
        'Correct inaccurate or outdated content',
        'Improve illustrations or images',
        'Fix typos or broken links',
        'Need more information',
        'Correct inaccurate or outdated code samples'
      ],
      successMessage: 'Thank you for your feedback!',
      consentMessage: 'Can we contact you about this feedback?'
    },
    seoSettings: {
      changeFrequency: 'weekly' as 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never',
      sitemapUrl: '',
      robotsTxt: '',
      robotsTxtUrl: '',
      metaTitle: '',
      metaDescription: '',
      sameAsMetaTitleDescription: true,
      ogTitle: '',
      ogDescription: '',
      ogImage: null as File | null
    },

    // Customization Tab Settings
    loginPageBackgroundImage: null as File | null,
    loginPageBackgroundImageUrl: '',
    themeMode: 'light' as 'light' | 'dark',
    themeColor: '#444ce7',
    customCSS: '',
    customJS: '',

    // Contact Information
    address: {
      street: project?.address?.street || '',
      city: project?.address?.city || '',
      state: project?.address?.state || '',
      country: project?.address?.country || 'India',
      pincode: project?.address?.pincode || ''
    },
    contactInfo: {
      phone: project?.contactInfo?.phone || '',
      email: project?.contactInfo?.email || '',
      website: project?.contactInfo?.website || ''
    },
    primaryContact: {
      name: project?.primaryContact?.name || '',
      title: project?.primaryContact?.designation || '',
      email: project?.primaryContact?.email || '',
      phone: project?.primaryContact?.phone || ''
    },

    // Branding
    branding: {
      primaryColor: project?.branding?.colorTheme?.primary || '#f97316',
      secondaryColor: project?.branding?.colorTheme?.secondary || '#64748b',
      footerText: project?.branding?.footerText || '© 2025 Your Organization. All rights reserved.',
      customUrlPath: project?.branding?.customUrlPath || ''
    },

    // Modules
    modules: {
      tickets: project?.modules?.tickets ?? true,
      knowledgeBase: project?.modules?.knowledgeBase ?? true,
      reports: project?.modules?.reports ?? true,
      assets: project?.modules?.assets ?? false,
      communication: project?.modules?.communication ?? true,
      analytics: project?.modules?.analytics ?? true,
      userManagement: project?.modules?.userManagement ?? true,
      workflows: project?.modules?.workflows ?? false,
      approvals: project?.modules?.approvals ?? false,
      notifications: project?.modules?.notifications ?? true
    },

    // Settings
    settings: {
      defaultLanguage: project?.settings?.defaultLanguage || 'en',
      timezone: project?.settings?.timezone || 'Asia/Kolkata',
      dateFormat: project?.settings?.dateFormat || 'DD/MM/YYYY',
      timeFormat: project?.settings?.timeFormat || '12h',
      currency: project?.settings?.currency || 'INR'
    }
  });

  // Master data states
  const [organizationTypes, setOrganizationTypes] = useState<Array<{ key: string; value: string }>>([]);
  const [countries, setCountries] = useState<Array<{ key: string; value: string }>>([]);
  const [languages, setLanguages] = useState<Array<{ key: string; value: string }>>([]);
  const [timezones, setTimezones] = useState<Array<{ key: string; value: string }>>([]);
  const [dateFormats, setDateFormats] = useState<Array<{ key: string; value: string }>>([]);
  const [currencies, setCurrencies] = useState<Array<{ key: string; value: string }>>([]);

  // Fetch master data
  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const [orgTypesRes, countriesRes, languagesRes, timezonesRes, dateFormatsRes, currenciesRes] = await Promise.all([
          fetch('http://localhost:3003/api/masters/organization-types', { credentials: 'include' }),
          fetch('http://localhost:3003/api/masters/countries', { credentials: 'include' }),
          fetch('http://localhost:3003/api/masters/languages', { credentials: 'include' }),
          fetch('http://localhost:3003/api/masters/timezones', { credentials: 'include' }),
          fetch('http://localhost:3003/api/masters/date-formats', { credentials: 'include' }),
          fetch('http://localhost:3003/api/masters/currencies', { credentials: 'include' })
        ]);

        const [orgTypes, countries, languages, timezones, dateFormats, currencies] = await Promise.all([
          orgTypesRes.json(),
          countriesRes.json(),
          languagesRes.json(),
          timezonesRes.json(),
          dateFormatsRes.json(),
          currenciesRes.json()
        ]);

        if (orgTypes.success) setOrganizationTypes(orgTypes.data);
        if (countries.success) setCountries(countries.data);
        if (languages.success) setLanguages(languages.data);
        if (timezones.success) setTimezones(timezones.data);
        if (dateFormats.success) setDateFormats(dateFormats.data);
        if (currencies.success) setCurrencies(currencies.data);
      } catch (error) {
        console.error('Error fetching master data:', error);
      }
    };

    fetchMasterData();
  }, []);

  // Update form data when project changes (for edit mode)
  useEffect(() => {
    if (project) {
      setFormData(prevData => ({
        ...prevData,
        portalName: project?.name || project?.branding?.headerText || '',
        branding: {
          ...prevData.branding,
          primaryColor: project?.branding?.colorTheme?.primary || '#f97316',
          secondaryColor: project?.branding?.colorTheme?.secondary || '#64748b',
          footerText: project?.branding?.footerText || '© 2025 Your Organization. All rights reserved.',
          customUrlPath: project?.branding?.customUrlPath || ''
        },
        logo: project?.branding?.logo || '',
        favicon: project?.branding?.favicon || '',
        address: {
          street: project?.address?.street || '',
          city: project?.address?.city || '',
          state: project?.address?.state || '',
          country: project?.address?.country || 'India',
          pincode: project?.address?.pincode || ''
        },
        contactInfo: {
          phone: project?.contactInfo?.phone || '',
          email: project?.contactInfo?.email || '',
          website: project?.contactInfo?.website || ''
        },
        primaryContact: {
          name: project?.primaryContact?.name || '',
          title: project?.primaryContact?.designation || '',
          email: project?.primaryContact?.email || '',
          phone: project?.primaryContact?.phone || ''
        }
      }));
    }
  }, [project]);

  const handleFileUpload = async (file: File, type: 'logo' | 'favicon') => {
    // TODO: Implement file upload to server
    // For now, we'll use base64
    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === 'logo') {
        setFormData({ ...formData, logo: reader.result as string, logoFile: file });
      } else {
        setFormData({ ...formData, favicon: reader.result as string, faviconFile: file });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    const newErrors: {[key: string]: string} = {};
    if (!formData.portalName.trim()) {
      newErrors.portalName = 'Portal name is required';
    }
    if (!formData.branding?.customUrlPath?.trim()) {
      newErrors.portalUrl = 'Custom URL path is required';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setToast({
        show: true,
        type: 'error',
        message: 'Please fill in all required fields'
      });
      setTimeout(() => setToast({ show: false, type: 'success', message: '' }), 4000);
      return;
    }
    
    setErrors({});
    setSaving(true);

    try {

      // Generate code from portal name (remove spaces, convert to uppercase, take first 10 chars)
      const generatedCode = formData.portalName.replace(/\s+/g, '').toUpperCase().substring(0, 10);

      // Prepare the data according to the Project model structure
      const projectData = {
        name: formData.portalName,
        code: generatedCode,
        description: `Portal for ${formData.portalName}`,
        organizationType: 'private', // Default value
        
        address: formData.address,
        contactInfo: formData.contactInfo,
        primaryContact: {
          name: formData.primaryContact.name,
          email: formData.primaryContact.email,
          phone: formData.primaryContact.phone,
          designation: formData.primaryContact.title
        },
        
        branding: {
          logo: formData.logo,
          favicon: formData.favicon,
          logoLinkbackUrl: formData.logoLinkbackUrl,
          colorTheme: {
            primary: formData.themeColor || formData.branding.primaryColor,
            secondary: formData.branding.secondaryColor,
            accent: '#3b82f6',
            background: '#ffffff'
          },
          headerText: formData.portalName,
          footerText: formData.branding.footerText,
          domainUrl: formData.portalUrl,
          customUrlPath: formData.branding.customUrlPath
        },
        
        modules: formData.modules,
        settings: formData.settings,
        
        configuration: {
          announcementBanner: {
            message: formData.announcementBannerMessage,
            type: formData.announcementBannerType
          },
          autoSuggestArticles: formData.autoSuggestArticles,
          ticketSettings: {
            restrictEditing: formData.restrictTicketEditing,
            restrictCcUsers: formData.restrictCcUsersFromUpdating,
            allowUnauthenticated: formData.allowUnauthenticatedTickets,
            allowEndUsersToClose: formData.allowEndUsersToCloseTickets
          },
          fileSettings: {
            downloadPermission: formData.fileDownloadPermission,
            inlineImageAttachment: formData.inlineImageAttachment,
            attachToEmails: formData.attachFilesToEmails
          },
          footerLinks: {
            copyright: formData.copyrightUrl,
            termsOfUse: formData.termsOfUseUrl,
            privacyPolicy: formData.privacyPolicyUrl,
            cookiePolicy: formData.cookiePolicyUrl
          },
          googleTagManagerId: formData.googleTagManagerId,
          loginSettings: {
            enableFormLogin: formData.enableFormLogin,
            enableGoogleRecaptcha: formData.enableGoogleRecaptcha,
            socialLogins: formData.socialLogins,
            ssoSettings: formData.ssoSettings
          },
          securitySettings: {
            allowUserSignup: formData.allowUserSignup,
            restrictSignupViaSocial: formData.restrictSignupViaSocial,
            mfaRequired: formData.enforceTwoFactorAuth,
            passwordPolicy: formData.passwordPolicy === 'custom' ? {
              minLength: formData.minimumPasswordLength,
              requireUppercase: formData.requireUpperCase,
              requireLowercase: formData.requireLowerCase,
              requireNumbers: formData.requireNumber,
              requireSpecialChars: formData.requireSpecialChar,
              expiryDays: formData.passwordExpiration === 'never' ? 0 : parseInt(formData.passwordExpiration)
            } : {
              minLength: 8,
              requireUppercase: true,
              requireLowercase: true,
              requireNumbers: true,
              requireSpecialChars: false,
              expiryDays: 90
            }
          },
          knowledgeBaseSettings: {
            enabled: formData.enableKB,
            kbHomeConfiguration: formData.kbHomeConfiguration,
            articleConfiguration: formData.articleConfiguration,
            enableAIAssistance: formData.enableAIAssistance,
            enableSatisfactionFeedback: formData.enableSatisfactionFeedback,
            satisfactionFeedback: formData.satisfactionFeedback,
            seoSettings: formData.seoSettings
          },
          customizationSettings: {
            loginPageBackgroundImage: formData.loginPageBackgroundImageUrl,
            themeMode: formData.themeMode,
            themeColor: formData.themeColor,
            customCSS: formData.customCSS,
            customJS: formData.customJS
          }
        }
      };

      const url = project
        ? `http://localhost:3003/api/projects/${project._id}`
        : 'http://localhost:3003/api/projects';

      const method = project ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(projectData),
      });

      const data = await response.json();
      if (data.success) {
        setToast({
          show: true,
          type: 'success',
          message: project ? 'Project updated successfully!' : 'Project created successfully!'
        });
        setTimeout(() => {
          setToast({ show: false, type: 'success', message: '' });
          onSave();
        }, 2000);
      } else {
        setToast({
          show: true,
          type: 'error',
          message: data.message || 'Failed to save project'
        });
        setTimeout(() => setToast({ show: false, type: 'success', message: '' }), 4000);
      }
    } catch (error) {
      console.error('Error saving project:', error);
      setToast({
        show: true,
        type: 'error',
        message: 'An error occurred while saving the project'
      });
      setTimeout(() => setToast({ show: false, type: 'success', message: '' }), 4000);
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'general', label: 'General', labelMr: 'सामान्य', icon: <MdSettings /> },
    { id: 'login', label: 'Login', labelMr: 'लॉगिन', icon: <MdLock /> },
    { id: 'security', label: 'Security', labelMr: 'सुरक्षा', icon: <MdShield /> },
    { id: 'knowledge', label: 'Knowledge Base', labelMr: 'ज्ञान आधार', icon: <MdMenuBook /> },
    { id: 'customization', label: 'Customization', labelMr: 'सानुकूलीकरण', icon: <MdPalette /> }
  ];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        width: '100%',
        maxWidth: '1400px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#111827', margin: 0 }}>
            {project
              ? (i18n.language === 'en' ? 'Edit Project' : 'प्रकल्प संपादित करा')
              : (i18n.language === 'en' ? 'Add New Project' : 'नवीन प्रकल्प जोडा')}
          </h2>
          <button
            onClick={onClose}
            type="button"
            style={{
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: 'none',
              background: 'transparent',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '20px',
              color: '#6b7280',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            ✕
          </button>
        </div>

        {/* Main Content Area with Sidebar */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* Left Sidebar Navigation */}
          <div style={{
            width: '240px',
            borderRight: '1px solid #e5e7eb',
            padding: '16px 0',
            overflowY: 'auto'
          }}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                type="button"
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 20px',
                  border: 'none',
                  background: activeTab === tab.id ? 'rgba(63, 65, 209, 0.1)' : 'transparent',
                  color: activeTab === tab.id ? '#3F41D1' : '#6b7280',
                  fontWeight: activeTab === tab.id ? '600' : '400',
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textAlign: 'left',
                  borderLeft: activeTab === tab.id ? '3px solid #3F41D1' : '3px solid transparent'
                }}
                onMouseOver={(e) => {
                  if (activeTab !== tab.id) {
                    e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.02)';
                    e.currentTarget.style.color = '#111827';
                  }
                }}
                onMouseOut={(e) => {
                  if (activeTab !== tab.id) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#6b7280';
                  }
                }}
              >
                <span style={{ fontSize: '20px', display: 'flex', alignItems: 'center' }}>
                  {tab.icon}
                </span>
                <span>{i18n.language === 'en' ? tab.label : tab.labelMr}</span>
              </button>
            ))}
          </div>

          {/* Right Content Area */}
          <form onSubmit={handleSubmit} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1, overflowY: 'auto', padding: '32px 40px' }}>
              {activeTab === 'general' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '700px' }}>
                  {/* Required Fields Note */}
                  <div style={{ 
                    padding: '12px 16px', 
                    backgroundColor: '#f3f4f6', 
                    borderRadius: '6px',
                    borderLeft: '3px solid #3F41D1'
                  }}>
                    <p style={{ fontSize: '13px', color: '#6b7280', margin: 0, lineHeight: '1.5' }}>
                      <span style={{ color: '#E6393E', fontWeight: '600' }}>*</span> indicates required fields
                    </p>
                  </div>
                  {/* Portal Name */}
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#111827',
                      marginBottom: '6px'
                    }}>
                      Portal Name <span style={{ color: '#E6393E' }}>*</span>
                    </label>
                    <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px', lineHeight: '1.5' }}>
                      The portal name specified below will be used in the customer portal browser title.
                    </p>
                    <input
                      type="text"
                      required
                      value={formData.portalName}
                      onChange={(e) => {
                        setFormData({ ...formData, portalName: e.target.value });
                        if (errors.portalName) {
                          setErrors({ ...errors, portalName: '' });
                        }
                      }}
                      onBlur={() => {
                        if (!formData.portalName.trim()) {
                          setErrors({ ...errors, portalName: 'Portal name is required' });
                        }
                      }}
                      placeholder="Enter portal name"
                      className="text-field"
                      style={{ 
                        width: '100%', 
                        boxSizing: 'border-box',
                        borderColor: errors.portalName ? '#ef4444' : undefined,
                        backgroundColor: errors.portalName ? 'rgba(239, 68, 68, 0.02)' : undefined
                      }}
                    />
                    {errors.portalName && (
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '6px', 
                        marginTop: '6px',
                        color: '#ef4444',
                        fontSize: '13px'
                      }}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M8 14A6 6 0 108 2a6 6 0 000 12z" stroke="currentColor" strokeWidth="1.5"/>
                          <path d="M8 5v3M8 11h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                        {errors.portalName}
                      </div>
                    )}
                    <div style={{ marginTop: '12px' }}>
                      <label style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        cursor: 'pointer', 
                        gap: '8px',
                        fontSize: '14px',
                        color: '#374151'
                      }}>
                        <input
                          type="checkbox"
                          checked={formData.displayPortalNameInNav}
                          onChange={(e) => setFormData({ ...formData, displayPortalNameInNav: e.target.checked })}
                          className="checkbox"
                        />
                        <span style={{ fontSize: '14px', color: '#111827', lineHeight: '1.5' }}>
                          Display portal name in the top navigation bar
                        </span>
                      </label>
                      <p style={{ fontSize: '12px', color: '#6b7280', marginLeft: '26px', marginTop: '4px', lineHeight: '1.5' }}>
                        If your logo image has a brand name, you can uncheck this option so that the same name does not appear twice in the navigation bar.
                      </p>
                </div>
              </div>

              {/* Footer Text */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#111827',
                  marginBottom: '6px'
                }}>
                  Footer Text
                </label>
                <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px', lineHeight: '1.5' }}>
                  This text will appear at the bottom of the login page and customer portal.
                </p>
                <input
                  type="text"
                  value={formData.branding.footerText}
                  onChange={(e) => {
                    setFormData({ 
                      ...formData, 
                      branding: { ...formData.branding, footerText: e.target.value }
                    });
                  }}
                  placeholder="e.g., © 2025 Your Organization. All rights reserved."
                  className="text-field"
                  style={{ 
                    width: '100%', 
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Portal URL */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#111827',
                  marginBottom: '6px'
                }}>
                  Custom Portal URL Path <span style={{ color: '#E6393E' }}>*</span>
                </label>
                <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px', lineHeight: '1.5' }}>
                  Enter a custom URL path for this project. Users will access the login page at: <strong>http://localhost:3000/[your-custom-path]</strong>
                  <br />
                  Example: Enter "studentassistcenter" → URL will be: http://localhost:3000/studentassistcenter
                </p>
                <div style={{ display: 'flex', gap: '0', alignItems: 'stretch' }}>
                  <span style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 12px',
                    backgroundColor: '#f9fafb',
                    border: '1px solid #d1d5db',
                    borderRight: 'none',
                    borderRadius: '6px 0 0 6px',
                    fontSize: '14px',
                    color: '#6b7280',
                    whiteSpace: 'nowrap',
                    height: '40px',
                    lineHeight: '1'
                  }}>
                    http://localhost:3000/
                  </span>
                  <input
                    type="text"
                    value={formData.branding?.customUrlPath || ''}
                    onChange={(e) => {
                      const value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
                      setFormData({
                        ...formData,
                        branding: {
                          ...formData.branding,
                          customUrlPath: value
                        }
                      });
                    }}
                    placeholder="studentassistcenter"
                    className="text-field"
                    style={{ 
                      flex: 1, 
                      borderRadius: '0 6px 6px 0',
                      boxSizing: 'border-box',
                      height: '40px',
                      minHeight: '40px'
                    }}
                    required
                  />
                </div>
                {errors.portalUrl && (
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '6px', 
                    marginTop: '6px',
                    color: '#ef4444',
                    fontSize: '13px'
                  }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M8 14A6 6 0 108 2a6 6 0 000 12z" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M8 5v3M8 11h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    {errors.portalUrl}
                  </div>
                )}
              </div>

              {/* Logo and Favicon */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#111827',
                  marginBottom: '6px'
                }}>
                  Logo and Favicon
                </label>
                <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '16px', lineHeight: '1.5' }}>
                  Upload your brand logo and favicon. Supported formats: 
                  <span style={{ 
                    display: 'inline-flex', 
                    gap: '4px', 
                    marginLeft: '4px',
                    flexWrap: 'wrap'
                  }}>
                    {['.jpeg', '.jpg', '.png', '.svg', '.gif', '.ico'].map(format => (
                      <span key={format} style={{
                        backgroundColor: '#f3f4f6',
                        padding: '2px 6px',
                        borderRadius: '3px',
                        fontSize: '11px',
                        fontWeight: '500',
                        color: '#6b7280'
                      }}>
                        {format}
                      </span>
                    ))}
                  </span>
                </p>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  {/* Logo */}
                  <div style={{
                    border: '2px dashed #d1d5db',
                    borderRadius: '8px',
                    padding: '20px',
                    backgroundColor: '#fafbfc',
                    transition: 'all 0.2s ease'
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.currentTarget.style.borderColor = '#3F41D1';
                    e.currentTarget.style.backgroundColor = 'rgba(63, 65, 209, 0.02)';
                  }}
                  onDragLeave={(e) => {
                    e.currentTarget.style.borderColor = '#d1d5db';
                    e.currentTarget.style.backgroundColor = '#fafbfc';
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.currentTarget.style.borderColor = '#d1d5db';
                    e.currentTarget.style.backgroundColor = '#fafbfc';
                    const file = e.dataTransfer.files[0];
                    if (file) handleFileUpload(file, 'logo');
                  }}
                  >
                    <div style={{ marginBottom: '12px' }}>
                      <span style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>Logo</span>
                      <p style={{ fontSize: '12px', color: '#6b7280', margin: '4px 0', lineHeight: '1.5' }}>
                        Recommended: 240×40px • Max 2MB
                      </p>
                    </div>
                    <div style={{
                      width: '100%',
                      minHeight: '120px',
                      border: formData.logo ? '1px solid #e5e7eb' : '2px dashed #e5e7eb',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#ffffff',
                      marginBottom: '12px',
                      overflow: 'hidden',
                      padding: '12px'
                    }}>
                      {formData.logo ? (
                        <img src={formData.logo} alt="Logo Preview" style={{ maxWidth: '100%', maxHeight: '100px', objectFit: 'contain' }} />
                      ) : (
                        <div style={{ textAlign: 'center', padding: '20px' }}>
                          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" style={{ margin: '0 auto 8px' }}>
                            <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M17 8L12 3L7 8" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M12 3V15" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <p style={{ fontSize: '13px', color: '#6b7280', margin: '0' }}>
                            Drag & drop or click to upload
                          </p>
                        </div>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <label style={{
                        flex: 1,
                        padding: '10px 16px',
                        border: '1px solid #3F41D1',
                        borderRadius: '6px',
                        backgroundColor: 'white',
                        color: '#3F41D1',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(63, 65, 209, 0.04)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'white';
                      }}
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M14 10V12.6667C14 13.0203 13.8595 13.3594 13.6095 13.6095C13.3594 13.8595 13.0203 14 12.6667 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M11.3333 5.33333L8 2L4.66667 5.33333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M8 2V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        {formData.logo ? 'Change Logo' : 'Upload Logo'}
                        <input
                          type="file"
                          accept=".jpeg,.jpg,.png,.svg,.gif"
                          onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'logo')}
                          style={{ display: 'none' }}
                        />
                      </label>
                      {formData.logo && (
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, logo: '', logoFile: null })}
                          style={{
                            padding: '10px 16px',
                            border: '1px solid #ef4444',
                            borderRadius: '6px',
                            backgroundColor: 'white',
                            color: '#ef4444',
                            fontSize: '14px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.04)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'white';
                          }}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Favicon */}
                  <div style={{
                    border: '2px dashed #d1d5db',
                    borderRadius: '8px',
                    padding: '20px',
                    backgroundColor: '#fafbfc',
                    transition: 'all 0.2s ease'
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.currentTarget.style.borderColor = '#3F41D1';
                    e.currentTarget.style.backgroundColor = 'rgba(63, 65, 209, 0.02)';
                  }}
                  onDragLeave={(e) => {
                    e.currentTarget.style.borderColor = '#d1d5db';
                    e.currentTarget.style.backgroundColor = '#fafbfc';
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.currentTarget.style.borderColor = '#d1d5db';
                    e.currentTarget.style.backgroundColor = '#fafbfc';
                    const file = e.dataTransfer.files[0];
                    if (file) handleFileUpload(file, 'favicon');
                  }}
                  >
                    <div style={{ marginBottom: '12px' }}>
                      <span style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>Favicon</span>
                      <p style={{ fontSize: '12px', color: '#6b7280', margin: '4px 0', lineHeight: '1.5' }}>
                        Recommended: 16×16px • Max 1MB
                      </p>
                    </div>
                    <div style={{
                      width: '100%',
                      minHeight: '120px',
                      border: formData.favicon ? '1px solid #e5e7eb' : '2px dashed #e5e7eb',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#ffffff',
                      marginBottom: '12px',
                      overflow: 'hidden',
                      padding: '12px'
                    }}>
                      {formData.favicon ? (
                        <img src={formData.favicon} alt="Favicon Preview" style={{ width: '48px', height: '48px', objectFit: 'contain' }} />
                      ) : (
                        <div style={{ textAlign: 'center', padding: '20px' }}>
                          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" style={{ margin: '0 auto 8px' }}>
                            <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M17 8L12 3L7 8" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M12 3V15" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <p style={{ fontSize: '13px', color: '#6b7280', margin: '0' }}>
                            Drag & drop or click to upload
                          </p>
                        </div>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <label style={{
                        flex: 1,
                        padding: '10px 16px',
                        border: '1px solid #3F41D1',
                        borderRadius: '6px',
                        backgroundColor: 'white',
                        color: '#3F41D1',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(63, 65, 209, 0.04)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'white';
                      }}
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M14 10V12.6667C14 13.0203 13.8595 13.3594 13.6095 13.6095C13.3594 13.8595 13.0203 14 12.6667 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M11.3333 5.33333L8 2L4.66667 5.33333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M8 2V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        {formData.favicon ? 'Change Favicon' : 'Upload Favicon'}
                        <input
                          type="file"
                          accept=".jpeg,.jpg,.png,.svg,.gif,.ico"
                          onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'favicon')}
                          style={{ display: 'none' }}
                        />
                      </label>
                      {formData.favicon && (
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, favicon: '', faviconFile: null })}
                          style={{
                            padding: '10px 16px',
                            border: '1px solid #ef4444',
                            borderRadius: '6px',
                            backgroundColor: 'white',
                            color: '#ef4444',
                            fontSize: '14px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.04)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'white';
                          }}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Logo Linkback URL */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#111827',
                  marginBottom: '6px'
                }}>
                  Logo Linkback URL
                </label>
                <div style={{ display: 'flex', gap: '0', alignItems: 'stretch' }}>
                  <select
                    className="text-field protocol-select"
                    style={{
                      height: '40px',
                      minHeight: '40px',
                      borderRadius: '6px 0 0 6px',
                      borderRight: 'none'
                    }}
                  >
                    <option>https://</option>
                    <option>http://</option>
                  </select>
                  <input
                    type="text"
                    value={formData.logoLinkbackUrl}
                    onChange={(e) => setFormData({ ...formData, logoLinkbackUrl: e.target.value })}
                    placeholder="example.com"
                    className="text-field"
                    style={{
                      flex: 1,
                      height: '40px',
                      minHeight: '40px',
                      borderRadius: '0 6px 6px 0',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              {/* Footer Links */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#111827',
                  marginBottom: '6px'
                }}>
                  Footer Links
                </label>
                <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '16px', lineHeight: '1.5' }}>
                  Footer links will be shown on all pages in the customer portal. The footer links will be hidden when left empty.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* Copyright URL */}
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#111827', marginBottom: '6px' }}>
                      Copyright URL
                    </label>
                    <div style={{ display: 'flex', gap: '0', alignItems: 'stretch' }}>
                      <select
                        className="text-field protocol-select"
                        style={{
                          height: '40px',
                          minHeight: '40px',
                          borderRadius: '6px 0 0 6px',
                          borderRight: 'none'
                        }}>
                        <option>https://</option>
                        <option>http://</option>
                      </select>
                      <input
                        type="text"
                        value={formData.copyrightUrl}
                        onChange={(e) => setFormData({ ...formData, copyrightUrl: e.target.value })}
                        placeholder="example.com"
                        className="text-field"
                        style={{ 
                          flex: 1,
                          height: '40px',
                          minHeight: '40px',
                          borderRadius: '0 6px 6px 0',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                  </div>

                  {/* Terms of Use URL */}
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#111827', marginBottom: '6px' }}>
                      Terms of Use URL
                    </label>
                    <div style={{ display: 'flex', gap: '0', alignItems: 'stretch' }}>
                      <select
                        className="text-field protocol-select"
                        style={{
                          height: '40px',
                          minHeight: '40px',
                          borderRadius: '6px 0 0 6px',
                          borderRight: 'none'
                        }}>
                        <option>https://</option>
                        <option>http://</option>
                      </select>
                      <input
                        type="text"
                        value={formData.termsOfUseUrl}
                        onChange={(e) => setFormData({ ...formData, termsOfUseUrl: e.target.value })}
                        placeholder="example.com"
                        className="text-field"
                        style={{ 
                          flex: 1,
                          height: '40px',
                          minHeight: '40px',
                          borderRadius: '0 6px 6px 0',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                  </div>

                  {/* Privacy Policy URL */}
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#111827', marginBottom: '6px' }}>
                      Privacy Policy URL
                    </label>
                    <div style={{ display: 'flex', gap: '0', alignItems: 'stretch' }}>
                      <select
                        className="text-field protocol-select"
                        style={{
                          height: '40px',
                          minHeight: '40px',
                          borderRadius: '6px 0 0 6px',
                          borderRight: 'none'
                        }}>
                        <option>https://</option>
                        <option>http://</option>
                      </select>
                      <input
                        type="text"
                        value={formData.privacyPolicyUrl}
                        onChange={(e) => setFormData({ ...formData, privacyPolicyUrl: e.target.value })}
                        placeholder="example.com"
                        className="text-field"
                        style={{ 
                          flex: 1,
                          height: '40px',
                          minHeight: '40px',
                          borderRadius: '0 6px 6px 0',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                  </div>

                  {/* Cookie Policy URL */}
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#111827', marginBottom: '6px' }}>
                      Cookie Policy URL
                    </label>
                    <div style={{ display: 'flex', gap: '0', alignItems: 'stretch' }}>
                      <select
                        className="text-field protocol-select"
                        style={{
                          height: '40px',
                          minHeight: '40px',
                          borderRadius: '6px 0 0 6px',
                          borderRight: 'none'
                        }}>
                        <option>https://</option>
                        <option>http://</option>
                      </select>
                      <input
                        type="text"
                        value={formData.cookiePolicyUrl}
                        onChange={(e) => setFormData({ ...formData, cookiePolicyUrl: e.target.value })}
                        placeholder="example.com"
                        className="text-field"
                        style={{ 
                          flex: 1,
                          height: '40px',
                          minHeight: '40px',
                          borderRadius: '0 6px 6px 0',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Announcement Banner Message */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#1f2937',
                  marginBottom: '4px'
                }}>
                  Announcement Banner Message
                </label>
                <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '12px' }}>
                  The announcement banner can be used to communicate an important message to the users. It appears on the top of the page.
                </p>

                <div style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="bannerType"
                      value="plain"
                      checked={formData.announcementBannerType === 'plain'}
                      onChange={(e) => setFormData({ ...formData, announcementBannerType: 'plain' })}
                      style={{ cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: '14px', color: '#374151' }}>Plain Text</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="bannerType"
                      value="rich"
                      checked={formData.announcementBannerType === 'rich'}
                      onChange={(e) => setFormData({ ...formData, announcementBannerType: 'rich' })}
                      style={{ cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: '14px', color: '#374151' }}>Rich Text</span>
                  </label>
                </div>

                <textarea
                  value={formData.announcementBannerMessage}
                  onChange={(e) => setFormData({ ...formData, announcementBannerMessage: e.target.value })}
                  placeholder="Enter text here"
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box',
                    resize: 'vertical'
                  }}
                />
              </div>

              {/* Auto Suggest Articles */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#1f2937',
                  marginBottom: '12px'
                }}>
                  Auto Suggest Articles
                </label>
                <label style={{ display: 'flex', alignItems: 'flex-start', cursor: 'pointer', gap: '8px' }}>
                  <input
                    type="checkbox"
                    checked={formData.autoSuggestArticles}
                    onChange={(e) => setFormData({ ...formData, autoSuggestArticles: e.target.checked })}
                    style={{ width: '16px', height: '16px', cursor: 'pointer', marginTop: '2px' }}
                  />
                  <div>
                    <span style={{ fontSize: '14px', color: '#374151', display: 'block' }}>
                      Allow article suggestions during ticket creation
                    </span>
                    <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px', marginBottom: 0 }}>
                      When the knowledge base module and these settings are enabled, the system will automatically suggest the top 5 most relevant knowledge base articles when a user types a subject for a ticket in the customer portal ticket creation page.
                    </p>
                  </div>
                </label>
              </div>

              {/* Ticket Update Settings */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#1f2937',
                  marginBottom: '12px'
                }}>
                  Ticket Update Settings
                </label>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <label style={{ display: 'flex', alignItems: 'flex-start', cursor: 'pointer', gap: '8px' }}>
                    <input
                      type="checkbox"
                      checked={formData.restrictTicketEditing}
                      onChange={(e) => setFormData({ ...formData, restrictTicketEditing: e.target.checked })}
                      style={{ width: '16px', height: '16px', cursor: 'pointer', marginTop: '2px' }}
                    />
                    <div>
                      <span style={{ fontSize: '14px', color: '#374151', display: 'block' }}>
                        Restrict ticket editing in the customer portal
                      </span>
                      <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px', marginBottom: 0 }}>
                        When enabled, users will be unable to edit titles, delete replies, or remove attachments after ticket creation.
                      </p>
                    </div>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'flex-start', cursor: 'pointer', gap: '8px' }}>
                    <input
                      type="checkbox"
                      checked={formData.restrictCcUsersFromUpdating}
                      onChange={(e) => setFormData({ ...formData, restrictCcUsersFromUpdating: e.target.checked })}
                      style={{ width: '16px', height: '16px', cursor: 'pointer', marginTop: '2px' }}
                    />
                    <div>
                      <span style={{ fontSize: '14px', color: '#374151', display: 'block' }}>
                        Restrict cc users from updating tickets via the customer portal
                      </span>
                      <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px', marginBottom: 0 }}>
                        If enabled, cc users will be restricted from adding replies to tickets in the customer portal.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Ticket Creation Settings */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#1f2937',
                  marginBottom: '12px'
                }}>
                  Ticket Creation Settings
                </label>
                
                <label style={{ display: 'flex', alignItems: 'flex-start', cursor: 'pointer', gap: '8px' }}>
                  <input
                    type="checkbox"
                    checked={formData.allowUnauthenticatedTickets}
                    onChange={(e) => setFormData({ ...formData, allowUnauthenticatedTickets: e.target.checked })}
                    style={{ width: '16px', height: '16px', cursor: 'pointer', marginTop: '2px' }}
                  />
                  <div>
                    <span style={{ fontSize: '14px', color: '#374151', display: 'block' }}>
                      Allow unauthenticated users to create tickets
                    </span>
                    <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px', marginBottom: 0 }}>
                      When enabled, the ticket creation form will be accessible without requiring a login, allowing anonymous users to submit tickets.
                    </p>
                  </div>
                </label>
              </div>

              {/* Ticket Closure Settings */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#1f2937',
                  marginBottom: '12px'
                }}>
                  Ticket Closure Settings
                </label>
                
                <label style={{ display: 'flex', alignItems: 'flex-start', cursor: 'pointer', gap: '8px' }}>
                  <input
                    type="checkbox"
                    checked={formData.allowEndUsersToCloseTickets}
                    onChange={(e) => setFormData({ ...formData, allowEndUsersToCloseTickets: e.target.checked })}
                    style={{ width: '16px', height: '16px', cursor: 'pointer', marginTop: '2px' }}
                  />
                  <div>
                    <span style={{ fontSize: '14px', color: '#374151', display: 'block' }}>
                      Allow end-users to close tickets through customer portal
                    </span>
                    <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px', marginBottom: 0 }}>
                      If enabled, customers will be able to close their own tickets. If disabled, only agents or automation will be able to close tickets.
                    </p>
                  </div>
                </label>
              </div>

              {/* File Download Settings */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#1f2937',
                  marginBottom: '12px'
                }}>
                  File Download Settings
                </label>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="fileDownload"
                      value="logged-in-permission"
                      checked={formData.fileDownloadPermission === 'logged-in-permission'}
                      onChange={(e) => setFormData({ ...formData, fileDownloadPermission: 'logged-in-permission' })}
                      style={{ cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: '14px', color: '#374151' }}>
                      Allow only if the user has permission to view the ticket (requires user to be logged in).
                    </span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="fileDownload"
                      value="logged-in"
                      checked={formData.fileDownloadPermission === 'logged-in'}
                      onChange={(e) => setFormData({ ...formData, fileDownloadPermission: 'logged-in' })}
                      style={{ cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: '14px', color: '#374151' }}>
                      Allow any agent or customer to download (requires user to be logged in).
                    </span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="fileDownload"
                      value="anyone"
                      checked={formData.fileDownloadPermission === 'anyone'}
                      onChange={(e) => setFormData({ ...formData, fileDownloadPermission: 'anyone' })}
                      style={{ cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: '14px', color: '#374151' }}>
                      Allow anyone who has a file download link to download file without having to log in.
                    </span>
                  </label>
                </div>
              </div>

              {/* Inline Image Attachment Settings */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#1f2937',
                  marginBottom: '12px'
                }}>
                  Inline Image Attachment Settings
                </label>
                
                <label style={{ display: 'flex', alignItems: 'flex-start', cursor: 'pointer', gap: '8px' }}>
                  <input
                    type="checkbox"
                    checked={formData.inlineImageAttachment}
                    onChange={(e) => setFormData({ ...formData, inlineImageAttachment: e.target.checked })}
                    style={{ width: '16px', height: '16px', cursor: 'pointer', marginTop: '2px' }}
                  />
                  <div>
                    <span style={{ fontSize: '14px', color: '#374151', display: 'block' }}>
                      To download or view an image, users must be logged into the portal. Images in emails will appear as broken links unless the user is logged into the portal.
                    </span>
                  </div>
                </label>
              </div>

              {/* File Attachment Settings (Email) */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#1f2937',
                  marginBottom: '12px'
                }}>
                  File Attachment Settings (Email)
                </label>
                
                <label style={{ display: 'flex', alignItems: 'flex-start', cursor: 'pointer', gap: '8px' }}>
                  <input
                    type="checkbox"
                    checked={formData.attachFilesToEmails}
                    onChange={(e) => setFormData({ ...formData, attachFilesToEmails: e.target.checked })}
                    style={{ width: '16px', height: '16px', cursor: 'pointer', marginTop: '2px' }}
                  />
                  <div>
                    <span style={{ fontSize: '14px', color: '#374151', display: 'block' }}>
                      Files will be attached to emails directly rather than being added as link in the email body.
                    </span>
                  </div>
                </label>
              </div>

              {/* Google Tag Manager ID */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#1f2937',
                  marginBottom: '4px'
                }}>
                  Google Tag Manager ID
                </label>
                <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '8px' }}>
                  A Google Tag Manager ID will be added to all pages in the customer portal. Refer to{' '}
                  <a href="#" style={{ color: '#a855f7', textDecoration: 'none' }}>this guide</a> to generate the tag ID.
                </p>
                <input
                  type="text"
                  value={formData.googleTagManagerId}
                  onChange={(e) => setFormData({ ...formData, googleTagManagerId: e.target.value })}
                  placeholder="Eg: GTM-XXXXXXX"
                  style={{
                    width: '100%',
                    maxWidth: '400px',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>
          )}

          {activeTab === 'login' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '800px' }}>
              {/* Form Login Section */}
              <div>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#1f2937',
                  marginBottom: '16px',
                  paddingBottom: '8px',
                  borderBottom: '1px solid #e5e7eb'
                }}>
                  Form Login
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '16px',
                    backgroundColor: '#f9fafb',
                    borderRadius: '6px',
                    border: '1px solid #e5e7eb'
                  }}>
                    <input
                      type="checkbox"
                      checked={formData.enableFormLogin}
                      onChange={(e) => setFormData({ ...formData, enableFormLogin: e.target.checked })}
                      style={{
                        width: '18px',
                        height: '18px',
                        marginTop: '2px',
                        cursor: 'pointer'
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <label style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#1f2937',
                        marginBottom: '4px',
                        cursor: 'pointer'
                      }}>
                        Enable Form Login
                      </label>
                      <p style={{
                        fontSize: '13px',
                        color: '#6b7280',
                        margin: 0,
                        lineHeight: '1.5'
                      }}>
                        Enabling this option will allow users to sign into the customer portal using a username and password. Turning off this option will hide the form login option in the customer portal.
                      </p>
                    </div>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '16px',
                    backgroundColor: '#f9fafb',
                    borderRadius: '6px',
                    border: '1px solid #e5e7eb'
                  }}>
                    <input
                      type="checkbox"
                      checked={formData.enableGoogleRecaptcha}
                      onChange={(e) => setFormData({ ...formData, enableGoogleRecaptcha: e.target.checked })}
                      style={{
                        width: '18px',
                        height: '18px',
                        marginTop: '2px',
                        cursor: 'pointer'
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <label style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#1f2937',
                        marginBottom: '4px',
                        cursor: 'pointer'
                      }}>
                        Enable Google reCAPTCHA <span style={{ 
                          fontSize: '12px',
                          color: '#059669',
                          fontWeight: '500',
                          backgroundColor: '#d1fae5',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          marginLeft: '8px'
                        }}>recommended</span>
                      </label>
                      <p style={{
                        fontSize: '13px',
                        color: '#6b7280',
                        margin: 0,
                        lineHeight: '1.5'
                      }}>
                        Enabling this option allows users to verify with Google reCAPTCHA during sign up and sign in.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Logins Section */}
              <div>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#1f2937',
                  marginBottom: '4px'
                }}>
                  Social Logins
                </h3>
                <p style={{
                  fontSize: '13px',
                  color: '#6b7280',
                  marginBottom: '16px'
                }}>
                  Allow customers to login using their social accounts
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '14px 16px',
                    backgroundColor: '#ffffff',
                    borderRadius: '6px',
                    border: '1px solid #e5e7eb'
                  }}>
                    <input
                      type="checkbox"
                      checked={formData.socialLogins.google}
                      onChange={(e) => setFormData({
                        ...formData,
                        socialLogins: { ...formData.socialLogins, google: e.target.checked }
                      })}
                      style={{
                        width: '18px',
                        height: '18px',
                        cursor: 'pointer'
                      }}
                    />
                    <label style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#1f2937',
                      cursor: 'pointer',
                      flex: 1
                    }}>
                      Google
                    </label>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '14px 16px',
                    backgroundColor: '#ffffff',
                    borderRadius: '6px',
                    border: '1px solid #e5e7eb'
                  }}>
                    <input
                      type="checkbox"
                      checked={formData.socialLogins.facebook}
                      onChange={(e) => setFormData({
                        ...formData,
                        socialLogins: { ...formData.socialLogins, facebook: e.target.checked }
                      })}
                      style={{
                        width: '18px',
                        height: '18px',
                        cursor: 'pointer'
                      }}
                    />
                    <label style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#1f2937',
                      cursor: 'pointer',
                      flex: 1
                    }}>
                      Facebook
                    </label>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '14px 16px',
                    backgroundColor: '#ffffff',
                    borderRadius: '6px',
                    border: '1px solid #e5e7eb'
                  }}>
                    <input
                      type="checkbox"
                      checked={formData.socialLogins.microsoft}
                      onChange={(e) => setFormData({
                        ...formData,
                        socialLogins: { ...formData.socialLogins, microsoft: e.target.checked }
                      })}
                      style={{
                        width: '18px',
                        height: '18px',
                        cursor: 'pointer'
                      }}
                    />
                    <label style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#1f2937',
                      cursor: 'pointer',
                      flex: 1
                    }}>
                      Microsoft
                    </label>
                  </div>
                </div>
              </div>

              {/* Single Sign-On Section */}
              <div>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#1f2937',
                  marginBottom: '4px'
                }}>
                  Single Sign-on
                </h3>
                <p style={{
                  fontSize: '13px',
                  color: '#6b7280',
                  marginBottom: '16px'
                }}>
                  Configure your single sign-on (SSO) method using information from your identity provider.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px',
                    backgroundColor: '#ffffff',
                    borderRadius: '6px',
                    border: '1px solid #e5e7eb'
                  }}>
                    <label style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#1f2937'
                    }}>
                      OAuth 2.0
                    </label>
                    <label style={{ position: 'relative', display: 'inline-block', width: '48px', height: '24px' }}>
                      <input
                        type="checkbox"
                        checked={formData.ssoSettings.oauth20}
                        onChange={(e) => setFormData({
                          ...formData,
                          ssoSettings: { ...formData.ssoSettings, oauth20: e.target.checked }
                        })}
                        style={{ opacity: 0, width: 0, height: 0 }}
                      />
                      <span style={{
                        position: 'absolute',
                        cursor: 'pointer',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: formData.ssoSettings.oauth20 ? 'var(--primary-main)' : 'var(--border-default)',
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        borderRadius: '24px'
                      }}>
                        <span style={{
                          position: 'absolute',
                          content: '""',
                          height: '18px',
                          width: '18px',
                          left: formData.ssoSettings.oauth20 ? '26px' : '3px',
                          bottom: '3px',
                          backgroundColor: 'white',
                          transition: '0.3s',
                          borderRadius: '50%'
                        }}></span>
                      </span>
                    </label>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px',
                    backgroundColor: '#ffffff',
                    borderRadius: '6px',
                    border: '1px solid #e5e7eb'
                  }}>
                    <label style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#1f2937'
                    }}>
                      OpenID Connect
                    </label>
                    <label style={{ position: 'relative', display: 'inline-block', width: '48px', height: '24px' }}>
                      <input
                        type="checkbox"
                        checked={formData.ssoSettings.openIdConnect}
                        onChange={(e) => setFormData({
                          ...formData,
                          ssoSettings: { ...formData.ssoSettings, openIdConnect: e.target.checked }
                        })}
                        style={{ opacity: 0, width: 0, height: 0 }}
                      />
                      <span style={{
                        position: 'absolute',
                        cursor: 'pointer',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: formData.ssoSettings.openIdConnect ? 'var(--primary-main)' : 'var(--border-default)',
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        borderRadius: '24px'
                      }}>
                        <span style={{
                          position: 'absolute',
                          content: '""',
                          height: '18px',
                          width: '18px',
                          left: formData.ssoSettings.openIdConnect ? '26px' : '3px',
                          bottom: '3px',
                          backgroundColor: 'white',
                          transition: '0.3s',
                          borderRadius: '50%'
                        }}></span>
                      </span>
                    </label>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px',
                    backgroundColor: '#ffffff',
                    borderRadius: '6px',
                    border: '1px solid #e5e7eb'
                  }}>
                    <label style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#1f2937'
                    }}>
                      JWT
                    </label>
                    <label style={{ position: 'relative', display: 'inline-block', width: '48px', height: '24px' }}>
                      <input
                        type="checkbox"
                        checked={formData.ssoSettings.jwt}
                        onChange={(e) => setFormData({
                          ...formData,
                          ssoSettings: { ...formData.ssoSettings, jwt: e.target.checked }
                        })}
                        style={{ opacity: 0, width: 0, height: 0 }}
                      />
                      <span style={{
                        position: 'absolute',
                        cursor: 'pointer',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: formData.ssoSettings.jwt ? 'var(--primary-main)' : 'var(--border-default)',
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        borderRadius: '24px'
                      }}>
                        <span style={{
                          position: 'absolute',
                          content: '""',
                          height: '18px',
                          width: '18px',
                          left: formData.ssoSettings.jwt ? '26px' : '3px',
                          bottom: '3px',
                          backgroundColor: 'white',
                          transition: '0.3s',
                          borderRadius: '50%'
                        }}></span>
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '800px' }}>
              {/* General Settings Section */}
              <div>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#1f2937',
                  marginBottom: '16px',
                  paddingBottom: '8px',
                  borderBottom: '1px solid #e5e7eb'
                }}>
                  General Settings
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '16px',
                    backgroundColor: '#f9fafb',
                    borderRadius: '6px',
                    border: '1px solid #e5e7eb'
                  }}>
                    <input
                      type="checkbox"
                      checked={formData.allowUserSignup}
                      onChange={(e) => setFormData({ ...formData, allowUserSignup: e.target.checked })}
                      style={{
                        width: '18px',
                        height: '18px',
                        marginTop: '2px',
                        cursor: 'pointer'
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <label style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#1f2937',
                        marginBottom: '4px',
                        cursor: 'pointer'
                      }}>
                        Allow users to sign up from customer portal.
                      </label>
                      <p style={{
                        fontSize: '13px',
                        color: '#6b7280',
                        margin: 0,
                        lineHeight: '1.5'
                      }}>
                        Enabling this option will allow an end-user to register an account and submit a ticket.
                      </p>
                    </div>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '16px',
                    backgroundColor: '#f9fafb',
                    borderRadius: '6px',
                    border: '1px solid #e5e7eb'
                  }}>
                    <input
                      type="checkbox"
                      checked={formData.restrictSignupViaSocial}
                      onChange={(e) => setFormData({ ...formData, restrictSignupViaSocial: e.target.checked })}
                      style={{
                        width: '18px',
                        height: '18px',
                        marginTop: '2px',
                        cursor: 'pointer'
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <label style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#1f2937',
                        marginBottom: '4px',
                        cursor: 'pointer'
                      }}>
                        Restrict sign-up via social and custom SSO on customer portal.
                      </label>
                      <p style={{
                        fontSize: '13px',
                        color: '#6b7280',
                        margin: 0,
                        lineHeight: '1.5'
                      }}>
                        When enabled, users cannot create new accounts or submit tickets using social media or custom SSO logins. Only users with existing accounts can log in via SSO.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Two-Factor Authentication Section */}
              <div>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#1f2937',
                  marginBottom: '4px'
                }}>
                  Two-Factor Authentication (2FA)
                </h3>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  padding: '16px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '6px',
                  border: '1px solid #e5e7eb',
                  marginTop: '16px'
                }}>
                  <input
                    type="checkbox"
                    checked={formData.enforceTwoFactorAuth}
                    onChange={(e) => setFormData({ ...formData, enforceTwoFactorAuth: e.target.checked })}
                    style={{
                      width: '18px',
                      height: '18px',
                      marginTop: '2px',
                      cursor: 'pointer'
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#1f2937',
                      marginBottom: '4px',
                      cursor: 'pointer'
                    }}>
                      Enforce two-factor authentication (2FA) for all users
                    </label>
                    <p style={{
                      fontSize: '13px',
                      color: '#6b7280',
                      margin: 0,
                      lineHeight: '1.5'
                    }}>
                      This will require all users to set up two-factor authentication (2FA) for their accounts. Please note that these settings only apply to form logins, not to custom SSO or social logins.
                    </p>
                  </div>
                </div>
              </div>

              {/* Password Policy Section */}
              <div>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#1f2937',
                  marginBottom: '4px'
                }}>
                  Password Policy
                </h3>
                <p style={{
                  fontSize: '13px',
                  color: '#6b7280',
                  marginBottom: '16px'
                }}>
                  The password policy is only applicable if you have allowed form logins.
                </p>

                <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer'
                  }}>
                    <input
                      type="radio"
                      checked={formData.passwordPolicy === 'default'}
                      onChange={() => setFormData({ ...formData, passwordPolicy: 'default' })}
                      style={{
                        width: '18px',
                        height: '18px',
                        cursor: 'pointer'
                      }}
                    />
                    <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                      Default Policy
                    </span>
                  </label>

                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer'
                  }}>
                    <input
                      type="radio"
                      checked={formData.passwordPolicy === 'custom'}
                      onChange={() => setFormData({ ...formData, passwordPolicy: 'custom' })}
                      style={{
                        width: '18px',
                        height: '18px',
                        cursor: 'pointer'
                      }}
                    />
                    <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                      Custom Policy
                    </span>
                  </label>
                </div>

                {formData.passwordPolicy === 'custom' && (
                  <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '12px',
                    padding: '16px',
                    backgroundColor: '#f9fafb',
                    borderRadius: '6px',
                    border: '1px solid #e5e7eb'
                  }}>
                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      cursor: 'pointer'
                    }}>
                      <input
                        type="checkbox"
                        checked={formData.requireLowerCase}
                        onChange={(e) => setFormData({ ...formData, requireLowerCase: e.target.checked })}
                        style={{
                          width: '18px',
                          height: '18px',
                          cursor: 'pointer'
                        }}
                      />
                      <span style={{ fontSize: '14px', color: '#374151' }}>
                        Require at least one lower case letter (a-z).
                      </span>
                    </label>

                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      cursor: 'pointer'
                    }}>
                      <input
                        type="checkbox"
                        checked={formData.requireUpperCase}
                        onChange={(e) => setFormData({ ...formData, requireUpperCase: e.target.checked })}
                        style={{
                          width: '18px',
                          height: '18px',
                          cursor: 'pointer'
                        }}
                      />
                      <span style={{ fontSize: '14px', color: '#374151' }}>
                        Require at least one upper case letter (A-Z).
                      </span>
                    </label>

                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      cursor: 'pointer'
                    }}>
                      <input
                        type="checkbox"
                        checked={formData.requireNumber}
                        onChange={(e) => setFormData({ ...formData, requireNumber: e.target.checked })}
                        style={{
                          width: '18px',
                          height: '18px',
                          cursor: 'pointer'
                        }}
                      />
                      <span style={{ fontSize: '14px', color: '#374151' }}>
                        Require at least one number (0-9).
                      </span>
                    </label>

                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      cursor: 'pointer'
                    }}>
                      <input
                        type="checkbox"
                        checked={formData.requireSpecialChar}
                        onChange={(e) => setFormData({ ...formData, requireSpecialChar: e.target.checked })}
                        style={{
                          width: '18px',
                          height: '18px',
                          cursor: 'pointer'
                        }}
                      />
                      <span style={{ fontSize: '14px', color: '#374151' }}>
                        Require at least one special character (@!%*?"#$?()[]^~_+-=).
                      </span>
                    </label>

                    <div style={{ marginTop: '8px' }}>
                      <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                      }}>
                        <span style={{ fontSize: '14px', color: '#374151', whiteSpace: 'nowrap' }}>
                          Minimum password length
                        </span>
                        <select
                          value={formData.minimumPasswordLength}
                          onChange={(e) => setFormData({ ...formData, minimumPasswordLength: parseInt(e.target.value) })}
                          style={{
                            padding: '6px 12px',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            fontSize: '14px',
                            backgroundColor: 'white',
                            cursor: 'pointer',
                            width: '80px'
                          }}
                        >
                          {[8, 10, 12, 14, 16].map(length => (
                            <option key={length} value={length}>{length}</option>
                          ))}
                        </select>
                        <span style={{ fontSize: '14px', color: '#6b7280' }}>
                          characters.
                        </span>
                      </label>
                    </div>

                    <div style={{ marginTop: '8px' }}>
                      <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                      }}>
                        <span style={{ fontSize: '14px', color: '#374151', whiteSpace: 'nowrap' }}>
                          Password expiration
                        </span>
                        <select
                          value={formData.passwordExpiration}
                          onChange={(e) => setFormData({ ...formData, passwordExpiration: e.target.value as any })}
                          className="text-field"
                          style={{
                            minWidth: '150px',
                            width: 'auto'
                          }}
                        >
                          <option value="never">Never</option>
                          <option value="30">30 days</option>
                          <option value="60">60 days</option>
                          <option value="90">90 days</option>
                          <option value="180">180 days</option>
                        </select>
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'knowledge' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '900px' }}>
              {/* Enable KB Toggle */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px',
                backgroundColor: '#f9fafb',
                borderRadius: '6px',
                border: '1px solid #e5e7eb'
              }}>
                <label style={{
                  fontSize: '15px',
                  fontWeight: '600',
                  color: '#1f2937'
                }}>
                  Enable KB
                </label>
                <label style={{ position: 'relative', display: 'inline-block', width: '48px', height: '24px' }}>
                  <input
                    type="checkbox"
                    checked={formData.enableKB}
                    onChange={(e) => setFormData({ ...formData, enableKB: e.target.checked })}
                    style={{ opacity: 0, width: 0, height: 0 }}
                  />
                  <span style={{
                    position: 'absolute',
                    cursor: 'pointer',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: formData.enableKB ? 'var(--primary-main)' : 'var(--border-default)',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    borderRadius: '24px'
                  }}>
                    <span style={{
                      position: 'absolute',
                      content: '""',
                      height: '18px',
                      width: '18px',
                      left: formData.enableKB ? '26px' : '3px',
                      bottom: '3px',
                      backgroundColor: 'white',
                      transition: '0.3s',
                      borderRadius: '50%'
                    }}></span>
                  </span>
                </label>
              </div>

              {formData.enableKB && (
                <>
                  {/* KB Home Configuration - Expandable */}
                  <div style={{
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    overflow: 'hidden'
                  }}>
                    <button
                      type="button"
                      onClick={() => setKbHomeExpanded(!kbHomeExpanded)}
                      style={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '16px',
                        backgroundColor: '#ffffff',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '15px',
                        fontWeight: '600',
                        color: '#1f2937'
                      }}
                    >
                      KB Home Configuration
                      <span style={{ fontSize: '18px', transform: kbHomeExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.3s' }}>▼</span>
                    </button>
                    
                    {kbHomeExpanded && (
                      <div style={{ padding: '20px', backgroundColor: '#f9fafb', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {/* Banner Heading */}
                        <div>
                          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#1f2937', marginBottom: '6px' }}>
                            Banner Heading <span style={{ color: '#ef4444' }}>*</span>
                          </label>
                          <input
                            type="text"
                            value={formData.kbHomeConfiguration.bannerHeading}
                            onChange={(e) => setFormData({
                              ...formData,
                              kbHomeConfiguration: { ...formData.kbHomeConfiguration, bannerHeading: e.target.value }
                            })}
                            style={{
                              width: '100%',
                              padding: '10px 12px',
                              border: '1px solid #d1d5db',
                              borderRadius: '6px',
                              fontSize: '14px',
                              boxSizing: 'border-box'
                            }}
                          />
                        </div>

                        {/* Banner Description */}
                        <div>
                          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#1f2937', marginBottom: '6px' }}>
                            Banner Description
                          </label>
                          <textarea
                            value={formData.kbHomeConfiguration.bannerDescription}
                            onChange={(e) => setFormData({
                              ...formData,
                              kbHomeConfiguration: { ...formData.kbHomeConfiguration, bannerDescription: e.target.value }
                            })}
                            placeholder="Description"
                            rows={4}
                            style={{
                              width: '100%',
                              padding: '10px 12px',
                              border: '1px solid #d1d5db',
                              borderRadius: '6px',
                              fontSize: '14px',
                              boxSizing: 'border-box',
                              resize: 'vertical'
                            }}
                          />
                        </div>

                        {/* Banner Text Color */}
                        <div>
                          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#1f2937', marginBottom: '6px' }}>
                            Banner text color
                          </label>
                          <input
                            type="color"
                            value={formData.kbHomeConfiguration.bannerTextColor}
                            onChange={(e) => setFormData({
                              ...formData,
                              kbHomeConfiguration: { ...formData.kbHomeConfiguration, bannerTextColor: e.target.value }
                            })}
                            style={{ width: '60px', height: '40px', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer' }}
                          />
                        </div>

                        {/* Banner Background */}
                        <div>
                          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#1f2937', marginBottom: '10px' }}>
                            Banner Background
                          </label>
                          <div style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                              <input
                                type="radio"
                                checked={formData.kbHomeConfiguration.bannerBackgroundType === 'color'}
                                onChange={() => setFormData({
                                  ...formData,
                                  kbHomeConfiguration: { ...formData.kbHomeConfiguration, bannerBackgroundType: 'color' }
                                })}
                                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                              />
                              <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>Background Color</span>
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                              <input
                                type="radio"
                                checked={formData.kbHomeConfiguration.bannerBackgroundType === 'image'}
                                onChange={() => setFormData({
                                  ...formData,
                                  kbHomeConfiguration: { ...formData.kbHomeConfiguration, bannerBackgroundType: 'image' }
                                })}
                                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                              />
                              <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>Background Image</span>
                            </label>
                          </div>
                          {formData.kbHomeConfiguration.bannerBackgroundType === 'color' ? (
                            <input
                              type="color"
                              value={formData.kbHomeConfiguration.bannerBackgroundColor}
                              onChange={(e) => setFormData({
                                ...formData,
                                kbHomeConfiguration: { ...formData.kbHomeConfiguration, bannerBackgroundColor: e.target.value }
                              })}
                              style={{ width: '60px', height: '40px', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer' }}
                            />
                          ) : (
                            <div>
                              <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '8px' }}>
                                Maximum file size: 2MB<br />Best dimensions: 1200×300 pixels
                              </p>
                              <button 
                                type="button" 
                                className="btn btn-cta"
                                style={{ 
                                  textTransform: 'none',
                                  marginRight: 'var(--spacing-2)'
                                }}
                              >
                                Upload image
                              </button>
                              {formData.kbHomeConfiguration.bannerBackgroundImage && (
                                <button type="button" style={{
                                  padding: '8px 16px',
                                  backgroundColor: 'white',
                                  color: '#374151',
                                  border: '1px solid #d1d5db',
                                  borderRadius: '6px',
                                  cursor: 'pointer',
                                  fontSize: '14px'
                                }}>Preview</button>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Show Popular Articles */}
                        <div>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                            <input
                              type="checkbox"
                              checked={formData.kbHomeConfiguration.showPopularArticles}
                              onChange={(e) => setFormData({
                                ...formData,
                                kbHomeConfiguration: { ...formData.kbHomeConfiguration, showPopularArticles: e.target.checked }
                              })}
                              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                            />
                            <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>Show popular articles</span>
                          </label>
                          {formData.kbHomeConfiguration.showPopularArticles && (
                            <div style={{ marginTop: '12px', marginLeft: '30px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <label style={{ fontSize: '14px', color: '#374151' }}>Number of articles to show</label>
                              <input
                                type="number"
                                value={formData.kbHomeConfiguration.popularArticlesCount}
                                onChange={(e) => setFormData({
                                  ...formData,
                                  kbHomeConfiguration: { ...formData.kbHomeConfiguration, popularArticlesCount: parseInt(e.target.value) || 10 }
                                })}
                                min="1"
                                max="20"
                                style={{
                                  width: '80px',
                                  padding: '6px 12px',
                                  border: '1px solid #d1d5db',
                                  borderRadius: '6px',
                                  fontSize: '14px'
                                }}
                              />
                            </div>
                          )}
                        </div>

                        {/* Portal Viewable By */}
                        <div>
                          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#1f2937', marginBottom: '10px' }}>
                            This portal can be viewed by:
                          </label>
                          <div style={{ display: 'flex', gap: '16px' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                              <input
                                type="radio"
                                checked={formData.kbHomeConfiguration.portalViewableBy === 'all'}
                                onChange={() => setFormData({
                                  ...formData,
                                  kbHomeConfiguration: { ...formData.kbHomeConfiguration, portalViewableBy: 'all' }
                                })}
                                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                              />
                              <span style={{ fontSize: '14px', color: '#1f2937' }}>All Users</span>
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                              <input
                                type="radio"
                                checked={formData.kbHomeConfiguration.portalViewableBy === 'loggedin'}
                                onChange={() => setFormData({
                                  ...formData,
                                  kbHomeConfiguration: { ...formData.kbHomeConfiguration, portalViewableBy: 'loggedin' }
                                })}
                                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                              />
                              <span style={{ fontSize: '14px', color: '#1f2937' }}>Logged-in Users</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Article Configuration - Expandable */}
                  <div style={{
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    overflow: 'hidden'
                  }}>
                    <button
                      type="button"
                      onClick={() => setArticleConfigExpanded(!articleConfigExpanded)}
                      style={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '16px',
                        backgroundColor: '#ffffff',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '15px',
                        fontWeight: '600',
                        color: '#1f2937'
                      }}
                    >
                      Article Configuration
                      <span style={{ fontSize: '18px', transform: articleConfigExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.3s' }}>▼</span>
                    </button>
                    
                    {articleConfigExpanded && (
                      <div style={{ padding: '20px', backgroundColor: '#f9fafb', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {[
                          { key: 'showAuthorName', label: "Show author's name" },
                          { key: 'showPublishedDate', label: 'Show published date' },
                          { key: 'showLastUpdatedDate', label: 'Show last updated date' },
                          { key: 'enableTableOfContents', label: 'Enable table of contents' },
                          { key: 'excludeAgentViewCount', label: 'Exclude Agent View Count on Article' },
                          { key: 'showArticleTags', label: 'Show article tags' },
                          { key: 'enableStatusIndicator', label: 'Enable Status Indicator' },
                          { key: 'showEstimatedReadTime', label: 'Show estimated read time' },
                          { key: 'showComments', label: 'Show comments' },
                          { key: 'showPreviousNextNavigation', label: 'Show previous / next navigation' }
                        ].map(item => (
                          <label key={item.key} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                            <input
                              type="checkbox"
                              checked={formData.articleConfiguration[item.key as keyof typeof formData.articleConfiguration] as boolean}
                              onChange={(e) => setFormData({
                                ...formData,
                                articleConfiguration: { ...formData.articleConfiguration, [item.key]: e.target.checked }
                              })}
                              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                            />
                            <span style={{ fontSize: '14px', color: '#374151' }}>{item.label}</span>
                          </label>
                        ))}

                        {/* Show Related Articles with count */}
                        <div>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                            <input
                              type="checkbox"
                              checked={formData.articleConfiguration.showRelatedArticles}
                              onChange={(e) => setFormData({
                                ...formData,
                                articleConfiguration: { ...formData.articleConfiguration, showRelatedArticles: e.target.checked }
                              })}
                              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                            />
                            <span style={{ fontSize: '14px', color: '#374151' }}>Show related articles</span>
                          </label>
                          {formData.articleConfiguration.showRelatedArticles && (
                            <div style={{ marginTop: '8px', marginLeft: '30px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <label style={{ fontSize: '14px', color: '#374151' }}>Number of articles to show</label>
                              <input
                                type="number"
                                value={formData.articleConfiguration.relatedArticlesCount}
                                onChange={(e) => setFormData({
                                  ...formData,
                                  articleConfiguration: { ...formData.articleConfiguration, relatedArticlesCount: parseInt(e.target.value) || 5 }
                                })}
                                min="1"
                                max="20"
                                style={{
                                  width: '80px',
                                  padding: '6px 12px',
                                  border: '1px solid #d1d5db',
                                  borderRadius: '6px',
                                  fontSize: '14px'
                                }}
                              />
                            </div>
                          )}
                        </div>

                        {/* Show Recent Articles with count */}
                        <div>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                            <input
                              type="checkbox"
                              checked={formData.articleConfiguration.showRecentArticles}
                              onChange={(e) => setFormData({
                                ...formData,
                                articleConfiguration: { ...formData.articleConfiguration, showRecentArticles: e.target.checked }
                              })}
                              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                            />
                            <span style={{ fontSize: '14px', color: '#374151' }}>Show recent articles</span>
                          </label>
                          {formData.articleConfiguration.showRecentArticles && (
                            <div style={{ marginTop: '8px', marginLeft: '30px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <label style={{ fontSize: '14px', color: '#374151' }}>Number of articles to show</label>
                              <input
                                type="number"
                                value={formData.articleConfiguration.recentArticlesCount}
                                onChange={(e) => setFormData({
                                  ...formData,
                                  articleConfiguration: { ...formData.articleConfiguration, recentArticlesCount: parseInt(e.target.value) || 5 }
                                })}
                                min="1"
                                max="20"
                                style={{
                                  width: '80px',
                                  padding: '6px 12px',
                                  border: '1px solid #d1d5db',
                                  borderRadius: '6px',
                                  fontSize: '14px'
                                }}
                              />
                            </div>
                          )}
                        </div>

                        {/* Show Same Category Articles */}
                        <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={formData.articleConfiguration.showSameCategoryArticles}
                            onChange={(e) => setFormData({
                              ...formData,
                              articleConfiguration: { ...formData.articleConfiguration, showSameCategoryArticles: e.target.checked }
                            })}
                            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                          />
                          <span style={{ fontSize: '14px', color: '#374151' }}>Show articles in the same category or section</span>
                        </label>

                        {/* Show Share Option with platforms */}
                        <div>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                            <input
                              type="checkbox"
                              checked={formData.articleConfiguration.showShareOption}
                              onChange={(e) => setFormData({
                                ...formData,
                                articleConfiguration: { ...formData.articleConfiguration, showShareOption: e.target.checked }
                              })}
                              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                            />
                            <span style={{ fontSize: '14px', color: '#374151' }}>Show share option</span>
                          </label>
                          {formData.articleConfiguration.showShareOption && (
                            <div style={{ marginTop: '8px', marginLeft: '30px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              {[
                                { key: 'shareOnFacebook', label: 'Facebook' },
                                { key: 'shareOnTwitter', label: 'Twitter' },
                                { key: 'shareOnLinkedIn', label: 'LinkedIn' },
                                { key: 'shareViaEmail', label: 'Email' }
                              ].map(item => (
                                <label key={item.key} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                                  <input
                                    type="checkbox"
                                    checked={formData.articleConfiguration[item.key as keyof typeof formData.articleConfiguration] as boolean}
                                    onChange={(e) => setFormData({
                                      ...formData,
                                      articleConfiguration: { ...formData.articleConfiguration, [item.key]: e.target.checked }
                                    })}
                                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                  />
                                  <span style={{ fontSize: '14px', color: '#374151' }}>{item.label}</span>
                                </label>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* AI Assistance & Satisfaction Feedback Toggles */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '16px',
                      backgroundColor: '#ffffff',
                      borderRadius: '6px',
                      border: '1px solid #e5e7eb'
                    }}>
                      <div>
                        <label style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', display: 'block', marginBottom: '4px' }}>
                          Enable AI assistance in KB search
                        </label>
                      </div>
                      <label style={{ position: 'relative', display: 'inline-block', width: '48px', height: '24px' }}>
                        <input
                          type="checkbox"
                          checked={formData.enableAIAssistance}
                          onChange={(e) => setFormData({ ...formData, enableAIAssistance: e.target.checked })}
                          style={{ opacity: 0, width: 0, height: 0 }}
                        />
                        <span style={{
                          position: 'absolute',
                          cursor: 'pointer',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          backgroundColor: formData.enableAIAssistance ? 'var(--primary-main)' : 'var(--border-default)',
                          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                          borderRadius: '24px'
                        }}>
                          <span style={{
                            position: 'absolute',
                            height: '18px',
                            width: '18px',
                            left: formData.enableAIAssistance ? '26px' : '3px',
                            bottom: '3px',
                            backgroundColor: 'white',
                            transition: '0.3s',
                            borderRadius: '50%'
                          }}></span>
                        </span>
                      </label>
                    </div>

                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      padding: '16px',
                      backgroundColor: '#ffffff',
                      borderRadius: '6px',
                      border: '1px solid #e5e7eb',
                      gap: '16px'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}>
                        <label style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                          Enable Satisfaction Feedback
                        </label>
                        <label style={{ position: 'relative', display: 'inline-block', width: '48px', height: '24px' }}>
                          <input
                            type="checkbox"
                            checked={formData.enableSatisfactionFeedback}
                            onChange={(e) => setFormData({ ...formData, enableSatisfactionFeedback: e.target.checked })}
                            style={{ opacity: 0, width: 0, height: 0 }}
                          />
                          <span style={{
                            position: 'absolute',
                            cursor: 'pointer',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: formData.enableSatisfactionFeedback ? 'var(--primary-main)' : 'var(--border-default)',
                            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                            borderRadius: '24px'
                          }}>
                            <span style={{
                              position: 'absolute',
                              height: '18px',
                              width: '18px',
                              left: formData.enableSatisfactionFeedback ? '26px' : '3px',
                              bottom: '3px',
                              backgroundColor: 'white',
                              transition: '0.3s',
                              borderRadius: '50%'
                            }}></span>
                          </span>
                        </label>
                      </div>

                      {formData.enableSatisfactionFeedback && (
                        <div style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '20px',
                          paddingTop: '16px',
                          borderTop: '1px solid #e5e7eb'
                        }}>
                          {/* Info Message */}
                          <div>
                            <label style={{
                              display: 'block',
                              fontSize: '14px',
                              fontWeight: '600',
                              color: '#1f2937',
                              marginBottom: '6px'
                            }}>
                              Info Message <span style={{ color: '#ef4444' }}>*</span>
                            </label>
                            <textarea
                              value={formData.satisfactionFeedback.infoMessage}
                              onChange={(e) => setFormData({
                                ...formData,
                                satisfactionFeedback: { ...formData.satisfactionFeedback, infoMessage: e.target.value }
                              })}
                              rows={2}
                              style={{
                                width: '100%',
                                padding: '10px 12px',
                                border: '1px solid #d1d5db',
                                borderRadius: '6px',
                                fontSize: '14px',
                                boxSizing: 'border-box',
                                resize: 'vertical'
                              }}
                            />
                          </div>

                          {/* Vote Type */}
                          <div>
                            <label style={{
                              display: 'block',
                              fontSize: '14px',
                              fontWeight: '600',
                              color: '#1f2937',
                              marginBottom: '12px'
                            }}>
                              Vote Type <span style={{ color: '#ef4444' }}>*</span>
                            </label>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                <input
                                  type="radio"
                                  checked={formData.satisfactionFeedback.voteType === 'like'}
                                  onChange={() => setFormData({
                                    ...formData,
                                    satisfactionFeedback: { ...formData.satisfactionFeedback, voteType: 'like' }
                                  })}
                                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                />
                                <span style={{ fontSize: '14px', color: '#374151' }}>👍 Like 👎 Dislike</span>
                              </label>
                              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                <input
                                  type="radio"
                                  checked={formData.satisfactionFeedback.voteType === 'upvote'}
                                  onChange={() => setFormData({
                                    ...formData,
                                    satisfactionFeedback: { ...formData.satisfactionFeedback, voteType: 'upvote' }
                                  })}
                                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                />
                                <span style={{ fontSize: '14px', color: '#374151' }}>⬆ Upvote ⬇ Downvote</span>
                              </label>
                              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                <input
                                  type="radio"
                                  checked={formData.satisfactionFeedback.voteType === 'yesno'}
                                  onChange={() => setFormData({
                                    ...formData,
                                    satisfactionFeedback: { ...formData.satisfactionFeedback, voteType: 'yesno' }
                                  })}
                                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                />
                                <span style={{ fontSize: '14px', color: '#374151' }}>✓ Yes ✗ No</span>
                              </label>
                            </div>
                          </div>

                          {/* Vote Label */}
                          <div>
                            <label style={{
                              display: 'block',
                              fontSize: '14px',
                              fontWeight: '600',
                              color: '#1f2937',
                              marginBottom: '8px'
                            }}>
                              Vote Label <span style={{ color: '#ef4444' }}>*</span>
                            </label>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                              <input
                                type="text"
                                value={formData.satisfactionFeedback.voteLabels.positive}
                                onChange={(e) => setFormData({
                                  ...formData,
                                  satisfactionFeedback: {
                                    ...formData.satisfactionFeedback,
                                    voteLabels: { ...formData.satisfactionFeedback.voteLabels, positive: e.target.value }
                                  }
                                })}
                                placeholder="👍 Like"
                                style={{
                                  padding: '10px 12px',
                                  border: '1px solid #d1d5db',
                                  borderRadius: '6px',
                                  fontSize: '14px'
                                }}
                              />
                              <input
                                type="text"
                                value={formData.satisfactionFeedback.voteLabels.negative}
                                onChange={(e) => setFormData({
                                  ...formData,
                                  satisfactionFeedback: {
                                    ...formData.satisfactionFeedback,
                                    voteLabels: { ...formData.satisfactionFeedback.voteLabels, negative: e.target.value }
                                  }
                                })}
                                placeholder="👎 Dislike"
                                style={{
                                  padding: '10px 12px',
                                  border: '1px solid #d1d5db',
                                  borderRadius: '6px',
                                  fontSize: '14px'
                                }}
                              />
                            </div>
                          </div>

                          {/* Feedback Message */}
                          <div>
                            <label style={{
                              display: 'block',
                              fontSize: '14px',
                              fontWeight: '600',
                              color: '#1f2937',
                              marginBottom: '8px'
                            }}>
                              Feedback Message
                            </label>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              {formData.satisfactionFeedback.feedbackMessages.map((msg: string, index: number) => (
                                <div key={index} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                  <input
                                    type="text"
                                    value={msg}
                                    onChange={(e) => {
                                      const newMessages = [...formData.satisfactionFeedback.feedbackMessages];
                                      newMessages[index] = e.target.value;
                                      setFormData({
                                        ...formData,
                                        satisfactionFeedback: { ...formData.satisfactionFeedback, feedbackMessages: newMessages }
                                      });
                                    }}
                                    style={{
                                      flex: 1,
                                      padding: '10px 12px',
                                      border: '1px solid #d1d5db',
                                      borderRadius: '6px',
                                      fontSize: '14px'
                                    }}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newMessages = formData.satisfactionFeedback.feedbackMessages.filter((_: any, i: number) => i !== index);
                                      setFormData({
                                        ...formData,
                                        satisfactionFeedback: { ...formData.satisfactionFeedback, feedbackMessages: newMessages }
                                      });
                                    }}
                                    style={{
                                      padding: '8px 12px',
                                      backgroundColor: 'white',
                                      border: '1px solid #fca5a5',
                                      borderRadius: '6px',
                                      color: '#ef4444',
                                      cursor: 'pointer',
                                      fontSize: '16px'
                                    }}
                                  >
                                    🗑
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Success Message */}
                          <div>
                            <label style={{
                              display: 'block',
                              fontSize: '14px',
                              fontWeight: '600',
                              color: '#1f2937',
                              marginBottom: '6px'
                            }}>
                              Success Message <span style={{ color: '#ef4444' }}>*</span>
                            </label>
                            <textarea
                              value={formData.satisfactionFeedback.successMessage}
                              onChange={(e) => setFormData({
                                ...formData,
                                satisfactionFeedback: { ...formData.satisfactionFeedback, successMessage: e.target.value }
                              })}
                              rows={2}
                              style={{
                                width: '100%',
                                padding: '10px 12px',
                                border: '1px solid #d1d5db',
                                borderRadius: '6px',
                                fontSize: '14px',
                                boxSizing: 'border-box',
                                resize: 'vertical'
                              }}
                            />
                          </div>

                          {/* Consent Message */}
                          <div>
                            <label style={{
                              display: 'block',
                              fontSize: '14px',
                              fontWeight: '600',
                              color: '#1f2937',
                              marginBottom: '6px'
                            }}>
                              Consent Message
                            </label>
                            <textarea
                              value={formData.satisfactionFeedback.consentMessage}
                              onChange={(e) => setFormData({
                                ...formData,
                                satisfactionFeedback: { ...formData.satisfactionFeedback, consentMessage: e.target.value }
                              })}
                              rows={2}
                              style={{
                                width: '100%',
                                padding: '10px 12px',
                                border: '1px solid #d1d5db',
                                borderRadius: '6px',
                                fontSize: '14px',
                                boxSizing: 'border-box',
                                resize: 'vertical'
                              }}
                            />
                            <p style={{
                              fontSize: '12px',
                              color: '#6b7280',
                              marginTop: '6px',
                              lineHeight: '1.5'
                            }}>
                              This message will be shown in the feedback. You can also add a link to the text. Example: &lt;a href = "https://yourcompany.com/privacy"&gt;Privacy Policy&lt;/a&gt;. When an anonymous user submits feedback, the consent message will be displayed.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* SEO - Expandable */}
                  <div style={{
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    overflow: 'hidden'
                  }}>
                    <button
                      type="button"
                      onClick={() => setSeoExpanded(!seoExpanded)}
                      style={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '16px',
                        backgroundColor: '#ffffff',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '15px',
                        fontWeight: '600',
                        color: '#1f2937'
                      }}
                    >
                      SEO
                      <span style={{ fontSize: '18px', transform: seoExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.3s' }}>▼</span>
                    </button>
                    
                    {seoExpanded && (
                      <div style={{ padding: '20px', backgroundColor: '#f9fafb', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{
                          backgroundColor: '#dbeafe',
                          border: '1px solid #93c5fd',
                          borderRadius: '6px',
                          padding: '12px',
                          fontSize: '13px',
                          color: '#1e40af'
                        }}>
                          ℹ️ Sitemap and robots.txt generation are only available for custom domain mapped portals.
                        </div>

                        {/* Sitemap */}
                        <div>
                          <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937', marginBottom: '12px' }}>Sitemap</h4>
                          <div style={{ marginBottom: '12px' }}>
                            <label style={{ display: 'block', fontSize: '14px', color: '#374151', marginBottom: '6px' }}>
                              Change Frequency
                            </label>
                            <select
                              value={formData.seoSettings.changeFrequency}
                              onChange={(e) => setFormData({
                                ...formData,
                                seoSettings: { ...formData.seoSettings, changeFrequency: e.target.value as any }
                              })}
                              className="text-field"
                              style={{
                                width: '200px'
                              }}
                            >
                              <option value="always">Always</option>
                              <option value="hourly">Hourly</option>
                              <option value="daily">Daily</option>
                              <option value="weekly">Weekly</option>
                              <option value="monthly">Monthly</option>
                              <option value="yearly">Yearly</option>
                              <option value="never">Never</option>
                            </select>
                          </div>
                          <div>
                            <label style={{ display: 'block', fontSize: '14px', color: '#374151', marginBottom: '6px' }}>
                              Sitemap Url
                            </label>
                            <input
                              type="text"
                              value={formData.seoSettings.sitemapUrl}
                              readOnly
                              placeholder="https://htf.bolddesk.com/sitemap.xml"
                              style={{
                                width: '100%',
                                padding: '10px 12px',
                                border: '1px solid #d1d5db',
                                borderRadius: '6px',
                                fontSize: '14px',
                                backgroundColor: '#f3f4f6',
                                boxSizing: 'border-box'
                              }}
                            />
                          </div>
                        </div>

                        {/* Robots.txt */}
                        <div>
                          <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937', marginBottom: '8px' }}>Robots.txt</h4>
                          <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '12px' }}>
                            A robots.txt file tells search engine crawlers which pages or files they can or can't request from your site.
                          </p>
                          <textarea
                            value={formData.seoSettings.robotsTxt}
                            onChange={(e) => setFormData({
                              ...formData,
                              seoSettings: { ...formData.seoSettings, robotsTxt: e.target.value }
                            })}
                            placeholder="Robots.txt"
                            rows={3}
                            style={{
                              width: '100%',
                              padding: '10px 12px',
                              border: '1px solid #d1d5db',
                              borderRadius: '6px',
                              fontSize: '14px',
                              boxSizing: 'border-box',
                              resize: 'vertical',
                              marginBottom: '12px'
                            }}
                          />
                          <div>
                            <label style={{ display: 'block', fontSize: '14px', color: '#374151', marginBottom: '6px' }}>
                              Robots.txt URL
                            </label>
                            <input
                              type="text"
                              value={formData.seoSettings.robotsTxtUrl}
                              readOnly
                              placeholder="https://htf.bolddesk.com/robots.txt"
                              style={{
                                width: '100%',
                                padding: '10px 12px',
                                border: '1px solid #d1d5db',
                                borderRadius: '6px',
                                fontSize: '14px',
                                backgroundColor: '#f3f4f6',
                                boxSizing: 'border-box'
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === 'customization' && (
            <div style={{ padding: '24px' }}>
              {/* Login Page */}
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>
                  Login Page
                </h3>
                
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Background Image
                  </label>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>
                    Maximum file size: 2MB<br/>
                    Best dimensions: 1920 × 1080 pixels
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {formData.loginPageBackgroundImageUrl && (
                      <img 
                        src={formData.loginPageBackgroundImageUrl} 
                        alt="Login background preview" 
                        style={{ 
                          width: '120px', 
                          height: '68px', 
                          objectFit: 'cover', 
                          borderRadius: '4px',
                          border: '1px solid #e5e7eb'
                        }} 
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => document.getElementById('loginBgImageInput')?.click()}
                      style={{
                        padding: '8px 16px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        backgroundColor: 'white',
                        color: '#374151',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer'
                      }}
                    >
                      Upload Image
                    </button>
                    <input
                      id="loginBgImageInput"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setFormData({
                            ...formData,
                            loginPageBackgroundImage: file,
                            loginPageBackgroundImageUrl: URL.createObjectURL(file)
                          });
                        }
                      }}
                      style={{ display: 'none' }}
                    />
                  </div>
                </div>
              </div>

              {/* Theme Customization */}
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>
                  Theme Customization
                </h3>
                
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="themeMode"
                      value="light"
                      checked={formData.themeMode === 'light'}
                      onChange={(e) => setFormData({ ...formData, themeMode: 'light' })}
                      style={{ cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>Light</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="themeMode"
                      value="dark"
                      checked={formData.themeMode === 'dark'}
                      onChange={(e) => setFormData({ ...formData, themeMode: 'dark' })}
                      style={{ cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>Dark</span>
                  </label>
                </div>

                <div style={{ marginBottom: '20px', opacity: formData.themeMode === 'dark' ? 0.5 : 1, pointerEvents: formData.themeMode === 'dark' ? 'none' : 'auto' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Theme Color {formData.themeMode === 'dark' && <span style={{ fontSize: '12px', fontWeight: '400', color: '#6b7280' }}>(Not applicable for dark theme)</span>}
                  </label>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>
                    Select a color for the overall theme of the customer portal.
                  </div>
                  
                  {/* Color Palette */}
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                    {[
                      '#444ce7', '#3b82f6', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899',
                      '#84cc16', '#22c55e', '#14b8a6', '#eab308', '#f97316', '#ef4444'
                    ].map(color => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setFormData({ ...formData, themeColor: color })}
                        disabled={formData.themeMode === 'dark'}
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '4px',
                          backgroundColor: color,
                          border: formData.themeColor === color ? '2px solid #111827' : '2px solid transparent',
                          cursor: formData.themeMode === 'dark' ? 'not-allowed' : 'pointer',
                          position: 'relative'
                        }}
                      >
                        {formData.themeColor === color && (
                          <span style={{ 
                            position: 'absolute', 
                            top: '50%', 
                            left: '50%', 
                            transform: 'translate(-50%, -50%)',
                            color: 'white',
                            fontSize: '16px'
                          }}>✓</span>
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Custom Color Input */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <input
                      type="color"
                      value={formData.themeColor}
                      onChange={(e) => setFormData({ ...formData, themeColor: e.target.value })}
                      disabled={formData.themeMode === 'dark'}
                      style={{
                        width: '48px',
                        height: '40px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        cursor: formData.themeMode === 'dark' ? 'not-allowed' : 'pointer'
                      }}
                    />
                    <input
                      type="text"
                      value={formData.themeColor}
                      onChange={(e) => setFormData({ ...formData, themeColor: e.target.value })}
                      placeholder="#444ce7"
                      disabled={formData.themeMode === 'dark'}
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px',
                        fontFamily: 'monospace',
                        backgroundColor: formData.themeMode === 'dark' ? '#f3f4f6' : 'white',
                        cursor: formData.themeMode === 'dark' ? 'not-allowed' : 'text'
                      }}
                    />
                    <button
                      type="button"
                      disabled={formData.themeMode === 'dark'}
                      style={{
                        padding: '8px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        backgroundColor: 'white',
                        cursor: formData.themeMode === 'dark' ? 'not-allowed' : 'pointer',
                        fontSize: '20px'
                      }}
                    >
                      🎨
                    </button>
                  </div>
                </div>
              </div>

              {/* Advanced Customization */}
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>
                  Advanced Customization
                </h3>
                
                {/* Warning Message */}
                <div style={{
                  padding: '12px 16px',
                  backgroundColor: '#fef3c7',
                  border: '1px solid #fde047',
                  borderRadius: '6px',
                  marginBottom: '20px',
                  display: 'flex',
                  gap: '12px'
                }}>
                  <span style={{ fontSize: '20px' }}>ℹ️</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '13px', color: '#92400e', margin: 0 }}>
                      Any custom code you add to the customer portal is your responsibility. Please take care when making these modifications because they could impact your customer experience. When incorporating CSS or JS, please use proper syntax.
                    </p>
                  </div>
                </div>

                {/* Custom CSS */}
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                      Custom CSS
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowCustomCSSModal(true)}
                      style={{
                        padding: '4px 12px',
                        border: 'none',
                        backgroundColor: 'transparent',
                        color: '#a855f7',
                        fontSize: '13px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        textDecoration: 'none'
                      }}
                    >
                      Add Custom CSS
                    </button>
                  </div>
                </div>

                {/* Custom JS */}
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                      Custom JS
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowCustomJSModal(true)}
                      style={{
                        padding: '4px 12px',
                        border: 'none',
                        backgroundColor: 'transparent',
                        color: '#a855f7',
                        fontSize: '13px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        textDecoration: 'none'
                      }}
                    >
                      Add Custom JS
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
            </div>

            {/* Form Footer - Inside Form */}
            <div style={{
              padding: '20px 40px',
              borderTop: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#ffffff'
            }}>
              <button
                type="button"
                style={{
                  padding: '0',
                  border: 'none',
                  background: 'transparent',
                  color: '#6b7280',
                  fontSize: '14px',
                  fontWeight: '400',
                  cursor: 'pointer',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  transition: 'color 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#3F41D1'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#6b7280'}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 14A6 6 0 108 2a6 6 0 000 12z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8 10.67V8M8 5.33h.007" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Learn more
              </button>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={() => setShowDiscardConfirm(true)}
                  className="btn"
                  style={{ 
                    textTransform: 'none',
                    backgroundColor: 'transparent',
                    border: '1px solid #d1d5db',
                    color: '#6b7280',
                    fontWeight: '500',
                    padding: '10px 20px',
                    height: '40px',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f9fafb';
                    e.currentTarget.style.borderColor = '#9ca3af';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.borderColor = '#d1d5db';
                  }}
                >
                  {i18n.language === 'en' ? 'Discard' : 'रद्द करा'}
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn"
                  style={{ 
                    textTransform: 'none',
                    backgroundColor: saving ? '#9ca3af' : '#3F41D1',
                    border: 'none',
                    color: '#ffffff',
                    fontWeight: '600',
                    padding: '10px 24px',
                    height: '40px',
                    minWidth: '120px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    cursor: saving ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: saving ? 'none' : '0 1px 2px rgba(0, 0, 0, 0.05)'
                  }}
                  onMouseEnter={(e) => {
                    if (!saving) {
                      e.currentTarget.style.backgroundColor = '#2E31A8';
                      e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!saving) {
                      e.currentTarget.style.backgroundColor = '#3F41D1';
                      e.currentTarget.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.05)';
                    }
                  }}
                >
                  {saving && (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ animation: 'spin 1s linear infinite' }}>
                      <path d="M8 2v2M8 12v2M14 8h-2M4 8H2M12.657 12.657l-1.414-1.414M4.757 4.757L3.343 3.343M12.657 3.343l-1.414 1.414M4.757 11.243l-1.414 1.414" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                  {saving ? (i18n.language === 'en' ? 'Saving...' : 'जतन करत आहे...') : (i18n.language === 'en' ? 'Update Project' : 'अपडेट करा')}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Discard Confirmation Modal */}
      {showDiscardConfirm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10002
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            width: '90%',
            maxWidth: '440px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            overflow: 'hidden'
          }}>
            {/* Icon and Title */}
            <div style={{ padding: '24px 24px 20px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px'
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 style={{
                margin: '0 0 8px 0',
                fontSize: '18px',
                fontWeight: '600',
                color: '#111827'
              }}>
                Discard Changes?
              </h3>
              <p style={{
                margin: '0',
                fontSize: '14px',
                color: '#6b7280',
                lineHeight: '1.5'
              }}>
                Are you sure you want to discard all changes? This action cannot be undone.
              </p>
            </div>

            {/* Actions */}
            <div style={{
              padding: '16px 24px 24px',
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end'
            }}>
              <button
                type="button"
                onClick={() => setShowDiscardConfirm(false)}
                style={{
                  padding: '10px 20px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  backgroundColor: 'white',
                  color: '#6b7280',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f9fafb';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowDiscardConfirm(false);
                  onClose();
                }}
                style={{
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '6px',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#dc2626';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#ef4444';
                }}
              >
                Yes, Discard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Map Custom Domain Modal */}
      {showMapModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10001
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            width: '90%',
            maxWidth: '500px',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
          }}>
            {/* Modal Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '20px 24px',
              borderBottom: '1px solid #e5e7eb'
            }}>
              <h3 style={{
                margin: 0,
                fontSize: '18px',
                fontWeight: '600',
                color: '#1f2937'
              }}>
                Map Custom Domain
              </h3>
              <button
                onClick={() => setShowMapModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#6b7280',
                  padding: '0',
                  width: '30px',
                  height: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ×
              </button>
            </div>

            {/* Modal Content */}
            <div style={{ padding: '24px' }}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#1f2937',
                  marginBottom: '8px'
                }}>
                  Custom Domain Path <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 12px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  backgroundColor: '#f9fafb',
                  fontSize: '14px',
                  color: '#374151'
                }}>
                  <span style={{ color: '#6b7280' }}>https://www.hubblehox.com/</span>
                  <span style={{ 
                    color: '#a855f7', 
                    fontWeight: '500',
                    flex: 1
                  }}>
                    {formData.portalUrl || 'domain_name'}
                  </span>
                </div>
                {!formData.portalUrl && (
                  <p style={{ 
                    fontSize: '13px', 
                    color: '#ef4444', 
                    marginTop: '4px',
                    marginBottom: 0
                  }}>
                    This field is required.
                  </p>
                )}
              </div>

              <div style={{
                backgroundColor: '#f0f9ff',
                border: '1px solid #bae6fd',
                borderRadius: '6px',
                padding: '16px',
                marginBottom: '20px'
              }}>
                <p style={{ 
                  fontSize: '14px', 
                  color: '#0c4a6e',
                  margin: '0 0 12px 0',
                  fontWeight: '500'
                }}>
                  Domain Path Configuration:
                </p>
                <p style={{ 
                  fontSize: '13px', 
                  color: '#0369a1',
                  margin: '0 0 8px 0',
                  lineHeight: '1.5'
                }}>
                  Your custom domain path will be used to access the customer portal (help center). 
                  To access the agent portal, add <strong>/agent</strong> at the end of the URL.
                </p>
                <p style={{ 
                  fontSize: '13px', 
                  color: '#0369a1',
                  margin: '0',
                  lineHeight: '1.5'
                }}>
                  <strong>Example:</strong>
                  <br />
                  • Customer Portal: <code style={{ 
                    backgroundColor: '#e0f2fe', 
                    padding: '2px 6px', 
                    borderRadius: '3px',
                    fontSize: '12px'
                  }}>https://www.hubblehox.com/{formData.portalUrl || 'domain_name'}</code>
                  <br />
                  • Agent Portal: <code style={{ 
                    backgroundColor: '#e0f2fe', 
                    padding: '2px 6px', 
                    borderRadius: '3px',
                    fontSize: '12px'
                  }}>https://www.hubblehox.com/{formData.portalUrl || 'domain_name'}/agent</code>
                </p>
              </div>

              <div style={{
                backgroundColor: '#fef3c7',
                border: '1px solid #fde047',
                borderRadius: '6px',
                padding: '16px',
                marginBottom: '20px'
              }}>
                <p style={{ 
                  fontSize: '14px', 
                  color: '#92400e',
                  margin: '0 0 8px 0',
                  fontWeight: '500'
                }}>
                  Note:
                </p>
                <p style={{ 
                  fontSize: '13px', 
                  color: '#a16207',
                  margin: '0',
                  lineHeight: '1.5'
                }}>
                  The domain path must be unique and will be mapped to your organization's portal. 
                  Changes may take a few minutes to propagate across the system.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px',
              padding: '16px 24px',
              borderTop: '1px solid #e5e7eb'
            }}>
              <button
                type="button"
                onClick={() => setShowMapModal(false)}
                style={{
                  padding: '10px 24px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  backgroundColor: 'white',
                  color: '#374151',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (formData.portalUrl) {
                    // Here you can add logic to save/map the domain
                    setShowMapModal(false);
                    alert(`Domain path "${formData.portalUrl}" has been mapped successfully!`);
                  }
                }}
                disabled={!formData.portalUrl}
                className="btn btn-cta"
                style={{ textTransform: 'none' }}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Custom CSS Modal */}
      {showCustomCSSModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10001
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            width: '90%',
            maxWidth: '600px',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
          }}>
            {/* Modal Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '20px 24px',
              borderBottom: '1px solid #e5e7eb'
            }}>
              <h3 style={{
                margin: 0,
                fontSize: '18px',
                fontWeight: '600',
                color: '#1f2937'
              }}>
                Add Custom CSS
              </h3>
              <button
                onClick={() => setShowCustomCSSModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#6b7280',
                  padding: '0',
                  width: '30px',
                  height: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ×
              </button>
            </div>

            {/* Modal Content */}
            <div style={{ padding: '24px' }}>
              <div style={{ marginBottom: '16px' }}>
                <div style={{
                  fontSize: '12px',
                  color: '#6b7280',
                  marginBottom: '8px',
                  display: 'flex',
                  justifyContent: 'space-between'
                }}>
                  <span>&lt;style&gt;</span>
                  <span>{formData.customCSS.length} / 10000</span>
                </div>
                <textarea
                  value={formData.customCSS}
                  onChange={(e) => setFormData({ ...formData, customCSS: e.target.value })}
                  placeholder="h1 { font-size: 40px; }"
                  maxLength={10000}
                  rows={15}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #a855f7',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontFamily: 'monospace',
                    resize: 'vertical',
                    outline: 'none'
                  }}
                />
                <div style={{
                  fontSize: '12px',
                  color: '#6b7280',
                  marginTop: '8px'
                }}>
                  &lt;/style&gt;
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '16px 24px',
              borderTop: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px'
            }}>
              <button
                type="button"
                onClick={() => setShowCustomCSSModal(false)}
                style={{
                  padding: '8px 20px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  backgroundColor: 'white',
                  color: '#374151',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setShowCustomCSSModal(false)}
                className="btn btn-cta"
                style={{ textTransform: 'none' }}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Custom JS Modal */}
      {showCustomJSModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10001
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            width: '90%',
            maxWidth: '600px',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
          }}>
            {/* Modal Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '20px 24px',
              borderBottom: '1px solid #e5e7eb'
            }}>
              <h3 style={{
                margin: 0,
                fontSize: '18px',
                fontWeight: '600',
                color: '#1f2937'
              }}>
                Add Custom JS
              </h3>
              <button
                onClick={() => setShowCustomJSModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#6b7280',
                  padding: '0',
                  width: '30px',
                  height: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ×
              </button>
            </div>

            {/* Modal Content */}
            <div style={{ padding: '24px' }}>
              <div style={{ marginBottom: '16px' }}>
                <div style={{
                  fontSize: '12px',
                  color: '#6b7280',
                  marginBottom: '8px',
                  display: 'flex',
                  justifyContent: 'space-between'
                }}>
                  <span>&lt;script&gt;</span>
                  <span>{formData.customJS.length} / 10000</span>
                </div>
                <textarea
                  value={formData.customJS}
                  onChange={(e) => setFormData({ ...formData, customJS: e.target.value })}
                  placeholder="console.log('Customer Portal')"
                  maxLength={10000}
                  rows={15}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #a855f7',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontFamily: 'monospace',
                    resize: 'vertical',
                    outline: 'none'
                  }}
                />
                <div style={{
                  fontSize: '12px',
                  color: '#6b7280',
                  marginTop: '8px'
                }}>
                  &lt;/script&gt;
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '16px 24px',
              borderTop: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px'
            }}>
              <button
                type="button"
                onClick={() => setShowCustomJSModal(false)}
                style={{
                  padding: '8px 20px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  backgroundColor: 'white',
                  color: '#374151',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setShowCustomJSModal(false)}
                className="btn btn-cta"
                style={{ textTransform: 'none' }}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast.show && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 10003,
          animation: 'slideInRight 0.3s ease-out'
        }}>
          <div style={{
            minWidth: '320px',
            maxWidth: '480px',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            border: `1px solid ${
              toast.type === 'success' ? '#10b981' :
              toast.type === 'error' ? '#ef4444' :
              toast.type === 'warning' ? '#f59e0b' :
              '#3b82f6'
            }`,
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            padding: '16px',
            borderLeft: `4px solid ${
              toast.type === 'success' ? '#10b981' :
              toast.type === 'error' ? '#ef4444' :
              toast.type === 'warning' ? '#f59e0b' :
              '#3b82f6'
            }`
          }}>
            {/* Icon */}
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              backgroundColor: 
                toast.type === 'success' ? 'rgba(16, 185, 129, 0.1)' :
                toast.type === 'error' ? 'rgba(239, 68, 68, 0.1)' :
                toast.type === 'warning' ? 'rgba(245, 158, 11, 0.1)' :
                'rgba(59, 130, 246, 0.1)'
            }}>
              {toast.type === 'success' && (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M13.3 4.7L6 12L2.7 8.7L3.4 8L6 10.6L12.6 4L13.3 4.7Z" fill="#10b981"/>
                </svg>
              )}
              {toast.type === 'error' && (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M11.5 4.5L4.5 11.5M4.5 4.5l7 7" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              )}
              {toast.type === 'warning' && (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 5v3M8 11h.01" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M8 14A6 6 0 108 2a6 6 0 000 12z" stroke="#f59e0b" strokeWidth="1.5"/>
                </svg>
              )}
              {toast.type === 'info' && (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 7v4M8 5h.01" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M8 14A6 6 0 108 2a6 6 0 000 12z" stroke="#3b82f6" strokeWidth="1.5"/>
                </svg>
              )}
            </div>

            {/* Content */}
            <div style={{ flex: 1 }}>
              <p style={{
                margin: 0,
                fontSize: '14px',
                fontWeight: '500',
                color: '#111827',
                lineHeight: '1.5'
              }}>
                {toast.type === 'success' ? 'Success' :
                 toast.type === 'error' ? 'Error' :
                 toast.type === 'warning' ? 'Warning' :
                 'Info'}
              </p>
              <p style={{
                margin: '4px 0 0 0',
                fontSize: '13px',
                color: '#6b7280',
                lineHeight: '1.5'
              }}>
                {toast.message}
              </p>
            </div>

            {/* Close button */}
            <button
              onClick={() => setToast({ show: false, type: 'success', message: '' })}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0',
                color: '#9ca3af',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '20px',
                height: '20px',
                flexShrink: 0
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddProjectForm;
