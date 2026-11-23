import { useMemo, useState } from 'react'
import StatCard from '../components/StatCard'
import TaskForm from '../components/TaskForm'
import TaskList from '../components/TaskList'
import Icon from '../components/Icon'

function Dashboard({
  tasks,
  visibleTasks,
  activePage,
  onNavigate,
  priority,
  onPriorityChange,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onToggleTask,
  onError,
}) {
  const [editingTask, setEditingTask] = useState(null)
  const stats = useMemo(() => {
    const now = new Date()
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
    const completed = tasks.filter((task) => task.completed).length
    return {
      total: tasks.length,
      completed,
      pending: tasks.length - completed,
      today: tasks.filter((task) => task.dueDate === today).length,
    }
  }, [tasks])

  const pageDescription = activePage === 'dashboard'
    ? 'Here’s what’s happening with your tasks today.'
    : activePage === 'all'
      ? 'Every task in one place. Make progress at your own pace.'
      : activePage === 'pending'
        ? 'Stay focused on what still needs to get done.'
        : 'A look at everything you’ve already accomplished.'

  async function handleSubmit(task) {
    if (editingTask) {
      const succeeded = await onUpdateTask(editingTask.id, task)
      if (succeeded) setEditingTask(null)
      return succeeded
    }
    return onAddTask(task)
  }

  return (
    <div className="dashboard-content">
      <section className="welcome-row">
        <div>
          <p className="eyebrow">{activePage === 'dashboard' ? `${new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date()).toUpperCase()}, LET’S MAKE IT COUNT` : 'YOUR WORKSPACE'}</p>
          <h2>{activePage === 'dashboard' ? 'Good things happen when you stay focused.' : pageDescription}</h2>
          <p className="welcome-description">{activePage === 'dashboard' ? 'A little progress each day adds up to big results.' : 'Organize your work and keep moving forward.'}</p>
        </div>
        <div className="welcome-spark"><Icon name="spark" size={25} /></div>
      </section>

      <section className="stats-grid" aria-label="Task overview">
        <StatCard label="Total tasks" value={stats.total} note="Across your workspace" icon="tasks" tone="blue" />
        <StatCard label="Completed" value={stats.completed} note="Nicely done so far" icon="checkCircle" tone="green" />
        <StatCard label="Pending" value={stats.pending} note="Ready when you are" icon="clock" tone="orange" />
        <StatCard label="Due today" value={stats.today} note="Tasks on today’s agenda" icon="calendar" tone="purple" />
      </section>

      <div className="workspace-grid">
        <div className="task-column">
          <div className="filters-row">
            <div className="filter-tabs" role="group" aria-label="Filter tasks by status">
              {[
                { id: 'all', label: 'All' },
                { id: 'pending', label: 'Pending' },
                { id: 'completed', label: 'Completed' },
              ].map((filter) => (
                <button
                  type="button"
                  key={filter.id}
                  className={`filter-tab${activePage === filter.id || (activePage === 'dashboard' && filter.id === 'all') ? ' filter-tab-active' : ''}`}
                  onClick={() => onNavigate(filter.id)}
                >
                  {filter.label}
                </button>
              ))}
            </div>
            <label className="priority-filter">
              <span>Priority</span>
              <select value={priority} onChange={(event) => onPriorityChange(event.target.value)} aria-label="Filter by priority">
                <option value="all">All priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </label>
          </div>
          <TaskList
            tasks={visibleTasks}
            hasTasks={tasks.length > 0}
            onEdit={setEditingTask}
            onDelete={onDeleteTask}
            onToggle={onToggleTask}
          />
        </div>
        <TaskForm
          key={editingTask?.id || 'new-task'}
          task={editingTask}
          onSubmit={handleSubmit}
          onCancel={() => setEditingTask(null)}
          onError={onError}
        />
      </div>
    </div>
  )
}

export default Dashboard
