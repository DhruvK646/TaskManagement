import { useState } from 'react'
import Icon from './Icon'

const initialForm = {
  title: '',
  description: '',
  category: 'Work',
  priority: 'medium',
  dueDate: '',
}
function TaskForm({ task, onSubmit, onCancel, onError }) {
  const [form, setForm] = useState(() => task ? {
    title: task.title,
    description: task.description || '',
    category: task.category || 'Work',
    priority: task.priority || 'medium',
    dueDate: task.dueDate || '',
  } : initialForm)

  function handleChange(event) {
    const { name, value } = event.target
    setForm((currentForm) => ({ ...currentForm, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const title = form.title.trim()
    if (!title) {
      onError('Please enter a task title.')
      return
    }
    if (!form.category) {
      onError('Please choose a category.')
      return
    }
    try {
      const succeeded = await onSubmit({
        ...form,
        title,
        description: form.description.trim(),
      })
      if (succeeded !== false) setForm(initialForm)
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Unable to save task.')
    }
  }

  return (
    <section className="form-panel panel">
      <div className="panel-heading form-panel-heading">
        <div className="panel-heading-icon"><Icon name={task ? 'edit' : 'plus'} size={18} /></div>
        <div>
          <h2>{task ? 'Edit task' : 'Create a task'}</h2>
          <p>{task ? 'Update the details below.' : 'Add something to your list.'}</p>
        </div>
      </div>
      <form className="task-form" onSubmit={handleSubmit} noValidate>
        <label className="field-label" htmlFor="task-title">Task title <span>*</span></label>
        <input
          id="task-title"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="e.g. Prepare project proposal"
          maxLength={100}
        />
        <label className="field-label" htmlFor="task-description">Description <span className="optional">(optional)</span></label>
        <textarea
          id="task-description"
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Add a few details..."
          rows="3"
          maxLength={300}
        />
        <div className="form-row">
          <div className="form-field">
            <label className="field-label" htmlFor="task-category">Category <span>*</span></label>
            <select id="task-category" name="category" value={form?.category} onChange={handleChange} required>
              <option value="">Select category</option>
              <option>Work</option>
              <option>Personal</option>
              <option>Learning</option>
              <option>Health</option>
              <option>Other</option>
            </select>
          </div>
          <div className="form-field">
            <label className="field-label" htmlFor="task-priority">Priority</label>
            <select id="task-priority" name="priority" value={form.priority} onChange={handleChange}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>
        <label className="field-label" htmlFor="task-due-date">Due date <span className="optional">(optional)</span></label>
        <input id="task-due-date" name="dueDate" type="date" value={form.dueDate} onChange={handleChange} />

        <div className="form-actions">
          {task && <button type="button" className="button button-secondary" onClick={onCancel}>Cancel</button>}
          <button type="submit" className="button button-primary">
            <Icon name={task ? 'check' : 'plus'} size={17} />
            {task ? 'Save changes' : 'Add task'}
          </button>
        </div>

      </form>
    </section>
  )
}

export default TaskForm
