import { useContext } from 'react'
import { TaskContext } from './TaskContextValue'

export function useTasks() {
  const context = useContext(TaskContext)
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider')
  }
  return context
}
