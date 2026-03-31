# 📚 Study Buddy - A Smart Study Companion

A comprehensive, full-stack web application designed to help students organize their studies, manage tasks, create flashcards, take notes, and collaborate with peer study groups in real-time.

---

## 🎯 Description

**Study Buddy** is an intelligent study management platform that provides students with essential tools to streamline their learning process. Whether you're preparing for exams, completing assignments, or collaborating with classmates, Study Buddy helps you stay organized, track progress, and maintain productivity.

The application features a modern, user-friendly interface with robust backend support for data persistence, real-time collaboration, and secure authentication.

---

## ✨ Features

### 🔐 **User Management**
- User registration and secure login
- Password reset functionality via email verification
- User profile management with personal information
- JWT-based authentication for secure API access

### 📋 **Task Management**
- Create and manage study tasks with titles and descriptions
- Mark tasks as completed or pending
- Track all tasks organized by status
- View task history and progress

### 📝 **Notes Management**
- Create text-based notes with subjects
- Upload and attach files to notes (images, PDFs, documents)
- Organize notes by subject
- Quick reference to important study materials
- Share notes with study groups

### 🎴 **Flashcard System**
- Create question-answer based flashcards
- Organize flashcards by subject/topic
- Filter flashcards by subject
- Interactive flashcard review and study mode
- Ideal for memorization and quick recall

### 📅 **Calendar & Deadlines**
- Interactive calendar view for your schedule
- Add important deadlines and submission dates
- Automatic deadline reminders
- Visualize your academic timeline
- Track multiple deadlines across subjects

### 👥 **Study Circle (Real-time Collaboration)**
- Create private study groups
- Invite peers to join your groups
- Real-time chat messaging within groups
- Share notes and resources with group members
- Monitor unread message counts
- Notification system for group activities
- Admin controls for group management

### 📊 **Progress Tracking**
- Monitor your study progress and productivity
- View statistics and learning insights
- Track completion rates across subjects
- Dashboard overview of all activities

### 🔔 **Notifications**
- Real-time notifications for group messages
- Task completion alerts
- Deadline reminders
- Study activity updates

---

## 🛠️ Tech Stack

### **Frontend**
- **React 19.2.0** - UI library for building interactive components
- **Vite 7.2.4** - Next-generation frontend build tool for fast development
- **React Router DOM 7.12.0** - Client-side routing and navigation
- **Axios 1.13.3** - HTTP client for API communication
- **Socket.io Client 4.8.1** - Real-time bidirectional communication
- **FullCalendar 6.1.20** - Interactive calendar component
- **Recharts 3.8.1** - React charting library for progress visualization
- **CSS3** - Custom styling with responsive design

### **Backend**
- **Node.js** - JavaScript runtime for server-side development
- **Express 5.2.1** - Web application framework and routing
- **MongoDB 9.1.5** - NoSQL database for data persistence (via Mongoose)
- **Mongoose** - MongoDB object modeling
- **Socket.io 4.8.1** - Real-time bidirectional event-based communication
- **JWT (jsonwebtoken 9.0.3)** - Secure token-based authentication
- **Bcryptjs 3.0.3** - Password hashing and encryption
- **Multer 2.0.2** - Middleware for file uploads
- **CORS 2.8.6** - Cross-origin resource sharing support
- **Dotenv 17.2.3** - Environment variable management

### **Database**
- **MongoDB** - Cloud NoSQL database for flexible data storage

---

## 📁 Project Structure

