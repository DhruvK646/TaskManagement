import Icon from './Icon'

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'grid' },
  { id: 'all', label: 'All tasks', icon: 'tasks' },
  { id: 'pending', label: 'Pending', icon: 'clock' },
  { id: 'completed', label: 'Completed', icon: 'check' },
]

function Sidebar({ activePage, onNavigate, open, onClose }) {
  return (
    <aside className={`sidebar${open ? ' sidebar-open' : ''}`}>
      <div className="brand">
        <div className="brand-mark"><Icon name="check" size={21} /></div>
        <span>Task<span className="brand-light">Flow</span></span>
        <button type="button" className="sidebar-close" aria-label="Close navigation" onClick={onClose}>
          <Icon name="close" />
        </button>
      </div>
      <div className="nav-label">WORKSPACE</div>
      <nav className="side-nav" aria-label="Main navigation">
        {navItems.map((item) => (
          <button
            type="button"
            key={item.id}
            className={`nav-item${activePage === item.id ? ' nav-item-active' : ''}`}
            onClick={() => onNavigate(item.id)}
          >
            <Icon name={item.icon} size={19} />
            <span>{item.label}</span>
            {item.id === 'dashboard' && <span className="nav-dot" />}
          </button>
        ))}
      </nav>
      <div className="sidebar-bottom">
        <button
          type="button"
          className={`nav-item${activePage === 'settings' ? ' nav-item-active' : ''}`}
          onClick={() => onNavigate('settings')}
        >
          <Icon name="settings" size={19} />
          <span>Settings</span>
        </button>
        <div className="sidebar-divider" />
        <div className="profile-block">
          <div className="avatar avatar-sidebar">JD</div>
          <div className="profile-copy">
            <strong>Jordan Davis</strong>
            <span>Free plan</span>
          </div>
          <Icon name="arrow" size={16} className="profile-arrow" />
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
