import React, { useEffect, useState } from "react";
import { Box, List, ListItem, Typography } from "@mui/material";
import { auth, db } from "../firebaseConfig";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";

const ChatThread = ({ receiverId }) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const senderId = auth.currentUser.uid;
    const q = query(
      collection(db, "messages"),
      where("senderId", "in", [senderId, receiverId]),
      where("receiverId", "in", [senderId, receiverId]),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, [receiverId]);

  return (
    <Box sx={{ height: "70vh", overflowY: "auto", border: "1px solid #ddd", borderRadius: 2, p: 2 }}>
      <List>
        {messages.map((msg) => (
          <ListItem key={msg.id} sx={{ display: "flex", justifyContent: msg.senderId === auth.currentUser.uid ? "flex-end" : "flex-start" }}>
            <Typography
              sx={{
                backgroundColor: msg.senderId === auth.currentUser.uid ? "#d1e7dd" : "#f8d7da",
                padding: "8px 12px",
                borderRadius: "8px",
                maxWidth: "70%",
                wordWrap: "break-word",
              }}
            >
              {msg.content}
            </Typography>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default ChatThread;
