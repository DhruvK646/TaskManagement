import Icon from './Icon'

function StatCard({ label, value, note, icon, tone }) {
  return (
    <article className="stat-card">
      <div className={`stat-icon stat-icon-${tone}`}><Icon name={icon} size={19} /></div>
      <div className="stat-card-content">
        <div className="stat-label">{label}</div>
        <div className="stat-value">{value}</div>
        <div className="stat-note">{note}</div>
      </div>
      <div className={`stat-accent stat-accent-${tone}`} />
    </article>
  )
}

export default StatCard
