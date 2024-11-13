import React, { useState, useEffect } from "react";
import { collection, addDoc, onSnapshot, updateDoc, doc, deleteDoc } from "firebase/firestore";  // <-- Import deleteDoc here
import { db } from "../firebaseConfig";
import { Box, TextField, Button, List, ListItem, Checkbox, Typography, LinearProgress, Card, CardContent, CardActions, IconButton } from "@mui/material";
import { Add, Delete } from "@mui/icons-material";

const ToDoList = () => {
  const [todoItems, setTodoItems] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  // Fetch to-do items from Firebase
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "todoList"), (snapshot) => {
      setTodoItems(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  // Add a new to-do item
  const handleAddTodo = async () => {
    if (newTodo.trim()) {
      await addDoc(collection(db, "todoList"), {
        title: newTodo,
        completed: false,
        createdAt: new Date(),
      });
      setNewTodo("");
    }
  };

  // Toggle completion status of a to-do item
  const handleToggleComplete = async (id, completed) => {
    const todoRef = doc(db, "todoList", id);
    await updateDoc(todoRef, { completed: !completed });
  };

  // Delete a to-do item
  const handleDeleteTodo = async (id) => {
    const todoRef = doc(db, "todoList", id);
    await deleteDoc(todoRef);  // <-- Using deleteDoc here
  };

  // Calculate progress
  const completedItems = todoItems.filter((item) => item.completed).length;
  const progress = todoItems.length ? (completedItems / todoItems.length) * 100 : 0;

  return (
    <Box sx={{ p: 4, minHeight: "100vh", backgroundColor: "#fff" }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, color: "#424242" }}>
        To-Do List
      </Typography>

      {/* Add New Todo Item */}
      <Box sx={{ display: "flex", mb: 3, backgroundColor: "white", p: 2, borderRadius: 2, boxShadow: 1 }}>
        <TextField
          label="New To-Do Item"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          fullWidth
          size="small"
          variant="outlined"
        />
        <Button variant="contained" onClick={handleAddTodo} sx={{ ml: 2, height: "100%" }} size="small">
          <Add /> Add
        </Button>
      </Box>

      {/* List of Todo Items */}
      <List>
        {todoItems.map((item) => (
          <Card sx={{ mb: 2, borderRadius: 2, boxShadow: 1 }} key={item.id}>
            <CardContent>
              <ListItem>
                <Checkbox
                  checked={item.completed}
                  onChange={() => handleToggleComplete(item.id, item.completed)}
                  size="small"
                />
                <Typography
                  variant="body1"
                  sx={{
                    textDecoration: item.completed ? "line-through" : "none",
                    color: item.completed ? "gray" : "inherit",
                    fontSize: "1rem",
                    flex: 1,
                  }}
                >
                  {item.title}
                </Typography>
                <IconButton
                  color="secondary"
                  onClick={() => handleDeleteTodo(item.id)}
                  size="small"
                  edge="end"
                >
                  <Delete />
                </IconButton>
              </ListItem>
            </CardContent>
          </Card>
        ))}
      </List>

      {/* Progress Section */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="body1">
          {completedItems}/{todoItems.length} items completed
        </Typography>
        <LinearProgress variant="determinate" value={progress} sx={{ mt: 1 }} />
      </Box>
    </Box>
  );
};

export default ToDoList;