```
Study-Buddy-A-Smart-Study-Companion/
├── client/                          # Frontend React Application
│   ├── src/
│   │   ├── components/              # Reusable React components
│   │   │   ├── ChatWindow.jsx       # Study circle chat interface
│   │   │   ├── Footer.jsx           # Footer component
│   │   │   ├── GroupList.jsx        # Study groups display
│   │   │   ├── Marquee.jsx          # Animated welcome message
│   │   │   ├── MessageBubble.jsx    # Chat message display
│   │   │   ├── Modal.jsx            # Modal dialogs
│   │   │   ├── NoteShareModal.jsx   # Share notes modal
│   │   │   ├── NotificationPanel.jsx # Notifications display
│   │   │   ├── ProtectedRoute.jsx   # Authentication guard
│   │   │   ├── Sidebar.jsx          # Navigation sidebar
│   │   │   └── Timer.jsx            # Study timer component
│   │   ├── pages/                   # Page components
│   │   │   ├── Home.jsx             # Landing page
│   │   │   ├── Login.jsx            # User login
│   │   │   ├── Signup.jsx           # User registration
│   │   │   ├── Dashboard.jsx        # Main dashboard
│   │   │   ├── Profile.jsx          # User profile
│   │   │   ├── Tasks.jsx            # Task management
│   │   │   ├── Notes.jsx            # Notes management
│   │   │   ├── Flashcards.jsx       # Flashcard system
│   │   │   ├── Calendar.jsx         # Calendar & deadlines
│   │   │   ├── StudyCircle.jsx      # Group collaboration
│   │   │   ├── ForgotPassword.jsx   # Password recovery
│   │   │   └── ResetPassword.jsx    # Password reset
│   │   ├── styles/                  # CSS files for all pages
│   │   ├── App.jsx                  # Main App component & routing
│   │   ├── main.jsx                 # React entry point
│   │   └── index.css                # Global styles
│   ├── vite.config.js               # Vite configuration
│   └── package.json                 # Frontend dependencies
│
├── server/                          # Backend Express Application
│   ├── models/                      # MongoDB schemas
│   │   ├── User.js                  # User schema with auth tokens
│   │   ├── Task.js                  # Task schema
│   │   ├── Note.js                  # Note schema
│   │   ├── Flashcard.js             # Flashcard schema
│   │   ├── Deadline.js              # Deadline schema
│   │   ├── Group.js                 # Study group schema
│   │   ├── Message.js               # Chat message schema
│   │   └── Notification.js          # Notification schema
│   ├── routes/                      # API route handlers
│   │   ├── auth.js                  # Authentication endpoints
│   │   ├── user.js                  # User profile endpoints
│   │   ├── tasks.js                 # Task management endpoints
│   │   ├── notes.js                 # Notes endpoints
│   │   ├── flashcardsApi.js         # Flashcard endpoints
│   │   ├── deadlineRoutes.js        # Deadline endpoints
│   │   ├── studyCircle.js           # Study group endpoints
│   │   └── progress.js              # Progress tracking endpoints
│   ├── middleware/                  # Custom middleware
│   │   └── authMiddleware.js        # JWT authentication middleware
│   ├── socket/                      # WebSocket handlers
│   │   └── studyCircleSocket.js     # Real-time group communication
│   ├── uploads/                     # File storage directory
│   ├── server.js                    # Main server entry point
│   └── package.json                 # Backend dependencies
│
├── package.json                     # Root package.json (monorepo)
└── README.md                        # This file
```

---

## 🚀 Installation Instructions

