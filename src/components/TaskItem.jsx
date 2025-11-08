import { memo } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import {
  Card,
  CardContent,
  IconButton,
  Typography,
  Box,
  Chip,
  Avatar,
} from '@mui/material';
import { Delete as DeleteIcon, DragIndicator, Person, CalendarToday } from '@mui/icons-material';
import { useTaskContext } from '../context/TaskContext';

const TaskItem = memo(({ task, index, column }) => {
  const { deleteTask } = useTaskContext();

  const handleDelete = (e) => {
    e.stopPropagation();
    deleteTask(task.id);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'error';
      case 'high':
        return 'warning';
      case 'medium':
        return 'info';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  const getPriorityLabel = (priority) => {
    return priority ? priority.charAt(0).toUpperCase() + priority.slice(1) : 'Medium';
  };

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`task-item ${snapshot.isDragging ? 'dragging' : ''}`}
          sx={{
            mb: 2,
            transition: 'all 0.3s ease',
            transform: snapshot.isDragging ? 'rotate(2deg) scale(1.02)' : 'none',
            boxShadow: snapshot.isDragging
              ? '0 8px 24px rgba(0,0,0,0.25)'
              : '0 2px 8px rgba(0,0,0,0.1)',
            cursor: 'grab',
            '&:active': {
              cursor: 'grabbing',
            },
            '&:hover': {
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            },
            animation: 'slideIn 0.3s ease-out',
          }}
        >
          <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
            {/* Drag Handle and Title */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 1,
                mb: 1.5,
                cursor: 'grab',
                '&:active': {
                  cursor: 'grabbing',
                },
              }}
            >
              <DragIndicator
                sx={{
                  color: 'text.secondary',
                  fontSize: 20,
                  mt: 0.5,
                  flexShrink: 0,
                }}
              />
              <Typography
                variant="h6"
                component="div"
                sx={{
                  flex: 1,
                  fontWeight: 600,
                  fontSize: '1rem',
                  lineHeight: 1.4,
                  wordBreak: 'break-word',
                }}
              >
                {task.title}
              </Typography>
            </Box>

            {/* Description */}
            {task.description && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mb: 1.5,
                  ml: 4,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {task.description}
              </Typography>
            )}

            {/* Footer: Priority, Assignee, Due Date, Delete */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 1,
                mt: 1.5,
                pt: 1.5,
                borderTop: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, flexWrap: 'wrap' }}>
                {/* Priority Chip */}
                <Chip
                  label={getPriorityLabel(task.priority)}
                  color={getPriorityColor(task.priority)}
                  size="small"
                  sx={{
                    height: 24,
                    fontSize: '0.7rem',
                    fontWeight: 600,
                  }}
                />

                {/* Assignee */}
                {task.assignee && (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                      ml: 1,
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 20,
                        height: 20,
                        bgcolor: 'primary.main',
                        fontSize: '0.7rem',
                      }}
                    >
                      <Person sx={{ fontSize: 14 }} />
                    </Avatar>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ fontSize: '0.7rem' }}
                    >
                      {task.assignee}
                    </Typography>
                  </Box>
                )}

                {/* Due Date */}
                {task.dueDate && (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                      ml: 1,
                    }}
                  >
                    <CalendarToday
                      sx={{
                        fontSize: 14,
                        color: 'text.secondary',
                      }}
                    />
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ fontSize: '0.7rem' }}
                    >
                      {new Date(task.dueDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </Typography>
                  </Box>
                )}
              </Box>

              {/* Delete Button */}
              <IconButton
                onClick={handleDelete}
                color="error"
                size="small"
                sx={{ flexShrink: 0 }}
                aria-label="delete task"
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          </CardContent>
        </Card>
      )}
    </Draggable>
  );
});

TaskItem.displayName = 'TaskItem';

export default TaskItem;
