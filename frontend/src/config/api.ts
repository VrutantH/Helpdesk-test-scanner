// API Configuration
const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://helpdesk.hubblehox.ai/api'
  : 'http://localhost:3003/api';

export default API_BASE_URL;
