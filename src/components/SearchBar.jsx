import Icon from './Icon'

function SearchBar({ value, onChange, inputRef }) {
  return (
    <label className="search-field">
      <Icon name="search" size={18} />
      <input
        ref={inputRef}
        type="search"
        placeholder="Search tasks..."
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label="Search tasks by title"
      />
      <kbd>⌘ K</kbd>
    </label>
  )
}

export default SearchBar
