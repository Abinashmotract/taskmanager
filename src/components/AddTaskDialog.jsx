import { useState, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Box,
  Typography,
  Divider,
} from '@mui/material';
import { Add as AddIcon, Close as CloseIcon } from '@mui/icons-material';
import { useTaskContext } from '../context/TaskContext';

const AddTaskDialog = ({ open, onClose }) => {
  const { addTask } = useTaskContext();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    assignee: '',
    dueDate: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = useCallback((field) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: '',
      }));
    }
  }, [errors]);

  const validate = useCallback(() => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!formData.priority) {
      newErrors.priority = 'Priority is required';
    }
    if (!formData.assignee.trim()) {
      newErrors.assignee = 'Assignee is required';
    }
    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(() => {
    if (validate()) {
      const success = addTask(formData);
      if (success) {
        setFormData({
          title: '',
          description: '',
          priority: 'medium',
          assignee: '',
          dueDate: '',
        });
        setErrors({});
        onClose();
      }
    }
  }, [formData, validate, addTask, onClose]);

  const handleClose = useCallback(() => {
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      assignee: '',
      dueDate: '',
    });
    setErrors({});
    onClose();
  }, [onClose]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 1,
        }}
      >
        <Typography variant="h6" component="div" fontWeight="bold">
          Create New Task
        </Typography>
        <Button
          onClick={handleClose}
          sx={{ minWidth: 'auto', p: 0.5 }}
          aria-label="close"
        >
          <CloseIcon />
        </Button>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ pt: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            label="Task Title"
            variant="outlined"
            fullWidth
            value={formData.title}
            onChange={handleChange('title')}
            error={!!errors.title}
            helperText={errors.title || 'Enter a brief title for the task'}
            required
            autoFocus
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 1,
              },
            }}
          />

          {/* Description Field */}
          <TextField
            label="Description"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            value={formData.description}
            onChange={handleChange('description')}
            error={!!errors.description}
            helperText={errors.description || 'Provide detailed information about the task'}
            required
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 1,
              },
            }}
          />

          {/* Priority Field */}
          <TextField
            label="Priority"
            variant="outlined"
            fullWidth
            select
            value={formData.priority}
            onChange={handleChange('priority')}
            error={!!errors.priority}
            helperText={errors.priority || 'Select the priority level for this task'}
            required
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 1,
              },
            }}
          >
            <MenuItem value="low">Low</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="high">High</MenuItem>
            <MenuItem value="urgent">Urgent</MenuItem>
          </TextField>

          {/* Assignee Field */}
          <TextField
            label="Assigned To"
            variant="outlined"
            fullWidth
            value={formData.assignee}
            onChange={handleChange('assignee')}
            error={!!errors.assignee}
            helperText={errors.assignee || 'Enter the name of the person assigned to this task'}
            placeholder="e.g., John Doe"
            required
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 1,
              },
            }}
          />

          {/* Due Date Field */}
          <TextField
            label="Due Date"
            type="date"
            variant="outlined"
            fullWidth
            value={formData.dueDate}
            onChange={handleChange('dueDate')}
            error={!!errors.dueDate}
            helperText={errors.dueDate || 'Select the due date for this task'}
            InputLabelProps={{
              shrink: true,
            }}
            required
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 1,
              },
            }}
          />
        </Box>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ p: 2.5, gap: 1 }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          color="inherit"
          sx={{
            borderRadius: 1,
            textTransform: 'none',
            px: 3,
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            borderRadius: 1,
            textTransform: 'none',
            px: 3,
            backgroundColor: '#04b261',
            color: '#fff',
            '&:hover': {
              backgroundColor: '#039a52',
            },
          }}
        >
          Create Task
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddTaskDialog;

