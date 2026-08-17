export default function StatTile({ number, caption }) {
  return (
    <div className="stat-tile">
      <div className="stat-number">{number}</div>
      <div className="stat-caption">{caption}</div>
    </div>
  )
}
