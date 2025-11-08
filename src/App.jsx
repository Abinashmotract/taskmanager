import { useState, useCallback } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import {
  Container,
  Box,
  Typography,
  Button,
  IconButton,
  AppBar,
  Toolbar,
} from '@mui/material';
import { Add as AddIcon, DarkMode, LightMode } from '@mui/icons-material';
import 'bootstrap/dist/css/bootstrap.min.css';
import { TaskProvider, useTaskContext } from './context/TaskContext';
import { CustomThemeProvider, useThemeContext } from './components/ThemeProvider';
import AddTaskDialog from './components/AddTaskDialog';
import TaskColumn from './components/TaskColumn';
import './App.css';

const TaskManagerContent = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { moveTask, reorderTask } = useTaskContext();
  const { mode, toggleTheme } = useThemeContext();

  const handleDragEnd = useCallback(
    (result) => {
      const { destination, source, draggableId } = result;

      console.log('Drag ended:', { destination, source, draggableId });

      // If dropped outside a droppable area
      if (!destination) {
        console.log('No destination, cancelling drag');
        return;
      }

      // If dropped in the same position
      if (
        destination.droppableId === source.droppableId &&
        destination.index === source.index
      ) {
        console.log('Same position, cancelling drag');
        return;
      }

      // Moving between columns
      if (destination.droppableId !== source.droppableId) {
        console.log('Moving between columns:', source.droppableId, '->', destination.droppableId);
        moveTask(
          draggableId,
          source.droppableId,
          destination.droppableId,
          destination.index
        );
      } else {
        // Reordering within the same column
        console.log('Reordering within column:', source.droppableId);
        reorderTask(
          draggableId,
          source.index,
          destination.index,
          source.droppableId
        );
      }
    },
    [moveTask, reorderTask]
  );

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      {/* App Bar */}
      <AppBar 
        position="sticky" 
        elevation={0} 
        sx={{
          backgroundColor: mode === 'dark' ? '#1e1e1e' : '#fff',
          borderBottom: '1px solid',
          borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
        }}
      >
        <Toolbar>
          <Typography 
            variant="h5" 
            component="div" 
            sx={{ 
              flexGrow: 1, 
              fontWeight: 700, 
              color: mode === 'dark' ? '#fff' : '#000',
            }}
          >
            Task Manager
          </Typography>
          <IconButton
            onClick={toggleTheme}
            sx={{ 
              mr: 2,
              color: mode === 'dark' ? '#fff' : '#000',
            }}
            aria-label="toggle theme"
          >
            {mode === 'dark' ? <LightMode /> : <DarkMode />}
          </IconButton>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setDialogOpen(true)}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              backgroundColor: '#04b261',
              color: '#fff',
              '&:hover': {
                backgroundColor: '#039a52',
              },
            }}
          >
            Add Task
          </Button>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
              },
              gap: 3,
            }}
          >
            {/* All Tasks Column */}
            <TaskColumn
              columnId="all"
              title="All Tasks"
              color="primary"
            />

            {/* Pending Tasks Column */}
            <TaskColumn
              columnId="pending"
              title="Pending"
              color="warning"
            />

            {/* Completed Tasks Column */}
            <TaskColumn
              columnId="completed"
              title="Completed"
              color="success"
            />
          </Box>
        </DragDropContext>
      </Container>

      <AddTaskDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      />
    </Box>
  );
};

function App() {
  return (
    <CustomThemeProvider>
      <TaskProvider>
        <TaskManagerContent />
      </TaskProvider>
    </CustomThemeProvider>
  );
}

export default App;
