# Job Portal

A comprehensive full-stack job portal application with AI-powered job matching, counseling services, skill development courses, and real-time chat capabilities.

## 🎯 Project Overview

This Job Portal is a complete platform that connects job seekers with employers. It features:
- **Job Listings & Matching**: Browse and match jobs based on skills and qualifications
- **AI-Powered Job Matcher**: Intelligent job recommendations using Google Generative AI
- **Application Management**: Track job applications and their status
- **User Counseling**: Career counseling and guidance services
- **Skill Development**: Access to courses for skill enhancement
- **Real-time Chat**: Integrated chatbot for user support
- **Admin Dashboard**: Comprehensive analytics and management tools
- **Authentication**: Secure JWT-based authentication with bcrypt encryption

## 📁 Project Structure

```
job-portal/
├── backend/                    # Node.js/Express API Server
│   ├── controllers/           # Request handlers (optional)
│   ├── middleware/            # Authentication & file upload middleware
│   │   ├── auth.js           # JWT authentication (protect, admin)
│   │   └── upload.js         # Resume file upload handling (multer)
│   ├── models/               # MongoDB schemas
│   │   ├── User.js           # User model (name locked post-registration, resume path)
│   │   ├── Job.js            # Job listings
│   │   ├── Application.js    # Job applications (includes 'withdrawn' status + withdrawnAt)
│   │   ├── Course.js         # Educational courses
│   │   ├── Counseling.js     # Counseling sessions
│   │   └── ChatHistory.js    # Chat messages
│   ├── routes/               # API endpoints
│   │   ├── auth.js           # Authentication routes (register/login/current user)
│   │   ├── user.js           # User profile routes (name locked, resume PUT/DELETE)
│   │   ├── jobs.js           # Job management routes (public + admin CRUD)
│   │   ├── applications.js   # Application routes (apply, withdraw, my apps, per-job list excl. withdrawn)
│   │   ├── admin.js          # Admin routes (jobs overview excl. withdrawn, withdrawals feed)
│   │   ├── courses.js        # Course routes
│   │   ├── counseling.js     # Counseling routes
│   │   ├── chat.js           # Chat routes (PGRKAM-first, fallback to internal jobs)
│   │   └── pgrkam.js         # PGRKAM test/search endpoint (optional)
│   ├── uploads/
│   │   └── resumes/          # Uploaded resume storage
│   ├── utils/
│   │   ├── jobMatcher.js     # AI-powered job matching logic
│   │   └── pgrkamService.js  # PGRKAM scraper (cheerio + caching)
│   ├── server.js             # Express server entry point
│   ├── seedJobs.js           # Database seeding script
│   ├── setupMyAdmin.js       # Admin setup script
│   └── package.json          # Backend dependencies
│
└── frontend/                  # React.js Frontend
    ├── public/
    │   ├── index.html        # HTML entry point
    │   ├── manifest.json     # PWA manifest
    │   └── robots.txt        # SEO
    ├── src/
    │   ├── components/       # Reusable React components
    │   │   ├── Navbar.jsx
    │   │   ├── Footer.jsx
    │   │   ├── Chatbot.jsx   # AI chatbot component (PGRKAM links + fallback, no model label)
    │   │   ├── ProtectedRoute.jsx
    │   │   └── NonAdminRoute.jsx  # Redirects admin to /admin when hitting user pages
    │   ├── pages/            # Page components
    │   │   ├── Home.jsx
    │   │   ├── JobListings.jsx
    │   │   ├── JobDetails.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Profile.jsx   # Name locked; resume replace/remove
    │   │   ├── MyApplications.jsx  # Withdraw button (removes from list)
    │   │   ├── About.jsx
    │   │   ├── SkillDevelopment.jsx
    │   │   ├── Counseling.jsx
    │   │   └── admin/        # Admin pages
    │   │       ├── AdminDashboard.jsx
    │   │       ├── DashboardHome.jsx      # Overview excl. withdrawn + recent withdrawals
    │   │       ├── Analytics.jsx
    │   │       ├── UserManagement.jsx
    │   │       ├── JobManagement.jsx
    │   │       ├── ApplicantManagement.jsx  # Shows only active applications
    │   │       ├── CounselingManagement.jsx
    │   │       └── CourseManagement.jsx
    │   │       └── Withdrawals.jsx        # Dedicated view: who withdrew & which job
    │   ├── context/
    │   │   └── AuthContext.jsx    # Global auth state management (named jwtDecode import)
    │   ├── services/              # API service utilities (optional)
    │   ├── utils/                 # Helper utilities (optional)
    │   ├── App.js                 # Main App component (admin-only /admin, NonAdminRoute for user pages)
    │   ├── index.js               # React entry point
    │   ├── config.js              # Frontend configuration (API URL)
    │   └── index.css              # Global styles
    ├── package.json               # Frontend dependencies
    ├── tailwind.config.js         # Tailwind CSS configuration
    ├── postcss.config.js          # PostCSS configuration
    └── README.md                  # Frontend documentation
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB** (local or MongoDB Atlas)
- **Git**

### Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/job-portal.git
cd job-portal
```

#### 2. Backend Setup

Navigate to the backend directory:
```bash
cd backend
```

Install dependencies:
```bash
npm install
```

Create a `.env` file in the backend directory:
```env
MONGO_URI=mongodb://localhost:27017/job-portal
# Or use MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/job-portal

FRONTEND_URL=http://localhost:3000
JWT_SECRET=your_jwt_secret_key_here
GOOGLE_API_KEY=your_google_generative_ai_api_key

PORT=5000
```

Start the backend server:
```bash
npm start          # Production
npm run dev        # Development with auto-reload (requires nodemon)
```

