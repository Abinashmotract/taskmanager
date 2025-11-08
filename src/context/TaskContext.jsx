import { createContext, useContext, useCallback, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const TaskContext = createContext();

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useLocalStorage('tasks', []);

  // Add a new task with multiple fields
  const addTask = useCallback((taskData) => {
    if (!taskData.title || taskData.title.trim() === '') {
      return false; // Form validation - prevent empty tasks
    }
    const newTask = {
      id: Date.now().toString(),
      title: taskData.title.trim(),
      description: taskData.description?.trim() || '',
      priority: taskData.priority || 'medium',
      assignee: taskData.assignee?.trim() || '',
      dueDate: taskData.dueDate || '',
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTasks((prevTasks) => [...prevTasks, newTask]);
    return true;
  }, [setTasks]);

  // Move task between columns (for drag and drop)
  const moveTask = useCallback((taskId, sourceColumn, destinationColumn, destinationIndex) => {
    setTasks((prevTasks) => {
      console.log('moveTask called:', { taskId, sourceColumn, destinationColumn, destinationIndex });
      
      // Find the task to move
      const task = prevTasks.find(t => t.id === taskId);
      if (!task) {
        console.log('Task not found:', taskId);
        return prevTasks;
      }

      console.log('Found task:', task);

      // Determine new completion status based on destination column
      let newCompleted = task.completed;
      if (destinationColumn === 'completed') {
        newCompleted = true;
      } else if (destinationColumn === 'pending') {
        newCompleted = false;
      }
      // For 'all' column, keep the current status

      console.log('New completed status:', newCompleted);

      // Create updated task
      const updatedTask = {
        ...task,
        completed: newCompleted,
      };

      // Remove the task from the list
      const tasksWithoutMoved = prevTasks.filter(t => t.id !== taskId);

      // Get tasks that belong to the destination column (after removing the moved task)
      // But we need to consider what the destination column will look like AFTER the task is moved
      let destinationColumnTasks = [];
      if (destinationColumn === 'completed') {
        // For completed column, we want tasks that are completed OR will be completed (the moved task)
        // But we already removed the moved task, so we only get currently completed tasks
        destinationColumnTasks = tasksWithoutMoved.filter(t => t.completed);
      } else if (destinationColumn === 'pending') {
        // For pending column, we want tasks that are not completed
        destinationColumnTasks = tasksWithoutMoved.filter(t => !t.completed);
      } else {
        // For 'all' column, use all tasks
        destinationColumnTasks = [...tasksWithoutMoved];
      }

      console.log('Destination column tasks (before insert):', destinationColumnTasks.length);

      // Insert the task at the correct position
      const beforeTasks = destinationColumnTasks.slice(0, destinationIndex);
      const afterTasks = destinationColumnTasks.slice(destinationIndex);

      console.log('Before tasks:', beforeTasks.length, 'After tasks:', afterTasks.length);

      // Get tasks that don't belong to the destination column
      const otherTasks = tasksWithoutMoved.filter(t => {
        if (destinationColumn === 'completed') {
          return !t.completed;
        } else if (destinationColumn === 'pending') {
          return t.completed;
        } else {
          // For 'all', all tasks are in the destination column
          return false;
        }
      });

      // Reconstruct the full list
      const result = [];
      
      if (destinationColumn === 'all') {
        // For 'all' column, just insert at the position
        result.push(...beforeTasks);
        result.push(updatedTask);
        result.push(...afterTasks);
      } else if (destinationColumn === 'pending') {
        // Pending tasks first, then completed
        result.push(...beforeTasks);
        result.push(updatedTask);
        result.push(...afterTasks);
        result.push(...otherTasks);
      } else {
        // Completed column: pending first, then completed
        result.push(...otherTasks);
        result.push(...beforeTasks);
        result.push(updatedTask);
        result.push(...afterTasks);
      }

      console.log('Final result length:', result.length);
      return result;
    });
  }, [setTasks]);

  // Reorder tasks within the same column
  const reorderTask = useCallback((taskId, sourceIndex, destinationIndex, column) => {
    setTasks((prevTasks) => {
      // Get tasks for the column
      let columnTasks;
      if (column === 'completed') {
        columnTasks = prevTasks.filter(t => t.completed);
      } else if (column === 'pending') {
        columnTasks = prevTasks.filter(t => !t.completed);
      } else {
        columnTasks = [...prevTasks];
      }

      // Reorder within column
      const reordered = Array.from(columnTasks);
      const [removed] = reordered.splice(sourceIndex, 1);
      reordered.splice(destinationIndex, 0, removed);

      // Reconstruct full list maintaining other tasks
      if (column === 'all') {
        return reordered;
      }

      // For completed/pending columns, merge with other tasks
      const otherTasks = prevTasks.filter(t => {
        if (column === 'completed') {
          return !t.completed;
        } else {
          return t.completed;
        }
      });

      // Maintain order: pending tasks first, then completed
      if (column === 'pending') {
        return [...reordered, ...otherTasks];
      } else {
        return [...otherTasks, ...reordered];
      }
    });
  }, [setTasks]);

  // Delete a task
  const deleteTask = useCallback((id) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  }, [setTasks]);

  // Get tasks for a specific column
  const getTasksForColumn = useCallback((column) => {
    switch (column) {
      case 'completed':
        return tasks.filter((task) => task.completed);
      case 'pending':
        return tasks.filter((task) => !task.completed);
      default:
        return tasks;
    }
  }, [tasks]);

  // Memoized value to prevent unnecessary re-renders
  const value = useMemo(
    () => ({
      tasks,
      addTask,
      moveTask,
      reorderTask,
      deleteTask,
      getTasksForColumn,
    }),
    [tasks, addTask, moveTask, reorderTask, deleteTask, getTasksForColumn]
  );

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};
