import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebaseConfig";
import { collection, query, where, getDocs, updateDoc, doc, addDoc } from "firebase/firestore";
import { TextField, Button, Typography, Box } from "@mui/material";

const InvitationPage = () => {
  const { token } = useParams(); // Get the token from the URL
  const navigate = useNavigate();
  const [invitation, setInvitation] = useState(null);
  const [name, setName] = useState("");
  const [usermail, setUsermail] = useState("");

  useEffect(() => {
    const fetchInvitation = async () => {
      const q = query(collection(db, "invitations"), where("token", "==", token));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        alert("Invalid or expired invitation link.");
        navigate("/"); // Redirect to home page
        return;
      }

      const invitationData = querySnapshot.docs[0];
      setInvitation({ id: invitationData.id, ...invitationData.data() });
    };

    fetchInvitation();
  }, [token, navigate]);

  const handleAcceptInvitation = async () => {
    if (!name || !usermail) return alert("Please enter your name and email to accept the invitation.");

    try {
      // Add the person with name, email, and invitee email to the "people" collection
      await addDoc(collection(db, "people"), { name, email: usermail });

      // Mark the invitation as used
      await updateDoc(doc(db, "invitations", invitation.id), { used: true });

      alert("Invitation accepted! Welcome!");
      navigate("/"); // Redirect to the home page or dashboard
    } catch (error) {
      console.error("Error accepting invitation: ", error);
      alert("Failed to accept the invitation.");
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {invitation ? (
        <>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Welcome! Accept the Invitation
          </Typography>
          <Typography variant="body2" sx={{ mb: 3 }}>
            You were invited by {invitation.email}.
          </Typography>
          <TextField
            label="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Your Email"
            value={usermail}
            onChange={(e) => setUsermail(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <Button variant="contained" onClick={handleAcceptInvitation}>
            Accept Invitation
          </Button>
        </>
      ) : (
        <Typography>Loading...</Typography>
      )}
    </Box>
  );
};

export default InvitationPage;
