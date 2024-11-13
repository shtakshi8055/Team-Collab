import React, { useState, useEffect } from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  AppBar,
  Toolbar,
  Typography,
  Divider,
  Collapse,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebaseConfig";
import { signOut } from "firebase/auth";
import DashboardIcon from "@mui/icons-material/Dashboard";
import TaskIcon from "@mui/icons-material/Assignment";
import ListIcon from "@mui/icons-material/List";
import GroupIcon from "@mui/icons-material/Group";
import LogoutIcon from "@mui/icons-material/Logout";
import BusinessIcon from "@mui/icons-material/Business";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const drawerWidth = 240;
const compactDrawerWidth = 60;

const Layout = ({ children }) => {
  const [user, setUser] = useState(null);
  const [teamOpen, setTeamOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleTeamClick = () => {
    setTeamOpen(!teamOpen);
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <Box sx={{ display: "flex", bgcolor: "#f4f6f8", minHeight: "100vh" }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: "#333",
          boxShadow: 3,
        }}
      >
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Task Manager Pro
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Sidebar (Drawer) */}
      <Drawer
        variant="permanent"
        open={drawerOpen}
        sx={{
          width: drawerOpen ? drawerWidth : compactDrawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerOpen ? drawerWidth : compactDrawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#824feb",
            color: "white",
            boxShadow: 3,
          },
        }}
      >
        <Toolbar />
        <List>
          <ListItem button component={Link} to="/dashboard" aria-label="Dashboard">
            <DashboardIcon sx={{ color: "white", mr: drawerOpen ? 2 : 0 }} />
            {drawerOpen && <ListItemText primary="Dashboard" />}
          </ListItem>
          <ListItem button component={Link} to="/tasks" aria-label="Projects">
            <TaskIcon sx={{ color: "white", mr: drawerOpen ? 2 : 0 }} />
            {drawerOpen && <ListItemText primary="Projects" />}
          </ListItem>
          <ListItem button component={Link} to="/todo-list" aria-label="Tasks">
            <ListIcon sx={{ color: "white", mr: drawerOpen ? 2 : 0 }} />
            {drawerOpen && <ListItemText primary="Task" />}
          </ListItem>
          <ListItem button component={Link} to="/crm" aria-label="CRM">
            <BusinessIcon sx={{ color: "white", mr: drawerOpen ? 2 : 0 }} />
            {drawerOpen && <ListItemText primary="CRM" />}
          </ListItem>

          {/* Team Section */}
          <ListItem button onClick={handleTeamClick} aria-expanded={teamOpen} aria-label="Team Section">
            <GroupIcon sx={{ color: "white", mr: drawerOpen ? 2 : 0 }} />
            {drawerOpen && <ListItemText primary="Team" />}
            {drawerOpen && (teamOpen ? <ExpandLess /> : <ExpandMore />)}
          </ListItem>
          <Collapse in={teamOpen && drawerOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding sx={{ pl: 4 }}>
              <ListItem button component={Link} to="/team-creation" aria-label="Create Team">
                <ListItemText primary="Team Creation" />
              </ListItem>
              <ListItem button component={Link} to="/team-dashboard" aria-label="Team Dashboard">
                <ListItemText primary="Team Dashboard" />
              </ListItem>
            </List>
          </Collapse>
        </List>

        <Box sx={{ flexGrow: 1 }} />

        <Divider />

        {/* User Info */}
        <List>
          {user && (
            <ListItem sx={{ display: "flex", alignItems: "center" }}>
              <AccountCircleIcon sx={{ color: "white", mr: drawerOpen ? 2 : 0 }} />
              {drawerOpen && (
                <Typography variant="subtitle1" sx={{ color: "white" }}>
                  {user.fullName || 'Full Name'}
                </Typography>
              )}
            </ListItem>
          )}

          {/* Logout button */}
          <ListItem button onClick={handleLogout} aria-label="Logout">
            <LogoutIcon sx={{ color: "white", mr: drawerOpen ? 2 : 0 }} />
            {drawerOpen && <ListItemText primary="Logout" />}
          </ListItem>

          {/* Toggle Drawer Button */}
          <ListItem button onClick={handleDrawerToggle} sx={{ justifyContent: "center" }} aria-label="Toggle Drawer">
            <MenuOpenIcon
              sx={{
                color: "white",
                transform: drawerOpen ? "rotate(180deg)" : "rotate(0deg)",
              }}
            />
          </ListItem>
        </List>
      </Drawer>

      {/* Main content area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 4,
          bgcolor: "#f4f6f8",
          position: "relative",
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
