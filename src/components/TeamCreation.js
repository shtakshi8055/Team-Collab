import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, addDoc, deleteDoc, updateDoc, doc, onSnapshot } from "firebase/firestore";
import { TextField, Button, Typography, Box, List, Card, CardContent, CardActions, IconButton, Divider, MenuItem, Select } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";

const TeamCreation = () => {
  const [teamName, setTeamName] = useState("");
  const [selectedMember, setSelectedMember] = useState(""); // To store selected member's name
  const [members, setMembers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [editMode, setEditMode] = useState(null);
  const [editTeamName, setEditTeamName] = useState("");
  const [editMembers, setEditMembers] = useState([]);
  const [peopleList, setPeopleList] = useState([]); // List of people from the people management page

  // Fetch all people in real-time (those added through People Management page)
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "people"), (snapshot) => {
      const peopleData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPeopleList(peopleData);
    });
    return unsubscribe; // Cleanup listener on component unmount
  }, []);

  // Fetch teams in real-time
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "teams"), (snapshot) => {
      const teamsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setTeams(teamsData);
    });
    return unsubscribe; // Cleanup listener on component unmount
  }, []);

  const handleAddMember = () => {
    if (selectedMember && !members.includes(selectedMember)) {
      setMembers([...members, selectedMember]);
      setSelectedMember(""); // Reset selected member field
    }
  };

  const handleCreateTeam = async () => {
    if (!teamName || members.length === 0) return alert("Enter team name and add members.");
    try {
      await addDoc(collection(db, "teams"), {
        name: teamName,
        members,
        createdAt: new Date(),
      });
      setTeamName("");
      setMembers([]);
      alert("Team created successfully!");
    } catch (error) {
      console.error("Error creating team: ", error);
    }
  };

  const handleDeleteTeam = async (teamId) => {
    try {
      await deleteDoc(doc(db, "teams", teamId));
      alert("Team deleted successfully!");
    } catch (error) {
      console.error("Error deleting team: ", error);
    }
  };

  const handleEditTeam = (team) => {
    setEditMode(team.id);
    setEditTeamName(team.name);
    setEditMembers([...team.members]);
  };

  const handleSaveEdit = async (teamId) => {
    try {
      await updateDoc(doc(db, "teams", teamId), {
        name: editTeamName,
        members: editMembers,
      });
      setEditMode(null);
      alert("Team updated successfully!");
    } catch (error) {
      console.error("Error updating team: ", error);
    }
  };

  const handleCancelEdit = () => {
    setEditMode(null);
    setEditTeamName("");
    setEditMembers([]);
  };

  const handleAddMemberToEdit = () => {
    if (selectedMember && !editMembers.includes(selectedMember)) {
      setEditMembers([...editMembers, selectedMember]);
      setSelectedMember("");
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Create Team Section */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" sx={{ mb: 2 }}>Create a Team</Typography>
          <TextField
            label="Team Name"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <Select
            value={selectedMember}
            onChange={(e) => setSelectedMember(e.target.value)}
            fullWidth
            displayEmpty
            sx={{ mb: 2 }}
          >
            <MenuItem value="" disabled>
              Add a member
            </MenuItem>
            {peopleList.map((person) => (
              <MenuItem key={person.id} value={person.name}>
                {person.name}
              </MenuItem>
            ))}
          </Select>
          <Button variant="contained" onClick={handleAddMember} sx={{ mb: 2 }}>
            Add Member
          </Button>
          <Typography variant="body2" color="textSecondary">Members: {members.join(", ")}</Typography>
          <Box sx={{ mt: 2 }}>
            <Button variant="contained" color="primary" onClick={handleCreateTeam}>
              Create Team
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Teams List Section */}
      <Divider sx={{ my: 4 }} />
      <Typography variant="h5" sx={{ mb: 2 }}>Teams</Typography>
      <List>
        {teams.map((team) => (
          <Card key={team.id} sx={{ mb: 2 }}>
            <CardContent sx={{ display: "flex", flexDirection: "column" }}>
              {editMode === team.id ? (
                <>
                  <TextField
                    label="Team Name"
                    value={editTeamName}
                    onChange={(e) => setEditTeamName(e.target.value)}
                    fullWidth
                    sx={{ mb: 2 }}
                  />
                  <Select
                    value={selectedMember}
                    onChange={(e) => setSelectedMember(e.target.value)}
                    fullWidth
                    displayEmpty
                    sx={{ mb: 2 }}
                  >
                    <MenuItem value="" disabled>
                      Add a member
                    </MenuItem>
                    {peopleList.map((person) => (
                      <MenuItem key={person.id} value={person.name}>
                        {person.name}
                      </MenuItem>
                    ))}
                  </Select>
                  <Button variant="outlined" onClick={handleAddMemberToEdit} sx={{ mb: 2 }}>
                    Add Member
                  </Button>
                  <Typography>Members: {editMembers.join(", ")}</Typography>
                  <Box sx={{ display: "flex", mt: 2 }}>
                    <IconButton onClick={() => handleSaveEdit(team.id)}><SaveIcon /></IconButton>
                    <IconButton onClick={handleCancelEdit}><CancelIcon /></IconButton>
                  </Box>
                </>
              ) : (
                <>
                  <Typography variant="h6">{team.name}</Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                    Members: {team.members.join(", ")}
                  </Typography>
                  <CardActions sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <IconButton onClick={() => handleEditTeam(team)}><EditIcon /></IconButton>
                    <IconButton onClick={() => handleDeleteTeam(team.id)}><DeleteIcon /></IconButton>
                  </CardActions>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </List>
    </Box>
  );
};

export default TeamCreation;
