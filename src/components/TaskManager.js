import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  Grid,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Add, Edit, Delete, Save, Cancel } from "@mui/icons-material";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebaseConfig";

const calculateReminderDate = (deadline) => {
  const reminderDate = new Date(deadline);
  reminderDate.setDate(reminderDate.getDate() - 1);
  return reminderDate.toISOString();
};

const showNotification = (message) => {
  if (Notification.permission === "granted") {
    new Notification(message);
  }
};

const checkTaskReminders = (tasks) => {
  tasks.forEach((task) => {
    const reminderTime = new Date(task.reminder).getTime();
    const currentTime = new Date().getTime();

    if (reminderTime <= currentTime && reminderTime + 60000 > currentTime) {
      showNotification(`Reminder: Task "${task.title}" is due soon!`);
    }
  });
};

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    deadline: "",
    priority: "Low",
    status: "Pending",
    reminder: "",
  });
  const [isEditing, setIsEditing] = useState(null);

  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
    const interval = setInterval(() => {
      checkTaskReminders(tasks);
    }, 60000);
    return () => clearInterval(interval);
  }, [tasks]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "tasks"));
      const tasksData = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setTasks(tasksData);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const addTask = async () => {
    if (!newTask.title || !newTask.deadline) {
      alert("Title and Deadline are required.");
      return;
    }
    const reminderDate = calculateReminderDate(newTask.deadline);
    const taskWithReminder = { ...newTask, reminder: reminderDate };

    try {
      const docRef = await addDoc(collection(db, "tasks"), taskWithReminder);
      setTasks([...tasks, { ...taskWithReminder, id: docRef.id }]);
      resetForm();
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const editTask = (task) => {
    setNewTask(task);
    setIsEditing(task.id);
  };

  const saveTask = async () => {
    if (!isEditing) return;

    const taskRef = doc(db, "tasks", isEditing);
    try {
      await updateDoc(taskRef, newTask);
      setTasks(tasks.map((task) => (task.id === isEditing ? newTask : task)));
      resetForm();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const resetForm = () => {
    setNewTask({
      title: "",
      description: "",
      deadline: "",
      priority: "Low",
      status: "Pending",
      reminder: "",
    });
    setIsEditing(null);
  };

  const deleteTask = async (taskId) => {
    try {
      await deleteDoc(doc(db, "tasks", taskId));
      setTasks(tasks.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <Box sx={{ p: 4, minHeight: "100vh", backgroundColor: "#f4f6f8" }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, color: "#424242", fontWeight: "bold" }}>
        Task Manager
      </Typography>
      <Box
        component="form"
        sx={{
          display: "flex",
          gap: 2,
          alignItems: "center",
          mb: 3,
          backgroundColor: "white",
          p: 2,
          borderRadius: 2,
          boxShadow: 2,
        }}
      >
        <TextField
          label="Title"
          variant="outlined"
          size="small"
          fullWidth
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          sx={{ backgroundColor: "#fff" }}
        />
        <TextField
          label="Description"
          variant="outlined"
          size="small"
          fullWidth
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          sx={{ backgroundColor: "#fff" }}
        />
        <TextField
          label="Deadline"
          type="date"
          InputLabelProps={{ shrink: true }}
          variant="outlined"
          size="small"
          fullWidth
          value={newTask.deadline}
          onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
          sx={{ backgroundColor: "#fff" }}
        />
        <Select
          value={newTask.priority}
          onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
          variant="outlined"
          size="small"
          fullWidth
          sx={{ backgroundColor: "#fff" }}
        >
          <MenuItem value="Low">Low</MenuItem>
          <MenuItem value="Medium">Medium</MenuItem>
          <MenuItem value="High">High</MenuItem>
        </Select>
        <Select
          value={newTask.status}
          onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
          variant="outlined"
          size="small"
          fullWidth
          sx={{ backgroundColor: "#fff" }}
        >
          <MenuItem value="Pending">Pending</MenuItem>
          <MenuItem value="In Progress">In Progress</MenuItem>
          <MenuItem value="Completed">Completed</MenuItem>
        </Select>

        {isEditing ? (
          <>
            <Button variant="contained" color="primary" startIcon={<Save />} onClick={saveTask} size="small">
              Save
            </Button>
            <Button variant="outlined" color="secondary" startIcon={<Cancel />} onClick={resetForm} size="small">
              Cancel
            </Button>
          </>
        ) : (
          <Button variant="contained" color="primary" startIcon={<Add />} onClick={addTask} size="small">
            Add Task
          </Button>
        )}
      </Box>

      <Grid container spacing={3}>
        {tasks.map((task) => (
          <Grid item xs={12} sm={6} md={4} key={task.id}>
            <Card sx={{ borderRadius: 2, boxShadow: 3, "&:hover": { boxShadow: 5 }, backgroundColor: "#fff" }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: "#424242", fontWeight: "bold" }}>
                  {task.title}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  {task.description}
                </Typography>
                <Box display="flex" justifyContent="space-between" my={1}>
                  <Typography variant="body2" color="textSecondary">
                    Deadline: {task.deadline}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: task.priority === "High" ? "#ff5722" : task.priority === "Medium" ? "#ff9800" : "#4caf50",
                      fontWeight: "bold",
                    }}
                  >
                    {task.priority}
                  </Typography>
                </Box>
                <Typography variant="body2" color="textSecondary">
                  Status: <strong>{task.status}</strong>
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Reminder: {new Date(task.reminder).toLocaleString()}
                </Typography>
              </CardContent>
              <CardActions>
                <Tooltip title="Edit Task">
                  <IconButton color="primary" onClick={() => editTask(task)}>
                    <Edit />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete Task">
                  <IconButton color="secondary" onClick={() => deleteTask(task.id)}>
                    <Delete />
                  </IconButton>
                </Tooltip>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default TaskManager;
