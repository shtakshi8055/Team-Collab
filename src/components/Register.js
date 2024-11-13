import React, { useState } from "react";
import { auth, db } from "../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Box, TextField, Button, Typography, Container, Grid, Paper, Link } from "@mui/material";

const Register = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      // Check if the email is already registered
      const userDoc = await getDoc(doc(db, "users", email));
      if (userDoc.exists()) {
        setError("This email is already registered.");
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        fullName,
        email,
      });

      navigate("/login");
    } catch (error) {
      setError(error.message);
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
          Create Your Account
        </Typography>
        {error && <Typography sx={{ color: "#f44336", marginBottom: 2 }}>{error}</Typography>}

        <form onSubmit={handleRegister}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Full Name"
                variant="outlined"
                fullWidth
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                autoFocus
                sx={{ marginBottom: 2 }}
                color="primary"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
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
            <Grid item xs={12}>
              <TextField
                label="Confirm Password"
                type="password"
                variant="outlined"
                fullWidth
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
            }}
          >
            Register
          </Button>
        </form>

        <Box sx={{ marginTop: 2, textAlign: "center" }}>
          <Typography variant="body2">
            Already have an account?{" "}
            <Link href="/login" sx={{ textDecoration: "none", color: "#3f51b5", fontWeight: "bold", "&:hover": { textDecoration: "underline" } }}>
              Login Here
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;