### **Prerequisites**
Ensure you have the following installed on your system:
- **Node.js** (v14.0.0 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **MongoDB** - [Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **Git** (optional, for version control)

### **Step 1: Clone the Repository**
```bash
git clone https://github.com/Khushiben/Study-Buddy-A-Smart-Study-Companion.git
cd Study-Buddy-A-Smart-Study-Companion
```

### **Step 2: Install Dependencies**
Install dependencies for both client and server using the monorepo setup:

```bash
# Install all dependencies in both client and server
npm install
```

Or install them separately:

```bash
# Install client dependencies
cd client
npm install
cd ..

# Install server dependencies
cd server
npm install
cd ..
```

### **Step 3: Configure Environment Variables**

Create a `.env` file in the `server` directory with the following variables:

```env
# MongoDB Connection URI
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/study-buddy?retryWrites=true&w=majority

# JWT Secret Key (use a strong random string)
JWT_SECRET=your_jwt_secret_key_here

# Server Port (optional, defaults to 5000)
PORT=5000

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

**How to get your MongoDB URI:**
1. Create a free account on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Go to "Connect" and copy your connection string
4. Replace `<username>` and `<password>` with your database credentials

### **Step 4: Start the Server**

Open a terminal in the project root and start the backend server:

```bash
cd server
npm start
```

You should see:
```
✅ MongoDB Connected
🚀 Server running on port 5000
```

### **Step 5: Start the Frontend Development Server**

Open another terminal in the project root:

```bash
cd client
npm run dev
```

The frontend will start at `http://localhost:5173`

### **Step 6: Access the Application**

Open your browser and visit:
```
http://localhost:5173
```

---

## 💻 Usage

### **Getting Started**

1. **Create an Account**: Click "Sign Up" on the home page and enter your details
2. **Login**: Use your credentials to log in
3. **Explore Dashboard**: View your overall study progress and quick actions
4. **Customize Profile**: Update your profile information

### **Using Each Feature**

#### **📋 Tasks**
- Navigate to **Tasks** from the sidebar
- Click "Add Task" to create a new task
- Enter task title and description
- Mark tasks as "Completed" when done
- View all your tasks organized by status

#### **📝 Notes**
- Go to **Notes** section
- Create a new note with a subject and content
- Optionally upload a file attachment
- Click on any note to view or edit details
- Search notes by subject

#### **🎴 Flashcards**
- Access **Flashcards** from the sidebar
- Create new flashcard with question and answer
- Assign a subject/topic to flashcards
- Filter flashcards by subject
- Study mode: Review and test yourself

#### **📅 Calendar & Deadlines**
- Open **Calendar** to see all your deadlines
- Click on a date to add a new deadline
- Set title, description, and deadline date
- Receive reminders before important dates
- View upcoming deadlines at a glance

#### **👥 Study Circle**
- Navigate to **Study Circle** to collaborate
- **Create Group**: Click "Create Group" and enter a name
- **Join Group**: Use invite link or join existing groups
- **Send Messages**: Chat with group members in real-time
- **Share Notes**: Attach and share notes with the group
- **View Members**: See all active members in the group

#### **📊 Progress**
- Check **Dashboard** for your overall progress
- View completion statistics
- Track your learning journey
- Monitor time spent on different subjects

#### **🔔 Notifications**
- Check **Notifications** panel on dashboard
- Stay updated on group activities
- Get alerts for important dates and tasks

### **Keyboard Shortcuts**
- `Ctrl/Cmd + S` - Save (context-dependent)
- `Escape` - Close modals

---

## 🔌 API Endpoints

### **Authentication Endpoints**
```
POST   /api/auth/signup              - Register new user
POST   /api/auth/login               - User login
POST   /api/auth/forgot-password     - Request password reset
POST   /api/auth/reset-password/:token - Reset password with token
```

### **User Endpoints**
```
GET    /api/user                     - Get current user profile
```

### **Task Management Endpoints**
```
GET    /api/tasks                    - Get all user tasks
POST   /api/tasks                    - Create new task
PUT    /api/tasks/:id                - Update task status
DELETE /api/tasks/:id                - Delete task
```

### **Notes Endpoints**
```
GET    /api/notes                    - Get all user notes
POST   /api/notes                    - Create new note (with file upload)
PUT    /api/notes/:id                - Update note
DELETE /api/notes/:id                - Delete note
```

### **Flashcard Endpoints**
```
GET    /api/flashcards               - Get all flashcards (optional: filter by subject)
POST   /api/flashcards               - Create new flashcard
PUT    /api/flashcards/:id           - Update flashcard
DELETE /api/flashcards/:id           - Delete flashcard
```

### **Deadline Endpoints**
```
GET    /api/deadlines                - Get all deadlines (FullCalendar format)
POST   /api/deadlines                - Create new deadline
PUT    /api/deadlines/:id            - Update deadline
DELETE /api/deadlines/:id            - Delete deadline
```

### **Study Circle Endpoints**
```
GET    /api/study-circle/groups      - Get all user groups
POST   /api/study-circle/groups      - Create new group
GET    /api/study-circle/groups/:id  - Get group details
POST   /api/study-circle/groups/:id/invite - Invite user to group
POST   /api/study-circle/groups/:id/messages - Send message
GET    /api/study-circle/groups/:id/messages - Get group messages
```

### **Progress Endpoints**
```
GET    /api/progress                 - Get user progress statistics
```

### **Real-time Events (Socket.io)**
```
connect                              - User connects to socket
disconnect                           - User disconnects
activate-group                       - Activate group for real-time updates
send-message                         - Send message in group
receive-message                      - Receive message from group
unread-update                        - Update unread message count
notification                         - Send notification
```

---

## 📸 Screenshots & Demo

Currently, the application includes the following user interface components:

### **Pages Available**
- 🏠 **Home Page** - Landing page with feature overview
- 🔐 **Login/Signup** - Authentication pages
- 📊 **Dashboard** - Main hub with quick actions and notifications
- 👤 **Profile** - User profile management
- 📋 **Tasks** - Task management interface
- 📝 **Notes** - Notes taking and organization
- 🎴 **Flashcards** - Flashcard study mode
- 📅 **Calendar** - Interactive calendar with deadlines
- 👥 **Study Circle** - Group collaboration and chat
- 🔄 **Progress** - Learning statistics and insights

> 📷 **Screenshots** - Screenshots and demo videos are currently unavailable. You can access the live application by following the Installation Steps above.

---

## 🚀 Future Improvements & Roadmap

### **Planned Enhancements**

#### **Phase 1 (Q2 2026)**
- [ ] Tutorial/onboarding for new users
- [ ] Dark mode theme support
- [ ] Mobile-responsive improvements
- [ ] Search functionality across all modules
- [ ] Export notes as PDF

#### **Phase 2 (Q3 2026)**
- [ ] AI-powered study recommendations
- [ ] Automatic flashcard generation from notes
- [ ] Study session analytics and insights
- [ ] Integration with popular tools (Google Drive, Dropbox)
- [ ] Mobile app (React Native)

#### **Phase 3 (Q4 2026)**
- [ ] Gamification features (badges, leaderboards)
- [ ] Advanced scheduling and time management
- [ ] Video study sessions support
- [ ] Integration with learning resources (Khan Academy, Coursera)
- [ ] Spaced repetition algorithm for flashcards

#### **Phase 4 (2027+)**
- [ ] AI chatbot for study assistance
- [ ] Advanced collaboration tools
- [ ] Custom subject templates
- [ ] Third-party API integrations
- [ ] Offline mode support
- [ ] Multi-language support

### **Performance Improvements**
- [ ] Implement caching mechanisms
- [ ] Optimize database queries
- [ ] Add pagination for large datasets
- [ ] Lazy loading for images and files

### **Security Enhancements**
- [ ] Two-factor authentication (2FA)
- [ ] OAuth2 integration (Google, GitHub)
- [ ] Enhanced encryption for sensitive data
- [ ] Rate limiting for API endpoints
- [ ] Regular security audits

---

## 🤝 Contributing Guidelines

We welcome contributions from the community! Here's how you can help improve Study Buddy.

### **How to Contribute**

1. **Fork the Repository**
   ```bash
   # Click "Fork" button on GitHub
   ```

2. **Clone Your Fork**
   ```bash
   git clone https://github.com/YOUR-USERNAME/Study-Buddy-A-Smart-Study-Companion.git
   cd Study-Buddy-A-Smart-Study-Companion
   ```

3. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   # Example: git checkout -b feature/add-pomodoro-timer
   ```

4. **Make Your Changes**
   - Follow the existing code style and conventions
   - Keep commits atomic and well-documented
   - Test your changes thoroughly

5. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "Add brief description of changes"
   ```

6. **Push to Your Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your branch and describe your changes
   - Submit for review

### **Code Standards**
- Use consistent naming conventions
- Add comments for complex logic
- Follow existing file structure patterns
- Ensure code is well-tested
- Update documentation if needed

### **Reporting Issues**
- Use GitHub Issues for bug reports
- Provide clear descriptions and reproduction steps
- Include screenshots when relevant
- Check existing issues to avoid duplicates

### **Getting Help**
- Check the README and documentation first
- Ask in GitHub Discussions
- Join our community chat (if available)

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### **MIT License Summary**
- ✅ **Allowed**: Commercial use, modification, distribution, private use
- ⚠️ **Required**: License and copyright notice
- ❌ **Forbidden**: Liability, warranty

---

## 📞 Support & Contact

### **Get Help**
- 📖 Check [Documentation](./README.md)
- 🐛 Report bugs on [GitHub Issues](https://github.com/Khushiben/Study-Buddy-A-Smart-Study-Companion/issues)
- 💬 Discuss features on [GitHub Discussions](https://github.com/Khushiben/Study-Buddy-A-Smart-Study-Companion/discussions)

### **Connect With Us**
- 🌟 Star the repository on GitHub
- 🍴 Fork and contribute
- 📢 Share with your study groups

---

## 🙏 Acknowledgments

- Thanks to all contributors and community members
- Built with modern web technologies
- Inspired by the need for better study management tools
- Special thanks to the open-source community

---

**Happy Studying with Study Buddy! 📚✨**

*Last Updated: March 31, 2026*
