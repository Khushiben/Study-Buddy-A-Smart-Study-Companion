import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword"; // <-- added
import Tasks from "./pages/Tasks";
import Flashcards from "./pages/Flashcards";
import Calendar from "./pages/Calendar";
import Notes from "./pages/Notes";
import Profile from "./pages/Profile";
import StudyCircle from "./pages/StudyCircle";
import LearningAptitude from "./pages/LearningAptitude";

function App() {
  return (
<BrowserRouter>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/forgot-password" element={<ForgotPassword />} />
    <Route path="/reset-password/:token" element={<ResetPassword />} />

    <Route
      path="/dashboard"
      element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/profile"
      element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      }
    />
    
    <Route
      path="/tasks"
      element={
        <ProtectedRoute>
          <Tasks />
        </ProtectedRoute>
      }
    />

    <Route
      path="/flashcards"
      element={
        <ProtectedRoute>
          <Flashcards />
        </ProtectedRoute>
      }
    />

    <Route
      path="/calendar"
      element={
        <ProtectedRoute>
          <Calendar />
        </ProtectedRoute>
      }
    />

    <Route
      path="/notes"
      element={
        <ProtectedRoute>
          <Notes />
        </ProtectedRoute>
      }
    />

    <Route
      path="/study-circle"
      element={
        <ProtectedRoute>
          <StudyCircle />
        </ProtectedRoute>
      }
    />

    <Route
      path="/learning-aptitude"
      element={
        <ProtectedRoute>
          <LearningAptitude />
        </ProtectedRoute>
      }
    />

    <Route
      path="/learning-aptitude/:topic/:chapter?"
      element={
        <ProtectedRoute>
          <LearningAptitude />
        </ProtectedRoute>
      }
    />

    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
</BrowserRouter>
  );
}

export default App;
