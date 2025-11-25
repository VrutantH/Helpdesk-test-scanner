// API Configuration
// In production, use relative path (same domain) or environment variable
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || (
  process.env.NODE_ENV === 'production'
    ? '/api'  // Production: Same domain, proxy handles routing
    : '${API_CONFIG.API_URL}'  // Development: Direct backend URL
);

export default API_BASE_URL;
