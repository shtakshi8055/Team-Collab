import React, { useState } from "react";
import { auth } from "../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Box, TextField, Button, Typography, Container, Grid, Paper, Link, CircularProgress } from "@mui/material";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (error) {
      setLoading(false);
      setError("Invalid email or password");
    }
  };

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "#f4f6f8",
      }}
    >
      <Paper
        sx={{
          padding: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          maxWidth: 400,
          boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.1)",
          borderRadius: "8px",
          backgroundColor: "#fff",
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: 3, color: "#333" }}>
          Login to Your Account
        </Typography>
        {error && <Typography sx={{ color: "#f44336", marginBottom: 2, fontSize: "0.875rem" }}>{error}</Typography>}

        <form onSubmit={handleLogin}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
                sx={{ marginBottom: 2 }}
                color="primary"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                sx={{ marginBottom: 2 }}
                color="primary"
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              marginTop: 2,
              padding: 1.5,
              backgroundColor: "#3f51b5",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#303f9f",
              },
              position: "relative",
            }}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ position: "absolute", left: "50%", top: "50%", marginLeft: "-12px", marginTop: "-12px" }} />
            ) : (
              "Login"
            )}
          </Button>
        </form>

        <Box sx={{ marginTop: 2, textAlign: "center" }}>
          <Typography variant="body2">
            Don't have an account?{" "}
            <Link
              href="/register"
              sx={{
                textDecoration: "none",
                color: "#3f51b5",
                fontWeight: "bold",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              Register Here
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
