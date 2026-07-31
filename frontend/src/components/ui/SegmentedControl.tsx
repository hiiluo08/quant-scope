

export interface SegmentedControlProps<T extends string> {
  label: string
  value: T
  options: readonly T[]
  onChange: (value: T) => void
}

export function SegmentedControl<T extends string>({ label, value, options, onChange }: SegmentedControlProps<T>) {
  return (
    <div role="group" aria-label={label} style={{ display: 'inline-flex', backgroundColor: 'var(--surface-2)', padding: '2px', borderRadius: '8px' }}>
      {options.map((opt) => {
        const isChecked = value === opt
        return (
          <label 
            key={opt}
            style={{
              padding: '6px 12px',
              fontSize: '0.875rem',
              fontWeight: 500,
              cursor: 'pointer',
              backgroundColor: isChecked ? 'var(--surface-1)' : 'transparent',
              color: isChecked ? 'var(--text-primary)' : 'var(--text-secondary)',
              borderRadius: '6px',
              boxShadow: isChecked ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <input 
              type="radio" 
              name={label} 
              value={opt} 
              checked={isChecked} 
              onChange={() => onChange(opt)} 
              style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
            />
            {opt}
          </label>
        )
      })}
    </div>
  )
}
