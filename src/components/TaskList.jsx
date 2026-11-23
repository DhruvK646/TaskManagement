import Icon from './Icon'
import TaskCard from './TaskCard'

function TaskList({ tasks, onEdit, onDelete, onToggle, hasTasks }) {
  return (
    <section className="task-list-panel panel">
      <div className="panel-heading task-list-heading">
        <div>
          <h2>Your tasks <span className="task-count">{tasks.length}</span></h2>
          <p>Keep track of what needs to get done.</p>
        </div>
        <button type="button" className="text-button" onClick={() => document.getElementById('task-title')?.focus()}>
          <Icon name="plus" size={16} /> New task
        </button>
      </div>
      {tasks.length ? (
        <div className="task-list">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} onToggle={onToggle} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon"><Icon name={hasTasks ? 'search' : 'checkCircle'} size={25} /></div>
          <h3>{hasTasks ? 'No matching tasks' : 'Nothing on your list yet'}</h3>
          <p>{hasTasks ? 'Try changing your search or filters.' : 'Add a task to get your day moving in the right direction.'}</p>
        </div>
      )}
    </section>
  )
}

export default TaskList
