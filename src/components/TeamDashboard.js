import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { Grid, Card, Typography, Button, Select, MenuItem, Box, Divider, List, ListItem, InputLabel, FormControl } from "@mui/material";

const TeamDashboard = () => {
  const [teams, setTeams] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [selectedTask, setSelectedTask] = useState("");
  const [assignees, setAssignees] = useState([]);
  const [teamSummary, setTeamSummary] = useState(null);

  useEffect(() => {
    const unsubscribeTeams = onSnapshot(collection(db, "teams"), (snapshot) => {
      const teamsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setTeams(teamsData);
    });

    const unsubscribeTasks = onSnapshot(collection(db, "tasks"), (snapshot) => {
      setTasks(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubscribeTeams();
      unsubscribeTasks();
    };
  }, []);

  useEffect(() => {
    // Set the team summary whenever a team is selected
    const team = teams.find((team) => team.id === selectedTeam);
    if (team) {
      setTeamSummary(team);
    } else {
      setTeamSummary(null);
    }
  }, [selectedTeam, teams]);

  const handleAssignTask = async () => {
    if (!selectedTask || assignees.length === 0) return alert("Select a task and at least one assignee.");
    try {
      const taskRef = doc(db, "tasks", selectedTask);
      // Assign the task to each selected member
      await Promise.all(assignees.map(async (member) => {
        await updateDoc(taskRef, { assignedTo: member });
      }));
      alert("Task assigned successfully!");
    } catch (error) {
      console.error("Error assigning task: ", error);
    }
  };

  return (
    <Grid container spacing={3} sx={{ padding: 2 }}>
      {/* Team Selection */}
      <Grid item xs={12}>
        <Card sx={{ p: 3, backgroundColor: "#f5f5f5", boxShadow: 3 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>Select a Team</Typography>
          <Select
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
            displayEmpty
            placeholder="Choose a team"
          >
            <MenuItem value="" disabled>
              Choose a team
            </MenuItem>
            {teams.map((team) => (
              <MenuItem key={team.id} value={team.id}>
                {team.name}
              </MenuItem>
            ))}
          </Select>
        </Card>
      </Grid>

      {/* Team Summary Section */}
      {teamSummary && (
        <Grid item xs={12}>
          <Card sx={{ p: 3, backgroundColor: "#f5f5f5", boxShadow: 3 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>Team Summary</Typography>
            <Typography variant="h6">Team Name: {teamSummary.name}</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>Members:</Typography>
            <List>
              {teamSummary.members.map((member, index) => (
                <ListItem key={index}>{member}</ListItem>
              ))}
            </List>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body1" sx={{ mb: 2 }}>Tasks Assigned:</Typography>
            <List>
              {teamSummary.members.map((member, index) => (
                <ListItem key={index}>
                  <Typography>{member}:</Typography>
                  <ul>
                    {tasks
                      .filter((task) => task.assignedTo === member)
                      .map((task) => (
                        <li key={task.id}>{task.title}</li>
                      ))}
                  </ul>
                </ListItem>
              ))}
            </List>
          </Card>
        </Grid>
      )}

      {/* Task Assignment Section */}
      <Grid item xs={12}>
        <Card sx={{ p: 3, backgroundColor: "#f5f5f5", boxShadow: 3 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>Assign Task</Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Select
              value={selectedTask}
              onChange={(e) => setSelectedTask(e.target.value)}
              fullWidth
              displayEmpty
              placeholder="Select a task"
              sx={{ mb: 2 }}
            >
              <MenuItem value="" disabled>
                Select a task
              </MenuItem>
              {tasks.map((task) => (
                <MenuItem key={task.id} value={task.id}>
                  {task.title}
                </MenuItem>
              ))}
            </Select>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Select assignees</InputLabel>
              <Select
                multiple
                value={assignees}
                onChange={(e) => setAssignees(e.target.value)}
                renderValue={(selected) => selected.join(", ")}
                displayEmpty
              >
                {teamSummary?.members.map((member, index) => (
                  <MenuItem key={index} value={member}>
                    {member}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAssignTask}
              sx={{ alignSelf: "flex-end" }}
            >
              Assign Task
            </Button>
          </Box>
        </Card>
      </Grid>
    </Grid>
  );
};

export default TeamDashboard;
