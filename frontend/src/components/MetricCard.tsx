export function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <section className="card" aria-label={label}>
      <h2>{label}</h2>
      <p>{value}</p>
    </section>
  )
}