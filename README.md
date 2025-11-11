# SAC Helpdesk Portal

A modern full-stack helpdesk portal application for support ticket management.

## 🚀 Features

- **User Authentication**: Secure login with role-based access control
- **Ticket Management**: Create, update, and track support tickets
- **Real-time Notifications**: Live updates for ticket status changes
- **Dashboard Analytics**: Comprehensive overview of helpdesk metrics
- **File Attachments**: Support for uploading and managing files
- **Advanced Search**: Filter and search tickets with multiple criteria
- **Responsive Design**: Mobile-friendly interface

## 🏗️ Project Structure

```
SAC Helpdesk/
├── frontend/          # React.js frontend application
├── backend/           # Node.js/Express API server
├── database/          # Database scripts and configuration
├── shared/            # Shared utilities and types
├── docs/             # Project documentation
└── .github/          # GitHub workflows and configurations
```

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **React Router** for navigation
- **React Query** for state management
- **Socket.io Client** for real-time features

### Backend
- **Node.js** with Express.js
- **TypeScript** for type safety
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Socket.io** for real-time communication
- **Multer** for file uploads

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (v5 or higher)
- npm or yarn

### Setup

1. **Clone and navigate to the project**
   ```powershell
   cd "d:\Niraj\SAC\SAC Helpdesk"
   ```

2. **Install backend dependencies**
   ```powershell
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```powershell
   cd ../frontend
   npm install
   ```

4. **Configure environment variables**
   - Copy `.env.example` to `.env` in both frontend and backend directories
   - Update the environment variables according to your setup

5. **Start the development servers**
   ```powershell
   # Terminal 1 - Backend
   cd backend
   npm run dev

   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

## 🔧 Development Scripts

### Backend
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run test` - Run tests

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests

## 📝 API Documentation

The API documentation is available at `http://localhost:3001/api/docs` when running the backend server.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.