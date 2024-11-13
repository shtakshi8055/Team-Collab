import React from 'react';
import { Button, Typography, Box, AppBar, Toolbar, Container, Grid, Card, CardContent, Tooltip } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ bgcolor: '#f4f6f8', minHeight: '100vh', padding: '20px' }}>
      {/* Header */}
      <AppBar position="static" sx={{ bgcolor: '#2196f3' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Task Manager Pro
          </Typography>
          <Button
            color="inherit"
            onClick={() => navigate('/dashboard')}
            aria-label="Login"
            sx={{ marginLeft: 2 }}
          >
            Login
          </Button>
          <Button
            color="inherit"
            onClick={() => navigate('/register')}
            aria-label="Sign Up"
            sx={{ marginLeft: 2 }}
          >
            Sign Up
          </Button>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Container sx={{ textAlign: 'center', my: 5 }}>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
          Transform Your Productivity
        </Typography>
        <Typography variant="h6" color="textSecondary" sx={{ mb: 4 }}>
          A comprehensive task management and team collaboration solution.
        </Typography>
        <Tooltip title="Get Started" arrow>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => navigate('/dashboard')}
            sx={{ fontSize: '1.2rem', padding: '10px 30px' }}
            aria-label="Get Started"
          >
            Get Started
          </Button>
        </Tooltip>
      </Container>

      {/* Features Section */}
      <Container sx={{ mt: 8 }}>
        <Typography variant="h4" align="center" sx={{ mb: 4, fontWeight: 'bold' }}>
          Features
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card sx={{ textAlign: 'center', p: 2 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Task Management</Typography>
                <Typography color="textSecondary">
                  Organize tasks, set priorities, and stay on top of deadlines.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ textAlign: 'center', p: 2 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Team Collaboration</Typography>
                <Typography color="textSecondary">
                  Work together in real-time, assign tasks, and keep everyone in sync.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ textAlign: 'center', p: 2 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Real-Time Updates</Typography>
                <Typography color="textSecondary">
                  Get instant notifications and track progress in real time.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Footer */}
      <Box sx={{ mt: 10, bgcolor: '#333', color: 'white', py: 3, textAlign: 'center' }}>
        <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
          © 2024 Task Manager Pro. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default LandingPage;
