import { useCallback, useEffect, useState } from 'react'
import { TaskContext } from './TaskContextValue'
import {
  getTasks, createTask, updateTask as updateTaskAPI,
  deleteTask as deleteTaskAPI,
} from "../api/tasks"

// const STORAGE_KEY = 'taskflow-tasks'

// function readTasks() {
//   try {
//     const storedTasks = window.localStorage.getItem(STORAGE_KEY)
//     if (!storedTasks) return []
//     const parsedTasks = JSON.parse(storedTasks)
//     return Array.isArray(parsedTasks) ? parsedTasks : []
//   }
//    catch (error) {
//     console.error('Unable to load saved tasks from localStorage.', error)
//     return []
//   }
// }

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)

  // useEffect(() => {
  //   try {
  //     window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  //   } catch (error) {
  //     console.error('Unable to save tasks to localStorage.', error)
  //   }
  // }, [tasks])

  const loadTasks = useCallback(() => {
    setLoading(true)
    setError(null)
    setReloadKey((currentKey) => currentKey + 1)
  }, [])

  useEffect(() => {
    let cancelled = false

    getTasks()
      .then((data) => {
        if (!cancelled) setTasks(data)
      })
      .catch((error) => {
        if (cancelled) return
        console.error("Unable to fetch tasks:", error)
        setError(error instanceof Error ? error.message : "Unable to load tasks.")
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [reloadKey])

  // POST: Create new task

  async function addTask(taskData) {

    try {
      const task = await createTask({
        ...taskData,
        completed: false,
      })
      setTasks((currentTasks) => [
        task,
        ...currentTasks
      ])
      return task;
    }
    catch (error) {
      console.error("Unable to add task:", error);
      throw error;
    }
  }

  async function updateTask(id, taskData) {
    try {
      const updatedTask = await updateTaskAPI(id, taskData);

      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === id ? updatedTask : task
        )
      );

      return updatedTask;
    } catch (error) {
      console.error("Unable to update task:", error);
      throw error;
    }
  }

  async function deleteTask(id) {
    try {
      await deleteTaskAPI(id);

      setTasks((currentTasks) =>
        currentTasks.filter((task) => task.id !== id)
      );
    } catch (error) {
      console.error("Unable to delete task:", error);
      throw error;
    }
  }

  // PATCH: Toggle completed status
  async function toggleTask(id) {
    const task = tasks.find((item) => item.id === id);

    if (!task) return;

    return updateTask(id, {
      completed: !task.completed,
    });
  }

  return (
    <TaskContext.Provider value={{
      tasks,
      addTask,
      updateTask,
      deleteTask,
      toggleTask,
      loadTasks,
      error,
      loading,
    }}>
      {children}
    </TaskContext.Provider>
  )
}
