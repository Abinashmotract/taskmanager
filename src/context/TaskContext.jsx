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
      return false;
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
      
      const task = prevTasks.find(t => t.id === taskId);
      if (!task) {
        console.log('Task not found:', taskId);
        return prevTasks;
      }

      console.log('Found task:', task);

      let newCompleted = task.completed;
      if (destinationColumn === 'completed') {
        newCompleted = true;
      } else if (destinationColumn === 'pending') {
        newCompleted = false;
      }
      console.log('New completed status:', newCompleted);

      const updatedTask = {
        ...task,
        completed: newCompleted,
      };

      const tasksWithoutMoved = prevTasks.filter(t => t.id !== taskId);

      let destinationColumnTasks = [];
      if (destinationColumn === 'completed') {
        destinationColumnTasks = tasksWithoutMoved.filter(t => t.completed);
      } else if (destinationColumn === 'pending') {
        destinationColumnTasks = tasksWithoutMoved.filter(t => !t.completed);
      } else {
        destinationColumnTasks = [...tasksWithoutMoved];
      }

      console.log('Destination column tasks (before insert):', destinationColumnTasks.length);

      // Insert task
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
          return false;
        }
      });
      const result = [];
      
      if (destinationColumn === 'all') {
        result.push(...beforeTasks);
        result.push(updatedTask);
        result.push(...afterTasks);
      } else if (destinationColumn === 'pending') {
        result.push(...beforeTasks);
        result.push(updatedTask);
        result.push(...afterTasks);
        result.push(...otherTasks);
      } else {
        result.push(...otherTasks);
        result.push(...beforeTasks);
        result.push(updatedTask);
        result.push(...afterTasks);
      }
      console.log('Final result length:', result.length);
      return result;
    });
  }, [setTasks]);

  const reorderTask = useCallback((taskId, sourceIndex, destinationIndex, column) => {
    setTasks((prevTasks) => {
      let columnTasks;
      if (column === 'completed') {
        columnTasks = prevTasks.filter(t => t.completed);
      } else if (column === 'pending') {
        columnTasks = prevTasks.filter(t => !t.completed);
      } else {
        columnTasks = [...prevTasks];
      }

      const reordered = Array.from(columnTasks);
      const [removed] = reordered.splice(sourceIndex, 1);
      reordered.splice(destinationIndex, 0, removed);

      if (column === 'all') {
        return reordered;
      }
      const otherTasks = prevTasks.filter(t => {
        if (column === 'completed') {
          return !t.completed;
        } else {
          return t.completed;
        }
      });
      if (column === 'pending') {
        return [...reordered, ...otherTasks];
      } else {
        return [...otherTasks, ...reordered];
      }
    });
  }, [setTasks]);

  const deleteTask = useCallback((id) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  }, [setTasks]);

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
