import { useMemo, useState } from 'react'
import { TaskProvider } from './context/TaskContext'
import { useTasks } from './context/useTasks'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import Icon from './components/Icon'
import './App.css'

const pageTitles = {
  dashboard: 'Dashboard',
  all: 'All tasks',
  pending: 'Pending tasks',
  completed: 'Completed tasks',
  settings: 'Settings',
}

function AppContent() {
  const {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    loadTasks,
    loading,
    error,
  } = useTasks()
  const [activePage, setActivePage] = useState('dashboard')
  const [search, setSearch] = useState('')
  const [priority, setPriority] = useState('all')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [toast, setToast] = useState(null)

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesPage =
        activePage === 'pending'
          ? !task.completed
          : activePage === 'completed'
            ? task.completed
            : true
      const matchesSearch = task.title.toLowerCase().includes(search.trim().toLowerCase())
      const matchesPriority = priority === 'all' || task.priority === priority
      return matchesPage && matchesSearch && matchesPriority
    })
  }, [activePage, priority, search, tasks])

  function showToast(message, type = 'success') {
    setToast({ message, type })
    window.clearTimeout(showToast.timeoutId)
    showToast.timeoutId = window.setTimeout(() => setToast(null), 3200)
  }

  function handleNavigate(page) {
    setActivePage(page)
    setSearch('')
    setSidebarOpen(false)
  }

  async function handleAddTask(task) {
    try {
      await addTask(task)
      showToast('Task added successfully')
      return true
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Unable to add task.', 'error')
      return false
    }
  }

  async function handleUpdateTask(id, task) {
    try {
      await updateTask(id, task)
      showToast('Task updated successfully')
      return true
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Unable to update task.', 'error')
      return false
    }
  }

  async function handleDeleteTask(id) {
    try {
      await deleteTask(id)
      showToast('Task deleted')
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Unable to delete task.', 'error')
    }
  }

  async function handleToggleTask(id) {
    const task = tasks.find((item) => item.id === id)
    if (!task) return

    try {
      await toggleTask(id)
      showToast(task.completed ? 'Task moved to pending' : 'Task completed')
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Unable to update task.', 'error')
    }
  }

  return (
    <div className="app-shell">
      <Sidebar
        activePage={activePage}
        onNavigate={handleNavigate}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      {sidebarOpen && (
        <button
          type="button"
          className="sidebar-backdrop"
          aria-label="Close navigation"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <main className="main-area">
        <Navbar
          title={pageTitles[activePage]}
          search={search}
          onSearch={setSearch}
          onMenuClick={() => setSidebarOpen(true)}
        />
        {loading ? (
          <section className="dashboard-content">
            <div className="panel task-state-panel" role="status">
              Loading tasks...
            </div>
          </section>
        ) : error ? (
          <section className="dashboard-content">
            <div className="panel task-state-panel" role="alert">
              <h2>Unable to load tasks</h2>
              <p>{error}</p>
              <button type="button" className="button button-primary" onClick={loadTasks}>
                Try again
              </button>
            </div>
          </section>
        ) : activePage === 'settings' ? (
          <SettingsPage taskCount={tasks.length} />
        ) : (
          <Dashboard
            tasks={tasks}
            visibleTasks={filteredTasks}
            activePage={activePage}
            onNavigate={handleNavigate}
            priority={priority}
            onPriorityChange={setPriority}
            onAddTask={handleAddTask}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
            onToggleTask={handleToggleTask}
            onError={(message) => showToast(message, 'error')}
          />
        )}
      </main>
      {toast && (
        <div className={`toast toast-${toast.type}`} role="status">
          <Icon name={toast.type === 'error' ? 'alert' : 'check'} />
          <span>{toast.message}</span>
          <button type="button" aria-label="Dismiss message" onClick={() => setToast(null)}>
            <Icon name="close" />
          </button>
        </div>
      )}
    </div>
  )
}

function SettingsPage({ taskCount }) {
  return (
    <section className="settings-page">
      <div className="section-heading">
        <div>
          <p className="eyebrow">PREFERENCES</p>
          <h1>Settings</h1>
          <p className="section-description">A few details about your TaskFlow workspace.</p>
        </div>
      </div>
      <div className="settings-card">
        <div className="settings-icon"><Icon name="database" /></div>
        <div>
          <h2>Local task storage</h2>
          <p>Your tasks are saved in this browser and stay available after a refresh.</p>
          <span className="storage-status"><span /> Active · {taskCount} {taskCount === 1 ? 'task' : 'tasks'} saved</span>
        </div>
      </div>
      <div className="settings-note">
        <Icon name="info" />
        <p>TaskFlow is a frontend-only demo. Your task data is stored locally on this device and is not sent to a server.</p>
      </div>
    </section>
  )
}

function App() {
  return (
    <TaskProvider>
      <AppContent />
    </TaskProvider>
  )
}

export default App
