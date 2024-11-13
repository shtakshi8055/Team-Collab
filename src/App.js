// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./components/AuthContext";
import Dashboard from "./components/Dashboard";
import TaskManager from "./components/TaskManager";
import ToDoList from "./components/ToDoList";
import Layout from "./components/Layout";
import Login from "./components/Login";
import Register from "./components/Register";
import TeamCreation from "./components/TeamCreation";
import TeamDashboard from "./components/TeamDashboard";
import LandingPage from "./components/LandingPage"
import CRM from "./components/CRM";
import { useAuthState } from "react-firebase-hooks/auth";

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
    <Router>
     
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard/></Layout></ProtectedRoute>}/>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/tasks" element={<Layout><TaskManager/></Layout>}/>
          <Route path="/todo-list" element={<Layout><ToDoList /></Layout>}/>
          <Route path="/team-creation" element={<Layout><TeamCreation /></Layout>} />
          <Route path="/team-dashboard" element={<Layout><TeamDashboard /></Layout>} />
          <Route path="/CRM" element={<Layout><CRM/></Layout>} />
          
        </Routes>
     
    </Router>
    </AuthProvider>
  );
}

export default App;
