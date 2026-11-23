import Icon from './Icon'

function formatDueDate(date) {
  if (!date) return 'No due date'
  const parsedDate = new Date(`${date}T00:00:00`)
  return parsedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function TaskCard({ task, onEdit, onDelete, onToggle }) {
  const overdue = task.dueDate && !task.completed && new Date(`${task.dueDate}T23:59:59`) < new Date()

  return (
    <article className={`task-card${task.completed ? ' task-card-completed' : ''}`}>
      <button
        type="button"
        className={`task-check${task.completed ? ' task-check-checked' : ''}`}
        aria-label={task.completed ? `Mark ${task.title} as pending` : `Mark ${task.title} as completed`}
        onClick={() => onToggle(task.id)}
      >
        {task.completed && <Icon name="check" size={14} />}
      </button>
      <div className="task-main">
        <div className="task-title-row">
          <h3>{task.title}</h3>
          <span className={`priority-badge priority-${task.priority}`}>{task.priority}</span>
        </div>
        {task.description && <p className="task-description">{task.description}</p>}
        <div className="task-meta">
          <span className="category-chip">{task.category}</span>
          <span className={`task-due${overdue ? ' task-overdue' : ''}`}>
            <Icon name="calendar" size={14} />
            {overdue ? 'Overdue · ' : ''}{formatDueDate(task.dueDate)}
          </span>
          <span className={`status-label${task.completed ? ' status-done' : ''}`}>
            <span />{task.completed ? 'Completed' : 'In progress'}
          </span>
        </div>
      </div>
      <div className="task-actions">
        <button type="button" className="task-action" aria-label={`Edit ${task.title}`} onClick={() => onEdit(task)}>
          <Icon name="edit" size={17} />
        </button>
        <button type="button" className="task-action task-delete" aria-label={`Delete ${task.title}`} onClick={() => onDelete(task.id)}>
          <Icon name="trash" size={17} />
        </button>
        <button type="button" className="complete-action" onClick={() => onToggle(task.id)}>
          {task.completed ? 'Undo' : 'Complete'}
        </button>
      </div>
    </article>
  )
}

export default TaskCard
