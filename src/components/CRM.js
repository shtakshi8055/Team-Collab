import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import {
  Box, Typography, Grid, Button, TextField, List, ListItem, ListItemText, IconButton, Select, MenuItem, FormControl, InputLabel, Paper
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const CRM = () => {
  const [customers, setCustomers] = useState([]);
  const [leads, setLeads] = useState([]);
  const [interactions, setInteractions] = useState([]);
  const [newCustomer, setNewCustomer] = useState({ name: '', contact: '', company: '', status: 'prospective' });
  const [newLead, setNewLead] = useState({ customerId: '', source: '', interestLevel: 'medium', status: 'contacted' });
  const [newInteraction, setNewInteraction] = useState({ customerId: '', date: '', type: 'call', notes: '' });
  const [editMode, setEditMode] = useState({ id: null, type: '' });

  useEffect(() => {
    const unsubscribeCustomers = onSnapshot(collection(db, "customers"), (snapshot) => {
      setCustomers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const unsubscribeLeads = onSnapshot(collection(db, "leads"), (snapshot) => {
      setLeads(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const unsubscribeInteractions = onSnapshot(collection(db, "interactions"), (snapshot) => {
      setInteractions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubscribeCustomers();
      unsubscribeLeads();
      unsubscribeInteractions();
    };
  }, []);

  const handleAddOrEditCustomer = async () => {
    if (editMode.id && editMode.type === 'customer') {
      await updateDoc(doc(db, 'customers', editMode.id), newCustomer);
      setEditMode({ id: null, type: '' });
    } else {
      await addDoc(collection(db, 'customers'), newCustomer);
    }
    setNewCustomer({ name: '', contact: '', company: '', status: 'prospective' });
  };

  const handleAddOrEditLead = async () => {
    if (editMode.id && editMode.type === 'lead') {
      await updateDoc(doc(db, 'leads', editMode.id), newLead);
      setEditMode({ id: null, type: '' });
    } else {
      await addDoc(collection(db, 'leads'), newLead);
    }
    setNewLead({ customerId: '', source: '', interestLevel: 'medium', status: 'contacted' });
  };

  const handleAddOrEditInteraction = async () => {
    if (editMode.id && editMode.type === 'interaction') {
      await updateDoc(doc(db, 'interactions', editMode.id), newInteraction);
      setEditMode({ id: null, type: '' });
    } else {
      await addDoc(collection(db, 'interactions'), newInteraction);
    }
    setNewInteraction({ customerId: '', date: '', type: 'call', notes: '' });
  };

  const handleDelete = async (id, type) => {
    try {
      await deleteDoc(doc(db, type, id));
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  const startEdit = (item, type) => {
    setEditMode({ id: item.id, type });
    if (type === 'customer') setNewCustomer({ name: item.name, contact: item.contact, company: item.company, status: item.status });
    else if (type === 'lead') setNewLead({ customerId: item.customerId, source: item.source, interestLevel: item.interestLevel, status: item.status });
    else if (type === 'interaction') setNewInteraction({ customerId: item.customerId, date: item.date, type: item.type, notes: item.notes });
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>CRM Dashboard</Typography>

      {/* Add/Edit Customer */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
          {editMode.id && editMode.type === 'customer' ? 'Edit Customer' : 'Add New Customer'}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField label="Name" fullWidth value={newCustomer.name} onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })} />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField label="Contact" fullWidth value={newCustomer.contact} onChange={(e) => setNewCustomer({ ...newCustomer, contact: e.target.value })} />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField label="Company" fullWidth value={newCustomer.company} onChange={(e) => setNewCustomer({ ...newCustomer, company: e.target.value })} />
          </Grid>
        </Grid>
        <Button onClick={handleAddOrEditCustomer} variant="contained" sx={{ mt: 2, backgroundColor: '#1976d2' }}>
          {editMode.id && editMode.type === 'customer' ? 'Save Changes' : 'Add Customer'}
        </Button>
      </Paper>

      {/* Lead Management */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
          {editMode.id && editMode.type === 'lead' ? 'Edit Lead' : 'Add New Lead'}
        </Typography>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Customer</InputLabel>
          <Select
            value={newLead.customerId}
            onChange={(e) => setNewLead({ ...newLead, customerId: e.target.value })}
            label="Customer"
          >
            {customers.map((customer) => (
              <MenuItem key={customer.id} value={customer.id}>{customer.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField label="Source" fullWidth value={newLead.source} onChange={(e) => setNewLead({ ...newLead, source: e.target.value })} />
        <Button onClick={handleAddOrEditLead} variant="contained" sx={{ mt: 2, backgroundColor: '#1976d2' }}>
          {editMode.id && editMode.type === 'lead' ? 'Save Changes' : 'Add Lead'}
        </Button>
      </Paper>

      {/* Interaction Logging */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
          {editMode.id && editMode.type === 'interaction' ? 'Edit Interaction' : 'Log Interaction'}
        </Typography>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Customer</InputLabel>
          <Select
            value={newInteraction.customerId}
            onChange={(e) => setNewInteraction({ ...newInteraction, customerId: e.target.value })}
            label="Customer"
          >
            {customers.map((customer) => (
              <MenuItem key={customer.id} value={customer.id}>{customer.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          type="date"
          label="Date"
          fullWidth
          InputLabelProps={{ shrink: true }}
          value={newInteraction.date}
          onChange={(e) => setNewInteraction({ ...newInteraction, date: e.target.value })}
        />
        <Button onClick={handleAddOrEditInteraction} variant="contained" sx={{ mt: 2, backgroundColor: '#1976d2' }}>
          {editMode.id && editMode.type === 'interaction' ? 'Save Changes' : 'Log Interaction'}
        </Button>
      </Paper>

      {/* Display Customers, Leads, and Interactions */}
      <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 2 }}>
        Customers
      </Typography>
      <List>
        {customers.map((customer) => (
          <ListItem key={customer.id}>
            <ListItemText primary={`${customer.name} (${customer.company})`} secondary={`Status: ${customer.status}`} />
            <IconButton onClick={() => startEdit(customer, 'customer')}>
              <Edit />
            </IconButton>
            <IconButton onClick={() => handleDelete(customer.id, 'customers')}>
              <Delete />
            </IconButton>
          </ListItem>
        ))}
      </List>

      <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 2 }}>
        Leads
      </Typography>
      <List>
        {leads.map((lead) => (
          <ListItem key={lead.id}>
            <ListItemText
              primary={`Customer: ${lead.customerId} - Source: ${lead.source}`}
              secondary={`Interest Level: ${lead.interestLevel} - Status: ${lead.status}`}
            />
            <IconButton onClick={() => startEdit(lead, 'lead')}>
              <Edit />
            </IconButton>
            <IconButton onClick={() => handleDelete(lead.id, 'leads')}>
              <Delete />
            </IconButton>
          </ListItem>
        ))}
      </List>

      <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 2 }}>
        Interactions
      </Typography>
      <List>
        {interactions.map((interaction) => (
          <ListItem key={interaction.id}>
            <ListItemText
              primary={`Customer: ${interaction.customerId} - Date: ${interaction.date}`}
              secondary={`Type: ${interaction.type} - Notes: ${interaction.notes}`}
            />
            <IconButton onClick={() => startEdit(interaction, 'interaction')}>
              <Edit />
            </IconButton>
            <IconButton onClick={() => handleDelete(interaction.id, 'interactions')}>
              <Delete />
            </IconButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default CRM;
