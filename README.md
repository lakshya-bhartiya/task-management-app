# TaskManager - MERN Stack Task Management Application

A modern, full-featured task management application built with the MERN stack (MongoDB, Express.js, React, Node.js) featuring Google OAuth, email notifications, and real-time analytics.

![TaskManager Banner](https://via.placeholder.com/1200x400/3b82f6/ffffff?text=TaskManager)

## 🌟 Features

### Authentication & Security
- ✅ User Registration & Login with JWT
- ✅ Google OAuth 2.0 Integration
- ✅ Forgot Password with Email Recovery
- ✅ Password Reset with Secure Tokens
- ✅ Password Show/Hide Toggle
- ✅ Protected Routes & Authorization

### Task Management
- ✅ Create, Read, Update, Delete Tasks
- ✅ Task Status (To Do, In Progress, Completed)
- ✅ Priority Levels (Low, Medium, High)
- ✅ Categories & Tags
- ✅ Due Dates with Overdue Tracking
- ✅ Task Search & Advanced Filtering
- ✅ Bulk Operations (Delete, Mark Complete)
- ✅ Drag & Drop Reordering

### Dashboard & Analytics
- ✅ Real-time Task Statistics
- ✅ Interactive Charts (Pie, Bar)
- ✅ Status Distribution Visualization
- ✅ Priority & Category Analytics
- ✅ Overdue Task Tracking

### UI/UX
- ✅ Dark/Light Theme Toggle
- ✅ Fully Responsive Design
- ✅ Smooth Animations & Transitions
- ✅ Toast Notifications
- ✅ Modal Dialogs
- ✅ Loading States
- ✅ Professional Design

### Technical Features
- ✅ RESTful API Architecture
- ✅ Redux State Management
- ✅ Form Validation (Formik + Yup)
- ✅ Email Service Integration
- ✅ Cron Jobs for Automated Tasks
- ✅ Error Handling & Logging

---

## 🚀 Tech Stack

### Frontend
- **React 18** - UI Library
- **Vite** - Build Tool
- **Redux Toolkit** - State Management
- **React Router v6** - Routing
- **Tailwind CSS** - Styling
- **Formik + Yup** - Form Handling & Validation
- **Recharts** - Data Visualization
- **Axios** - HTTP Client
- **React Hot Toast** - Notifications
- **SweetAlert2** - Beautiful Alerts

### Backend
- **Node.js** - Runtime Environment
- **Express.js** - Web Framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password Hashing
- **Nodemailer** - Email Service
- **Passport.js** - OAuth Authentication
- **Node-Cron** - Scheduled Tasks
- **Joi** - Validation

---

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Gmail Account (for email service)
- Google Cloud Project (for OAuth)

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/task-management.git
cd task-management
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create `.env` file in `backend` folder:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/taskmanagement

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# Email Configuration (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
EMAIL_FROM=TaskManager <your-email@gmail.com>

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

Start backend server:
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### 3. Frontend Setup

Open new terminal:
```bash
cd frontend
npm install
```

Create `.env` file in `frontend` folder:
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_GOOGLE_AUTH_URL=http://localhost:5000/api/auth/google
```

Start frontend:
```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

---

## 🔑 Gmail App Password Setup

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable **2-Step Verification**
3. Go to [App Passwords](https://myaccount.google.com/apppasswords)
4. Select app: **Mail**
5. Select device: **Other** (enter "TaskManager")
6. Click **Generate**
7. Copy the 16-character password
8. Use it as `EMAIL_PASSWORD` in `.env`

---

## 🔐 Google OAuth Setup

### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project: **TaskManager**

### 2. Enable Google+ API

1. Go to **APIs & Services** → **Library**
2. Search **Google+ API**
3. Click **Enable**

### 3. Create OAuth Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth client ID**
3. Configure consent screen (if first time)
4. Application type: **Web application**
5. Name: **TaskManager Web Client**
6. Authorized JavaScript origins:
```
   http://localhost:5000
   http://localhost:3000
```
7. Authorized redirect URIs:
```
   http://localhost:5000/api/auth/google/callback
```
8. Click **Create**
9. Copy **Client ID** and **Client Secret**
10. Add to backend `.env`

---

## 📁 Project Structure
```
task-management/
├── backend/
│   ├── config/
│   │   └── passport.js          # Passport OAuth config
│   ├── helper/
│   │   ├── cronJobs.js          # Scheduled tasks
│   │   └── emailService.js      # Email templates
│   ├── middleware/
│   │   ├── authHelper.js        # JWT middleware
│   │   └── middleware.validation.js
│   ├── src/
│   │   ├── auth/
│   │   │   └── route.auth.js    # OAuth routes
│   │   ├── user/
│   │   │   ├── model.user.js
│   │   │   ├── route.user.js
│   │   │   ├── controller.user.js
│   │   │   └── service.user.js
│   │   └── task/
│   │       ├── model.task.js
│   │       ├── route.task.js
│   │       ├── controller.task.js
│   │       └── service.task.js
│   ├── validations/
│   ├── .env
│   ├── server.js
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── common/          # Reusable components
    │   │   ├── layout/          # Layout components
    │   │   └── tasks/           # Task components
    │   ├── pages/
    │   │   ├── auth/            # Auth pages
    │   │   ├── dashboard/       # Dashboard
    │   │   ├── tasks/           # Task pages
    │   │   └── profile/         # Profile page
    │   ├── redux/
    │   │   ├── slices/          # Redux slices
    │   │   └── services/        # API services
    │   ├── routes/              # Route configuration
    │   ├── utils/               # Utilities
    │   ├── context/             # React Context
    │   └── api/                 # Axios config
    ├── .env
    └── package.json
```

---

## 🎯 API Endpoints

### Authentication
```
POST   /api/users/register           - Register user
POST   /api/users/login              - Login user
POST   /api/users/forgot-password    - Request password reset
POST   /api/users/reset-password/:token - Reset password
GET    /api/auth/google              - Google OAuth login
GET    /api/auth/google/callback     - Google OAuth callback
```

### User
```
GET    /api/users/profile            - Get user profile
PUT    /api/users/profile            - Update profile
PUT    /api/users/change-password    - Change password
```

### Tasks
```
GET    /api/tasks                    - Get all tasks (with filters)
GET    /api/tasks/:id                - Get single task
POST   /api/tasks                    - Create task
PUT    /api/tasks/:id                - Update task
DELETE /api/tasks/:id                - Delete task
GET    /api/tasks/statistics         - Get statistics
GET    /api/tasks/categories         - Get categories
GET    /api/tasks/tags               - Get tags
POST   /api/tasks/reorder            - Reorder tasks
POST   /api/tasks/bulk-delete        - Bulk delete
POST   /api/tasks/bulk-update-status - Bulk update status
```

---

## 🧪 Testing

### Manual Testing Checklist

**Authentication:**
- [ ] Register new user
- [ ] Login with credentials
- [ ] Login with Google
- [ ] Forgot password flow
- [ ] Reset password
- [ ] Logout

**Tasks:**
- [ ] Create task
- [ ] Edit task
- [ ] Delete task
- [ ] Filter by status/priority/category
- [ ] Search tasks
- [ ] Bulk delete
- [ ] Bulk mark complete

**Profile:**
- [ ] Update profile info
- [ ] Change password
- [ ] Update avatar

**UI:**
- [ ] Theme toggle (dark/light)
- [ ] Responsive on mobile
- [ ] Password show/hide

---

## 🎨 Design System

### Color Palette
```css
Primary Blue:   #3b82f6
Secondary Purple: #8b5cf6
Success Green:  #10b981
Warning Amber:  #f59e0b
Error Red:      #ef4444
```

### Typography
- Font Family: Inter (Google Fonts)
- Heading: 600-700 weight
- Body: 400 weight

### Components
- Border Radius: 8px (rounded-lg)
- Shadows: Subtle (shadow-sm, shadow-md)
- Spacing: 4px grid system

---

## 📸 Screenshots

### Dashboard
![Dashboard](https://via.placeholder.com/800x500/3b82f6/ffffff?text=Dashboard+Screenshot)

### Tasks Page
![Tasks](https://via.placeholder.com/800x500/3b82f6/ffffff?text=Tasks+Page)

### Login Page
![Login](https://via.placeholder.com/800x500/3b82f6/ffffff?text=Login+Page)

### Dark Mode
![Dark Mode](https://via.placeholder.com/800x500/1f2937/ffffff?text=Dark+Mode)

---

## 🚢 Deployment

### Backend (Railway/Render)

1. Create account on [Railway](https://railway.app/) or [Render](https://render.com/)
2. Connect GitHub repository
3. Add environment variables
4. Deploy

### Frontend (Vercel/Netlify)

1. Create account on [Vercel](https://vercel.com/) or [Netlify](https://netlify.com/)
2. Connect GitHub repository
3. Add environment variables
4. Deploy

### Database (MongoDB Atlas)

1. Create account on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create cluster
3. Get connection string
4. Update `MONGODB_URI` in backend `.env`

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Developer

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your Name](https://linkedin.com/in/yourprofile)
- Email: your.email@example.com

---

## 🙏 Acknowledgments

- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js](https://expressjs.com/)
- [Recharts](https://recharts.org/)

---

## 📞 Support

For support, email your.email@example.com or create an issue in the repository.

---

## ⭐ Show your support

Give a ⭐️ if this project helped you!

---

**Built with ❤️ using MERN Stack**
```

---

## 📄 Additional Files to Create

### **LICENSE** (MIT License)
```
MIT License

Copyright (c) 2024 Your Name

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.