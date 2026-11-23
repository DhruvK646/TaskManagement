import { useEffect, useRef, useState } from 'react'
import Icon from './Icon'
import SearchBar from './SearchBar'

function Navbar({ title, search, onSearch, onMenuClick }) {
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const searchInputRef = useRef(null)

  useEffect(() => {
    function handleSearchShortcut(event) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        searchInputRef.current?.focus()
      }
    }

    window.addEventListener('keydown', handleSearchShortcut)
    return () => window.removeEventListener('keydown', handleSearchShortcut)
  }, [])

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button type="button" className="mobile-menu" aria-label="Open navigation" onClick={onMenuClick}>
          <Icon name="menu" />
        </button>
        <div>
          <div className="breadcrumb">Workspace <span>/</span> <strong>{title}</strong></div>
          <h1 className="topbar-title">{title}</h1>
        </div>
      </div>
      <div className="topbar-actions">
        <SearchBar value={search} onChange={onSearch} inputRef={searchInputRef} />
        <div className="notification-wrap">
          <button
            type="button"
            className={`icon-button notification-button${notificationsOpen ? ' is-active' : ''}`}
            aria-label="Notifications"
            aria-expanded={notificationsOpen}
            onClick={() => setNotificationsOpen((open) => !open)}
          >
            <Icon name="bell" size={19} />
            <span className="notification-dot" />
          </button>
          {notificationsOpen && (
            <div className="notification-popover">
              <strong>You&apos;re all caught up</strong>
              <span>New task updates will show up here.</span>
            </div>
          )}
        </div>
        <div className="topbar-profile">
          <div className="avatar avatar-top">JD</div>
          <div className="topbar-profile-copy">
            <strong>Jordan Davis</strong>
            <span>Workspace owner</span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
