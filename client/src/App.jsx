import { BrowserRouter, Routes, Route } from "react-router-dom";

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
  </Routes>
</BrowserRouter>
  );
}

export default App;
