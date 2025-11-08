import { memo, useMemo } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { Box, Typography, Paper } from '@mui/material';
import { useTaskContext } from '../context/TaskContext';
import TaskItem from './TaskItem';

const TaskColumn = memo(({ columnId, title, color }) => {
  const { getTasksForColumn } = useTaskContext();

  const tasks = useMemo(() => {
    return getTasksForColumn(columnId);
  }, [getTasksForColumn, columnId]);

  const getColumnColor = () => {
    switch (color) {
      case 'primary':
        return 'primary.main';
      case 'warning':
        return 'warning.main';
      case 'success':
        return 'success.main';
      default:
        return 'grey.500';
    }
  };

  return (
    <Paper
      elevation={2}
      sx={{
        flex: 1,
        minHeight: '600px',
        maxHeight: 'calc(100vh - 200px)',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          borderBottom: '2px solid',
          borderColor: getColumnColor(),
          backgroundColor: 'background.paper',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: 700,
              color: getColumnColor(),
              textTransform: 'uppercase',
              fontSize: '0.9rem',
              letterSpacing: 1,
            }}
          >
            {title}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              fontWeight: 600,
              px: 1.5,
              py: 0.5,
              borderRadius: 1,
              backgroundColor: 'action.hover',
            }}
          >
            {tasks.length}
          </Typography>
        </Box>
      </Box>

      {/* Droppable Area */}
      <Droppable droppableId={columnId}>
        {(provided, snapshot) => (
          <Box
            ref={provided.innerRef}
            {...provided.droppableProps}
            sx={{
              flex: 1,
              p: 2,
              overflowY: 'auto',
              backgroundColor: snapshot.isDraggingOver
                ? 'action.hover'
                : 'background.default',
              transition: 'background-color 0.2s ease',
              minHeight: '200px',
              '&::-webkit-scrollbar': {
                width: '8px',
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: 'transparent',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: 'action.disabled',
                borderRadius: '4px',
                '&:hover': {
                  backgroundColor: 'action.disabledBackground',
                },
              },
            }}
          >
            {tasks.length === 0 ? (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  py: 8,
                  color: 'text.secondary',
                }}
              >
                <Typography variant="body2" align="center">
                  {columnId === 'all'
                    ? 'No tasks yet'
                    : columnId === 'pending'
                    ? 'No pending tasks'
                    : 'No completed tasks'}
                </Typography>
                <Typography variant="caption" sx={{ mt: 1, opacity: 0.7 }}>
                  {snapshot.isDraggingOver
                    ? 'Drop task here'
                    : 'Drag tasks here or create a new one'}
                </Typography>
              </Box>
            ) : (
              tasks.map((task, index) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  index={index}
                  column={columnId}
                />
              ))
            )}
            {provided.placeholder}
          </Box>
        )}
      </Droppable>
    </Paper>
  );
});

TaskColumn.displayName = 'TaskColumn';

export default TaskColumn;