The backend will run on `http://localhost:5000`

#### 3. Frontend Setup

Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```

Install dependencies:
```bash
npm install
```

Create a `.env` file in the frontend directory (if needed):
```env
REACT_APP_API_URL=http://localhost:5000
```

Start the development server:
```bash
npm start
```

The frontend will open at `http://localhost:3000`

## 📚 Available Scripts

### Backend

- `npm start` - Start the production server
- `npm run dev` - Start development server with nodemon (auto-reload on changes)

### Frontend

- `npm start` - Start development server (opens http://localhost:3000)
- `npm build` - Build for production
- `npm test` - Run test suite
- `npm eject` - Eject from Create React App (one-way operation)

## 🔐 Key Features

### Authentication & Security
- JWT-based authentication
- Password encryption with bcryptjs
- Protected routes with auth middleware
- Secure session management

### Job Management
- Post and manage job listings
- Advanced job filtering and search
- Job application tracking
- Resume upload functionality

### AI-Powered Features
- **Job Matcher**: Uses Google Generative AI to recommend jobs based on user skills
- **Chatbot**: AI-powered assistant for user queries and support

### User Management
- User registration and authentication
- Profile creation and management
- Application history tracking
- Skill endorsements

### Career Services
- **Counseling**: Schedule and manage career counseling sessions
- **Courses**: Access skill development courses
- **Progress Tracking**: Monitor learning progress

### Admin Dashboard
- User management and analytics
- Job posting management
- Application review and management
- Counseling session management
- Course administration
- Platform analytics

### Real-time Communication
- Chat history storage
- Chatbot conversations
- Message persistence

## 🛠 Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **File Upload**: Multer
- **AI Integration**: Google Generative AI
- **Environment**: dotenv
- **CORS**: Enable cross-origin requests

### Frontend
- **Library**: React 18.2.0
- **Routing**: React Router DOM 7.9.5
- **HTTP Client**: Axios
- **Styling**: Tailwind CSS 3.3.0
- **UI Icons**: Heroicons
- **Charts**: Recharts 3.4.1
- **JWT Decoding**: jwt-decode 4.0.0
- **Testing**: React Testing Library

## 📋 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Jobs
- `GET /api/jobs` - Get all jobs
- `GET /api/jobs/:id` - Get job details
- `POST /api/jobs` - Create job (admin)
- `PUT /api/jobs/:id` - Update job (admin)
- `DELETE /api/jobs/:id` - Delete job (admin)

### Applications
- `GET /api/applications` - Get user applications
- `POST /api/applications` - Submit application
- `PUT /api/applications/:id` - Update application status (admin)

### Courses
- `GET /api/courses` - Get all courses
- `POST /api/courses` - Create course (admin)
- `PUT /api/courses/:id` - Update course (admin)
- `DELETE /api/courses/:id` - Delete course (admin)

### Counseling
- `GET /api/counseling` - Get counseling sessions
- `POST /api/counseling` - Book counseling session
- `PUT /api/counseling/:id` - Update session (admin)

### Chat
- `GET /api/chat` - Get chat history
- `POST /api/chat` - Send message

### User
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update profile
- `GET /api/user/applications` - Get applications

### Admin
- `GET /api/admin/analytics` - Platform analytics
- `GET /api/admin/users` - Manage users
- `GET /api/admin/applications` - Review applications

## 🔧 Configuration

### Environment Variables

Create `.env` files in both `backend` and `frontend` directories:

**Backend `.env`:**
```env
# Database
MONGO_URI="Mongo URL"

# Server
PORT=5000
FRONTEND_URL=http://localhost:3000

# Security
JWT_SECRET=your_secret_key_here

# AI Integration
GOOGLE_API_KEY=your_google_generative_ai_key
```

**Frontend `.env` (optional):**
```env
REACT_APP_API_URL=http://localhost:5000
```

## 📦 Database Models

### User
- Email, password, full name
- Profile information
- User role (job seeker / employer / admin)
- Profile completion status

### Job
- Title, description, requirements
- Location, salary range
- Job type (full-time, part-time, etc.)
- Posted date, deadline
- Required skills

### Application
- User and job references
- Application status
- Resume file reference
- Application date

### Course
- Title, description, syllabus
- Duration, level
- Enrollment count
- Instructor information

### Counseling
- User and counselor references
- Session date/time
- Notes, feedback
- Session status

### ChatHistory
- User and message content
- Timestamps
- Message type (user/bot)

## 🚢 Deployment

### Backend Deployment
1. Set environment variables on your hosting platform
2. Deploy to services like Heroku, AWS, Azure, or DigitalOcean
3. Ensure MongoDB is accessible from your deployment environment

### Frontend Deployment
1. Build the production bundle: `npm run build`
2. Deploy to services like Vercel, Netlify, AWS S3 + CloudFront, or GitHub Pages

## 📝 Usage Examples

### Register a New User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "fullName": "John Doe",
    "userRole": "job_seeker"
  }'
```

### Apply for a Job
```bash
curl -X POST http://localhost:5000/api/applications \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "resume=@resume.pdf" \
  -F "jobId=job_id_here"
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

## 👥 Authors

- Your Name - Initial work

## 🆘 Support

For issues, questions, or suggestions, please:
1. Check existing issues in the repository
2. Create a new issue with detailed description
3. Contact support at support@jobportal.com

## 🎓 Learning Resources

- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [JWT Authentication](https://jwt.io/)

## 📊 Project Statistics

- **Languages**: JavaScript, JSX
- **Frontend Components**: 25+
- **API Endpoints**: 30+
- **Database Models**: 6
- **Key Features**: 10+

---

**Last Updated**: November 2025

For more information or to report issues, please visit the project repository.
