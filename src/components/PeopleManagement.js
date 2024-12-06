import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import {
  TextField,
  Button,
  Typography,
  Box,
  CardActions,
  Card,
  CardContent,
  IconButton,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
} from "@mui/material";
import { Link } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

const PeopleManagement = () => {
  const [people, setPeople] = useState([]);
  const [newPerson, setNewPerson] = useState({ name: "", email: "" });
  const [editPerson, setEditPerson] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "" });

  // Fetch people in real-time
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "people"), (snapshot) => {
      const peopleData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPeople(peopleData);
    });
    return unsubscribe; // Cleanup listener on component unmount
  }, []);

  const handleAddPerson = async () => {
    if (!newPerson.name || !newPerson.email) {
      return setSnackbar({ open: true, message: "All fields are required.", severity: "error" });
    }
    try {
      await addDoc(collection(db, "people"), newPerson);
      setNewPerson({ name: "", email: "" });
      setSnackbar({ open: true, message: "Person added successfully!", severity: "success" });
    } catch (error) {
      console.error("Error adding person: ", error);
      setSnackbar({ open: true, message: "Failed to add person.", severity: "error" });
    }
  };

  const handleDeletePerson = async (personId) => {
    try {
      await deleteDoc(doc(db, "people", personId));
      setSnackbar({ open: true, message: "Person deleted successfully!", severity: "success" });
    } catch (error) {
      console.error("Error deleting person: ", error);
      setSnackbar({ open: true, message: "Failed to delete person.", severity: "error" });
    }
  };

  const handleEditDialogOpen = (person) => {
    setEditPerson(person);
    setDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setDialogOpen(false);
    setEditPerson(null);
  };

  const handleUpdatePerson = async () => {
    if (!editPerson.name || !editPerson.email) {
      return setSnackbar({ open: true, message: "All fields are required.", severity: "error" });
    }
    try {
      await updateDoc(doc(db, "people", editPerson.id), {
        name: editPerson.name,
        email: editPerson.email,
      });
      setSnackbar({ open: true, message: "Person updated successfully!", severity: "success" });
      handleEditDialogClose();
    } catch (error) {
      console.error("Error updating person: ", error);
      setSnackbar({ open: true, message: "Failed to update person.", severity: "error" });
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        People Management
      </Typography>

      {/* Add New Person */}
      <Card sx={{ mb: 4, p: 2 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Add New Person
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                label="Name"
                value={newPerson.name}
                onChange={(e) => setNewPerson({ ...newPerson, name: e.target.value })}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Email"
                value={newPerson.email}
                onChange={(e) => setNewPerson({ ...newPerson, email: e.target.value })}
                fullWidth
              />
            </Grid>
          </Grid>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            sx={{ mt: 2 }}
            onClick={handleAddPerson}
          >
            Add Person
          </Button>
        </CardContent>
      </Card>

      <Button 
  component={Link} 
  to="/generate-invitation"
  variant="outlined"
>
  Generate Invitation
</Button>

      {/* List of People */}
      <Typography variant="h5" sx={{ mb: 2 }}>
        People List
      </Typography>
      <Grid container spacing={3}>
        {people.map((person) => (
          <Grid item xs={12} sm={6} md={4} key={person.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{person.name}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {person.email}
                </Typography>
              </CardContent>
              <CardActions>
                <IconButton color="primary" onClick={() => handleEditDialogOpen(person)}>
                  <EditIcon />
                </IconButton>
                <IconButton color="error" onClick={() => handleDeletePerson(person.id)}>
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Edit Person Dialog */}
      <Dialog open={dialogOpen} onClose={handleEditDialogClose}>
        <DialogTitle>Edit Person</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            value={editPerson?.name || ""}
            onChange={(e) => setEditPerson({ ...editPerson, name: e.target.value })}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Email"
            value={editPerson?.email || ""}
            onChange={(e) => setEditPerson({ ...editPerson, email: e.target.value })}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditDialogClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleUpdatePerson} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar Notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PeopleManagement;
