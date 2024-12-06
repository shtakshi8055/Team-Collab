import React, { useState } from "react";
import { Box, TextField, Button } from "@mui/material";
import { auth, db } from "../firebaseConfig";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import ChatThread from "./ChatThread";

const Chat = ({ receiverId }) => {
  const [newMessage, setNewMessage] = useState("");

  const handleSend = async () => {
    if (newMessage.trim()) {
      try {
        await addDoc(collection(db, "messages"), {
          senderId: auth.currentUser.uid,
          receiverId,
          content: newMessage.trim(),
          timestamp: Timestamp.now(),
          type: "individual",
        });
        setNewMessage("");
      } catch (error) {
        console.error("Error sending message: ", error);
      }
    }
  };

  return (
    <Box sx={{ p: 2, border: "1px solid #ddd", borderRadius: 2, height: "100%" }}>
      {/* Chat Thread */}
      <ChatThread receiverId={receiverId} />

      {/* Input Field */}
      <Box sx={{ mt: 2, display: "flex" }}>
        <TextField
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message"
          variant="outlined"
          fullWidth
        />
        <Button variant="contained" color="primary" onClick={handleSend} sx={{ ml: 1 }}>
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default Chat;
