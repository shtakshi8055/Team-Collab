import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Grid,
  Card,
  CardContent,
  Collapse,
  Button,
  Typography,
  LinearProgress,
  Box,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  IconButton,
  TextField,
  Divider,
  Tooltip,
} from "@mui/material";
import { collection, onSnapshot, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";
import EditIcon from "@mui/icons-material/Edit";
import { signOut } from 'firebase/auth';
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import { ExpandMore, ExpandLess } from "@mui/icons-material";

// Import team collaboration components
import TeamCreation from "./TeamCreation";
import TeamDashboard from "./TeamDashboard";

const TeamList = ({ teams, onSelectTeam }) => (
  <List>
    {teams.map((team) => (
      <ListItem key={team.id} button onClick={() => onSelectTeam(team.id)}>
        <ListItemText primary={team.name} />
      </ListItem>
    ))}
  </List>
);

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [todoList, setTodoList] = useState([]);
  const [teams, setTeams] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [editMode, setEditMode] = useState(null);
  const [editText, setEditText] = useState("");
  const [dateTime, setDateTime] = useState(new Date());
  const [expandedTeam, setExpandedTeam] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);  // Sign out from Firebase authentication
      navigate('/');   // Redirect to login page after landing page
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);

    // Setup Firestore listeners
    const unsubscribeTasks = onSnapshot(collection(db, "tasks"), (snapshot) => {
      setTasks(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    const unsubscribeTodo = onSnapshot(collection(db, "todoList"), (snapshot) => {
      setTodoList(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    const unsubscribeNotifications = onSnapshot(collection(db, "notifications"), (snapshot) => {
      setNotifications(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    const unsubscribeTeams = onSnapshot(collection(db, "teams"), (snapshot) => {
      setTeams(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      clearInterval(timer);
      unsubscribeTasks();
      unsubscribeTodo();
      unsubscribeNotifications();
      unsubscribeTeams();
    };
  }, []);

  const toggleExpandTeam = () => {
    setExpandedTeam((prevExpanded) => !prevExpanded);
  };

  const formattedDate = dateTime.toLocaleDateString('en-GB'); // Day/Month/Year format
  const formattedTime = dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Only hour and minutes

  const handleToggleTodo = async (id, completed) => {
    const todoRef = doc(db, "todoList", id);
    try {
      await updateDoc(todoRef, { completed: !completed });
    } catch (error) {
      console.error("Error updating todo: ", error);
    }
  };

  const handleEdit = (id, currentText) => {
    setEditMode(id);
    setEditText(currentText);
  };

  const handleSaveEdit = async (id) => {
    const todoRef = doc(db, "todoList", id);
    try {
      await updateDoc(todoRef, { title: editText });
      setEditMode(null);
      setEditText("");
    } catch (error) {
      console.error("Error saving todo edit: ", error);
    }
  };

  const handleCancelEdit = () => {
    setEditMode(null);
    setEditText("");
  };

  const handleDeleteTodo = async (id) => {
    const todoRef = doc(db, "todoList", id);
    try {
      await deleteDoc(todoRef);
    } catch (error) {
      console.error("Error deleting todo: ", error);
    }
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.status === "Completed").length;
  const pendingTasks = tasks.filter((task) => task.status === "Pending").length;
  const inProgressTasks = tasks.filter((task) => task.status === "In Progress").length;

  const upcomingDeadlines = tasks
    .filter((task) => new Date(task.deadline) > new Date())
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
    .slice(0, 5);

  const completedTodoItems = todoList.filter((item) => item.completed).length;
  const todoProgress = todoList.length ? (completedTodoItems / todoList.length) * 100 : 0;

  const upcomingNotifications = tasks.filter((task) => {
    const reminderTime = new Date(task.reminder).getTime();
    const currentTime = new Date().getTime();
    const oneDay = 24 * 60 * 60 * 1000;
    return reminderTime <= currentTime + oneDay && reminderTime > currentTime;
  });

  const tasksByTeam = (teamId) =>
    tasks.filter((task) => task.teamId === teamId).map((task) => ({
      ...task,
      assignedMember: task.assignedMember || "Unassigned",
    }));

  const handleSelectTeam = (teamId) => {
    setSelectedTeam(teamId);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", textAlign: "left" }}>
        Dashboard
      </Typography>

      {/* Display current date and time */}
      <Box sx={{ mb: 3, display: "flex", justifyContent: "flex-end" }}>
        <Typography variant="h6" color="textSecondary" sx={{ mr: 2 }}>
          {formattedDate}
        </Typography>
        <Typography variant="h6" color="textSecondary">
          {formattedTime}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Task Status Summary */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ display: "flex", flexDirection: "column", height: "100%", boxShadow: 3, borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>Project Overview</Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography>Total Projects: {totalTasks}</Typography>
              <Typography>Pending: {pendingTasks}</Typography>
              <Typography>In Progress: {inProgressTasks}</Typography>
              <Typography>Completed: {completedTasks}</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Upcoming Deadlines */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ display: "flex", flexDirection: "column", height: "100%", boxShadow: 3, borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>Upcoming Deadlines</Typography>
              <Divider sx={{ mb: 2 }} />
              {upcomingDeadlines.length ? (
                upcomingDeadlines.map((task) => (
                  <Typography key={task.id} variant="body2" sx={{ mb: 1 }}>
                    {task.title} - Due: {new Date(task.deadline).toLocaleDateString()}
                  </Typography>
                ))
              ) : (
                <Typography>No upcoming deadlines</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* To-Do List Progress */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ display: "flex", flexDirection: "column", height: "100%", boxShadow: 3, borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>Task Progress</Typography>
              <Divider sx={{ mb: 2 }} />
              <LinearProgress variant="determinate" value={todoProgress} sx={{ mb: 2 }} />
              <Typography variant="body2">{todoList.length} tasks - {completedTodoItems} completed</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Team List */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ display: "flex", flexDirection: "column", height: "100%", boxShadow: 3, borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>Teams</Typography>
              <Divider sx={{ mb: 2 }} />
              <TeamList teams={teams} onSelectTeam={handleSelectTeam} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Team Dashboard */}
      {selectedTeam && (
        <TeamDashboard
          tasks={tasksByTeam(selectedTeam)}
          teamId={selectedTeam}
        />
      )}

      {/* Team Creation */}
      <TeamCreation />

      {/* Notifications */}
      <Box sx={{ mt: 5 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>Notifications</Typography>
        {upcomingNotifications.map((notification) => (
          <Typography key={notification.id}>{notification.message}</Typography>
        ))}
      </Box>

      {/* Logout Button */}
      <Box sx={{ mt: 3 }}>
        <Tooltip title="Log out">
          <IconButton onClick={handleLogout} color="secondary">
            Logout
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default Dashboard;
