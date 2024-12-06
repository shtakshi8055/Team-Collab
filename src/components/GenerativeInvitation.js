import React, { useState } from "react";
import { db } from "../firebaseConfig";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid"; // Install with `npm install uuid`
import { TextField, Button, Typography, Box } from "@mui/material";

const GenerateInvitation = () => {
  const [email, setEmail] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");

  const handleGenerateLink = async () => {
    if (!email) return alert("Please enter an email to send the invitation.");

    const token = uuidv4(); // Generate unique token
    try {
      await addDoc(collection(db, "invitations"), {
        email,
        token,
        createdAt: Timestamp.now(),
        used: false, // To track if the invitation is already used
      });

      const link = `${window.location.origin}/invite/${token}`; // Generate the full link
      setGeneratedLink(link);
      alert("Invitation link generated successfully!");
    } catch (error) {
      console.error("Error generating invitation: ", error);
      alert("Failed to generate invitation.");
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Generate Invitation Link
      </Typography>
      <TextField
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />
      <Button variant="contained" onClick={handleGenerateLink}>
        Generate Link
      </Button>

      {generatedLink && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="body1">
            Invitation Link:{" "}
            <a href={generatedLink} target="_blank" rel="noopener noreferrer">
              {generatedLink}
            </a>
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default GenerateInvitation;
